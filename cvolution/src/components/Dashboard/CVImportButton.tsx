import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

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

  const handleSelectFile = () => {
    if (!hasSelfServiceAccess) {
      onRequirePayment();
      return;
    }

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

    const confirmed = window.confirm(
      "CV oder LinkedIn-Profil PDF importieren? Bestehende Erfahrungen, Ausbildungen, Fähigkeiten und Sprachen werden durch die ausgelesenen Daten ersetzt."
    );

    if (!confirmed) return;

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
      <Button
        type="button"
        variant="outline"
        onClick={handleSelectFile}
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
