import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  grade: string | null;
  description: string | null;
}

export const EducationSection: React.FC = () => {
  const { user } = useAuth();
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchEducation();
  }, [user]);

  const fetchEducation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;

      setEducation(
        (data || []).map((item) => ({
          ...item,
          is_current: !!item.is_current, // Ensure is_current is strictly boolean
        }))
      );
    } catch (error) {
      console.error('Error fetching education:', error);
      toast({
        title: 'Fehler',
        description: 'Bildungsdaten konnten nicht geladen werden.',
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
    const educationData = {
      user_id: user.id,
      institution: formData.get('institution') as string,
      degree: formData.get('degree') as string,
      field_of_study: formData.get('field_of_study') as string || null,
      start_date: formData.get('start_date') as string || null,
      end_date: formData.get('end_date') as string || null,
      is_current: formData.get('is_current') === 'on',
      grade: formData.get('grade') as string || null,
      description: formData.get('description') as string || null,
    };

    try {
      if (id) {
        const { error } = await supabase
          .from('education')
          .update(educationData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('education')
          .insert(educationData);
        if (error) throw error;
      }

      await fetchEducation();
      setEditingId(null);
      setIsAdding(false);
      toast({
        title: 'Erfolgreich',
        description: 'Bildung erfolgreich gespeichert.',
      });
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: 'Fehler',
        description: 'Bildung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchEducation();
      toast({
        title: 'Gelöscht',
        description: 'Bildung erfolgreich gelöscht.',
      });
    } catch (error) {
      console.error('Error deleting education:', error);
      toast({
        title: 'Fehler',
        description: 'Bildung konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  const EducationForm: React.FC<{ education?: Education }> = ({ education }) => (
    <form onSubmit={(e) => handleSave(e, education?.id)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-black">Institution *</label>
          <Input
            name="institution"
            defaultValue={education?.institution || ''}
            placeholder="Universität für Technologie"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">Abschluss *</label>
          <Input
            name="degree"
            defaultValue={education?.degree || ''}
            placeholder="Bachelor of Science"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        {/* <div>
          <label className="text-sm font-medium text-black">Studienrichtung</label>
          <Input
            name="field_of_study"
            defaultValue={education?.field_of_study || ''}
            placeholder="Informatik"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div> */}
        <div>
          <label className="text-sm font-medium text-black">Note/Abschluss</label>
          <Input
            name="grade"
            defaultValue={education?.grade || ''}
            placeholder="1,5 oder Sehr gut"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">Startdatum</label>
          <Input
            name="start_date"
            type="date"
            defaultValue={education?.start_date || ''}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">Enddatum</label>
          <Input
            name="end_date"
            type="date"
            defaultValue={education?.end_date || ''}
            disabled={education?.is_current}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="is_current"
              id="is_current"
              defaultChecked={education?.is_current}
              className="w-5 h-5 text-[#204878] border-gray-300 mr-4 rounded focus:ring-[#204878]"
            />
            <label htmlFor="is_current" className="text-sm text-black">
              Ich studiere hier noch
            </label>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-black">Beschreibung</label>
        <Textarea
          name="description"
          defaultValue={education?.description || ''}
          placeholder="Bemerkenswerte Leistungen, Kurse oder Aktivitäten..."
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
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
              <CardTitle className="text-xl font-bold text-black mb-1">Bildung</CardTitle>
              <CardDescription className="text-black">Ihr Bildungshintergrund</CardDescription>
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
            <CardTitle className="text-black">Neue Bildung hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <EducationForm />
          </CardContent>
        </Card>
      )}

      {education.map((edu) => (
        <Card key={edu.id}>
          <CardContent className="pt-6">
            {editingId === edu.id ? (
              <EducationForm education={edu} />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.field_of_study && (
                      <p className="text-gray-600">{edu.field_of_study}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {edu.grade && <Badge className="text-xs text-black bg-gray-200">{edu.grade}</Badge>}
                      {edu.start_date && (
                        <span className="text-sm text-gray-500">
                          {new Date(edu.start_date).toLocaleDateString()} -{' '}
                          {edu.is_current ? 'Aktuell' : 
                           edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setEditingId(edu.id)}
                      className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(edu.id)}
                      className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700 mt-3">{edu.description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {education.length === 0 && !isAdding && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">Noch keine Bildung hinzugefügt.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
