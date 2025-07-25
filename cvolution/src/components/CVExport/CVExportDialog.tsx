import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CVPreview } from './CVPreview';
import * as PDF from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { LebenslaufPDF } from './LebenslaufPDF';
import { LebenslaufPDF_Minimal } from './LebenslaufPDF_Minimal';
import { LebenslaufPDF_Classic } from './LebenslaufPDF_Classic';

interface CVExportDialogProps {
  children: React.ReactNode;
}

export type CVTemplate = 'classic' | 'modern' | 'minimal';

export const CVExportDialog: React.FC<CVExportDialogProps> = ({ children }) => {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);
  const [profile, setProfile] = useState<any>({});
  const [experiences, setExperiences] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [skills, setSkills] = useState<{ category: string | null; value: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    // Lade Profil inkl. Bild
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(async ({ data }) => {
        if (data && data.profile_picture_url) {
          // Falls Bild-URL ein Supabase Storage Pfad ist, hole die öffentliche URL
          if (data.profile_picture_url.startsWith('profile-photos/')) {
            const { data: urlData } = supabase.storage
              .from('profile-photos')
              .getPublicUrl(data.profile_picture_url.replace('profile-photos/', ''));
            if (urlData && urlData.publicUrl) {
              data.profile_picture_url = urlData.publicUrl;
            }
          }
        }
        setProfile(data || {});
        // Nach dem Laden: Profilname ausgeben
        console.log('Profilname:', data?.full_name);
        console.log('Profilbild:', data?.profile_picture_url);
      });
    // Lade Erfahrungen
    supabase
      .from('experiences')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setExperiences(data || []);
        // Erste Erfahrung ausgeben
        if (data && data.length > 0) {
          console.log('Erste Erfahrung:', data[0]);
        }
      });
    // Lade Bildung
    supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        // Erste Bildung ausgeben
        if (data && data.length > 0) {
          console.log('Erste Bildung:', data[0]);
        }
      });
    // Lade Sprachen
    supabase
      .from('languages')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setLanguages(data || []);
        // Erste Sprache ausgeben
        if (data && data.length > 0) {
          console.log('Erste Sprache:', data[0]);
        }
      });
    // Lade Programme (z.B. aus skills mit Kategorie 'Programme')
    supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setPrograms((data || []).filter(s => s.category === 'Programme').map(s => s.skill_name));
        setSkills((data || []).map(s => ({ category: s.category, value: s.skill_name })));
        // Erste Fähigkeit ausgeben
        if (data && data.length > 0) {
          console.log('Erste Fähigkeit:', data[0]);
        }
      });
  }, [user]);

  const templates = [
    {
      id: 'classic' as CVTemplate,
      name: 'Klassisch',
      description: 'Traditionelles Lebenslauf-Layout mit klarer Struktur',
      preview: '/lovable-uploads/cdc6fbed-c846-4243-b7ea-4eb12246f389.png'
    },
    {
      id: 'modern' as CVTemplate,
      name: 'Modern',
      description: 'Zeitgemäßes Design mit Farbakzenten',
      preview: '/lovable-uploads/52816b4d-4592-4ac6-a2ca-7eba6c6d86d2.png'
    },
    {
      id: 'minimal' as CVTemplate,
      name: 'Minimal',
      description: 'Sauberes, minimalistisches Design',
      preview: '/lovable-uploads/f40ab6d8-a47e-4e91-b431-58002f60e221.png'
    }
  ];

  const handleGenerateCV = async () => {
    if (!user) return;

    setIsGenerating(true);

    try {
      let pdfComponent;
      if (selectedTemplate === 'classic') {
        // Map email and birthdate from profile and user
        const profileData = {
          ...profile,
          email: profile?.email || user?.email || '',
          birthdate: profile?.birthdate || profile?.geburtsdatum || '',
        };
        // Map experiences to expected format
        const experiencesData = (experiences || []).map(exp => ({
          job: exp.job || exp.position || '',
          period: exp.period || `${exp.start_date || ''} – ${exp.end_date || 'heute'}`,
          position: exp.position || '',
          company: exp.company || '',
          tasks: exp.tasks || (exp.description ? [exp.description] : []),
        }));
        // Map education from state if available
        const educationData: any[] = [];
        // Pass programs as skills with category 'Programme'
        const skillsData = [
          ...skills,
          ...programs.map(program => ({ category: 'Programme', skill_name: program })),
        ];
        pdfComponent = (
          <LebenslaufPDF_Classic
            profile={profileData}
            experiences={experiencesData}
            education={educationData}
            languages={languages}
            skills={skillsData}
          />
        );
      } else if (selectedTemplate === 'minimal') {
        pdfComponent = (
          <LebenslaufPDF_Minimal
            profile={profile}
            experiences={experiences}
            languages={languages.map(l => ({ language: l.language_name, level: l.proficiency }))}
            programs={programs}
            skills={skills.map(s => ({ category: s.category ?? '', value: s.value }))}
          />
        );
      } else {
        pdfComponent = (
          <LebenslaufPDF
            profile={{}}
            experiences={[]}
          />
        );
      }
      const blob = await PDF.pdf(pdfComponent).toBlob();
      saveAs(blob, `Lebenslauf-Max-Mustermann.pdf`);
      toast({
        title: 'Lebenslauf generiert',
        description: 'Ihr Lebenslauf wurde erfolgreich erstellt und heruntergeladen.',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating CV:', error);
      toast({
        title: 'Fehler',
        description: 'Der Lebenslauf konnte nicht generiert werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white p-2 sm:p-4 md:p-8 rounded-2xl shadow-lg border-0">
        <DialogHeader className="space-y-1 p-0 mb-6">
          <DialogTitle className="flex flex-col sm:flex-row items-center gap-2 text-xl sm:text-2xl text-center text-black font-bold">
            <FileText className="h-5 w-5" />
            Lebenslauf exportieren
          </DialogTitle>
          <DialogDescription className="text-center text-black text-sm sm:text-base">
            Wählen Sie ein Template und generieren Sie Ihren professionellen Lebenslauf
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-black flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4" />
              Template auswählen
            </label>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all border-0 ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-2 sm:p-4">
                    <div className="aspect-[3/4] mb-2 sm:mb-3 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-black text-base sm:text-lg">{template.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 gap-3 sm:gap-0">
            <p className="text-xs sm:text-sm text-black text-center sm:text-left">
              Ausgewähltes Template: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong>
            </p>
            <Button 
              onClick={handleGenerateCV}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-3 sm:px-4 py-2 transition duration-200 w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Wird generiert...' : 'PDF generieren'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};