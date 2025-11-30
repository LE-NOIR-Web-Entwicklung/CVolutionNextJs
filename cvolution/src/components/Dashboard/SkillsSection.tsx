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

interface Skill {
  id: string;
  skill_name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native';
  years_of_experience: number | null;
  category: string | null;
}

export const SkillsSection: React.FC = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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

      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: 'Fehler',
        description: 'Fähigkeitsdaten konnten nicht geladen werden.',
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
    const skillData = {
      user_id: user.id,
      skill_name: formData.get('skill_name') as string,
      proficiency: formData.get('proficiency') as 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native',
      years_of_experience: formData.get('years_of_experience') ? Number(formData.get('years_of_experience')) : null,
      category: formData.get('category') as string || null,
    };

    try {
      if (id) {
        const { error } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('skills')
          .insert(skillData);
        if (error) throw error;
      }

      await fetchSkills();
      setEditingId(null);
      setIsAdding(false);
      toast({
        title: 'Erfolgreich',
        description: 'Fähigkeit erfolgreich gespeichert.',
      });
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: 'Fehler',
        description: 'Fähigkeit konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSkills();
      toast({
        title: 'Gelöscht',
        description: 'Fähigkeit erfolgreich gelöscht.',
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Fehler',
        description: 'Fähigkeit konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  const SkillForm: React.FC<{ skill?: Skill }> = ({ skill }) => (
    <form onSubmit={(e) => handleSave(e, skill?.id)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-black">Fähigkeit *</label>
          <Input
            name="skill_name"
            defaultValue={skill?.skill_name || ''}
            placeholder="JavaScript, React, etc."
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">Kategorie</label>
          <Input
            name="category"
            defaultValue={skill?.category || ''}
            placeholder="Programmierung, Design, etc."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-black mb-1">Fähigkeiten</CardTitle>
              <CardDescription className="text-black">Ihre beruflichen Fähigkeiten und Kompetenzen</CardDescription>
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
                  {editingId === skill.id ? (
                    <SkillForm skill={skill} />
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-black">{skill.skill_name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge className="text-xs text-black bg-gray-200">
                              {skill.proficiency === 'beginner' && 'C1'}
                              {skill.proficiency === 'intermediate' && 'C2'}
                              {skill.proficiency === 'advanced' && 'B2'}
                              {skill.proficiency === 'expert' && 'Experte'}
                              {skill.proficiency === 'native' && 'Muttersprachlich'}
                            </Badge>
                            {skill.years_of_experience && (
                              <Badge className="text-xs text-black bg-gray-200">
                                {skill.years_of_experience} Jahre
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => setEditingId(skill.id)}
                            className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(skill.id)}
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

      {skills.length === 0 && !isAdding && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-black mb-4">Noch keine Fähigkeiten hinzugefügt.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
