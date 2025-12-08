"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  paid: any;
  paydate: string | null;
  id: string;
  user_id: string;
  full_name: string | null;
  headline: string | null;
  summary: string | null;
  profile_picture_url: string | null;
  location: string | null;
  phone: string | null;
  linkedin_url: string | null;
  website: string | null;
  birthdate: string | null;
  civil_status: string | null;
  place_of_origin: string | null;
  created_at: string;
  email?: string; // Optional email field (requires database schema update)
}

interface Experience {
  id: string;
  user_id: string;
  company: string;
  job_title: string | null;
  employment_type: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  location: string | null;
}

interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

interface Skill {
  id: string;
  user_id: string;
  skill_name: string;
  proficiency: string | null;
}

interface Language {
  id: string;
  user_id: string;
  language_name: string;
  proficiency: string | null;
}

interface UserData {
  profile: UserProfile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

const AdminContent: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    // Prüfe localStorage für Admin-Session
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    const storedEmail = localStorage.getItem('admin_email');

    if (adminLoggedIn === 'true' && storedEmail) {
      setIsAdmin(true);
      setAdminEmail(storedEmail);
    } else {
      router.push('/admin/login');
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Admin-Email-Liste
      const adminEmails = ['jan@cvolution.ch', 'armend@cvolution.ch'];

      // Hole alle Profile mit Email-Feld (muss in der Datenbank existieren)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Filtere Admin-Profile aus
      const nonAdminProfiles = profiles.filter(profile => {
        // Wenn email Feld existiert, prüfe ob es keine Admin-Email ist
        const profileWithEmail = profile as any;
        if (profileWithEmail.email) {
          return !adminEmails.includes(profileWithEmail.email.toLowerCase());
        }
        // Wenn kein email Feld, zeige das Profil an
        return true;
      });

      const usersData: UserData[] = await Promise.all(
        nonAdminProfiles.map(async (profile) => {
          const [experiences, education, skills, languages] = await Promise.all([
            supabase
              .from('experiences')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
            supabase
              .from('education')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
            supabase
              .from('skills')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
            supabase
              .from('languages')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
          ]);

          return {
            profile: profile as unknown as UserProfile,
            experiences: experiences as Experience[],
            education: education as Education[],
            skills: skills as Skill[],
            languages: languages as Language[],
          };
        })
      );

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Laden der Benutzerdaten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Lösche Admin-Session aus localStorage
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_email');

    toast({
      title: 'Abgemeldet',
      description: 'Sie wurden erfolgreich abgemeldet.',
    });

    router.push('/admin/login');
  };

  const toggleUserExpanded = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Heute';
    return new Date(date).toLocaleDateString('de-DE');
  };

  if (!isAdmin) {
    return null;
  }

  // Pagination calculations
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-[#204878] mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <Badge variant="secondary" className="ml-3 text-gray-900">
                {users.length} Benutzer
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:inline">
                {adminEmail}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="bg-[#204878] text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Lade Benutzerdaten...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Keine Benutzer gefunden.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedUsers.map((userData) => {
                const isExpanded = expandedUsers.has(userData.profile.user_id);

              return (
                <Card key={userData.profile.user_id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleUserExpanded(userData.profile.user_id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg text-gray-900">
                            {userData.profile.full_name || 'Kein Name'}
                          </CardTitle>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {userData.profile.email && <p className="font-medium">Email: {userData.profile.email}</p>}
                          {userData.profile.headline && <p className="font-medium">{userData.profile.headline}</p>}
                          {userData.profile.phone && <p>Telefon: {userData.profile.phone}</p>}
                          {userData.profile.location && <p>Ort: {userData.profile.location}</p>}
                          <p className="text-xs text-gray-400">
                            Registriert: {formatDate(userData.profile.created_at)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Aktiv: {userData.profile.paid ? 'Ja' : 'Nein'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Letzte Abrechnung: {formatDate(userData.profile.paydate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm text-gray-500">
                          <div>{userData.experiences.length} Erfahrungen</div>
                          <div>{userData.education.length} Ausbildungen</div>
                          <div>{userData.skills.length} Fähigkeiten</div>
                          <div>{userData.languages.length} Sprachen</div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        {/* Kontaktdaten */}
                        <div>
                          <h3 className="font-semibold text-sm mb-2 text-[#204878]">Kontaktdaten</h3>
                          <div className="text-sm text-gray-900 space-y-1">
                            {userData.profile.location && <p>Standort: {userData.profile.location}</p>}
                            {userData.profile.phone && <p>Telefon: {userData.profile.phone}</p>}
                            {userData.profile.website && <p>Website: {userData.profile.website}</p>}
                            {userData.profile.linkedin_url && (
                              <p>LinkedIn: <a href={userData.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profil</a></p>
                            )}
                            {userData.profile.birthdate && <p>Geburtsdatum: {formatDate(userData.profile.birthdate)}</p>}
                            {userData.profile.civil_status && <p>Zivilstand: {userData.profile.civil_status}</p>}
                            {userData.profile.place_of_origin && <p>Heimatort: {userData.profile.place_of_origin}</p>}
                          </div>
                        </div>

                        {/* Erfahrungen */}
                        {userData.experiences.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-sm mb-2 text-[#204878]">Berufserfahrung</h3>
                            <div className="space-y-2">
                              {userData.experiences.map((exp) => (
                                <div key={exp.id} className="text-sm bg-white text-gray-900 p-2 rounded">
                                  <p className="font-medium">{exp.job_title || 'Position'}</p>
                                  <p className="text-gray-600">{exp.company}</p>
                                  {exp.employment_type && <p className="text-xs text-gray-500">{exp.employment_type}</p>}
                                  <p className="text-xs text-gray-500">
                                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Ausbildung */}
                        {userData.education.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-sm mb-2 text-[#204878]">Ausbildung</h3>
                            <div className="space-y-2">
                              {userData.education.map((edu) => (
                                <div key={edu.id} className="text-sm bg-white p-2 rounded">
                                  <p className="font-medium text-gray-900">{edu.degree}</p>
                                  <p className="text-gray-600">{edu.institution}</p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {userData.skills.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-sm mb-2 text-[#204878]">Fähigkeiten</h3>
                            <div className="flex flex-wrap text-gray-900 gap-2">
                              {userData.skills.map((skill) => (
                                <Badge key={skill.id} variant="outline" className="text-sm text-gray-900">
                                  {skill.skill_name} {skill.proficiency && `(${skill.proficiency})`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sprachen */}
                        {userData.languages.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-sm mb-2 text-[#204878]">Sprachen</h3>
                            <div className="flex flex-wrap gap-2">
                              {userData.languages.map((lang) => (
                                <Badge key={lang.id} variant="outline" className="text-sm text-gray-900">
                                  {lang.language_name} {lang.proficiency && `(${lang.proficiency})`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 bg-[#204878]" 
                >
                  <ChevronLeft className="h-4 w-4" />
                  Zurück
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Seite {currentPage} von {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 bg-[#204878]"
                >
                  Weiter
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function AdminPage() {
  return <AdminContent />;
}
