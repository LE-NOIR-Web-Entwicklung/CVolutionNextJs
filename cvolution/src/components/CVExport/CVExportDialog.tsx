import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// ⇢ If you ever refactor the preview, export the base component here so it stays in sync
//   with the printing / exporting layout.
import { CVPreview } from './CVPreview';

/** *******************************************************************************************
 *  TYPES & CONSTANTS
 ********************************************************************************************/

interface CVExportDialogProps {
  children: React.ReactNode;
}

export type CVTemplate = 'classic' | 'modern' | 'minimal';

const TEMPLATES: Record<CVTemplate, { id: CVTemplate; name: string; description: string; preview: string }> = {
  classic: {
    id: 'classic',
    name: 'Klassisch',
    description: 'Traditionelles Lebenslauf‑Layout mit klarer Struktur',
    preview: '/lovable-uploads/cdc6fbed-c846-4243-b7ea-4eb12246f389.png',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Zeitgemäßes Design mit Farbakzenten',
    preview: '/lovable-uploads/52816b4d-4592-4ac6-a2ca-7eba6c6d86d2.png',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sauberes, minimalistisches Design',
    preview: '/lovable-uploads/f40ab6d8-a47e-4e91-b431-58002f60e221.png',
  },
};

/** *******************************************************************************************
 *  MAIN COMPONENT
 ********************************************************************************************/

