import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
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
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  place: string | null;
}

const EducationSection = React.forwardRef<{ saveEducation: () => void }, {}>((props, ref) => {
  const { user } = useAuth();
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRefs = useRef<{ [id: string]: HTMLFormElement | null }>({});

  useImperativeHandle(ref, () => ({
    saveEducation: () => {
      if (isAdding && addFormRef.current) {
        addFormRef.current.requestSubmit();
      } else if (editingId && editFormRefs.current[editingId]) {
        editFormRefs.current[editingId]?.requestSubmit();
      }
    }
  }));

  useEffect(() => {
    fetchEducation();
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
  // Hilfsfunktion: MM.YYYY -> YYYY-MM-01
function parseMonthYearToDate(str?: string | null) {
  if (!str) return null;
  const match = str.match(/^(\d{2})\.(\d{4})$/);
  if (match) {
    const [_, mm, yyyy] = match;
    return `${yyyy}-${mm}-01`;
  }
  return str; // falls schon korrekt
}

  const handleSave = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const educationData = {
      user_id: user.id,
      institution: formData.get('institution') as string,
      degree: formData.get('degree') as string,
      start_date: parseMonthYearToDate(formData.get('start_date') as string),
      end_date: parseMonthYearToDate(formData.get('end_date') as string),
      is_current: formData.get('is_current') === 'on',
      place: formData.get('place') as string || null,
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

  const EducationForm: React.FC<{ education?: Education }> = ({ education }) => {
    const formInstanceRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
      if (education?.id) {
        editFormRefs.current[education.id] = formInstanceRef.current;
        return () => {
          editFormRefs.current[education.id] = null;
        };
      }
    }, [education?.id]);
    return (
      <form
        ref={education?.id ? formInstanceRef : addFormRef}
        onSubmit={(e) => handleSave(e, education?.id)}
        className="space-y-4"
      >
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
        <div>
          <label className="text-sm font-medium text-black">Ort *</label>
          <Input
            name="place"
            defaultValue={education?.place || ''}
            placeholder="Zürich, Schweiz"
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-black">Startdatum</label>
          <Input
            name="start_date"
            type="text"
            pattern="\d{2}\.\d{4}" // erlaubt nur "MM.YYYY"
            placeholder="MM.YYYY"
            defaultValue={
              education?.start_date
                ? education.start_date.slice(5, 7) + '.' + education.start_date.slice(0, 4)
                : ''
            }
            disabled={education?.is_current || false}
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
              education?.end_date
                ? education.end_date.slice(5, 7) + '.' + education.end_date.slice(0, 4)
                : ''
            }
            disabled={education?.is_current || false}
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
                    <p className="text-gray-600">{edu.place}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {edu.start_date && (
                        <span className="text-sm text-gray-500">
                          {formatMonthYear(edu.start_date)} -
                      {edu.is_current
                        ? ' Aktuell'
                        : edu.end_date
                          ? ` ${formatMonthYear(edu.end_date)}`
                          : ' Aktuell'}
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
});
export default EducationSection;
