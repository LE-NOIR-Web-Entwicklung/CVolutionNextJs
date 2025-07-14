import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, Download, LinkedinIcon, Menu } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProfileSection } from '@/components/Dashboard/ProfileSection';
import { ExperienceSection } from '@/components/Dashboard/ExperienceSection';
import { EducationSection } from '@/components/Dashboard/EducationSection';
import { SkillsAndLanguagesSection } from '@/components/Dashboard/SkillsAndLanguagesSection';
import { LinkedInExtractor } from '@/components/LinkedInExtractor';
import { CVExportDialog } from '@/components/CVExport/CVExportDialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Abgemeldet',
      description: 'Sie wurden erfolgreich abgemeldet.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Badge variant="secondary" className="text-gray-600 sm:ml-3 text-xs sm:text-sm hidden sm:inline-flex">
                Self-Service Lebenslauf-Plattform
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden md:inline">
                Willkommen, {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Abmelden</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
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
            
            <CVExportDialog>
              <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Lebenslauf exportieren</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </CVExportDialog>
          </div>

          {/* <TabsContent value="linkedin">
            <LinkedInExtractor />
          </TabsContent> */}

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceSection />
          </TabsContent>

          <TabsContent value="education">
            <EducationSection />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsAndLanguagesSection />
          </TabsContent>

          <TabsContent value="languages">
            <SkillsAndLanguagesSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
