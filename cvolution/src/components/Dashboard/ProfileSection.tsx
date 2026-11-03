import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Save, Edit, Camera, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CvLoading, CvPanel, cvField, cvFormActions, cvLabel, cvPrimary, cvSecondary } from './cv-ui';

interface Profile {
  id: string;
  full_name: string | null;
  headline: string | null;
  summary: string | null;
  profile_picture_url: string | null;
  location: string | null;
  phone: string | null;
  linkedin_url: string | null;
  website: string | null;
  birthdate: string | null; // <-- hinzugefügt
  civil_status: string | null;   // <-- Zivilstand
  place_of_origin: string | null;
}

export const ProfileSection = React.forwardRef<{ saveProfile: () => void }, {}>((props, ref) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    saveProfile: () => {
      if (isEditing && formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  }));

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    return () => {
      if (isEditing && formRef.current) {
        formRef.current.requestSubmit();
      }
    };
  }, [isEditing]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Fehler',
          description: 'Profildaten konnten nicht geladen werden.',
          variant: 'destructive',
        });
      } else {
        setProfile(data || {
          id: '',
          full_name: '',
          headline: '',
          summary: '',
          profile_picture_url: '',
          location: '',
          phone: '',
          linkedin_url: '',
          website: '',
          birthdate: '',
          civil_status: '',
          place_of_origin: '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ungültiger Dateityp',
        description: 'Bitte laden Sie eine Bilddatei hoch.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB for high quality)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Datei zu groß',
        description: 'Bitte laden Sie ein Bild kleiner als 10MB hoch.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      // Delete existing profile photo if it exists
      if (profile?.profile_picture_url) {
        const oldFileName = profile.profile_picture_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('profile-photos')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      // Upload new photo with no compression
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          profile_picture_url: publicUrl,
        }, { onConflict: 'user_id' });

      if (updateError) throw updateError;

      await fetchProfile();
      toast({
        title: 'Foto aktualisiert',
        description: 'Ihr Profilbild wurde erfolgreich aktualisiert.',
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Upload-Fehler',
        description: 'Foto konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      user_id: user.id,
      full_name: formData.get('full_name') as string,
      headline: formData.get('headline') as string,
      summary: formData.get('summary') as string,
      location: formData.get('location') as string,
      phone: formData.get('phone') as string,
      linkedin_url: formData.get('linkedin_url') as string,
      website: formData.get('website') as string,
      birthdate: formData.get('birthdate') as string, // <-- hinzugefügt
      civil_status: formData.get('civil_status') as string,
      place_of_origin: formData.get('place_of_origin') as string,
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(updatedProfile, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      await fetchProfile();
      setIsEditing(false);
      toast({
        title: 'Profil aktualisiert',
        description: 'Ihr Profil wurde erfolgreich gespeichert.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Fehler',
        description: 'Profil konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <CvLoading />;

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U';
  const avatar = (
    <Avatar className="h-28 w-[5.25rem] shrink-0 overflow-hidden rounded-lg border border-slate-200">
      <AvatarImage
        src={profile?.profile_picture_url || ''}
        alt={profile?.full_name || 'Profil'}
        className="h-28 w-[5.25rem] rounded-lg object-cover"
      />
      <AvatarFallback className="flex h-28 w-[5.25rem] items-center justify-center rounded-lg bg-[#EEF4FA] text-lg font-semibold text-[#204878]">
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!isEditing) {
    const fields: Array<[string, string | null | undefined]> = [
      ['E-Mail', user?.email],
      ['Telefon', profile?.phone],
      ['Adresse', profile?.location],
      ['Heimatort', profile?.place_of_origin],
      ['Geburtsdatum', profile?.birthdate
        ? new Date(profile.birthdate).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null],
      ['Zivilstand', profile?.civil_status],
    ];
    return (
      <CvPanel
        title="Persönliches Profil"
        description="Diese Angaben stehen im Kopf Ihres Lebenslaufs."
        action={
          <Button type="button" onClick={() => setIsEditing(true)} className={`h-9 shrink-0 px-3 ${cvSecondary}`}>
            <Edit className="h-4 w-4" />
            Bearbeiten
          </Button>
        }
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex items-center gap-4 md:w-72 md:shrink-0">
            {avatar}
            <div className="min-w-0">
              <h3 className="break-words text-lg font-semibold text-slate-950">{profile?.full_name || 'Name fehlt'}</h3>
              <p className="mt-0.5 break-words text-sm text-slate-600">{profile?.headline || 'Keine Berufsbezeichnung angegeben'}</p>
            </div>
          </div>
          <dl className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:border-l md:border-slate-100 md:pl-6">
            {fields.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className={`mt-0.5 break-words text-sm ${value ? 'text-slate-950' : 'text-slate-400'}`}>{value || 'Nicht angegeben'}</dd>
              </div>
            ))}
          </dl>
        </div>
      </CvPanel>
    );
  }

  return (
    <CvPanel title="Profil bearbeiten" description="Felder mit * werden für den Lebenslauf benötigt.">
        <form ref={formRef} onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center gap-4">
            {avatar}
            <div>
              <label htmlFor="profile-photo" className="cursor-pointer">
                <Button type="button" asChild className={`h-9 px-3 ${cvSecondary}`}>
                  <span>
                    {isUploadingPhoto ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    {isUploadingPhoto ? 'Wird hochgeladen …' : 'Foto ändern'}
                  </span>
                </Button>
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploadingPhoto}
                className="hidden"
              />
              <p className="mt-1.5 text-xs text-slate-500">JPG oder PNG, höchstens 10 MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              {!profile?.full_name && (
                <p className="mb-2 text-xs text-amber-700">
                  Ihr Name kann nach der Eingabe nicht mehr geändert werden.
                </p>
              )}
              <label htmlFor="full_name" className={cvLabel}>
                Vorname, Nachname *
              </label>
              <Input
                id="full_name"
                name="full_name"
                placeholder='Max Mustermann'
                defaultValue={profile?.full_name || ''}
                readOnly={!!profile?.full_name}
                required={!profile?.full_name}
                className={profile?.full_name ? `${cvField} cursor-not-allowed bg-slate-50 text-slate-500` : cvField}
              />
            </div>
            <div>
              <label htmlFor="headline" className={cvLabel}>
                Aktuelle Berufsbezeichnung *
              </label>
              <Input
                id="headline"
                name="headline"
                defaultValue={profile?.headline || ''}
                placeholder="z.B. Software Engineer | Kaufmännischer Angestellter"
                required
                className={cvField}
              />
            </div>
            <div>
              <label htmlFor="email" className={cvLabel}>
                E-Mail *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email || ''}
                placeholder="max.mustermann@mustermann.ch"
                required
                readOnly
                className={`${cvField} cursor-not-allowed bg-slate-50 text-slate-500`}
              />
            </div>
            <div>
              <label htmlFor="location" className={cvLabel}>
                Adresse *
              </label>
              <Input
                id="location"
                name="location"
                defaultValue={profile?.location || ''}
                placeholder="Musterstrasse 1, 5000 Musterstadt"
                required
                className={cvField}
              />
            </div>
            <div>
              <label htmlFor="place_of_origin" className={cvLabel}>
                Heimatort *
              </label>
              <Input
                id="place_of_origin"
                name="place_of_origin"
                defaultValue={profile?.place_of_origin || ''}
                placeholder="Zürich"
                required
                className={cvField}
              />
            </div>
            <div>
              <label htmlFor="phone" className={cvLabel}>
                Telefon *
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile?.phone || ''}
                placeholder="+41 76 000 00 00"
                required
                className={cvField}
              />
            </div>
            <div>
              <label htmlFor="birthdate" className={cvLabel}>
                Geburtsdatum *
              </label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                defaultValue={profile?.birthdate || ''}
                required
                className={cvField}
              />
            </div>
            <div className="relative">
              <label htmlFor="civil_status" className={cvLabel}>
                Zivilstand *
              </label>
              <select
                id="civil_status"
                name="civil_status"
                defaultValue={profile?.civil_status || ''}
                required
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]/20"
              >
                <option value="" disabled>Bitte auswählen</option>
                <option value="Ledig">Ledig</option>
                <option value="Verheiratet">Verheiratet</option>
                <option value="Geschieden">Geschieden</option>
                <option value="Verwitwet">Verwitwet</option>
              </select>
            </div>
          </div>
          <div className={cvFormActions}>
            <Button type="submit" disabled={isSaving} className={cvPrimary}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Wird gespeichert …' : 'Änderungen speichern'}
            </Button>
            <Button type="button" onClick={() => setIsEditing(false)} className={cvSecondary}>
              Abbrechen
            </Button>
          </div>
        </form>
    </CvPanel>
  );
});
  export default ProfileSection;
