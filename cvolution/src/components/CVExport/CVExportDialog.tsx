import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CVPreview } from './CVPreview';

interface CVExportDialogProps {
  children: React.ReactNode;
}

export type CVTemplate = 'classic' | 'modern' | 'minimal';

export const CVExportDialog: React.FC<CVExportDialogProps> = ({ children }) => {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      // Fetch all user data
      const [profileData, experiencesData, educationData, skillsData, languagesData] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', user.id).order('category', { ascending: true }),
        supabase.from('languages').select('*').eq('user_id', user.id).order('language_name', { ascending: true })
      ]);

      const cvData = {
        profile: profileData.data,
        experiences: experiencesData.data || [],
        education: educationData.data || [],
        skills: skillsData.data || [],
        languages: languagesData.data || [],
        template: selectedTemplate
      };

      // Generate PDF using the CV data
      await generatePDF(cvData);

      toast({
        title: 'Lebenslauf generiert',
        description: `Ihr ${templates.find(t => t.id === selectedTemplate)?.name} Lebenslauf wurde erfolgreich erstellt.`,
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

  const generatePDF = async (cvData: any) => {
    // Create a new window with the CV content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate HTML content based on template
    const htmlContent = generateHTMLContent(cvData);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  const generateHTMLContent = (cvData: any) => {
    const { profile, experiences, education, skills, languages, template } = cvData;

    const getTemplateStyles = () => {
      switch (template) {
        case 'classic':
          return `
            body { 
              font-family: Arial, sans-serif; 
              color: #000; 
              background: white; 
              line-height: 1.2;
              max-width: 210mm;
              margin: 0 auto;
              padding: 15mm;
              font-size: 11px;
            }
            .header { 
              margin-bottom: 20px;
              display: flex;
              align-items: flex-start;
              gap: 20px;
            }
            .profile-image {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
              flex-shrink: 0;
            }
            .header-content {
              flex-grow: 1;
            }
            .name { 
              font-size: 22px; 
              font-weight: bold; 
              margin-bottom: 4px;
              color: #000;
            }
            .contact-info { 
              font-size: 10px;
              margin-bottom: 15px;
              line-height: 1.3;
            }
            .section-title { 
              font-weight: bold; 
              font-size: 12px;
              color: #000;
              margin: 15px 0 8px 0; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .section-content {
              margin-bottom: 15px;
              padding-left: 10px;
            }
            .item { 
              margin-bottom: 12px; 
              break-inside: avoid;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 2px;
            }
            .item-title { 
              font-weight: bold; 
              font-size: 11px; 
              color: #000;
            }
            .item-company { 
              font-size: 10px; 
              color: #000;
              margin-bottom: 2px;
            }
            .item-date { 
              font-size: 9px; 
              color: #666;
              white-space: nowrap;
            }
            .item-description { 
              font-size: 10px; 
              color: #333; 
              margin-top: 3px;
              line-height: 1.3;
            }
            .skills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .skill-item {
              font-size: 10px;
              color: #000;
              background: transparent;
              display: inline-block;
            }
            .two-column {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                margin: 0;
                padding: 15mm;
              }
            }
          `;
        case 'modern':
          return `
            body { 
              font-family: Arial, sans-serif; 
              color: #333; 
              background: white;
              line-height: 1.3;
              max-width: 210mm;
              margin: 0 auto;
              padding: 0;
              font-size: 11px;
            }
            .header { 
              background: #1e40af; 
              color: white; 
              padding: 25px 30px; 
              margin-bottom: 0;
              display: flex;
              align-items: center;
              gap: 25px;
            }
            .profile-image {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              object-fit: cover;
              border: 4px solid white;
              flex-shrink: 0;
            }
            .header-content {
              flex-grow: 1;
            }
            .name { 
              font-size: 26px; 
              font-weight: bold; 
              margin-bottom: 6px;
              color: white;
            }
            .title { 
              font-size: 14px; 
              margin-bottom: 10px;
              color: #e0e7ff;
              font-weight: normal;
            }
            .contact-info { 
              font-size: 11px;
              color: #e0e7ff;
              line-height: 1.4;
            }
            .content-area {
              padding: 25px 30px;
            }
            .section-title { 
              color: #1e40af; 
              font-weight: bold; 
              font-size: 13px;
              margin: 20px 0 10px 0; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .section-title:first-child {
              margin-top: 0;
            }
            .item { 
              margin-bottom: 15px; 
              break-inside: avoid;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 3px;
            }
            .item-title { 
              font-weight: bold; 
              font-size: 12px; 
              color: #1e40af;
            }
            .item-company { 
              color: #333; 
              margin-bottom: 3px; 
              font-size: 11px;
            }
            .item-date { 
              font-size: 10px; 
              color: #666;
              white-space: nowrap;
            }
            .item-description { 
              font-size: 10px; 
              color: #555; 
              margin-top: 4px;
              line-height: 1.4;
            }
            .skills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .skill-item {
              background: #eff6ff;
              color: #1e40af;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 500;
              display: inline-block;
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                margin: 0;
                padding: 0;
              }
            }
          `;
        case 'minimal':
          return `
            body { 
              font-family: Arial, sans-serif; 
              color: #2d3748; 
              background: white; 
              line-height: 1.4;
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              font-size: 11px;
            }
            .header { 
              border-bottom: 1px solid #e2e8f0; 
              padding-bottom: 20px; 
              margin-bottom: 25px; 
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .profile-image {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
              flex-shrink: 0;
            }
            .header-content {
              flex-grow: 1;
            }
            .name { 
              font-size: 28px; 
              font-weight: 300; 
              margin-bottom: 6px;
              color: #2d3748;
              letter-spacing: -0.5px;
            }
            .title { 
              font-size: 13px; 
              margin-bottom: 12px;
              color: #718096;
              font-weight: normal;
            }
            .contact-info { 
              font-size: 10px;
              color: #a0aec0;
              line-height: 1.5;
            }
            .section-title { 
              font-weight: normal; 
              font-size: 11px; 
              margin: 25px 0 12px 0; 
              color: #4a5568; 
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .section-title:first-child {
              margin-top: 0;
            }
            .item { 
              margin-bottom: 16px; 
              break-inside: avoid;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              margin-bottom: 3px;
            }
            .item-title { 
              font-weight: 500; 
              font-size: 12px; 
              color: #2d3748;
            }
            .item-company { 
              color: #718096; 
              margin-bottom: 3px; 
              font-size: 11px;
            }
            .item-date { 
              font-size: 9px; 
              color: #a0aec0;
              white-space: nowrap;
            }
            .item-description { 
              font-size: 10px; 
              color: #718096; 
              margin-top: 4px;
              line-height: 1.4;
            }
            .skills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }
            .skill-item {
              border: 1px solid #e2e8f0;
              color: #718096;
              padding: 3px 8px;
              font-size: 9px;
              background: #f7fafc;
              display: inline-block;
            }
            @media print {
              body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                margin: 0;
                padding: 20mm;
              }
            }
          `;
        default:
          return '';
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' });
    };

    const contentArea = template === 'modern' ? 'content-area' : '';

    // Generate profile image HTML if available
    const profileImageHTML = profile?.profile_picture_url ? 
      `<img src="${profile.profile_picture_url}" alt="Profilbild" class="profile-image" />` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Lebenslauf - ${profile?.full_name || 'Unbekannt'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            ${getTemplateStyles()}
          </style>
        </head>
        <body>
          <div class="header">
            ${profileImageHTML}
            <div class="header-content">
              <div class="name">${profile?.full_name || 'Ihr Name'}</div>
              ${profile?.headline ? `<div class="title">${profile.headline}</div>` : ''}
              <div class="contact-info">
                ${profile?.location ? `${profile.location}<br>` : ''}
                ${profile?.phone ? `${profile.phone}<br>` : ''}
                ${user?.email ? `${user.email}<br>` : ''}
                ${profile?.linkedin_url ? `LinkedIn: ${profile.linkedin_url}<br>` : ''}
                ${profile?.website ? `Website: ${profile.website}` : ''}
              </div>
            </div>
          </div>

          <div class="${contentArea}">
            ${profile?.summary ? `
              <div class="section-title">Berufliche Zusammenfassung</div>
              <div class="item-description">${profile.summary}</div>
            ` : ''}

            ${experiences.length > 0 ? `
              <div class="section-title">Berufserfahrung</div>
              <div class="section-content">
                ${experiences.map((exp: any) => `
                  <div class="item">
                    <div class="item-header">
                      <div class="item-title">${exp.job_title}</div>
                      <div class="item-date">
                        ${formatDate(exp.start_date)} - ${exp.is_current ? 'heute' : formatDate(exp.end_date)}
                      </div>
                    </div>
                    <div class="item-company">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
                    ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${education.length > 0 ? `
              <div class="section-title">Ausbildung</div>
              <div class="section-content">
                ${education.map((edu: any) => `
                  <div class="item">
                    <div class="item-header">
                      <div class="item-title">${edu.degree}</div>
                      <div class="item-date">
                        ${formatDate(edu.start_date)} - ${edu.is_current ? 'heute' : formatDate(edu.end_date)}
                      </div>
                    </div>
                    <div class="item-company">${edu.institution}</div>
                    ${edu.field_of_study ? `<div class="item-description">${edu.field_of_study}</div>` : ''}
                    ${edu.grade ? `<div class="item-description">Note: ${edu.grade}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div class="two-column">
              ${skills.length > 0 ? `
                <div>
                  <div class="section-title">Fähigkeiten</div>
                  <div class="skills-container">
                    ${skills.map((skill: any) => `
                      <div class="skill-item">${skill.skill_name}</div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${languages.length > 0 ? `
                <div>
                  <div class="section-title">Sprachen</div>
                  <div class="skills-container">
                    ${languages.map((lang: any) => `
                      <div class="skill-item">
                        ${lang.language_name} (${
                          lang.proficiency === 'beginner' ? 'Grundkenntnisse' :
                          lang.proficiency === 'intermediate' ? 'Mittelstufe' :
                          lang.proficiency === 'advanced' ? 'Fortgeschritten' :
                          lang.proficiency === 'expert' ? 'Experte' :
                          lang.proficiency === 'native' ? 'Muttersprache' : lang.proficiency
                        })
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lebenslauf exportieren
          </DialogTitle>
          <DialogDescription>
            Wählen Sie ein Template und generieren Sie Ihren professionellen Lebenslauf
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4" />
              Template auswählen
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[3/4] mb-3 bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Ausgewähltes Template: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong>
            </p>
            <Button 
              onClick={handleGenerateCV}
              disabled={isGenerating}
              className="bg-green-600 hover:bg-green-700"
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
