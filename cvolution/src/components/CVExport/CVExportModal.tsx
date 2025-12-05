import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CVDesignSelector, CVDesign } from './CVDesignSelector';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVPdfDocument } from './pdf/CVPdfDocument';
import dynamic from 'next/dynamic';


interface CVExportModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

export const CVExportModal: React.FC<CVExportModalProps> = ({
  open, onClose, user, profile, experiences, education, skills, languages
}) => {
  const [selectedDesign, setSelectedDesign] = useState<CVDesign>('design1');
  const [loading, setLoading] = useState(false);


  const handleExport = async () => {
    setLoading(true);
    const pdf = (await import('@react-pdf/renderer')).pdf;
    const doc = (
      <CVPdfDocument
        key={selectedDesign}
        user={user || {}}
        profile={profile || {}}
        experiences={experiences || []}
        education={education || []}
        skills={skills || []}
        languages={languages || []}
        design={selectedDesign}
      />
    );
    const blob = await pdf(doc).toBlob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lebenslauf.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-200 p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#204878] mb-1">CV Exportieren</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-black">
            Wählen Sie ein Design und exportieren Sie Ihren Lebenslauf als PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 lg:p-8 my-4 sm:my-6 flex justify-center overflow-x-auto">
          <CVDesignSelector selected={selectedDesign} onSelect={setSelectedDesign} />
        </div>
       <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            onClick={handleExport}
            disabled={loading}
            className="w-full sm:w-auto bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-2.5 sm:py-3 transition duration-200 px-4 sm:px-6 text-sm sm:text-base"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Exportiere...' : 'Als PDF exportieren'}
          </Button>
          <Button onClick={onClose} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-2.5 sm:py-3 transition duration-200 px-4 sm:px-6 text-sm sm:text-base">
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
