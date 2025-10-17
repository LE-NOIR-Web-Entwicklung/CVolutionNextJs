import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Skill type
interface Skill {
  id: string;
  skill_name: string;
  proficiency: 'Anfänger' | 'Gut' | 'Sehr gut';
  years_of_experience: number | null;
  category: string | null;
}

// Language type
interface Language {
  id: string;
  language_name: string;
  proficiency: 'C1' | 'C2' | 'B2' | 'Muttersprache';
}

export const SkillsAndLanguagesSection: React.FC = () => {
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

  // Fetch skills
  useEffect(() => {
    fetchSkills();
  }, [user]);

  const fetchSkills = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('category', { ascending: true });
      if (error) throw error;
      setSkills(
        (data || []).map((skill) => ({
          ...skill,
          proficiency:
            skill.proficiency === 'beginner'
              ? 'Anfänger'
              : skill.proficiency === 'intermediate'
              ? 'Gut'
              : skill.proficiency === 'advanced'
              ? 'Sehr gut'
              : (
                  skill.proficiency === 'expert' || skill.proficiency === 'native'
                    ? 'Sehr gut'
                    : skill.proficiency
                ),
        }))
      );
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
          proficiency:
            language.proficiency === 'beginner'
              ? 'C1'
              : language.proficiency === 'intermediate'
              ? 'C2'
              : language.proficiency === 'advanced'
              ? 'B2'
              : language.proficiency === 'native'
              ? 'Muttersprache'
              : (
                  language.proficiency === 'expert'
                    ? 'C2' // fallback or handle as needed, here mapped to 'C2'
                    : language.proficiency
                ),
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
  const LanguageForm: React.FC<{ language?: Language }> = ({ language }) => (
    <form onSubmit={(e) => handleSaveLanguage(e, language?.id)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-black">Sprache *</label>
          <Input
            name="language_name"
            defaultValue={language?.language_name || ''}
            placeholder="Deutsch, Englisch, Spanisch, etc."
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">Niveau *</label>
          <Select name="proficiency" defaultValue={language?.proficiency || 'intermediate'}>
            <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <SelectValue className="text-black" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg text-black">
              <SelectItem value="native" className="text-black hover:bg-blue-50">Muttersprache</SelectItem>
              <SelectItem value="beginner" className="text-black hover:bg-blue-50">C1</SelectItem>
              <SelectItem value="intermediate" className="text-black hover:bg-blue-50">C2</SelectItem>
              <SelectItem value="advanced" className="text-black hover:bg-blue-50">B2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button type="submit" className="w-full bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200">
          <Save className="h-4 w-4 mr-2" />
          Speichern
        </Button>
        <Button
          type="button"
          onClick={() => {
            setLanguagesEditingId(null);
            setIsAddingLanguage(false);
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Abbrechen
        </Button>
      </div>
    </form>
  );

  // Skill form
  const SkillForm: React.FC<{ skill?: Skill }> = ({ skill }) => (
    <form onSubmit={(e) => handleSaveSkill(e, skill?.id)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-black">Fähigkeit *</label>
          <Input
            name="skill_name"
            defaultValue={skill?.skill_name || ''}
            placeholder="SAP, MS Office, Instandhaltung, Bauführung..."
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        {/* <div>
          <label className="text-sm font-medium text-black">Kategorie</label>
          <Input
            name="category"
            defaultValue={skill?.category || ''}
            placeholder="Programmierung, Design, etc."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-black">Kenntnisstand *</label>
          <Select name="proficiency" defaultValue={skill?.proficiency || 'intermediate'}>
            <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <SelectValue className="text-black" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg text-black">
              <SelectItem value="beginner" className="text-black hover:bg-blue-50">C1</SelectItem>
              <SelectItem value="intermediate" className="text-black hover:bg-blue-50">C2</SelectItem>
              <SelectItem value="advanced" className="text-black hover:bg-blue-50">B2</SelectItem>
              <SelectItem value="expert" className="text-black hover:bg-blue-50">Experte</SelectItem>
              <SelectItem value="native" className="text-black hover:bg-blue-50">Muttersprachlich</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-black">Jahre Erfahrung</label>
          <Input
            name="years_of_experience"
            type="number"
            defaultValue={skill?.years_of_experience || ''}
            placeholder="Jahre"
            min="0"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
      <div className="flex space-x-3">
        <Button type="submit" className="w-full bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200">
          <Save className="h-4 w-4 mr-2" />
          Speichern
        </Button>
        <Button
          type="button"
          onClick={() => {
            setSkillsEditingId(null);
            setIsAddingSkill(false);
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Abbrechen
        </Button>
      </div>
    </form>
  );

  // Save skill
  const handleSaveSkill = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const skillData = {
      user_id: user.id,
      skill_name: formData.get('skill_name') as string,
      proficiency: formData.get('proficiency') as 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native',
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
    const languageData = {
      user_id: user.id,
      language_name: formData.get('language_name') as string,
      proficiency: formData.get('proficiency') as 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native',
    };
    try {
      if (id) {
        const { error } = await supabase.from('languages').update(languageData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('languages').insert(languageData);
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

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Andere';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-12">
      {/* Sprachen Section */}
      <section>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold text-black mb-1">Sprachen</CardTitle>
                <CardDescription className="text-black">Ihre Sprachkenntnisse und Kompetenzen</CardDescription>
              </div>
              <Button onClick={() => setIsAddingLanguage(true)} className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-4 py-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </div>
        {isAddingLanguage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Neue Sprache hinzufügen</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageForm />
            </CardContent>
          </Card>
        )}
        {languages.map((language) => (
          <Card key={language.id}>
            <CardContent className="pt-6">
              {languagesEditingId === language.id ? (
                <LanguageForm language={language} />
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-black">{language.language_name}</h4>
                    <Badge className="text-xs text-black bg-gray-200">
                      {language.proficiency === 'C1' && 'C1'}
                      {language.proficiency === 'C2' && 'C2'}
                      {language.proficiency === 'B2' && 'B2'}
                      {language.proficiency === 'Muttersprache' && 'Muttersprache'}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      onClick={() => setLanguagesEditingId(language.id)}
                      className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteLanguage(language.id)}
                      className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {languages.length === 0 && !isAddingLanguage && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-black mb-4">Noch keine Sprachen hinzugefügt.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Fähigkeiten Section */}
      <section>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold text-black mb-1">Fähigkeiten</CardTitle>
                <CardDescription className="text-black">Ihre beruflichen Fähigkeiten und Kompetenzen</CardDescription>
              </div>
              <Button onClick={() => setIsAddingSkill(true)} className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-4 py-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </div>
        {isAddingSkill && (
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Neue Fähigkeit hinzufügen</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillForm />
            </CardContent>
          </Card>
        )}
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg text-black">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="border rounded-lg p-4 space-y-2">
                    {skillsEditingId === skill.id ? (
                      <SkillForm skill={skill} />
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-black">{skill.skill_name}</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge className="text-xs text-black bg-gray-200">
                                {skill.proficiency === 'Anfänger' && 'Anfänger'}
                                {skill.proficiency === 'Gut' && 'Gut'}
                                {skill.proficiency === 'Sehr gut' && 'Sehr gut'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              onClick={() => setSkillsEditingId(skill.id)}
                              className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {skills.length === 0 && !isAddingSkill && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-black mb-4">Noch keine Fähigkeiten hinzugefügt.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};
