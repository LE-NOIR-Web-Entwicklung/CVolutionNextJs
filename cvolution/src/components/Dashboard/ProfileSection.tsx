import React, { useState, useEffect } from 'react';
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
}

export const ProfileSection: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

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
            <Avatar className="h-20 w-20 border-2 border-blue-200">
              <AvatarImage 
                src={profile?.profile_picture_url || ''} 
                alt={profile?.full_name || 'Profil'} 
              />
              <AvatarFallback className="text-lg bg-blue-100 text-black">
                {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-black mb-1">{profile?.full_name || 'Nicht angegeben'}</h3>
              <p className="text-black text-sm">{profile?.headline || 'Keine Schlagzeile'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black">E-Mail</label>
              <p className="text-black">{user?.email || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Standort</label>
              <p className="text-black">{profile?.location || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Telefon</label>
              <p className="text-black">{profile?.phone || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">LinkedIn-URL</label>
              <p className="text-black">{profile?.linkedin_url || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-black">Website</label>
              <p className="text-black">{profile?.website || 'Nicht angegeben'}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-black">Berufliche Zusammenfassung</label>
            <p className="text-black mt-1">{profile?.summary || 'Nicht angegeben'}</p>
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
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20 border-2 border-blue-200">
              <AvatarImage 
                src={profile?.profile_picture_url || ''} 
                alt={profile?.full_name || 'Profil'} 
              />
              <AvatarFallback className="text-lg bg-blue-100 text-black">
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
                Vollständiger Name
              </label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name || ''}
                placeholder="Ihr vollständiger Name"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-black">
                E-Mail
              </label>
              <Input
                id="email"
                name="email"
                value={user?.email || ''}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black opacity-70 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="headline" className="text-sm font-medium text-black">
                Berufliche Schlagzeile
              </label>
              <Input
                id="headline"
                name="headline"
                defaultValue={profile?.headline || ''}
                placeholder="z.B. Senior-Softwareentwickler"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="location" className="text-sm font-medium text-black">
                Standort
              </label>
              <Input
                id="location"
                name="location"
                defaultValue={profile?.location || ''}
                placeholder="Stadt, Land"
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
                placeholder="+49 (123) 456-7890"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="linkedin_url" className="text-sm font-medium text-black">
                LinkedIn-URL
              </label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                defaultValue={profile?.linkedin_url || ''}
                placeholder="https://linkedin.com/in/ihrprofil"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="website" className="text-sm font-medium text-black">
                Website
              </label>
              <Input
                id="website"
                name="website"
                defaultValue={profile?.website || ''}
                placeholder="https://ihrewebsite.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div>
            <label htmlFor="summary" className="text-sm font-medium text-black">
              Berufliche Zusammenfassung
            </label>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={profile?.summary || ''}
              placeholder="Kurze Beschreibung Ihres beruflichen Hintergrunds und Ihrer Ziele..."
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
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
};
