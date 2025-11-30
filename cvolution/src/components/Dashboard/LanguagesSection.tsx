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

interface Language {
  id: string;
  language_name: string;
  proficiency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Muttersprache';
}

export const LanguagesSection: React.FC = () => {
  const { user } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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
      toast({
        title: 'Fehler',
        description: 'Sprachdaten konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const uiProficiency = formData.get('proficiency') as string;
    const languageData = {
      user_id: user.id,
      language_name: formData.get('language_name') as string,
      proficiency: uiToDbLanguageProficiency(uiProficiency),
    };

    try {
      if (id) {
        const { error } = await supabase
          .from('languages')
          .update(languageData as any)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('languages')
          .insert(languageData as any);
        if (error) throw error;
      }

      await fetchLanguages();
      setEditingId(null);
      setIsAdding(false);
      toast({
        title: 'Erfolgreich',
        description: 'Sprache erfolgreich gespeichert.',
      });
    } catch (error) {
      console.error('Error saving language:', error);
      toast({
        title: 'Fehler',
        description: 'Sprache konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchLanguages();
      toast({
        title: 'Gelöscht',
        description: 'Sprache erfolgreich gelöscht.',
      });
    } catch (error) {
      console.error('Error deleting language:', error);
      toast({
        title: 'Fehler',
        description: 'Sprache konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  const LanguageForm: React.FC<{ language?: Language }> = ({ language }) => (
    <form onSubmit={(e) => handleSave(e, language?.id)} className="space-y-4">
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
          <Select name="proficiency" defaultValue={language?.proficiency || 'B2'}>
            <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <SelectValue className="text-black" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-gray-200 shadow-lg text-black">
              <SelectItem value="A1" className="text-black hover:bg-blue-50">A1 – Anfänger</SelectItem>
              <SelectItem value="A2" className="text-black hover:bg-blue-50">A2 – Grundlegende Kenntnisse</SelectItem>
              <SelectItem value="B1" className="text-black hover:bg-blue-50">B1 – Fortgeschrittene Sprachverwendung</SelectItem>
              <SelectItem value="B2" className="text-black hover:bg-blue-50">B2 – Selbstständige Sprachverwendung</SelectItem>
              <SelectItem value="C1" className="text-black hover:bg-blue-50">C1 – Fachkundige Sprachkenntnisse</SelectItem>
              <SelectItem value="C2" className="text-black hover:bg-blue-50">C2 – Annähernd muttersprachliche Kenntnisse</SelectItem>
              <SelectItem value="Muttersprache" className="text-black hover:bg-blue-50">Muttersprache</SelectItem>
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
            setEditingId(null);
            setIsAdding(false);
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200"
        >
          <X className="h-4 w-4 mr-2" />
          Abbrechen
        </Button>
      </div>
    </form>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-black mb-1">Sprachen</CardTitle>
              <CardDescription className="text-black">Ihre Sprachkenntnisse und Kompetenzen</CardDescription>
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-4 py-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </div>

      {isAdding && (
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
            {editingId === language.id ? (
              <LanguageForm language={language} />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-black">{language.language_name}</h4>
                  <Badge className="text-xs text-black bg-gray-200">
                    {getLanguageProficiencyLabel(language.proficiency)}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => setEditingId(language.id)}
                    className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(language.id)}
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

      {languages.length === 0 && !isAdding && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-black mb-4">Noch keine Sprachen hinzugefügt.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
