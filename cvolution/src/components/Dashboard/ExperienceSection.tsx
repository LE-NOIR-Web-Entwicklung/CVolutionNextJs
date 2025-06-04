import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Experience {
  id: string;
  job_title: string;
  company: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'volunteer';
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean | null;
  description: string | null;
  skills_used: string[] | null;
}

export const ExperienceSection: React.FC = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, [user]);

  const fetchExperiences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) throw error;

      setExperiences(
        (data || []).map((item) => ({
          ...item,
          employment_type: item.employment_type || 'full_time', // Default to 'full_time' if null
        }))
      );
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast({
        title: 'Fehler',
        description: 'Erfahrungsdaten konnten nicht geladen werden.',
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
    const experienceData = {
      user_id: user.id,
      job_title: formData.get('job_title') as string,
      company: formData.get('company') as string,
      employment_type: formData.get('employment_type') as 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'volunteer',
      location: formData.get('location') as string || null,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('is_current') === 'on' ? null : formData.get('end_date') as string || null,
      is_current: formData.get('is_current') === 'on',
      description: formData.get('description') as string || null,
    };

    try {
      if (id) {
        const { error } = await supabase
          .from('experiences')
          .update(experienceData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert(experienceData);
        if (error) throw error;
      }

      await fetchExperiences();
      setEditingId(null);
      setIsAdding(false);
      toast({
        title: 'Erfolgreich',
        description: 'Erfahrung erfolgreich gespeichert.',
      });
    } catch (error) {
      console.error('Error saving experience:', error);
      toast({
        title: 'Fehler',
        description: 'Erfahrung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchExperiences();
      toast({
        title: 'Gelöscht',
        description: 'Erfahrung erfolgreich gelöscht.',
      });
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: 'Fehler',
        description: 'Erfahrung konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  const ExperienceForm: React.FC<{ experience?: Experience }> = ({ experience }) => (
    <form onSubmit={(e) => handleSave(e, experience?.id)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Jobtitel *</label>
          <Input
            name="job_title"
            defaultValue={experience?.job_title || ''}
            placeholder="Softwareentwickler"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Unternehmen *</label>
          <Input
            name="company"
            defaultValue={experience?.company || ''}
            placeholder="Firmenname"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Beschäftigungsart</label>
          <Select name="employment_type" defaultValue={experience?.employment_type || 'full_time'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Vollzeit</SelectItem>
              <SelectItem value="part_time">Teilzeit</SelectItem>
              <SelectItem value="contract">Vertrag</SelectItem>
              <SelectItem value="internship">Praktikum</SelectItem>
              <SelectItem value="freelance">Freiberuflich</SelectItem>
              <SelectItem value="volunteer">Ehrenamt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Standort</label>
          <Input
            name="location"
            defaultValue={experience?.location || ''}
            placeholder="Stadt, Land"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Startdatum *</label>
          <Input
            name="start_date"
            type="date"
            defaultValue={experience?.start_date || ''}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Enddatum</label>
          <Input
            name="end_date"
            type="date"
            defaultValue={experience?.end_date || ''}
            disabled={experience?.is_current || false}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          name="is_current"
          id="is_current"
          defaultChecked={experience?.is_current || false}
        />
        <label htmlFor="is_current" className="text-sm text-gray-700">
          Ich arbeite hier noch
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Beschreibung</label>
        <Textarea
          name="description"
          defaultValue={experience?.description || ''}
          placeholder="Beschreiben Sie Ihre Rolle und Leistungen..."
          rows={4}
        />
      </div>

      <div className="flex space-x-3">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Speichern
        </Button>
        <Button
          type="button"
          onClick={() => {
            setEditingId(null);
            setIsAdding(false);
          }}
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Berufserfahrung</CardTitle>
              <CardDescription>Ihre berufliche Laufbahn</CardDescription>
            </div>
            <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Neue Erfahrung hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <ExperienceForm />
          </CardContent>
        </Card>
      )}

      {experiences.map((experience) => (
        <Card key={experience.id}>
          <CardContent className="pt-6">
            {editingId === experience.id ? (
              <ExperienceForm experience={experience} />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{experience.job_title}</h3>
                    <p className="text-gray-600">{experience.company}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(experience.start_date).toLocaleDateString()} - 
                      {experience.is_current ? ' Aktuell' : 
                       experience.end_date ? ` ${new Date(experience.end_date).toLocaleDateString()}` : ' Aktuell'}
                    </p>
                    {experience.location && (
                      <p className="text-sm text-gray-500">{experience.location}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setEditingId(experience.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(experience.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {experience.description && (
                  <p className="text-gray-700 whitespace-pre-wrap">{experience.description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {experiences.length === 0 && !isAdding && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Noch keine Berufserfahrung hinzugefügt.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
