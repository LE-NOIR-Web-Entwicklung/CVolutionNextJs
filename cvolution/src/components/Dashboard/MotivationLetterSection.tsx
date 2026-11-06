import React, { useEffect, useId, useMemo, useState } from "react";
import { emptyMotivationForm, type MotivationDraft, type MotivationForm } from "@/lib/applications";
import { downloadMotivationLetterDocx, MotivationLetterRequestError } from "@/lib/motivation-letter-client";
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
  BriefcaseBusiness,
  Building2,
  Clipboard,
  Download,
  Eye,
  FileText,
  Link2,
  Loader2,
  PenLine,
  Sparkles,
} from "lucide-react";

type MotivationLetterSectionProps = {
  hasSelfServiceAccess: boolean;
  onRequirePayment: () => void;
  draft?: MotivationDraft;
  onDraftChange?: (draft: MotivationDraft) => void;
  onSaveDraft?: (draft: MotivationDraft) => Promise<string>;
  applicationId?: string;
  autoSaveDraft?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onBusyChange?: (busy: boolean) => void;
  // Inside an application: link, job title and company come from the application form.
  embedded?: boolean;
};

const fieldClass = "border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20";
const labelClass = "text-sm font-medium text-slate-900";
const hintClass = "text-xs leading-5 text-slate-500";

function isSubjectLine(line: string) {
  return /^(betreff|subject|objet)\b/i.test(line) || /^(bewerbung|initiativbewerbung|spontanbewerbung)\s/i.test(line);
}

