import React, { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  AlertCircle,
  Clipboard,
  Download,
  FileText,
  Link2,
  Loader2,
  Sparkles,
} from "lucide-react";

type MotivationForm = {
  jobTitle: string;
  company: string;
  companyStreet: string;
  companyPostalCode: string;
  companyCity: string;
  recipient: string;
  jobAd: string;
  jobAdUrl: string;
  language: "de-CH" | "de" | "en" | "fr";
};

type MotivationLetterSectionProps = {
  hasSelfServiceAccess: boolean;
  onRequirePayment: () => void;
};

const initialForm: MotivationForm = {
  jobTitle: "",
  company: "",
  companyStreet: "",
  companyPostalCode: "",
  companyCity: "",
  recipient: "",
  jobAd: "",
  jobAdUrl: "",
  language: "de-CH",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

function isSubjectLine(line: string) {
  return /^(betreff|subject|objet)\b/i.test(line) || /^bewerbung\s/i.test(line);
}

// Formatierte Vorschau: Betreff fett, Bulletpoints eingerueckt, saubere Absaetze
const LetterPreview: React.FC<{ letter: string }> = ({ letter }) => {
  const blocks = letter
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-sm leading-6 text-slate-900">
      {blocks.map((block, blockIdx) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const allBullets = lines.length > 0 && lines.every((line) => /^[-–•*]\s+/.test(line));

        if (allBullets) {
          return (
            <ul key={blockIdx} className="list-disc space-y-1 pl-5">
              {lines.map((line, idx) => (
                <li key={idx}>{line.replace(/^[-–•*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        if (lines.length === 1 && isSubjectLine(lines[0])) {
          return (
            <p key={blockIdx} className="font-bold">
              {lines[0]}
            </p>
          );
        }

        return (
          <p key={blockIdx}>
            {lines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export const MotivationLetterSection: React.FC<MotivationLetterSectionProps> = ({
  hasSelfServiceAccess,
  onRequirePayment,
}) => {
  const { user } = useAuth();
  const [form, setForm] = useState<MotivationForm>(initialForm);
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canGenerate = useMemo(() => {
    return Boolean(form.jobAd.trim() || form.jobAdUrl.trim());
  }, [form.jobAd, form.jobAdUrl]);

  const updateField = <K extends keyof MotivationForm>(key: K, value: MotivationForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!hasSelfServiceAccess) {
      onRequirePayment();
      return;
    }

    if (!canGenerate) {
      setError("Bitte fügen Sie die Stellenanzeige ein oder geben Sie den Link zum Inserat an.");
      return;
    }

    if (!user) {
      setError("Bitte melden Sie sich erneut an.");
      return;
    }

    setIsGenerating(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        throw new Error("Bitte melden Sie sich erneut an.");
      }

      const response = await fetch("/api/motivation-letter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 402) {
        onRequirePayment();
        throw new Error(result?.error || "Dieses Feature ist im aktiven Self-Service-Abo enthalten.");
      }

      if (!response.ok) {
        // 504/502 vom Hosting liefern HTML statt JSON -> result ist null.
        if (!result && (response.status === 504 || response.status === 502 || response.status === 503)) {
          throw new Error(
            "Die Erstellung hat zu lange gedauert und wurde abgebrochen. Bitte versuchen Sie es erneut. Tipp: Stellenanzeige als Text einfügen statt nur den Link anzugeben."
          );
        }
        throw new Error(result?.error || "Motivationsschreiben konnte nicht erstellt werden.");
      }

      setLetter(result.letter || "");
      toast({
        title: "Motivationsschreiben erstellt",
        description: "Der Entwurf ist bereit.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Motivationsschreiben konnte nicht erstellt werden.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!letter) return;

    try {
      await navigator.clipboard.writeText(letter);
      toast({
        title: "Kopiert",
        description: "Das Motivationsschreiben wurde in die Zwischenablage kopiert.",
      });
    } catch {
      toast({
        title: "Kopieren fehlgeschlagen",
        description: "Bitte markieren Sie den Text manuell.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!letter) return;

    setIsDownloading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        throw new Error("Bitte melden Sie sich erneut an.");
      }

      const fileName = `motivationsschreiben-${slugify(form.company || form.jobTitle || "cvolution")}.docx`;

      const response = await fetch("/api/motivation-letter/docx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          letter,
          jobTitle: form.jobTitle,
          company: form.company,
        }),
      });

      if (response.status === 402) {
        onRequirePayment();
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Das DOCX konnte nicht erstellt werden.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: "Download fehlgeschlagen",
        description: err instanceof Error ? err.message : "Das DOCX konnte nicht erstellt werden.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1rem_3rem_rgba(15,37,65,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              AI Motivationsschreiben
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Stellenanzeige einfügen oder Link zum Inserat angeben. Unternehmen, Adresse und
              Ansprechperson werden automatisch aus dem Inserat oder der Website erkannt. Das
              fertige Schreiben laden Sie als Word-Datei herunter.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="jobAdUrl" className="text-sm font-semibold text-slate-900">
                Link zum Inserat
              </label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="jobAdUrl"
                  value={form.jobAdUrl}
                  onChange={(event) => updateField("jobAdUrl", event.target.value)}
                  placeholder="https://..."
                  className="border-slate-200 bg-white pl-9 text-slate-950 focus-visible:ring-[#204878]/20"
                  maxLength={500}
                  type="url"
                  inputMode="url"
                />
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Der obere Teil des Schreibens wird aus dem Inserat oder der Website erkannt. Ohne
                Angaben wird das Impressum verwendet.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="jobAd" className="text-sm font-semibold text-slate-900">
                Stellenanzeige {form.jobAdUrl.trim() ? "(optional)" : "*"}
              </label>
              <Textarea
                id="jobAd"
                value={form.jobAd}
                onChange={(event) => updateField("jobAd", event.target.value)}
                placeholder="Stelleninserat hier einfügen"
                className="min-h-44 resize-y border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                maxLength={9000}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="jobTitle" className="text-sm font-semibold text-slate-900">
                  Stelle (optional)
                </label>
                <Input
                  id="jobTitle"
                  value={form.jobTitle}
                  onChange={(event) => updateField("jobTitle", event.target.value)}
                  placeholder="Wird aus dem Inserat erkannt"
                  className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                  maxLength={140}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-semibold text-slate-900">
                  Unternehmen (optional)
                </label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  placeholder="Wird aus dem Inserat erkannt"
                  className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                  maxLength={140}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="recipient" className="text-sm font-semibold text-slate-900">
                  Ansprechperson (optional)
                </label>
                <Input
                  id="recipient"
                  value={form.recipient}
                  onChange={(event) => updateField("recipient", event.target.value)}
                  placeholder="Wird aus dem Inserat erkannt"
                  className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                  maxLength={180}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Sprache</label>
                <Select value={form.language} onValueChange={(value) => updateField("language", value as MotivationForm["language"])}>
                  <SelectTrigger className="border-slate-200 bg-white text-slate-950">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-slate-950">
                    <SelectItem value="de-CH">Deutsch CH</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">Englisch</SelectItem>
                    <SelectItem value="fr">Französisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <details className="rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
              <summary className="cursor-pointer select-none text-sm font-semibold text-slate-700">
                Empfängeradresse manuell überschreiben (optional)
              </summary>
              <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)_minmax(0,1fr)]">
                <div className="space-y-2">
                  <label htmlFor="companyStreet" className="text-sm font-semibold text-slate-900">
                    Adresse
                  </label>
                  <Input
                    id="companyStreet"
                    value={form.companyStreet}
                    onChange={(event) => updateField("companyStreet", event.target.value)}
                    placeholder="Musterstrasse 1"
                    className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                    maxLength={160}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="companyPostalCode" className="text-sm font-semibold text-slate-900">
                    PLZ
                  </label>
                  <Input
                    id="companyPostalCode"
                    value={form.companyPostalCode}
                    onChange={(event) => updateField("companyPostalCode", event.target.value)}
                    placeholder="8000"
                    className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                    maxLength={16}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="companyCity" className="text-sm font-semibold text-slate-900">
                    Ort
                  </label>
                  <Input
                    id="companyCity"
                    value={form.companyCity}
                    onChange={(event) => updateField("companyCity", event.target.value)}
                    placeholder="Zürich"
                    className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                    maxLength={80}
                  />
                </div>
              </div>
            </details>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={isGenerating}
                className="min-h-11 bg-[#204878] text-white hover:bg-[#1a3a66]"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {hasSelfServiceAccess ? "Erstellen" : "Abo aktivieren"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(initialForm);
                  setLetter("");
                  setError("");
                }}
                className="min-h-11 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                Zurücksetzen
              </Button>
            </div>
          </div>

          <div className="min-h-[28rem] lg:relative lg:min-h-0">
            <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 sm:p-5 lg:absolute lg:inset-0">
              <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#204878]" />
                  <h3 className="text-lg font-semibold text-slate-950">Entwurf</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!letter}
                    className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <Clipboard className="h-4 w-4" />
                    Kopieren
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!letter || isDownloading}
                    className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Word
                  </Button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-800 shadow-sm">
                {isGenerating ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                    <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#204878]" />
                    <p className="font-medium text-slate-700">Einen Moment! Wir machen aus Gedanken gerade Bewerbungsmaterial....</p>
                  </div>
                ) : letter ? (
                  <LetterPreview letter={letter} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                    <FileText className="mb-4 h-10 w-10 text-slate-300" />
                    <p className="max-w-xs text-sm leading-6">Der generierte Text erscheint hier.</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};
