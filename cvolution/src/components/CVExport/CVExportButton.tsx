import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CVExportButtonProps {
  onExport: () => void;
}

export const CVExportButton: React.FC<CVExportButtonProps> = ({ onExport }) => (
  <Button
    variant="outline"
    className="flex h-9 items-center justify-center gap-2 border-[#204878] bg-[#204878] px-3 text-white hover:bg-[#1a3a66] hover:text-white"
    onClick={onExport}
  >
    <Download className="h-4 w-4" />
    Exportieren
  </Button>
);
