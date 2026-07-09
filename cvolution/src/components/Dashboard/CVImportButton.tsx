import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FileText, Linkedin, Loader2, Upload } from "lucide-react";

type CVImportButtonProps = {
  hasSelfServiceAccess: boolean;
  onRequirePayment: () => void;
  onImported: () => void;
};

export const CVImportButton: React.FC<CVImportButtonProps> = ({
  hasSelfServiceAccess,
  onRequirePayment,
  onImported,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const handleOpenInfo = () => {
    if (!hasSelfServiceAccess) {
      onRequirePayment();
      return;
    }

    setInfoOpen(true);
  };

  const handleSelectFile = () => {
    setInfoOpen(false);
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const isSupported =
      file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isSupported) {
      toast({
        title: "Ungültige Datei",
        description: "Bitte laden Sie einen CV als PDF/DOCX oder ein LinkedIn-Profil als PDF hoch.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        throw new Error("Bitte melden Sie sich erneut an.");
      }

      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/cv-import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (response.status === 402) {
        onRequirePayment();
      }

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Die Datei konnte nicht importiert werden.");
      }

      const counts = result?.counts || {};
      toast({
        title: "Profil importiert",
        description: `${counts.experiences || 0} Erfahrungen, ${counts.education || 0} Ausbildungen, ${counts.skills || 0} Fähigkeiten und ${counts.languages || 0} Sprachen übernommen.`,
      });
      onImported();
    } catch (error) {
      toast({
        title: "Import fehlgeschlagen",
        description: error instanceof Error ? error.message : "Die Datei konnte nicht importiert werden.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Erklaerung zum LinkedIn- und CV-Import */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#204878]">
              CV oder LinkedIn-Profil importieren
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Ihre CV-Daten werden automatisch aus der Datei ausgelesen und ins Profil übernommen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm text-slate-700">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                So exportieren Sie Ihr LinkedIn-Profil als PDF
              </div>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Öffnen Sie Ihr LinkedIn-Profil im Browser.</li>
                <li>Klicken Sie unter Ihrem Namen auf «Mehr».</li>
                <li>Wählen Sie «Profil als PDF speichern».</li>
                <li>Laden Sie die gespeicherte PDF-Datei hier hoch.</li>
              </ol>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                <FileText className="h-4 w-4 text-[#204878]" />
                Bestehender Lebenslauf
              </div>
              <p>Alternativ können Sie Ihren bestehenden Lebenslauf als PDF- oder Word-Datei (DOCX) hochladen.</p>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Hinweis: Bestehende Erfahrungen, Ausbildungen, Fähigkeiten und Sprachen im Self-Service
              werden durch die ausgelesenen Daten ersetzt.
            </p>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setInfoOpen(false)}
              className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Abbrechen
            </Button>
            <Button
              type="button"
              onClick={handleSelectFile}
              className="w-full bg-[#204878] text-white hover:bg-[#1a3a66] sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Datei auswählen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        type="button"
        variant="outline"
        onClick={handleOpenInfo}
        disabled={isImporting}
        title="CV als PDF/DOCX oder LinkedIn-Profil als PDF importieren"
        className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:w-auto"
      >
        {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        CV / LinkedIn PDF importieren
      </Button>
    </>
  );
};
