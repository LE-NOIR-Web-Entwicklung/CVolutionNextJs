import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const ExperienceSection = React.forwardRef<{ saveExperiences: () => void }, {}>((props, ref) => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRefs = useRef<{ [id: string]: HTMLFormElement | null }>({});

  useImperativeHandle(ref, () => ({
    saveExperiences: () => {
      if (isAdding && addFormRef.current) {
        addFormRef.current.requestSubmit();
      } else if (editingId && editFormRefs.current[editingId]) {
        editFormRefs.current[editingId]?.requestSubmit();
      }
    }
  }));

  useEffect(() => {
    fetchExperiences();
  }, [user]);
// Hilfsfunktion zum Formatieren von YYYY-MM oder YYYY-MM-DD nach MM.YYYY
function formatMonthYear(dateStr?: string | null) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length >= 2) {
    const year = parts[0];
    const month = parts[1];
    return `${month}.${year}`;
  }
  return dateStr;
}
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

  function parseMonthYearToDate(str?: string | null) {
  if (!str) return null;
  const match = str.match(/^(\d{2})\.(\d{4})$/);
  if (match) {
    const [_, mm, yyyy] = match;
    return `${yyyy}-${mm}-01`;
  }
  return str; // falls schon korrekt
}

  const handleSave = async (e: React.FormEvent<HTMLFormElement>, id?: string, keepOpen?: boolean) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const experienceData = {
      user_id: user.id,
      job_title: formData.get('job_title') as string,
      company: formData.get('company') as string,
      employment_type: formData.get('employment_type') as 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'volunteer',
      location: formData.get('location') as string || null,
      start_date: parseMonthYearToDate(formData.get('start_date') as string) || '',
      end_date: formData.get('is_current') === 'on' ? null : (parseMonthYearToDate(formData.get('end_date') as string) || null),
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
      if (!keepOpen) {
        setEditingId(null);
        setIsAdding(false);
      }
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

  const ExperienceForm: React.FC<{ experience?: Experience }> = ({ experience }) => {
    // If end_date is not set, treat as current
    const initialIsCurrent = experience?.is_current ?? (!experience?.end_date);
    const [isCurrent, setIsCurrent] = useState<boolean>(initialIsCurrent);
    const [startDate, setStartDate] = useState<Date | null>(experience?.start_date ? new Date(experience.start_date) : null);
    const [endDate, setEndDate] = useState<Date | null>(experience?.end_date ? new Date(experience.end_date) : null);
    const formInstanceRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
      setStartDate(experience?.start_date ? new Date(experience.start_date) : null);
      setEndDate(experience?.end_date ? new Date(experience.end_date) : null);
      setIsCurrent(experience?.is_current ?? (!experience?.end_date));
    }, [experience]);

    useEffect(() => {
      if (experience?.id) {
        editFormRefs.current[experience.id] = formInstanceRef.current;
        return () => {
          editFormRefs.current[experience.id] = null;
        };
      }
    }, [experience?.id]);

    return (
      <form
        ref={experience?.id ? formInstanceRef : addFormRef}
        onSubmit={(e) => {
          const keepOpen = (e.nativeEvent as any)?.keepOpen || false;
          handleSave(e, experience?.id, keepOpen);
        }}
        className="space-y-4"
      >
        <input type="hidden" name="id" value={experience?.id || ''} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-black">Berufsbezeichnung *</label>
            <Input
              name="job_title"
              defaultValue={experience?.job_title || ''}
              placeholder="Softwareentwickler"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-black">Unternehmen *</label>
            <Input
              name="company"
              defaultValue={experience?.company || ''}
              placeholder="Firmenname"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-black">Standort</label>
            <Input
              name="location"
              defaultValue={experience?.location || ''}
              placeholder="Stadt, Land"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-black">Startdatum</label>
            <Input
              name="start_date"
              type="text"
              pattern="\d{2}\.\d{4}" // erlaubt nur "MM.YYYY"
              placeholder="MM.YYYY"
              defaultValue={
                experience?.start_date
                  ? experience.start_date.slice(5, 7) + '.' + experience.start_date.slice(0, 4)
                  : ''
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-black">Enddatum</label>
            <Input
              name="end_date"
              type="text"
              pattern="\d{2}\.\d{4}" // erlaubt nur "MM.YYYY"
              placeholder="MM.YYYY"
              defaultValue={
                experience?.end_date
                  ? experience.end_date.slice(5, 7) + '.' + experience.end_date.slice(0, 4)
                  : ''
              }
              disabled={experience?.is_current || false}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            name="is_current"
            id="is_current"
            defaultChecked={experience?.is_current || false}
            className="w-5 h-5 text-[#204878] border-gray-300 mr-4 rounded focus:ring-[#204878]"
          />
          <label htmlFor="is_current" className="text-sm text-black select-none cursor-pointer">
            Ich arbeite hier noch
          </label>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-black">Beschreibung</label>
          </div>
          <Textarea
            name="description"
            defaultValue={experience?.description || ''}
            placeholder={"• Durchführen von administrativen Aufgaben"}
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onKeyDown={async e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                const value = textarea.value;
                const selectionStart = textarea.selectionStart;

                // Add a new bullet point
                const before = value.substring(0, selectionStart);
                const after = value.substring(selectionStart);
                textarea.value = before + '\n• ' + after;
                const newCursorPos = selectionStart + 3;

                // Save data in the background
                const form = e.currentTarget.closest('form');
                if (form) {
                  const formData = new FormData(form);
                  const experienceData = {
                    description: formData.get('description') as string,
                    // ...other fields if needed...
                  };
                  const experienceId = formData.get('id') as string;
                  console.log('Saving experience with ID:', experienceId);
                  if (experienceId) {
                    try {
                      await supabase
                        .from('experiences')
                        .update(experienceData)
                        .eq('id', experienceId);
                    } catch (error) {
                      console.error('Fehler beim Speichern:', error);
                    }
                  }
                }

                // Refocus textarea after save
                setTimeout(() => {
                  textarea.focus();
                  textarea.selectionStart = textarea.selectionEnd = newCursorPos;
                }, 100);
              } else if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                const value = textarea.value;
                const selectionStart = textarea.selectionStart;
                const before = value.substring(0, selectionStart);
                const after = value.substring(selectionStart);
                textarea.value = before + '\n• ' + after;
                const newCursorPos = selectionStart + 3;
                textarea.selectionStart = textarea.selectionEnd = newCursorPos;
              }
            }}
            onFocus={e => {
              const textarea = e.target as HTMLTextAreaElement;
              if (textarea.value === '') {
                textarea.value = '• ';
                // Set cursor after bullet
                setTimeout(() => {
                  textarea.selectionStart = textarea.selectionEnd = 2;
                }, 0);
              }
            }}
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
  };

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
              <CardTitle className="text-xl font-bold text-black mb-1">Berufserfahrung</CardTitle>
              <CardDescription className="text-black">Ihre bisherigen beruflichen Stationen</CardDescription>
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
            <CardTitle className="text-black">Neue Erfahrung hinzufügen</CardTitle>
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
                    <h3 className="text-lg font-semibold text-black">{experience.job_title}</h3>
                    <p className="text-black">{experience.company}</p>
                    <p className="text-sm text-black">
                      {formatMonthYear(experience.start_date)} -
                      {experience.is_current
                        ? ' Aktuell'
                        : experience.end_date
                          ? ` ${formatMonthYear(experience.end_date)}`
                          : ' Aktuell'}
                    </p>

                    {experience.location && (
                      <p className="text-sm text-black">{experience.location}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setEditingId(experience.id)}
                      className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(experience.id)}
                      className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-3 py-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {experience.description && (
                  <p className="text-black whitespace-pre-wrap">{experience.description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {experiences.length === 0 && !isAdding && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-black">Noch keine Berufserfahrung hinzugefügt.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
export default ExperienceSection;
