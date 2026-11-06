import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings } from 'lucide-react';
import { dashboardPath, legacyDashboardHashArea, parseDashboardPath, type DashboardArea } from '@/lib/dashboard-routes';
import { toast } from '@/hooks/use-toast';
import ProfileSection from '@/components/Dashboard/ProfileSection';
import ExperienceSection from '@/components/Dashboard/ExperienceSection';
import EducationSection from '@/components/Dashboard/EducationSection';
import SkillsAndLanguagesSection from '@/components/Dashboard/SkillsAndLanguagesSection';
import { MotivationLetterSection } from '@/components/Dashboard/MotivationLetterSection';
import { ApplicationsSection } from '@/components/Dashboard/ApplicationsSection';
import { emptyApplication, emptyMotivationForm, type Application, type MotivationDraft } from '@/lib/applications';
import { saveApplication } from '@/lib/applications-client';
import { CVImportButton } from '@/components/Dashboard/CVImportButton';
import { CVExportButton } from '@/components/CVExport/CVExportButton';
import { CVExportModal } from '@/components/CVExport/CVExportModal';
import { PaymentModal } from '@/components/ui/PaymentModal';

const cvTabClass = 'h-9 min-w-0 rounded-md !bg-transparent px-3 text-sm font-medium !text-slate-600 !shadow-none transition-colors hover:!text-slate-900 data-[state=active]:!bg-white data-[state=active]:!text-[#204878] data-[state=active]:!shadow-sm';
// Two-column button grid on phones, underline tabs from md upwards.
const areaTabClass = 'h-10 min-w-0 rounded-md border border-slate-200 !bg-white px-2 text-[13px] font-medium !text-slate-600 !shadow-none transition-colors hover:!text-slate-900 data-[state=active]:border-[#204878] data-[state=active]:!bg-[#204878] data-[state=active]:!text-white md:-mb-px md:h-11 md:rounded-none md:border-0 md:border-b-2 md:border-transparent md:!bg-transparent md:px-1 md:text-sm md:!text-slate-500 md:data-[state=active]:border-[#204878] md:data-[state=active]:!bg-transparent md:data-[state=active]:!text-[#204878]';

