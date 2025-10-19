import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Save, Edit, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Datei zu groß',
        description: 'Bitte laden Sie ein Bild kleiner als 5MB hoch.',
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

      // Upload new photo
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!isEditing) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-black mb-1">Persönliches Profil</CardTitle>
              <CardDescription className="text-black">Ihre professionellen Informationen</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(true)} className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-4 py-2">
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-32 w-24 border-2 border-blue-200 rounded-lg overflow-hidden">
              <AvatarImage 
                src={profile?.profile_picture_url || ''} 
                alt={profile?.full_name || 'Profil'} 
                className="object-cover h-32 w-24 rounded-lg"
              />
              <AvatarFallback className="text-lg bg-blue-100 text-black h-32 w-24 flex items-center justify-center rounded-lg">
                {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-black mb-1">{profile?.full_name || 'Nicht angegeben'}</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black">E-Mail</label>
              <p className="text-black">{user?.email || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Wohnort</label>
              <p className="text-black">{profile?.location || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Heimatort</label>
              <p className="text-black">{profile?.place_of_origin || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Telefon</label>
              <p className="text-black">{profile?.phone || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Geburtsdatum</label>
              <p className="text-black">
                {profile?.birthdate
                  ? new Date(profile.birthdate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : 'Nicht angegeben'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Zivilstand</label>
              <p className="text-black">{profile?.civil_status || 'Nicht angegeben'}</p>
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="text-xl font-bold text-black mb-1">Profil bearbeiten</CardTitle>
        <CardDescription className="text-black">Aktualisieren Sie Ihre professionellen Informationen</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form ref={formRef} onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-32 w-24 border-2 border-blue-200 rounded-lg overflow-hidden">
              <AvatarImage 
                src={profile?.profile_picture_url || ''} 
                alt={profile?.full_name || 'Profil'} 
                className="object-cover h-32 w-24 rounded-lg"
              />
              <AvatarFallback className="text-lg bg-blue-100 text-black h-32 w-24 flex items-center justify-center rounded-lg">
                {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <label htmlFor="profile-photo" className="cursor-pointer">
                <Button type="button" asChild className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg px-4 py-2">
                  <span>
                    {isUploadingPhoto ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    {isUploadingPhoto ? 'Hochladen...' : 'Foto ändern'}
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
              <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="full_name" className="text-sm font-medium text-black">
                Vorname, Nachname
              </label>
              <Input
                id="full_name"
                name="full_name"
                placeholder='Max Mustermann'
                value={profile?.full_name || ''}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black opacity-70 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-black">
                E-Mail
              </label>
              <Input
                id="email"
                name="email"
                defaultValue={user?.email || ''}
                placeholder="max.mustermann@mustermann.ch"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="location" className="text-sm font-medium text-black">
                Wohnort
              </label>
              <Input
                id="location"
                name="location"
                defaultValue={profile?.location || ''}
                placeholder="Musterstrasse 1, 5000 Musterstadt"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="place_of_origin" className="text-sm font-medium text-black">
                Heimatort
              </label>
              <Input
                id="place_of_origin"
                name="place_of_origin"
                defaultValue={profile?.place_of_origin || ''}
                placeholder="Musterstrasse 1, 5000 Musterstadt"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium text-black">
                Telefon
              </label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile?.phone || ''}
                placeholder="+41 76 000 00 00"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="birthdate" className="text-sm font-medium text-black">
                Geburtsdatum
              </label>
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                defaultValue={profile?.birthdate || ''}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="civil_status" className="text-sm font-medium text-black">
                Zivilstand
              </label>
              <Input
                id="civil_status"
                name="civil_status"
                defaultValue={profile?.civil_status || ''}
                placeholder="Ledig, verheiratet, ..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button type="submit" disabled={isSaving} className="w-full bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Speichern...' : 'Änderungen speichern'}
            </Button>
            <Button type="button" onClick={() => setIsEditing(false)} className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200">
              Abbrechen
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
});
  export default ProfileSection;
