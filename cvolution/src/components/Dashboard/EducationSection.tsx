import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CvAddButton, CvEmpty, CvFormSurface, CvItemActions, CvLoading, CvPanel, cvCheckbox, cvField, cvFormActions, cvLabel, cvPrimary, cvSecondary } from './cv-ui';

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={cvLabel}>Institution *</label>
          <Input
            name="institution"
            defaultValue={education?.institution || ''}
            placeholder="Universität für Technologie"
            required
            className={cvField}
          />
        </div>
        <div>
          <label className={cvLabel}>Abschluss *</label>
          <Input
            name="degree"
            defaultValue={education?.degree || ''}
            placeholder="Bachelor of Science"
            required
            className={cvField}
          />
        </div>
        <div>
          <label className={cvLabel}>Ort *</label>
          <Input
            name="place"
            defaultValue={education?.place || ''}
            placeholder="Zürich, Schweiz"
            required
            className={cvField}
          />
        </div>
        <div>
          <label className={cvLabel}>Startdatum</label>
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
            className={cvField}
          />
        </div>
        <div>
          <label className={cvLabel}>Enddatum</label>
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
            className={cvField}
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_current"
              id="is_current"
              defaultChecked={education?.is_current}
              className={cvCheckbox}
            />
            <label htmlFor="is_current" className="cursor-pointer select-none text-sm text-slate-700">
              Ich studiere hier noch
            </label>
          </div>
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
            setEditingId(null);
            setIsAdding(false);
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

  if (isLoading) return <CvLoading />;

  const period = (edu: Education) => edu.start_date
    ? `${formatMonthYear(edu.start_date)} – ${edu.is_current || !edu.end_date ? 'heute' : formatMonthYear(edu.end_date)}`
    : '';

  return (
    <CvPanel
      title="Bildung"
      description="Abschlüsse, Ausbildungen und Weiterbildungen."
      action={<CvAddButton label="Bildung hinzufügen" onClick={() => { setEditingId(null); setIsAdding(true); }} disabled={isAdding} />}
    >
      <div className="space-y-4">
        {isAdding && (
          <CvFormSurface title="Neue Ausbildung">
            <EducationForm />
          </CvFormSurface>
        )}

        {education.length > 0 && (
          <ol className="divide-y divide-slate-100">
            {education.map((edu) => (
              <li key={edu.id} className="py-4 first:pt-0 last:pb-0">
                {editingId === edu.id ? (
                  <CvFormSurface title="Ausbildung bearbeiten">
                    <EducationForm education={edu} />
                  </CvFormSurface>
                ) : (
                  <div className="flex gap-3 sm:gap-4">
                    <span aria-hidden="true" className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF4FA] text-[#204878] sm:flex">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-slate-950">{edu.degree}</h3>
                        <p className="mt-0.5 break-words text-sm text-slate-700">
                          {edu.institution}
                          {edu.place && <span className="text-slate-500"> · {edu.place}</span>}
                        </p>
                        {period(edu) && (
                          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="tabular-nums">{period(edu)}</span>
                            {edu.is_current && <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">Laufend</span>}
                          </p>
                        )}
                      </div>
                      <CvItemActions label={edu.degree} onEdit={() => { setIsAdding(false); setEditingId(edu.id); }} onDelete={() => handleDelete(edu.id)} />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}

        {education.length === 0 && !isAdding && (
          <CvEmpty icon={GraduationCap} text="Noch keine Ausbildung erfasst." actionLabel="Erste Ausbildung hinzufügen" onAction={() => setIsAdding(true)} />
        )}
      </div>
    </CvPanel>
  );
});
export default EducationSection;