// Loaded on demand because the charts are heavy.
const SalaryAnalysisSection = dynamic(() => import('@/components/Dashboard/SalaryAnalysisSection').then((module) => module.SalaryAnalysisSection), { ssr: false });

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '/dashboard';
  const route = parseDashboardPath(pathname) || { area: 'cv' as DashboardArea, applicationId: null };
  const activeArea = route.area;
  // Returning to the tab reopens the application that was open before.
  const applicationsPath = useRef(dashboardPath('applications'));
  if (activeArea === 'applications') applicationsPath.current = pathname;
  const [cvModalOpen, setCVModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isRenewal, setIsRenewal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [experiencesData, setExperiencesData] = useState<any[]>([]);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [languagesData, setLanguagesData] = useState<any[]>([]);
  const [motivationDraft, setMotivationDraft] = useState<MotivationDraft>(() => ({ form: emptyMotivationForm(), letter: '' }));
  const [incomingApplication, setIncomingApplication] = useState<Application | null>(null);
  const [applicationDirty, setApplicationDirty] = useState(false);
  const motivationDirty = JSON.stringify(motivationDraft) !== JSON.stringify({ form: emptyMotivationForm(), letter: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [cvImportVersion, setCvImportVersion] = useState(0);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const profileSectionRef = React.useRef<{ saveProfile: () => void }>(null);
  const experienceSectionRef = React.useRef<{ saveExperiences: () => void }>(null);
  const educationSectionRef = React.useRef<{ saveEducation: () => void }>(null);
  const skillsAndLanguagesSectionRef = React.useRef<{ saveSkillsAndLanguages: () => void }>(null);

  // Next.js keeps usePathname in sync with the History API, so the dashboard
  // stays mounted (drafts included) while the URL follows the open area.
  const navigate = useCallback((path: string, { replace = false } = {}) => {
    if (path === window.location.pathname) return;
    if (replace) window.history.replaceState(null, '', path);
    else window.history.pushState(null, '', path);
  }, []);

  useEffect(() => {
    const area = legacyDashboardHashArea(window.location.hash);
    if (area && window.location.pathname === '/dashboard') window.history.replaceState(null, '', dashboardPath(area));
  }, []);

  useEffect(() => {
    setMotivationDraft({ form: emptyMotivationForm(), letter: '' });
    setIncomingApplication(null);
    setApplicationDirty(false);
  }, [user?.id]);

  useEffect(() => {
    if (!motivationDirty && !applicationDirty) return;
    const preventUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const confirmNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const destination = new URL(link.href, window.location.href);
      if (!['http:', 'https:'].includes(destination.protocol)) return;
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      if (!window.confirm('Ungespeicherte Änderungen verwerfen und diese Seite verlassen?')) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', preventUnload);
    document.addEventListener('click', confirmNavigation, true);
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
      document.removeEventListener('click', confirmNavigation, true);
    };
  }, [motivationDirty, applicationDirty]);

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
    if ((applicationDirty || motivationDirty) && !window.confirm('Ungespeicherte Änderungen verwerfen und abmelden?')) return;
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

  // Only access that will not renew by itself needs a reminder before it ends.
  const accessEndsSoon = Boolean(
    hasSelfServiceAccess &&
    !hasActiveSubscription &&
    paidPeriodEnd &&
    new Date(paidPeriodEnd).getTime() - Date.now() <= 7 * 24 * 60 * 60 * 1000
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

  const handleAreaChange = (newArea: string, path?: string) => {
    const area = newArea as DashboardArea;
    if (activeArea === 'cv' && area !== 'cv') {
      saveActiveCvSection();
    }
    navigate(path || (area === 'applications' ? applicationsPath.current : dashboardPath(area)));
  };

  const navigateApplication = useCallback((applicationId: string | null, options?: { replace?: boolean }) => {
    navigate(dashboardPath('applications', applicationId), options);
  }, [navigate]);

  const saveMotivationDraft = async (draft: MotivationDraft) => {
    if (!hasSelfServiceAccess) {
      openSelfServicePayment();
      throw new Error('Der Bewerbungsmanager ist im aktiven Self-Service-Abo enthalten.');
    }
    if (applicationDirty) throw new Error('Bitte speichern oder schliessen Sie zuerst die offene Bewerbung im Bereich Bewerbungen.');
    const application = await saveApplication({ ...emptyApplication(), company: draft.form.company, job_title: draft.form.jobTitle, motivation_form: draft.form, motivation_letter: draft.letter }, null);
    setIncomingApplication(application);
    setMotivationDraft({ form: emptyMotivationForm(), letter: '' });
    handleAreaChange('applications', dashboardPath('applications'));
    return application.id;
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
          <div className="flex justify-between items-center h-12 sm:h-16">
            <div className="flex items-center">
              <Badge variant="secondary" className="text-gray-600 sm:ml-3 text-xs sm:text-sm">
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
        <Tabs value={activeArea} onValueChange={(area) => handleAreaChange(area)} className="space-y-4 sm:space-y-6">
          <TabsList className="!grid h-auto w-full grid-cols-2 gap-1.5 rounded-none !bg-transparent p-0 md:!flex md:items-stretch md:justify-start md:gap-3 md:border-b md:border-slate-200">
            <TabsTrigger value="cv" className={areaTabClass}>
              Lebenslauf
            </TabsTrigger>
            <TabsTrigger value="motivation" className={areaTabClass}>
              Motivationsschreiben
            </TabsTrigger>
            <TabsTrigger value="salary" className={areaTabClass}>
              Lohnanalyse
            </TabsTrigger>
            <TabsTrigger value="applications" className={areaTabClass}>
              Bewerbungsmanager
            </TabsTrigger>
            <a
              href="https://www.headshotpro.com/?via=armend"
              target="_blank"
              rel="noopener sponsored"
              title="Öffnet in neuem Fenster"
              className={`inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] ${areaTabClass}`}
            >
              Bewerbungsfoto
            </a>
            <TabsTrigger
              value="settings"
              aria-label="Einstellungen"
              title="Einstellungen"
              className={`gap-1.5 md:ml-auto md:w-10 md:shrink-0 md:!px-0 ${areaTabClass}`}
            >
              <Settings className="h-4 w-4" /><span className="md:hidden">Einstellungen</span>
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

          {accessEndsSoon && (
            <p role="status" className="text-xs text-amber-800">
              Ihr Self-Service-Zugang endet am {formatSubscriptionDate(paidPeriodEnd)}.{' '}
              <button type="button" onClick={openSelfServicePayment} className="font-semibold underline underline-offset-2 hover:text-amber-950">
                Abo verlängern
              </button>
            </p>
          )}

          <TabsContent value="cv" className="mt-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <TabsList aria-label="Lebenslauf-Bereiche" className="!grid h-auto w-full grid-cols-2 gap-1 rounded-lg !bg-slate-100 p-1 sm:!inline-flex sm:w-auto">
                  <TabsTrigger value="profile" className={cvTabClass}>Profil</TabsTrigger>
                  <TabsTrigger value="experience" className={cvTabClass}>Erfahrung</TabsTrigger>
                  <TabsTrigger value="education" className={cvTabClass}>Bildung</TabsTrigger>
                  <TabsTrigger value="skills" className={cvTabClass}>Sprachen & Fähigkeiten</TabsTrigger>
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

          <TabsContent value="motivation" forceMount className={activeArea === 'motivation' ? '' : 'hidden'}>
            <MotivationLetterSection
              hasSelfServiceAccess={hasSelfServiceAccess}
              onRequirePayment={openSelfServicePayment}
              draft={motivationDraft}
              onDraftChange={setMotivationDraft}
              onSaveDraft={saveMotivationDraft}
            />
          </TabsContent>

          <TabsContent value="salary" forceMount className={activeArea === 'salary' ? '' : 'hidden'}>
            <SalaryAnalysisSection
              key={user?.id || 'anonymous'}
              hasSelfServiceAccess={hasSelfServiceAccess}
              onRequirePayment={openSelfServicePayment}
              hasCvData={experiencesData.length > 0 || educationData.length > 0}
              profileName={profileData?.full_name || ''}
              profileBirthdate={profileData?.birthdate || null}
            />
          </TabsContent>

          <TabsContent value="applications" forceMount className={activeArea === 'applications' ? '' : 'hidden'}>
            <ApplicationsSection
              key={user?.id || 'anonymous'}
              hasSelfServiceAccess={hasSelfServiceAccess}
              onRequirePayment={openSelfServicePayment}
              onExportCv={handleExportClick}
              incomingApplication={incomingApplication?.user_id === user?.id ? incomingApplication : null}
              onDirtyChange={setApplicationDirty}
              routeApplicationId={activeArea === 'applications' ? route.applicationId : undefined}
              onRouteChange={navigateApplication}
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
                      {hasSelfServiceAccess && paidPeriodEnd
                        ? `${hasActiveSubscription ? 'Aktiv bis' : 'Zugriff bis'} ${formatSubscriptionDate(paidPeriodEnd)}${hasActiveSubscription ? ' · verlängert sich automatisch' : hasCanceledSubscription ? ' · keine weiteren Abbuchungen' : ''}`
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
