import React, { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

type MotivationForm = {
  jobTitle: string;
  company: string;
  recipient: string;
  jobAd: string;
  motivation: string;
  achievements: string;
  tone: "professionell" | "warm" | "direkt" | "selbstbewusst";
  language: "de-CH" | "de" | "en" | "fr";
};

type MotivationLetterSectionProps = {
  hasSelfServiceAccess: boolean;
  onRequirePayment: () => void;
};

const initialForm: MotivationForm = {
  jobTitle: "",
  company: "",
  recipient: "",
  jobAd: "",
  motivation: "",
  achievements: "",
  tone: "professionell",
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const MotivationLetterSection: React.FC<MotivationLetterSectionProps> = ({
  hasSelfServiceAccess,
  onRequirePayment,
}) => {
  const { user } = useAuth();
  const [form, setForm] = useState<MotivationForm>(initialForm);
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [usage, setUsage] = useState<{ input_tokens?: number; output_tokens?: number } | null>(null);

  const canGenerate = useMemo(() => {
    return Boolean(form.jobTitle.trim() && form.company.trim() && form.jobAd.trim());
  }, [form.company, form.jobAd, form.jobTitle]);

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
      setError("Bitte Stelle, Unternehmen und Stellenanzeige ausfüllen.");
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
        throw new Error(result?.error || "Motivationsschreiben konnte nicht erstellt werden.");
      }

      setLetter(result.letter || "");
      setUsage(result.usage || null);
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

  const handleDownload = () => {
    if (!letter) return;

    const fileName = `motivationsschreiben-${slugify(form.company || form.jobTitle || "cvolution")}.doc`;
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Motivationsschreiben</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #111827; line-height: 1.55; margin: 48px; }
    main { max-width: 720px; margin: 0 auto; white-space: pre-wrap; }
  </style>
</head>
<body><main>${escapeHtml(letter)}</main></body>
</html>`;

    const blob = new Blob(["\ufeff", html], {
      type: "application/msword;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-950">Motivationsschreiben</h2>
              <Badge className="border-[#204878]/20 bg-[#204878]/10 text-[#204878] hover:bg-[#204878]/10">
                CHF 13.90 inklusive
              </Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Claude erstellt einen individuellen Entwurf auf Basis Ihres Profils und der Stellenanzeige.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Ohne fixes Monatskontingent
          </div>
        </div>

        <form onSubmit={handleGenerate} className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="jobTitle" className="text-sm font-semibold text-slate-900">
                  Stelle *
                </label>
                <Input
                  id="jobTitle"
                  value={form.jobTitle}
                  onChange={(event) => updateField("jobTitle", event.target.value)}
                  placeholder="HR Business Partner"
                  className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                  maxLength={140}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-semibold text-slate-900">
                  Unternehmen *
                </label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(event) => updateField("company", event.target.value)}
                  placeholder="Muster AG"
                  className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                  maxLength={140}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="recipient" className="text-sm font-semibold text-slate-900">
                  Ansprechperson
                </label>
                <Input
                  id="recipient"
                  value={form.recipient}
                  onChange={(event) => updateField("recipient", event.target.value)}
                  placeholder="Frau Meier"
                  className="border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                  maxLength={180}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Ton</label>
                  <Select value={form.tone} onValueChange={(value) => updateField("tone", value as MotivationForm["tone"])}>
                    <SelectTrigger className="border-slate-200 bg-white text-slate-950">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-slate-950">
                      <SelectItem value="professionell">Professionell</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="direkt">Direkt</SelectItem>
                      <SelectItem value="selbstbewusst">Selbstbewusst</SelectItem>
                    </SelectContent>
                  </Select>
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
            </div>

            <div className="space-y-2">
              <label htmlFor="jobAd" className="text-sm font-semibold text-slate-900">
                Stellenanzeige *
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

            <div className="space-y-2">
              <label htmlFor="motivation" className="text-sm font-semibold text-slate-900">
                Motivation
              </label>
              <Textarea
                id="motivation"
                value={form.motivation}
                onChange={(event) => updateField("motivation", event.target.value)}
                placeholder="Warum diese Stelle?"
                className="min-h-24 resize-y border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                maxLength={2500}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="achievements" className="text-sm font-semibold text-slate-900">
                Argumente oder Erfolge
              </label>
              <Textarea
                id="achievements"
                value={form.achievements}
                onChange={(event) => updateField("achievements", event.target.value)}
                placeholder="Relevante Projekte, Resultate oder Staerken"
                className="min-h-24 resize-y border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20"
                maxLength={2500}
              />
            </div>

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
                  setUsage(null);
                  setError("");
                }}
                className="min-h-11 border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                Zurücksetzen
              </Button>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
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
                  disabled={!letter}
                  className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  DOC
                </Button>
              </div>
            </div>

            <div className="min-h-[38rem] rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-800 shadow-sm">
              {isGenerating ? (
                <div className="flex h-full min-h-[28rem] flex-col items-center justify-center text-center text-slate-500">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-[#204878]" />
                  <p className="font-medium text-slate-700">Claude formuliert den Entwurf...</p>
                </div>
              ) : letter ? (
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-900">
                  {letter}
                </pre>
              ) : (
                <div className="flex h-full min-h-[28rem] flex-col items-center justify-center text-center text-slate-500">
                  <FileText className="mb-4 h-10 w-10 text-slate-300" />
                  <p className="max-w-xs text-sm leading-6">Der generierte Text erscheint hier.</p>
                </div>
              )}
            </div>

            {usage && (
              <p className="mt-3 text-xs text-slate-500">
                Claude Tokens: {usage.input_tokens || 0} Input / {usage.output_tokens || 0} Output
              </p>
            )}
          </aside>
        </form>
      </div>
    </div>
  );
};
