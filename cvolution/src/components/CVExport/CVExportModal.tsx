import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CVDesignSelector, CVDesign } from './CVDesignSelector';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CVPdfDocument } from './pdf/CVPdfDocument';

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

export const CVExportModal: React.FC<CVExportModalProps> = ({ open, onClose, user, profile, experiences, education, skills, languages }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<CVDesign>('design1');

  // Export-Button wird jetzt durch PDFDownloadLink ersetzt

  return (
    <Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#204878] mb-1">CV Exportieren</DialogTitle>
          <DialogDescription className="text-black">Wählen Sie ein Design und exportieren Sie Ihren Lebenslauf als PDF.</DialogDescription>
        </DialogHeader>
        <div className="bg-blue-50 rounded-2xl p-8 my-6 flex justify-center">
          <CVDesignSelector selected={selectedDesign} onSelect={setSelectedDesign} />
        </div>
        <DialogFooter>
          <PDFDownloadLink
            document={
              <CVPdfDocument
                user={user}
                profile={profile}
                experiences={experiences}
                education={education}
                skills={skills}
                languages={languages}
                design={selectedDesign}
              />
            }
            fileName="Lebenslauf.pdf"
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Button disabled={loading} className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200 px-6">
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Exportiere...' : 'Als PDF exportieren'}
              </Button>
            )}
          </PDFDownloadLink>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200 px-6">Abbrechen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
