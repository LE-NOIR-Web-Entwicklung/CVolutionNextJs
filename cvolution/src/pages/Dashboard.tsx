import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProfileSection from '@/components/Dashboard/ProfileSection';
import ExperienceSection from '@/components/Dashboard/ExperienceSection';
import EducationSection from '@/components/Dashboard/EducationSection';
import SkillsAndLanguagesSection from '@/components/Dashboard/SkillsAndLanguagesSection';
import { CVExportButton } from '@/components/CVExport/CVExportButton';
import { CVExportModal } from '@/components/CVExport/CVExportModal';
import { PaymentModal } from '@/components/ui/PaymentModal';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [cvModalOpen, setCVModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [experiencesData, setExperiencesData] = useState<any[]>([]);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [languagesData, setLanguagesData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
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
  }, [user, cvModalOpen]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Abgemeldet',
      description: 'Sie wurden erfolgreich abgemeldet.',
    });
  router.push('/self');
  };

  const handleExportClick = () => {
    // Prüfe, ob bezahlt wurde oder paydate älter als ein Jahr ist
    if (profileData) {
      const paid = profileData.paid;
      const paydate = profileData.paydate;
      let expired = false;
      if (paydate) {
        const payDateObj = new Date(paydate);
        const now = new Date();
        const diffYears = (now.getTime() - payDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365);
        expired = diffYears >= 1;
      }
      if ((paid === false || !paid) || !paydate || expired) {
        setPaymentModalOpen(true);
        return;
      }
    }
    setCVModalOpen(true);
  };

  // Detect tab change and trigger save when leaving profile tab
  const handleTabChange = (newTab: string) => {
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
                Self-Service CV-Plattform
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
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Mobile Tab Navigation */}
            <div className="w-full sm:hidden">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                {/* <TabsTrigger value="linkedin" className="text-xs p-2">LinkedIn</TabsTrigger> */}
                <TabsTrigger value="profile" className="text-xs p-2 text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white">Profil</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs p-2 text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white">Erfahrung</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-3 h-auto mt-2">
                <TabsTrigger value="education" className="text-xs p-2 text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white">Bildung</TabsTrigger>
                <TabsTrigger value="skills" className="text-xs p-2 text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white min-w-[180px]">Sprachen und Fähigkeiten</TabsTrigger>
              </TabsList>
            </div>

            {/* Desktop Tab Navigation */}
            <TabsList className="hidden sm:grid w-full max-w-2xl grid-cols-6">
              {/* <TabsTrigger value="linkedin">LinkedIn</TabsTrigger> */}
              <TabsTrigger value="profile" className="text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white">Profil</TabsTrigger>
              <TabsTrigger value="experience" className="text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white">Erfahrung</TabsTrigger>
              <TabsTrigger value="education" className="text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white">Bildung</TabsTrigger>
              <TabsTrigger value="skills" className="text-gray-600 data-[state=active]:bg-[#204878] data-[state=active]:text-white col-span-2 min-w-[180px]">Sprachen & Fähigkeiten</TabsTrigger>
            </TabsList>
            {/* CV Export Button below desktop navigation */}
            <div className="hidden sm:block ml-4">
              <CVExportButton onExport={handleExportClick} />
            </div>
            <div className="sm:hidden ml-4">
              <CVExportButton onExport={handleExportClick} />
            </div>
          </div>

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
          />

          {/* <TabsContent value="linkedin">
            <LinkedInExtractor />
          </TabsContent> */}

          <TabsContent value="profile">
            <ProfileSection ref={profileSectionRef} />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceSection ref={experienceSectionRef} />
          </TabsContent>
          <TabsContent value="education">
            <EducationSection ref={educationSectionRef} />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsAndLanguagesSection ref={skillsAndLanguagesSectionRef} />
          </TabsContent>
          <TabsContent value="languages">
            <SkillsAndLanguagesSection ref={skillsAndLanguagesSectionRef} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