// Formatierte Vorschau: Betreff fett, Bulletpoints eingerueckt, saubere Absaetze
const LetterPreview: React.FC<{ letter: string }> = ({ letter }) => {
  const blocks = letter
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-[1.1em] font-[Arial,Helvetica,sans-serif] text-[13px] leading-[1.45] text-slate-900 sm:text-sm">
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

function FormGroup({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-slate-100 pt-5 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        {description && <p className={`mt-0.5 ${hintClass}`}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export const MotivationLetterSection: React.FC<MotivationLetterSectionProps> = ({
  hasSelfServiceAccess,
  onRequirePayment,
  draft,
  onDraftChange,
  onSaveDraft,
  applicationId,
  autoSaveDraft = false,
  disabled = false,
  readOnly = false,
  onBusyChange,
  embedded = false,
}) => {
  const { user } = useAuth();
  const fieldId = useId();
  const [localDraft, setLocalDraft] = useState<MotivationDraft>(() => ({ form: emptyMotivationForm(), letter: "" }));
  const { form, letter } = draft || localDraft;
  const changeDraft = onDraftChange || setLocalDraft;
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const spontaneous = form.applicationType === "spontaneous";
  const wordCount = useMemo(() => letter.trim() ? letter.trim().split(/\s+/).length : 0, [letter]);

  useEffect(() => {
    onBusyChange?.(isGenerating || isDownloading || isSavingDraft);
  }, [isGenerating, isDownloading, isSavingDraft, onBusyChange]);

  const canGenerate = useMemo(() => {
    if (spontaneous) {
      return Boolean(form.jobTitle.trim() && (form.company.trim() || form.jobAdUrl.trim()));
    }
    return Boolean(form.jobAd.trim() || form.jobAdUrl.trim());
  }, [spontaneous, form.jobAd, form.jobAdUrl, form.jobTitle, form.company]);

  const updateField = <K extends keyof MotivationForm>(key: K, value: MotivationForm[K]) => {
    changeDraft({ form: { ...form, [key]: value }, letter });
  };

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!hasSelfServiceAccess) {
      onRequirePayment();
      return;
    }

    if (!canGenerate) {
      setError(spontaneous
        ? embedded
          ? "Bitte erfassen Sie in der Bewerbung Stellenbezeichnung und Unternehmen."
          : "Bitte geben Sie die gewünschte Funktion und das Unternehmen oder dessen Website an."
        : embedded
          ? "Bitte fügen Sie die Stellenanzeige ein oder erfassen Sie in der Bewerbung den Link zum Inserat."
          : "Bitte fügen Sie die Stellenanzeige ein oder geben Sie den Link zum Inserat an.");
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

      const generated = { form, letter: result.letter || "" };
      changeDraft(generated);
      setMode("preview");
      if (autoSaveDraft && onSaveDraft) await onSaveDraft(generated);
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
      const savedId = autoSaveDraft && onSaveDraft ? await onSaveDraft({ form, letter }) : applicationId;
      await downloadMotivationLetterDocx({ applicationId: savedId, letter, jobTitle: form.jobTitle, company: form.company });
    } catch (err) {
      if (err instanceof MotivationLetterRequestError && err.status === 402) onRequirePayment();
      toast({
        title: "Download fehlgeschlagen",
        description: err instanceof Error ? err.message : "Das DOCX konnte nicht erstellt werden.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;
    setError("");
    setIsSavingDraft(true);
    try {
      await onSaveDraft({ form, letter });
      toast({ title: "Bewerbung gespeichert", description: "Sie finden den Entwurf unter Bewerbungen." });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Die Bewerbung konnte nicht gespeichert werden.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleReset = () => {
    if ((letter || JSON.stringify(form) !== JSON.stringify(emptyMotivationForm())) &&
      !window.confirm("Alle Eingaben und den Entwurf löschen?")) return;
    changeDraft({ form: emptyMotivationForm(), letter: "" });
    setError("");
    setMode("preview");
  };

  const typeOptions: Array<[MotivationForm["applicationType"], string, React.ElementType]> = [
    ["reactive", "Auf eine Stelle", BriefcaseBusiness],
    ["spontaneous", "Spontanbewerbung", Building2],
  ];

  return (
    <div className={embedded ? "lg:h-full" : "rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"}>
      {!embedded && (
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-950">Motivationsschreiben</h2>
          <p className="mt-1 text-sm text-slate-600">
            Inserat oder Zielunternehmen angeben, Schreiben erstellen und als Word-Datei herunterladen.
          </p>
        </div>
      )}

      <form
        onSubmit={handleGenerate}
        className={embedded
          ? "grid lg:h-full lg:grid-cols-[26rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]"
          : "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start"}
      >
        <fieldset disabled={disabled || isGenerating || isSavingDraft} className="contents">
        <fieldset disabled={readOnly} className={embedded ? "min-w-0 space-y-5 px-5 pt-5 sm:px-6 lg:overflow-y-auto" : "min-w-0 space-y-5"}>
          <FormGroup title="Art der Bewerbung">
            <div role="radiogroup" aria-label="Art der Bewerbung" className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
              {typeOptions.map(([value, label, Icon]) => {
                const active = form.applicationType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      if (active) return;
                      changeDraft({ form: { ...form, applicationType: value }, letter: "" });
                      setError("");
                    }}
                    className={`inline-flex min-h-9 min-w-0 items-center justify-center gap-2 rounded-md px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] disabled:cursor-not-allowed ${active ? "bg-white text-[#204878] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </FormGroup>

          <FormGroup
            title={spontaneous ? "Zielunternehmen" : "Stelle"}
            description={embedded
              ? "Link, Stelle und Unternehmen stammen aus der Bewerbung."
              : spontaneous
                ? "Ein Stelleninserat ist nicht nötig. Beschreiben Sie Funktion und Unternehmen."
                : "Inserat einfügen oder Link angeben. Stelle und Unternehmen werden sonst erkannt."}
          >
            {!embedded && (
              <div className="space-y-1.5">
                <label htmlFor={`${fieldId}-jobAdUrl`} className={labelClass}>
                  {spontaneous ? "Unternehmenswebsite (optional)" : "Link zum Inserat"}
                </label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id={`${fieldId}-jobAdUrl`}
                    value={form.jobAdUrl}
                    onChange={(event) => updateField("jobAdUrl", event.target.value)}
                    placeholder="https://..."
                    className={`pl-9 ${fieldClass}`}
                    maxLength={500}
                    type="url"
                    inputMode="url"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor={`${fieldId}-jobAd`} className={labelClass}>
                {spontaneous ? "Unternehmensinformationen / eigene Hinweise (optional)" : `Stellenanzeige ${form.jobAdUrl.trim() ? "(optional)" : "*"}`}
              </label>
              <Textarea
                id={`${fieldId}-jobAd`}
                value={form.jobAd}
                onChange={(event) => updateField("jobAd", event.target.value)}
                placeholder={spontaneous ? "Was interessiert Sie an diesem Unternehmen? Welchen Beitrag möchten Sie leisten?" : "Stelleninserat hier einfügen"}
                className={`min-h-32 resize-y ${fieldClass}`}
                maxLength={9000}
              />
            </div>

            {!embedded && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor={`${fieldId}-jobTitle`} className={labelClass}>
                    {spontaneous ? "Gewünschte Funktion *" : "Stelle (optional)"}
                  </label>
                  <Input
                    id={`${fieldId}-jobTitle`}
                    value={form.jobTitle}
                    onChange={(event) => updateField("jobTitle", event.target.value)}
                    placeholder={spontaneous ? "Zum Beispiel Teamleitung Beratung" : "Wird aus dem Inserat erkannt"}
                    className={fieldClass}
                    maxLength={140}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={`${fieldId}-company`} className={labelClass}>
                    Unternehmen {spontaneous && !form.jobAdUrl.trim() ? "*" : "(optional)"}
                  </label>
                  <Input
                    id={`${fieldId}-company`}
                    value={form.company}
                    onChange={(event) => updateField("company", event.target.value)}
                    placeholder={spontaneous ? "Ihr Zielunternehmen" : "Wird aus dem Inserat erkannt"}
                    className={fieldClass}
                    maxLength={140}
                  />
                </div>
              </div>
            )}
          </FormGroup>

          <FormGroup title="Empfänger und Sprache" description="Fehlende Angaben werden aus dem Inserat oder der Unternehmenswebsite übernommen.">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
              <div className="space-y-1.5">
                <label htmlFor={`${fieldId}-recipient`} className={labelClass}>
                  Ansprechperson (optional)
                </label>
                <Input
                  id={`${fieldId}-recipient`}
                  value={form.recipient}
                  onChange={(event) => updateField("recipient", event.target.value)}
                  placeholder="Zum Beispiel Frau Muster"
                  className={fieldClass}
                  maxLength={180}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${fieldId}-language`} className={labelClass}>Sprache</label>
                <Select value={form.language} onValueChange={(value) => updateField("language", value as MotivationForm["language"])}>
                  <SelectTrigger id={`${fieldId}-language`} className={fieldClass}>
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

            <details className="group rounded-lg border border-slate-200 px-3 py-2.5 open:bg-slate-50/60">
              <summary className="cursor-pointer select-none text-sm font-medium text-slate-700 marker:text-slate-400">
                Empfängeradresse {form.companyStreet || form.companyPostalCode || form.companyCity
                  ? <span className="font-normal text-slate-500">· {[form.companyStreet, [form.companyPostalCode, form.companyCity].filter(Boolean).join(" ")].filter(Boolean).join(", ")}</span>
                  : <span className="font-normal text-slate-500">(optional)</span>}
              </summary>
              <div className={`mt-3 grid gap-3 ${embedded ? "grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]" : "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)_minmax(0,1fr)]"}`}>
                <div className={`space-y-1.5 ${embedded ? "col-span-2" : ""}`}>
                  <label htmlFor={`${fieldId}-companyStreet`} className={labelClass}>
                    Adresse
                  </label>
                  <Input
                    id={`${fieldId}-companyStreet`}
                    value={form.companyStreet}
                    onChange={(event) => updateField("companyStreet", event.target.value)}
                    placeholder="Musterstrasse 1"
                    className={fieldClass}
                    maxLength={160}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={`${fieldId}-companyPostalCode`} className={labelClass}>
                    PLZ
                  </label>
                  <Input
                    id={`${fieldId}-companyPostalCode`}
                    value={form.companyPostalCode}
                    onChange={(event) => updateField("companyPostalCode", event.target.value)}
                    placeholder="8000"
                    className={fieldClass}
                    maxLength={16}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={`${fieldId}-companyCity`} className={labelClass}>
                    Ort
                  </label>
                  <Input
                    id={`${fieldId}-companyCity`}
                    value={form.companyCity}
                    onChange={(event) => updateField("companyCity", event.target.value)}
                    placeholder="Zürich"
                    className={fieldClass}
                    maxLength={80}
                  />
                </div>
              </div>
            </details>
          </FormGroup>

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className={embedded
            ? "sticky bottom-0 -mx-5 border-t border-slate-200 bg-white px-5 py-3 sm:-mx-6 sm:px-6"
            : "flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5"}
          >
            <Button
              type="submit"
              disabled={isGenerating}
              className={`min-h-10 bg-[#204878] text-white hover:bg-[#1a3a66] ${embedded ? "w-full" : ""}`}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {hasSelfServiceAccess ? (letter ? "Neu erstellen" : "Erstellen") : "Abo aktivieren"}
            </Button>
            {onSaveDraft && !embedded && (
              <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isDownloading} className="min-h-10 border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                {isSavingDraft ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Bewerbung speichern
              </Button>
            )}
            {!embedded && (
              <Button type="button" variant="ghost" onClick={handleReset} className="ml-auto min-h-10 px-3 text-slate-500 hover:bg-transparent hover:text-slate-900 hover:underline">
                Zurücksetzen
              </Button>
            )}
          </div>
        </fieldset>

        <aside
          aria-label="Entwurf"
          className={embedded
            ? "min-w-0 border-t border-slate-200 bg-slate-100 lg:overflow-y-auto lg:border-l lg:border-t-0"
            : "min-w-0 rounded-lg border border-slate-200 bg-slate-50 lg:sticky lg:top-4"}
        >
          <div className={`flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 ${embedded ? "sticky top-0 z-10 bg-white px-5 py-2.5 sm:px-6" : "px-3 py-2.5 sm:px-4"}`}>
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-[#204878]" />
              <h3 className="text-sm font-semibold text-slate-950">Entwurf</h3>
              {letter && !isGenerating && <span className="hidden text-xs text-slate-500 sm:inline">· {wordCount} Wörter</span>}
            </div>
            <div className="flex items-center gap-1.5">
              {letter && !isGenerating && (
                <div role="group" aria-label="Ansicht" className="mr-1 flex rounded-md border border-slate-200 bg-white p-0.5">
                  {([["preview", "Vorschau", Eye], ["edit", readOnly ? "Text" : "Bearbeiten", PenLine]] as const).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={mode === value}
                      onClick={() => setMode(value)}
                      className={`inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] ${mode === value ? "bg-[#204878] text-white" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <Icon className="h-3.5 w-3.5" />{label}
                    </button>
                  ))}
                </div>
              )}
              <Button type="button" variant="outline" size="sm" onClick={handleCopy} disabled={!letter} aria-label="Kopieren" title="Kopieren" className="h-8 border-slate-200 bg-white px-2 text-slate-700 hover:bg-slate-50 sm:px-3">
                <Clipboard className="h-4 w-4" /><span className="hidden sm:inline">Kopieren</span>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleDownload} disabled={!letter || isDownloading} className="h-8 border-slate-200 bg-white px-2 text-slate-700 hover:bg-slate-50 sm:px-3">
                {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Word
              </Button>
            </div>
          </div>

          <div className={embedded ? "p-4 sm:p-6" : "p-3 sm:p-4"}>
            {isGenerating ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-6 text-center" role="status">
                <Loader2 className="mb-3 h-7 w-7 animate-spin text-[#204878]" />
                <p className="text-sm font-medium text-slate-700">Einen Moment! Wir machen aus Gedanken gerade Bewerbungsmaterial …</p>
                <p className="mt-1 text-xs text-slate-500">Das dauert meist 15 bis 30 Sekunden.</p>
              </div>
            ) : letter && mode === "preview" ? (
              <article className="mx-auto w-full max-w-[44rem] rounded-sm bg-white px-5 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.12),0_8px_24px_rgba(15,23,42,0.06)] sm:px-10 sm:py-12">
                <LetterPreview letter={letter} />
              </article>
            ) : letter ? (
              <div className="space-y-1.5">
                <label htmlFor={`${fieldId}-letter`} className="block text-xs font-medium text-slate-600">{readOnly ? "Gespeichertes Schreiben" : "Schreiben bearbeiten"}</label>
                <Textarea
                  id={`${fieldId}-letter`}
                  value={letter}
                  readOnly={readOnly}
                  onChange={(event) => changeDraft({ form, letter: event.target.value })}
                  maxLength={12000}
                  rows={Math.min(40, Math.max(14, letter.split("\n").length + 4))}
                  className="resize-y border-slate-200 bg-white text-sm leading-6 text-slate-950"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-md border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                <FileText className="mb-3 h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-700">Noch kein Entwurf</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                  {readOnly ? "Für diese Bewerbung ist kein Schreiben gespeichert." : "Füllen Sie links die Angaben aus und klicken Sie auf «Erstellen». Das Schreiben erscheint hier als Vorschau."}
                </p>
              </div>
            )}
          </div>
        </aside>
        </fieldset>
      </form>
    </div>
  );
};
