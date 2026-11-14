import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Languages, Pencil, Save, Sparkles, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CvAddButton, CvEmpty, CvFormSurface, CvItemActions, CvPanel, cvField, cvFormActions, cvLabel, cvPrimary, cvSecondary } from './cv-ui';

// Skill type
interface Skill {
  id: string;
  skill_name: string;
  proficiency: 'Anfänger' | 'Gut' | 'Sehr gut' | 'Experte' | 'Muttersprachlich';
  years_of_experience: number | null;
  category: string | null;
}

// Language type
interface Language {
  id: string;
  language_name: string;
  proficiency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Muttersprache';
}

const SkillsAndLanguagesSection = React.forwardRef<{ saveSkillsAndLanguages: () => void }, {}>((props, ref) => {
  const { user } = useAuth();

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState(true);
  const [skillsEditingId, setSkillsEditingId] = useState<string | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Languages state
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLanguagesLoading, setIsLanguagesLoading] = useState(true);
  const [languagesEditingId, setLanguagesEditingId] = useState<string | null>(null);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  // Driver's license state
  const [driverLicenses, setDriverLicenses] = useState<Skill[]>([]);
  const [isAddingDriverLicense, setIsAddingDriverLicense] = useState(false);
  const [driverLicenseEditingId, setDriverLicenseEditingId] = useState<string | null>(null);

  // Refs for forms
  const addSkillFormRef = useRef<HTMLFormElement>(null);
  const editSkillFormRefs = useRef<{ [id: string]: HTMLFormElement | null }>({});
  const addLanguageFormRef = useRef<HTMLFormElement>(null);
  const editLanguageFormRefs = useRef<{ [id: string]: HTMLFormElement | null }>({});
  const addDriverLicenseFormRef = useRef<HTMLFormElement>(null);
  const editDriverLicenseFormRefs = useRef<{ [id: string]: HTMLFormElement | null }>({});

  useImperativeHandle(ref, () => ({
    saveSkillsAndLanguages: () => {
      if (isAddingSkill && addSkillFormRef.current) {
        addSkillFormRef.current.requestSubmit();
      } else if (skillsEditingId && editSkillFormRefs.current[skillsEditingId]) {
        editSkillFormRefs.current[skillsEditingId]?.requestSubmit();
      }
      if (isAddingLanguage && addLanguageFormRef.current) {
        addLanguageFormRef.current.requestSubmit();
      } else if (languagesEditingId && editLanguageFormRefs.current[languagesEditingId]) {
        editLanguageFormRefs.current[languagesEditingId]?.requestSubmit();
      }
      if (isAddingDriverLicense && addDriverLicenseFormRef.current) {
        addDriverLicenseFormRef.current.requestSubmit();
      } else if (driverLicenseEditingId && editDriverLicenseFormRefs.current[driverLicenseEditingId]) {
        editDriverLicenseFormRefs.current[driverLicenseEditingId]?.requestSubmit();
      }
    }
  }));

  // Fetch skills
  useEffect(() => {
    fetchSkills();
  }, [user]);

  // Mapping DB value to UI value for skills
  const dbToUiSkillProficiency = (dbValue: string): string => {
    switch (dbValue) {
      case 'beginner': return 'Anfänger';
      case 'intermediate': return 'Gut';
      case 'advanced': return 'Sehr gut';
      case 'expert': return 'Experte';
      default: return dbValue;
    }
  };

  const fetchSkills = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('category', { ascending: true });
      if (error) throw error;

      // Separate driver licenses from other skills
      const allSkills = (data || []).map((skill) => ({
        ...skill,
        proficiency: dbToUiSkillProficiency(skill.proficiency) as Skill['proficiency'],
      }));

      const licenses = allSkills.filter(s => s.category?.toLowerCase() === 'führerschein');
      const otherSkills = allSkills.filter(s => s.category?.toLowerCase() !== 'führerschein');

      setDriverLicenses(licenses);
      setSkills(otherSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({ title: 'Fehler', description: 'Fähigkeitsdaten konnten nicht geladen werden.', variant: 'destructive' });
    } finally {
      setIsSkillsLoading(false);
    }
  };

  // Fetch languages
  useEffect(() => {
    fetchLanguages();
  }, [user]);

  // Mapping DB value to UI value for languages
  const dbToUiLanguageProficiency = (dbValue: string): Language['proficiency'] => {
    const mapping: Record<string, Language['proficiency']> = {
      'a1': 'A1',
      'a2': 'A2',
      'b1': 'B1',
      'b2': 'B2',
      'c1': 'C1',
      'c2': 'C2',
      'native': 'Muttersprache',
      // Legacy mappings
      'beginner': 'A2',
      'intermediate': 'B1',
      'advanced': 'B2',
      'expert': 'C1',
    };
    return mapping[dbValue.toLowerCase()] || 'B2';
  };

  // Get display label with description for language proficiency
  const getLanguageProficiencyLabel = (proficiency: Language['proficiency']): string => {
    const labels: Record<Language['proficiency'], string> = {
      'A1': 'A1 – Anfänger',
      'A2': 'A2 – Grundlegende Kenntnisse',
      'B1': 'B1 – Fortgeschrittene Sprachverwendung',
      'B2': 'B2 – Selbstständige Sprachverwendung',
      'C1': 'C1 – Fachkundige Sprachkenntnisse',
      'C2': 'C2 – Annähernd muttersprachliche Kenntnisse',
      'Muttersprache': 'Muttersprache',
    };
    return labels[proficiency] || proficiency;
  };

  // Mapping UI value to DB value for languages
  const uiToDbLanguageProficiency = (uiValue: string): string => {
    const mapping: Record<string, string> = {
      'A1': 'a1',
      'A2': 'a2',
      'B1': 'b1',
      'B2': 'b2',
      'C1': 'c1',
      'C2': 'c2',
      'Muttersprache': 'native',
    };
    return mapping[uiValue] || 'b2';
  };

  const fetchLanguages = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', user.id)
        .order('language_name', { ascending: true });
      if (error) throw error;
      setLanguages(
        (data || []).map((language) => ({
          ...language,
          proficiency: dbToUiLanguageProficiency(language.proficiency),
        }))
      );
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast({ title: 'Fehler', description: 'Sprachdaten konnten nicht geladen werden.', variant: 'destructive' });
    } finally {
      setIsLanguagesLoading(false);
    }
  };

  // Language form
  const LanguageForm: React.FC<{ language?: Language }> = ({ language }) => {
    const formInstanceRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
      if (language?.id) {
        editLanguageFormRefs.current[language.id] = formInstanceRef.current;
        return () => {
          editLanguageFormRefs.current[language.id] = null;
        };
      }
    }, [language?.id]);
    return (
      <form
        ref={language?.id ? formInstanceRef : addLanguageFormRef}
        onSubmit={(e) => handleSaveLanguage(e, language?.id)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={cvLabel}>Sprache *</label>
            <Input
              name="language_name"
              defaultValue={language?.language_name || ''}
              placeholder="Deutsch, Englisch, Spanisch, etc."
              required
              className={cvField}
            />
          </div>
          <div>
            <label className={cvLabel}>Niveau *</label>
            <Select name="proficiency" defaultValue={language?.proficiency || 'B2'}>
              <SelectTrigger className={cvField}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 border-slate-200 bg-white text-slate-950 shadow-lg">
                <SelectItem value="A1">A1 – Anfänger</SelectItem>
                <SelectItem value="A2">A2 – Grundlegende Kenntnisse</SelectItem>
                <SelectItem value="B1">B1 – Fortgeschrittene Sprachverwendung</SelectItem>
                <SelectItem value="B2">B2 – Selbstständige Sprachverwendung</SelectItem>
                <SelectItem value="C1">C1 – Fachkundige Sprachkenntnisse</SelectItem>
                <SelectItem value="C2">C2 – Annähernd muttersprachliche Kenntnisse</SelectItem>
                <SelectItem value="Muttersprache">Muttersprache</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={cvFormActions}>
          <Button type="submit" className={cvPrimary}>
            <Save className="h-4 w-4" />
            Speichern
          </Button>
          <Button
            type="button"
            onClick={() => {
              setLanguagesEditingId(null);
              setIsAddingLanguage(false);
            }}
            className={cvSecondary}
          >
            <X className="h-4 w-4" />
            Abbrechen
          </Button>
        </div>
      </form>
    );
  };

  // Skill form
  const SkillForm: React.FC<{ skill?: Skill }> = ({ skill }) => {
    const formInstanceRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
      if (skill?.id) {
        editSkillFormRefs.current[skill.id] = formInstanceRef.current;
        return () => {
          editSkillFormRefs.current[skill.id] = null;
        };
      }
    }, [skill?.id]);
    return (
      <form
        ref={skill?.id ? formInstanceRef : addSkillFormRef}
        onSubmit={(e) => handleSaveSkill(e, skill?.id)}
        className="space-y-4"
      >
        <div>
          <label className={cvLabel}>Fähigkeit *</label>
          <Input
            name="skill_name"
            defaultValue={skill?.skill_name || ''}
            placeholder="SAP, MS Office, Instandhaltung, Bauführung..."
            required
            className={cvField}
          />
        </div>
        <div className={cvFormActions}>
          <Button type="submit" className={cvPrimary}>
            <Save className="h-4 w-4" />
            Speichern
          </Button>
          <Button
            type="button"
            onClick={() => {
              setSkillsEditingId(null);
              setIsAddingSkill(false);
            }}
            className={cvSecondary}
          >
            <X className="h-4 w-4" />
            Abbrechen
          </Button>
        </div>
      </form>
    );
  };

  // Save skill
  const handleSaveSkill = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const skillData = {
      user_id: user.id,
      skill_name: formData.get('skill_name') as string,
      proficiency: 'intermediate' as const, // Default value since proficiency is no longer user-selectable
      years_of_experience: formData.get('years_of_experience') ? Number(formData.get('years_of_experience')) : null,
      category: formData.get('category') as string || null,
    };
    try {
      if (id) {
        const { error } = await supabase.from('skills').update(skillData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert(skillData);
        if (error) throw error;
      }
      await fetchSkills();
      setSkillsEditingId(null);
      setIsAddingSkill(false);
      toast({ title: 'Erfolgreich', description: 'Fähigkeit erfolgreich gespeichert.' });
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({ title: 'Fehler', description: 'Fähigkeit konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.', variant: 'destructive' });
    }
  };

  // Save language
  const handleSaveLanguage = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const uiProficiency = formData.get('proficiency') as string;
    const dbProficiency = uiToDbLanguageProficiency(uiProficiency);

    console.log('UI Proficiency:', uiProficiency);
    console.log('DB Proficiency:', dbProficiency);

    const languageData = {
      user_id: user.id,
      language_name: formData.get('language_name') as string,
      proficiency: dbProficiency,
    };

    console.log('Language Data:', languageData);

    try {
      if (id) {
        const { data, error } = await supabase.from('languages').update(languageData as any).eq('id', id);
        console.log('Update result:', { data, error });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('languages').insert(languageData as any);
        console.log('Insert result:', { data, error });
        if (error) throw error;
      }
      await fetchLanguages();
      setLanguagesEditingId(null);
      setIsAddingLanguage(false);
      toast({ title: 'Erfolgreich', description: 'Sprache erfolgreich gespeichert.' });
    } catch (error) {
      console.error('Error saving language:', error);
      toast({ title: 'Fehler', description: 'Sprache konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.', variant: 'destructive' });
    }
  };

  // Delete skill
  const handleDeleteSkill = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      await fetchSkills();
      toast({ title: 'Gelöscht', description: 'Fähigkeit erfolgreich gelöscht.' });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({ title: 'Fehler', description: 'Fähigkeit konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  // Delete language
  const handleDeleteLanguage = async (id: string) => {
    try {
      const { error } = await supabase.from('languages').delete().eq('id', id);
      if (error) throw error;
      await fetchLanguages();
      toast({ title: 'Gelöscht', description: 'Sprache erfolgreich gelöscht.' });
    } catch (error) {
      console.error('Error deleting language:', error);
      toast({ title: 'Fehler', description: 'Sprache konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  // Driver's license categories based on the screenshot
  const driverLicenseCategories = [
    'A', 'A-', 'A1',
    'B', 'BE', 'B1',
    'C', 'CE', 'C1', 'C1E',
    'D', 'DE', 'D1', 'D1E',
    'M', 'F', 'G',
    'BPT', 'CZV'
  ];

  // Driver's license form
  const DriverLicenseForm: React.FC<{ license?: Skill }> = ({ license }) => {
    const formInstanceRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
      if (license?.id) {
        editDriverLicenseFormRefs.current[license.id] = formInstanceRef.current;
        return () => {
          editDriverLicenseFormRefs.current[license.id] = null;
        };
      }
    }, [license?.id]);

    // Extract category from skill_name like "Führerschein Kategorie B"
    const existingCategory = license?.skill_name.replace('Führerschein Kategorie ', '') || 'B';

    return (
      <form
        ref={license?.id ? formInstanceRef : addDriverLicenseFormRef}
        onSubmit={(e) => handleSaveDriverLicense(e, license?.id)}
        className="space-y-4"
      >
        <div>
          <label className={cvLabel}>Kategorie *</label>
          <Select name="category" defaultValue={existingCategory}>
            <SelectTrigger className={cvField}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50 border-slate-200 bg-white text-slate-950 shadow-lg max-h-[300px] overflow-y-auto">
              {driverLicenseCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  Kategorie {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className={cvFormActions}>
          <Button type="submit" className={cvPrimary}>
            <Save className="h-4 w-4" />
            Speichern
          </Button>
          <Button
            type="button"
            onClick={() => {
              setDriverLicenseEditingId(null);
              setIsAddingDriverLicense(false);
            }}
            className={cvSecondary}
          >
            <X className="h-4 w-4" />
            Abbrechen
          </Button>
        </div>
      </form>
    );
  };

  // Save driver license
  const handleSaveDriverLicense = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as string;

    const licenseData = {
      user_id: user.id,
      skill_name: `Führerschein Kategorie ${category}`,
      proficiency: 'expert' as const,
      years_of_experience: null,
      category: 'Führerschein',
    };

    try {
      if (id) {
        const { error } = await supabase.from('skills').update(licenseData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert(licenseData);
        if (error) throw error;
      }
      await fetchSkills();
      setDriverLicenseEditingId(null);
      setIsAddingDriverLicense(false);
      toast({ title: 'Erfolgreich', description: 'Führerschein erfolgreich gespeichert.' });
    } catch (error) {
      console.error('Error saving driver license:', error);
      toast({ title: 'Fehler', description: 'Führerschein konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.', variant: 'destructive' });
    }
  };

  // Delete driver license
  const handleDeleteDriverLicense = async (id: string) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      await fetchSkills();
      toast({ title: 'Gelöscht', description: 'Führerschein erfolgreich gelöscht.' });
    } catch (error) {
      console.error('Error deleting driver license:', error);
      toast({ title: 'Fehler', description: 'Führerschein konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Fähigkeiten';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const chipClass = 'inline-flex max-w-full items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-1 text-sm text-slate-800';
  const chipButton = 'rounded-full p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]';

  const chipActions = (label: string, onEdit: () => void, onDelete: () => void) => (
    <>
      <button type="button" onClick={onEdit} aria-label={`${label} bearbeiten`} title="Bearbeiten" className={chipButton}><Pencil className="h-3.5 w-3.5" /></button>
      <button type="button" onClick={onDelete} aria-label={`${label} löschen`} title="Löschen" className={`${chipButton} hover:text-red-700`}><X className="h-3.5 w-3.5" /></button>
    </>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <CvPanel
        title="Sprachen"
        description="Sprachkenntnisse mit Niveau nach europäischem Referenzrahmen."
        action={<CvAddButton label="Sprache hinzufügen" onClick={() => { setLanguagesEditingId(null); setIsAddingLanguage(true); }} disabled={isAddingLanguage} />}
      >
        <div className="space-y-4">
          {isAddingLanguage && (
            <CvFormSurface title="Neue Sprache">
              <LanguageForm />
            </CvFormSurface>
          )}
          {languages.length > 0 && (
            <ul className="divide-y divide-slate-100">
              {languages.map((language) => (
                <li key={language.id} className="py-3 first:pt-0 last:pb-0">
                  {languagesEditingId === language.id ? (
                    <CvFormSurface title="Sprache bearbeiten">
                      <LanguageForm language={language} />
                    </CvFormSurface>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-medium text-slate-950">{language.language_name}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${language.proficiency === 'Muttersprache' ? 'bg-[#204878] text-white' : 'bg-[#EEF4FA] text-[#204878]'}`}>
                          {getLanguageProficiencyLabel(language.proficiency)}
                        </span>
                      </div>
                      <CvItemActions label={language.language_name} onEdit={() => { setIsAddingLanguage(false); setLanguagesEditingId(language.id); }} onDelete={() => handleDeleteLanguage(language.id)} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {languages.length === 0 && !isAddingLanguage && (
            <CvEmpty icon={Languages} text="Noch keine Sprachen erfasst." actionLabel="Erste Sprache hinzufügen" onAction={() => setIsAddingLanguage(true)} />
          )}
        </div>
      </CvPanel>

      <CvPanel
        title="Fähigkeiten"
        description="Fachkenntnisse, Tools und Methoden."
        action={<CvAddButton label="Fähigkeit hinzufügen" onClick={() => { setSkillsEditingId(null); setIsAddingSkill(true); }} disabled={isAddingSkill} />}
      >
        <div className="space-y-4">
          {isAddingSkill && (
            <CvFormSurface title="Neue Fähigkeit">
              <SkillForm />
            </CvFormSurface>
          )}
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              {Object.keys(groupedSkills).length > 1 && <h3 className="mb-2 text-xs font-medium text-slate-500">{category}</h3>}
              <ul className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => skillsEditingId === skill.id ? (
                  <li key={skill.id} className="basis-full">
                    <CvFormSurface title="Fähigkeit bearbeiten">
                      <SkillForm skill={skill} />
                    </CvFormSurface>
                  </li>
                ) : (
                  <li key={skill.id} className={chipClass}>
                    <span className="truncate">{skill.skill_name}</span>
                    {chipActions(skill.skill_name, () => { setIsAddingSkill(false); setSkillsEditingId(skill.id); }, () => handleDeleteSkill(skill.id))}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {skills.length === 0 && !isAddingSkill && (
            <CvEmpty icon={Sparkles} text="Noch keine Fähigkeiten erfasst." actionLabel="Erste Fähigkeit hinzufügen" onAction={() => setIsAddingSkill(true)} />
          )}
        </div>
      </CvPanel>

      <CvPanel
        title="Führerschein"
        description="Kategorien, die im Lebenslauf erscheinen."
        action={<CvAddButton label="Führerschein hinzufügen" onClick={() => { setDriverLicenseEditingId(null); setIsAddingDriverLicense(true); }} disabled={isAddingDriverLicense} />}
      >
        <div className="space-y-4">
          {isAddingDriverLicense && (
            <CvFormSurface title="Neue Kategorie">
              <DriverLicenseForm />
            </CvFormSurface>
          )}
          {driverLicenses.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {driverLicenses.map((license) => {
                const category = license.skill_name.replace('Führerschein Kategorie ', '');
                return driverLicenseEditingId === license.id ? (
                  <li key={license.id} className="basis-full">
                    <CvFormSurface title="Kategorie bearbeiten">
                      <DriverLicenseForm license={license} />
                    </CvFormSurface>
                  </li>
                ) : (
                  <li key={license.id} className={chipClass}>
                    <Car className="mr-1 h-3.5 w-3.5 text-slate-500" />
                    <span>Kategorie <strong className="font-semibold">{category}</strong></span>
                    {chipActions(`Kategorie ${category}`, () => { setIsAddingDriverLicense(false); setDriverLicenseEditingId(license.id); }, () => handleDeleteDriverLicense(license.id))}
                  </li>
                );
              })}
            </ul>
          )}
          {driverLicenses.length === 0 && !isAddingDriverLicense && (
            <CvEmpty icon={Car} text="Noch keine Führerscheinkategorie erfasst." />
          )}
        </div>
      </CvPanel>
    </div>
  );
});
SkillsAndLanguagesSection.displayName = "SkillsAndLanguagesSection";

export default SkillsAndLanguagesSection;
