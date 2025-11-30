import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CVExportButtonProps {
  onExport: () => void;
}

export const CVExportButton: React.FC<CVExportButtonProps> = ({ onExport }) => (
  <Button
    variant="outline"
    className="bg-[#204878] text-white hover:bg-[#4c6c93] font-bold rounded-lg py-2 px-4 flex items-center gap-2"
    onClick={onExport}
  >
    <Download className="h-4 w-4" />
    Exportieren
  </Button>
);
