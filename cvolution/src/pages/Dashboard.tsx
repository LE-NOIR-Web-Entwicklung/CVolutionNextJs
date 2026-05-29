import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProfileSection from '@/components/Dashboard/ProfileSection';
import ExperienceSection from '@/components/Dashboard/ExperienceSection';
import EducationSection from '@/components/Dashboard/EducationSection';
import SkillsAndLanguagesSection from '@/components/Dashboard/SkillsAndLanguagesSection';
import { MotivationLetterSection } from '@/components/Dashboard/MotivationLetterSection';
import { CVImportButton } from '@/components/Dashboard/CVImportButton';
import { CVExportButton } from '@/components/CVExport/CVExportButton';
import { CVExportModal } from '@/components/CVExport/CVExportModal';
import { PaymentModal } from '@/components/ui/PaymentModal';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [cvModalOpen, setCVModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [experiencesData, setExperiencesData] = useState<any[]>([]);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [languagesData, setLanguagesData] = useState<any[]>([]);
  const [activeArea, setActiveArea] = useState('cv');
  const [activeTab, setActiveTab] = useState('profile');
  const [cvImportVersion, setCvImportVersion] = useState(0);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const profileSectionRef = React.useRef<{ saveProfile: () => void }>(null);
  const experienceSectionRef = React.useRef<{ saveExperiences: () => void }>(null);
  const educationSectionRef = React.useRef<{ saveEducation: () => void }>(null);
  const skillsAndLanguagesSectionRef = React.useRef<{ saveSkillsAndLanguages: () => void }>(null);

  // Fetch all data for export
  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;
      // Profile
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      console.log('Supabase user:', user);
      console.log('Supabase profile:', profile);
      if (profileError) console.error('Supabase profile error:', profileError);
      setProfileData(profile);
      // Experiences
      const { data: experiences, error: expError } = await supabase.from('experiences').select('*').eq('user_id', user.id);
      if (expError) console.error('Supabase experiences error:', expError);
      setExperiencesData(experiences || []);
      // Education
      const { data: education, error: eduError } = await supabase.from('education').select('*').eq('user_id', user.id);
      if (eduError) console.error('Supabase education error:', eduError);
      setEducationData(education || []);
      // Skills
      const { data: skills, error: skillsError } = await supabase.from('skills').select('*').eq('user_id', user.id);
      if (skillsError) console.error('Supabase skills error:', skillsError);
      setSkillsData(skills || []);
      // Languages
      const { data: languages, error: langError } = await supabase.from('languages').select('*').eq('user_id', user.id);
      if (langError) console.error('Supabase languages error:', langError);

      // Map language proficiency to display labels with descriptions
      const mappedLanguages = (languages || []).map(lang => {
        const proficiencyLabels: Record<string, string> = {
          'a1': 'A1 – Anfänger',
          'a2': 'A2 – Grundlegende Kenntnisse',
          'b1': 'B1 – Fortgeschrittene Sprachverwendung',
          'b2': 'B2 – Selbstständige Sprachverwendung',
          'c1': 'C1 – Fachkundige Sprachkenntnisse',
          'c2': 'C2 – Annähernd muttersprachliche Kenntnisse',
          'native': 'Muttersprache',
          // Legacy mappings
          'beginner': 'A2 – Grundlegende Kenntnisse',
          'intermediate': 'B1 – Fortgeschrittene Sprachverwendung',
          'advanced': 'B2 – Selbstständige Sprachverwendung',
          'expert': 'C1 – Fachkundige Sprachkenntnisse',
        };
        return {
          ...lang,
          proficiency: proficiencyLabels[lang.proficiency?.toLowerCase()] || lang.proficiency
        };
      });

      setLanguagesData(mappedLanguages);
    };
    fetchAll();
  }, [user, cvModalOpen, cvImportVersion]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Abgemeldet',
      description: 'Sie wurden erfolgreich abgemeldet.',
    });
  router.push('/self');
  };

  const handleExportClick = () => {
    // Prüfe, ob ein aktiver Zahlungszeitraum vorhanden ist.
    if (profileData) {
      const paid = profileData.paid;
      const periodEnd = profileData.subscription_current_period_end || profileData.paydate;
      let expired = false;
      if (periodEnd) {
        const periodEndDate = new Date(periodEnd);
        const now = new Date();
        expired = periodEndDate.getTime() <= now.getTime();
      }
      if ((paid === false || !paid) || !periodEnd || expired) {
        setIsRenewal(expired);
        setPaymentModalOpen(true);
        return;
      }
    }
    setCVModalOpen(true);
  };

  const hasActiveSubscription = Boolean(
    profileData?.subscription_provider === 'saferpay' &&
    profileData?.subscription_status === 'active' &&
    profileData?.subscription_current_period_end &&
    new Date(profileData.subscription_current_period_end).getTime() > Date.now()
  );

  const hasCanceledSubscription = Boolean(
    profileData?.subscription_provider === 'saferpay' &&
    profileData?.subscription_status === 'canceled'
  );

  const paidPeriodEnd = profileData?.subscription_current_period_end || profileData?.paydate;
  const hasCurrentPaidPeriod = Boolean(
    paidPeriodEnd && new Date(paidPeriodEnd).getTime() > Date.now()
  );
  const hasSelfServiceAccess = Boolean(
    profileData &&
    hasCurrentPaidPeriod &&
    (profileData.paid || ['active', 'canceled'].includes(profileData.subscription_status))
  );

  const formatSubscriptionDate = (value: string | null | undefined) => {
    if (!value) return '';
    return new Intl.DateTimeFormat('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  };

  const openSelfServicePayment = () => {
    let expired = false;
    if (paidPeriodEnd) {
      expired = new Date(paidPeriodEnd).getTime() <= Date.now();
    }

    setIsRenewal(expired);
    setPaymentModalOpen(true);
  };

  const handleCancelSubscription = async () => {
    if (!hasActiveSubscription || cancelingSubscription) return;

    const confirmed = window.confirm(
      'Abo wirklich kündigen? Ihr Zugang bleibt bis zum Ende der bezahlten Laufzeit aktiv. Es werden danach keine weiteren monatlichen Abbuchungen ausgelöst.'
    );

    if (!confirmed) return;

    setCancelingSubscription(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        throw new Error('Bitte melden Sie sich erneut an.');
      }

      const res = await fetch('/api/saferpay/self-subscription/cancel', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Abo konnte nicht gekündigt werden.');
      }

      setProfileData((current: any) => current ? { ...current, subscription_status: 'canceled' } : current);
      toast({
        title: 'Abo gekündigt',
        description: 'Es werden keine weiteren monatlichen Abbuchungen ausgelöst.',
      });
    } catch (error) {
      toast({
        title: 'Kündigung fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setCancelingSubscription(false);
    }
  };

  const saveActiveCvSection = () => {
    if (activeTab === 'profile' && profileSectionRef.current) {
      profileSectionRef.current.saveProfile();
    }
    if (activeTab === 'experience' && experienceSectionRef.current) {
      experienceSectionRef.current.saveExperiences();
    }
    if (activeTab === 'education' && educationSectionRef.current) {
      educationSectionRef.current.saveEducation();
    }
    if ((activeTab === 'skills' || activeTab === 'languages') && skillsAndLanguagesSectionRef.current) {
      skillsAndLanguagesSectionRef.current.saveSkillsAndLanguages();
    }
  };

  const handleAreaChange = (newArea: string) => {
    if (activeArea === 'cv' && newArea !== 'cv') {
      saveActiveCvSection();
    }
    setActiveArea(newArea);
  };

  // Detect tab change and trigger save when leaving CV tabs
  const handleTabChange = (newTab: string) => {
    saveActiveCvSection();
    setActiveTab(newTab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Badge variant="secondary" className="text-gray-600 sm:ml-3 text-xs sm:text-sm hidden sm:inline-flex">
                CVolution GmbH | Self-Service
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden md:inline">
                Willkommen, {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm bg-[#204878]">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline ">Abmelden</span>
                <span className="sm:hidden">Abmelden</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeArea} onValueChange={handleAreaChange} className="space-y-4 sm:space-y-6">
          <TabsList className="flex h-auto w-full items-center justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="cv" className="h-12 min-w-0 flex-1 rounded-lg border border-slate-200 !bg-white text-xs font-semibold !text-gray-600 shadow-sm data-[state=active]:!bg-[#204878] data-[state=active]:!text-white data-[state=active]:!shadow-md sm:w-72 sm:flex-none sm:text-sm">
              CV Self-Service
            </TabsTrigger>
            <TabsTrigger value="motivation" className="h-12 min-w-0 flex-1 rounded-lg border border-slate-200 !bg-white text-xs font-semibold !text-gray-600 shadow-sm data-[state=active]:!bg-[#204878] data-[state=active]:!text-white data-[state=active]:!shadow-md sm:w-72 sm:flex-none sm:text-sm">
              AI Motivationsschreiben
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              aria-label="Einstellungen"
              title="Einstellungen"
              className="ml-auto h-12 w-12 shrink-0 rounded-md border border-slate-200 !bg-white px-0 !text-gray-600 shadow-sm data-[state=active]:!bg-[#204878] data-[state=active]:!text-white data-[state=active]:!shadow-md"
            >
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* CV Export Modal */}
          <CVExportModal
            open={cvModalOpen}
            onClose={() => setCVModalOpen(false)}
            user={user || {}} // Fallback auf leeres Objekt
            profile={profileData || {}} // Fallback auf leeres Objekt
            experiences={Array.isArray(experiencesData) ? experiencesData : []}
            education={Array.isArray(educationData) ? educationData : []}
            skills={Array.isArray(skillsData) ? skillsData : []}
            languages={Array.isArray(languagesData) ? languagesData : []}
          />
          {/* Payment Modal */}
          <PaymentModal
            open={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
            user={user || {}}
            profile={profileData || {}}
            isRenewal={isRenewal}
          />

          {/* <TabsContent value="linkedin">
            <LinkedInExtractor />
          </TabsContent> */}

          {(hasActiveSubscription || hasCanceledSubscription) && (
            <div className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-slate-200/70 bg-white/50 px-3 py-1.5 text-xs text-slate-500 shadow-none">
              <span className="font-medium text-slate-600">
                {hasCanceledSubscription ? 'Abo gekündigt' : 'Abo aktiv'}
              </span>
              <span>
                bis {formatSubscriptionDate(profileData?.subscription_current_period_end)}
                {hasCanceledSubscription ? ' · keine weiteren Abbuchungen' : ' (Automatische Verlängerung)'}
              </span>
            </div>
          )}

          <TabsContent value="cv" className="mt-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <TabsList className="!grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:!flex sm:flex-wrap sm:items-center sm:justify-start">
                    <TabsTrigger value="profile" className="h-11 min-w-28 rounded-lg border border-slate-200 !bg-white text-sm !text-gray-600 shadow-sm data-[state=active]:!bg-[#204878] data-[state=active]:!text-white data-[state=active]:!shadow-md">Profil</TabsTrigger>
                    <TabsTrigger value="experience" className="h-11 min-w-28 rounded-lg border border-slate-200 !bg-white text-sm !text-gray-600 shadow-sm data-[state=active]:!bg-[#204878] data-[state=active]:!text-white data-[state=active]:!shadow-md">Erfahrung</TabsTrigger>
                    <TabsTrigger value="education" className="h-11 min-w-28 rounded-lg border border-slate-200 !bg-white text-sm !text-gray-600 shadow-sm data-[state=active]:!bg-[#204878] data-[state=active]:!text-white data-[state=active]:!shadow-md">Bildung</TabsTrigger>
                    <TabsTrigger value="skills" className="h-11 min-w-48 rounded-lg border border-slate-200 !bg-white px-4 text-sm !text-gray-600 shadow-sm data-[state=active]:!bg-[#204878] data-[state=active]:!text-white data-[state=active]:!shadow-md">Sprachen & Fähigkeiten</TabsTrigger>
                  </TabsList>

                  <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
                    <CVImportButton
                      hasSelfServiceAccess={hasSelfServiceAccess}
                      onRequirePayment={openSelfServicePayment}
                      onImported={() => setCvImportVersion((current) => current + 1)}
                    />
                    <CVExportButton onExport={handleExportClick} />
                  </div>
                </div>
              </div>

              <TabsContent value="profile">
                <ProfileSection key={`profile-${cvImportVersion}`} ref={profileSectionRef} />
              </TabsContent>
              <TabsContent value="experience">
                <ExperienceSection key={`experience-${cvImportVersion}`} ref={experienceSectionRef} />
              </TabsContent>
              <TabsContent value="education">
                <EducationSection key={`education-${cvImportVersion}`} ref={educationSectionRef} />
              </TabsContent>
              <TabsContent value="skills">
                <SkillsAndLanguagesSection key={`skills-${cvImportVersion}`} ref={skillsAndLanguagesSectionRef} />
              </TabsContent>
              <TabsContent value="languages">
                <SkillsAndLanguagesSection key={`languages-${cvImportVersion}`} ref={skillsAndLanguagesSectionRef} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="motivation">
            <MotivationLetterSection
              hasSelfServiceAccess={hasSelfServiceAccess}
              onRequirePayment={openSelfServicePayment}
            />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-lg shadow p-4 sm:p-8">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-3xl sm:text-2xl font-bold text-gray-900">Einstellungen</h2>
                <p className="text-sm text-gray-600 mt-1">Konto und Abo verwalten</p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {hasCanceledSubscription ? 'Abo gekündigt' : 'Monatsabo'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {profileData?.subscription_current_period_end
                        ? `Zugriff bis ${formatSubscriptionDate(profileData.subscription_current_period_end)}`
                        : 'Kein aktives Abo gefunden'}
                    </p>
                  </div>
                  {hasActiveSubscription && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelSubscription}
                      disabled={cancelingSubscription}
                      className="border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
                    >
                      {cancelingSubscription ? 'Kündige...' : 'Abo kündigen'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