export const CVExportDialog: React.FC<CVExportDialogProps> = ({ children }) => {
  const { user } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any | null>(null);

  // Fetch preview data when dialog opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      (async () => {
        const [profileData, experiencesData, educationData, skillsData, languagesData] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).single(),
          supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
          supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
          supabase.from('skills').select('*').eq('user_id', user.id).order('category', { ascending: true }),
          supabase.from('languages').select('*').eq('user_id', user.id).order('language_name', { ascending: true })
        ]);
        setPreviewData({
          profile: profileData.data,
          experiences: experiencesData.data || [],
          education: educationData.data || [],
          skills: skillsData.data || [],
          languages: languagesData.data || [],
        });
      })();
    } else if (!isOpen) {
      setPreviewData(null);
    }
  }, [isOpen, user]);

  /** **************************************
   * DATA HELPERS
   ***************************************/

  const fetchAllData = async () => {
    if (!user) return null;

    const [profileData, experiencesData, educationData, skillsData, languagesData] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
      supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false }),
      supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false }),
      supabase.from('skills').select('*').eq('user_id', user.id).order('category', { ascending: true }),
      supabase
        .from('languages')
        .select('*')
        .eq('user_id', user.id)
        .order('language_name', { ascending: true }),
    ]);

    return {
      profile: profileData.data,
      experiences: experiencesData.data || [],
      education: educationData.data || [],
      skills: skillsData.data || [],
      languages: languagesData.data || [],
    };
  };

  /** **************************************
   * EXPORT ACTIONS
   ***************************************/

  /**
   * Opens a new window and prints its content to PDF via the browser dialog. This keeps
   * dependencies small and works on every platform the browser supports.
   */
  const handleGeneratePDF = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const cvData = await fetchAllData();
      if (!cvData) return;

      const win = window.open('', '_blank');
      if (!win) return;

      win.document.write(generateHTML(cvData, selectedTemplate));
      win.document.close();

      win.onload = () => {
        // wait a tick so that images / fonts are loaded – otherwise the printout may be blank
        setTimeout(() => {
          win.print();
          win.close();
        }, 500);
      };

      toast({
        title: 'Lebenslauf generiert',
        description: `Ihr ${TEMPLATES[selectedTemplate].name} Lebenslauf wurde erfolgreich erstellt.`,
      });
      setIsOpen(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast({
        title: 'Fehler',
        description: 'Der Lebenslauf konnte nicht generiert werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportHTML = async () => {
    if (!user) return;

    const cvData = await fetchAllData();
    if (!cvData) return;

    const blob = new Blob([generateHTML(cvData, selectedTemplate)], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Lebenslauf-${user.email || 'CV'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWord = async () => {
    // html‑docx‑js has to be included via <script> tag → available on window
    const htmlDocx = (window as any).htmlDocx;
    if (!htmlDocx) {
      alert('Word‑Export ist nicht verfügbar. Bitte aktivieren Sie html‑docx‑js.');
      return;
    }

    if (!user) return;

    const cvData = await fetchAllData();
    if (!cvData) return;

    const blob = htmlDocx.asBlob(generateHTML(cvData, selectedTemplate));
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Lebenslauf-${user.email || 'CV'}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /** **************************************
   * HTML GENERATION – THIS IS WHERE THE LOOK & FEEL LIVES
   ***************************************/

  interface FullCVData {
    profile: any;
    experiences: any[];
    education: any[];
    skills: any[];
    languages: any[];
  }

  const generateHTML = (data: FullCVData, template: CVTemplate): string => {
    const { profile, experiences, education, skills, languages } = data;

    const fmt = (date: string): string => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' });
    };

    // -------------------------------------------------------------------------
    //  SHARED STYLES
    // -------------------------------------------------------------------------
    const baseStyle = `
      @page {
        margin: 0;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body {
        margin: 0;
        font-family: 'Inter', Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
      }
      h1, h2, h3, h4, h5, h6 { margin: 0; }
    `;

    // -------------------------------------------------------------------------
    //  TEMPLATE‑SPECIFIC STYLES
    // -------------------------------------------------------------------------
    const styles: Record<CVTemplate, string> = {
      /**
       *  MODERN – strong colour bars left / right (see 52816b4d-…)
       */
      modern: `
        ${baseStyle}

        /* side bars */
        .side-bar {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 66px;
          background: #005d89; /* the exact hue from the design */
          z-index: -1;
        }
        .side-bar.left { left: 0; }
        .side-bar.right { right: 0; }

        main {
          margin: 0 66px;
          padding: 36px 28px 64px 28px;
        }

        /* header */
        .name {
          font-size: 32px;
          font-weight: 800;
          color: #0f4f75;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.1;
        }
        .headline {
          font-size: 14px;
          font-weight: 500;
          color: #94a3b8;
          margin-top: 4px;
        }
        .profile-wrapper {
          display: flex;
          gap: 24px;
        }
        .profile-img {
          width: 170px;
          height: 170px;
          object-fit: cover;
          border-radius: 4px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px #0001;
        }
        /* tables */
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 24px;
        }
        .info-table th {
          text-align: left;
          width: 110px;
          padding-right: 8px;
          font-weight: 600;
        }
        .info-table td { padding-bottom: 4px; }

        /* section */
        section {
          margin-top: 32px;
        }
        section h3 {
          color: #0f4f75;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 6px;
          border-bottom: 2px solid #0f4f75;
          display: inline-block;
          padding-bottom: 2px;
        }
        .exp-item + .exp-item { margin-top: 18px; }
        .exp-role { font-weight: 700; }
        .exp-company { font-weight: 600; }
        .exp-dates {
          font-size: 11px;
          color: #475569;
        }

        ul.bullet {
          margin: 4px 0 0 18px;
          padding: 0;
        }
        ul.bullet li { margin-bottom: 2px; }
      `,

      /**
       *  CLASSIC – black frame, strong rules (see cdc6fbed-…)
       */
      classic: `
        ${baseStyle}

        body { padding: 24mm; }
        main {
          border: 1px solid #000;
          padding: 20mm 20mm 22mm 20mm;
        }
        .top-rule {
          border-top: 3px solid #000;
          margin-top: 12px;
        }
        .name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 160px;
          gap: 24px;
        }
        .profile-img {
          width: 160px;
          height: 160px;
          object-fit: cover;
          border-radius: 4px;
        }
        .info-table { width: 100%; border-collapse: collapse; }
        .info-table th { text-align: left; width: 90px; font-weight: 600; }
        .info-table td { padding-bottom: 3px; }
        section { margin-top: 18px; }
        section h3 {
          font-size: 14px;
          font-weight: 700;
          border-bottom: 3px solid #000;
          display: inline-block;
          padding-bottom: 2px;
          margin-bottom: 6px;
        }
        .exp-item + .exp-item { margin-top: 12px; }
        .exp-role { font-weight: 700; }
        .exp-company { font-weight: 600; }
        .exp-dates { font-size: 11px; }
        ul.bullet { margin: 4px 0 0 18px; padding: 0; }
        ul.bullet li { margin-bottom: 2px; }
      `,

      /**
       *  MINIMAL – subtle grey margins (see f40ab6d8-…)
       */
      minimal: `
        ${baseStyle}

        /* grey outer columns */
        .side-bar {
          position: fixed;
          top: 0;
          bottom: 0;
          width: 70px;
          background: #f1f1f1;
          z-index: -1;
        }
        .side-bar.left { left: 0; }
        .side-bar.right { right: 0; }

        main {
          margin: 0 70px;
          padding: 32px 24px 64px 24px;
        }

        .name {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
          text-transform: uppercase;
        }
        .headline {
          font-size: 14px;
          color: #9ca3af;
          margin-top: 4px;
        }
        .header {
          display: flex;
          gap: 32px;
          margin-bottom: 32px;
        }
        .profile-img {
          width: 180px;
          height: 180px;
          object-fit: cover;
          border-radius: 4px;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-table th { text-align: left; width: 100px; font-weight: 600; }
        .info-table td { padding-bottom: 4px; }

        section { margin-top: 36px; }
        section h3 {
          font-size: 14px;
          font-weight: 700;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 2px;
          margin-bottom: 10px;
        }
        .exp-item + .exp-item { margin-top: 16px; }
        .exp-role { font-weight: 700; }
        .exp-company { font-weight: 600; }
        .exp-dates { font-size: 11px; color: #6b7280; }
        ul.bullet { margin: 4px 0 0 18px; padding: 0; }
        ul.bullet li { margin-bottom: 2px; }
      `,
    };

    // -------------------------------------------------------------------------
    //  HTML BODY (shared skeleton – template variants are handled via CSS)
    // -------------------------------------------------------------------------

    const profileImgHTML = profile?.profile_picture_url
      ? `<img class="profile-img" src="${profile.profile_picture_url}" alt="Profilbild" />`
      : '';

    const contactTable = `
      <table class="info-table">
        ${profile?.location ? `<tr><th>Adresse</th><td>${profile.location}</td></tr>` : ''}
        ${profile?.phone ? `<tr><th>Tel.</th><td>${profile.phone}</td></tr>` : ''}
        ${user?.email ? `<tr><th>E‑Mail</th><td>${user.email}</td></tr>` : ''}
        ${profile?.birthdate ? `<tr><th>Geb.</th><td>${profile.birthdate}</td></tr>` : ''}
      </table>`;

    const experienceHTML = experiences
      .map(
        (exp) => `
        <div class="exp-item">
          <div class="exp-role">${exp.job_title}</div>
          <div class="exp-company">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
          <div class="exp-dates">${fmt(exp.start_date)} – ${exp.is_current ? 'heute' : fmt(exp.end_date)}</div>
          ${exp.description ? `<ul class="bullet">${exp.description
            .split('\n')
            .map((d: string) => `<li>${d}</li>`) // assume newline separated
            .join('')}</ul>`
            : ''}
        </div>`
      )
      .join('');

    const educationHTML = education
      .map(
        (edu) => `
        <div class="exp-item">
          <div class="exp-role">${edu.degree}</div>
          <div class="exp-company">${edu.institution}</div>
          <div class="exp-dates">${fmt(edu.start_date)} – ${edu.is_current ? 'heute' : fmt(edu.end_date)}</div>
          ${edu.field_of_study ? `<div>${edu.field_of_study}</div>` : ''}
        </div>`
      )
      .join('');

    const skillsHTML = skills.length
      ? `<div class="skills"><strong>Fähigkeiten: </strong>${skills
          .map((s) => s.skill_name)
          .join(', ')}</div>`
      : '';

    const languagesHTML = languages.length
      ? `<div class="languages"><strong>Sprachen: </strong>${languages
          .map((l) => `${l.language_name} (${l.proficiency})`)
          .join(', ')}</div>`
      : '';

    // -------------------------------------------------------------------------

    return `
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="utf-8" />
          <title>Lebenslauf</title>
          <style>${styles[template]}</style>
        </head>
        <body>
          <!-- decorative side bars for modern & minimal -->
          <div class="side-bar left"></div>
          <div class="side-bar right"></div>
          <main>
            <!-- HEADER -------------------------------------------------------->
            ${template === 'classic'
              ? `<div class="profile-grid">
                   <div>
                     <h2 class="name">${profile?.full_name || 'Ihr Name'}</h2>
                     ${contactTable}
                   </div>
                   ${profileImgHTML}
                 </div>
                 <div class="top-rule"></div>`
              : `<div class="header">
                   <div>
                     <h1 class="name">${profile?.full_name || 'Ihr Name'}</h1>
                     ${profile?.headline ? `<div class="headline">${profile.headline}</div>` : ''}
                     ${contactTable}
                   </div>
                   ${profileImgHTML}
                 </div>`}

            <!-- EXPERIENCE ---------------------------------------------------->
            <section>
              <h3>Berufliche Erfahrung</h3>
              ${experienceHTML}
            </section>

            <!-- EDUCATION ----------------------------------------------------->
            ${education.length
              ? `<section>
                   <h3>Ausbildung</h3>
                   ${educationHTML}
                 </section>`
              : ''}

            <!-- SKILLS & LANGUAGES ------------------------------------------->
            ${(skills.length || languages.length)
              ? `<section>
                   ${skillsHTML}
                   ${languagesHTML}
                 </section>`
              : ''}
          </main>
        </body>
      </html>
    `;
  };

  /** *************************************************************************************** */

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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

        {/* ------------------------------------------------------------------ */}
        {/*  TEMPLATE SELECTION GRID                                           */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-black flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4" />
              Template auswählen
            </label>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {(Object.values(TEMPLATES) as typeof TEMPLATES[CVTemplate][]).map((tpl) => (
                <Card
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`cursor-pointer transition-all border-0 ${
                    selectedTemplate === tpl.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-2 sm:p-4">
                    <div className="aspect-[3/4] mb-2 sm:mb-3 bg-gray-100 rounded overflow-hidden">
                      <img src={tpl.preview} alt={tpl.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-semibold text-black text-base sm:text-lg">{tpl.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{tpl.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------------------*/}
          {/*  PREVIEW                                                         */}
          {/* ----------------------------------------------------------------*/}
          <div className="hidden md:block min-h-[400px]">
            {previewData ? (
              <CVPreview template={selectedTemplate} data={previewData} />
            ) : (
              <div className="text-gray-400 text-center py-12">Vorschau wird geladen ...</div>
            )}
          </div>

          {/* ----------------------------------------------------------------*/}
          {/*  ACTIONS                                                         */}
          {/* ----------------------------------------------------------------*/}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 gap-3 sm:gap-0">
            <p className="text-xs sm:text-sm text-black text-center sm:text-left">
              Ausgewähltes Template: <strong>{TEMPLATES[selectedTemplate].name}</strong>
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-2 transition duration-200 w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" /> PDF exportieren
              </Button>
              <Button
                onClick={handleExportWord}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-4 py-2 transition duration-200 w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" /> Word exportieren
              </Button>
              <Button
                onClick={handleExportHTML}
                disabled={isGenerating}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg px-4 py-2 transition duration-200 w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" /> HTML exportieren
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
