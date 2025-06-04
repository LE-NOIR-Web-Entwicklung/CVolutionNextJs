
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkedinIcon, Upload, Check, TestTube } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LinkedInOAuth } from './LinkedInOAuth';

interface LinkedInData {
  profile: {
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    profilePicture: string;
    location: string;
  };
  experiences: Array<{
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: string;
    isCurrent: boolean;
  }>;
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  skills: Array<{
    name: string;
    endorsements?: number;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
}

export const LinkedInExtractor: React.FC = () => {
  const { user } = useAuth();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<LinkedInData | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  const handleLinkedInExtraction = async (useDemo = false) => {
    if (!linkedinUrl && !useDemo) {
      toast({
        title: 'LinkedIn URL Required',
        description: 'Please enter your LinkedIn profile URL.',
        variant: 'destructive',
      });
      return;
    }

    if (!useDemo && !accessToken) {
      toast({
        title: 'Authentication Required',
        description: 'Please authenticate with LinkedIn first.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtracting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-extract', {
        body: { 
          linkedinUrl: useDemo ? 'https://linkedin.com/in/demo' : linkedinUrl,
          accessToken: useDemo ? null : accessToken,
          useDemo
        }
      });

      if (error) throw error;

      setExtractedData(data.data);
      toast({
        title: 'Success',
        description: data.message || 'LinkedIn data extracted successfully!',
      });
    } catch (error) {
      console.error('Error extracting LinkedIn data:', error);
      toast({
        title: 'Error',
        description: 'Failed to extract LinkedIn data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleTokenReceived = (token: string) => {
    setAccessToken(token);
    toast({
      title: 'Authentication Successful',
      description: 'You can now extract your LinkedIn data.',
    });
  };

  const handleImportData = async () => {
    if (!extractedData || !user) return;

    setIsImporting(true);

    try {
      // Import profile data with proper upsert handling
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: `${extractedData.profile.firstName} ${extractedData.profile.lastName}`,
          headline: extractedData.profile.headline,
          summary: extractedData.profile.summary,
          profile_picture_url: extractedData.profile.profilePicture,
          location: extractedData.profile.location,
          linkedin_url: linkedinUrl,
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Clear existing data before importing new data
      await supabase.from('experiences').delete().eq('user_id', user.id);
      await supabase.from('education').delete().eq('user_id', user.id);
      await supabase.from('skills').delete().eq('user_id', user.id);
      await supabase.from('languages').delete().eq('user_id', user.id);

      // Import experiences
      for (const exp of extractedData.experiences) {
        const { error: expError } = await supabase
          .from('experiences')
          .insert({
            user_id: user.id,
            job_title: exp.title,
            company: exp.company,
            description: exp.description,
            start_date: exp.startDate,
            end_date: exp.endDate,
            location: exp.location,
            is_current: exp.isCurrent,
            employment_type: 'full_time',
          });

        if (expError) throw expError;
      }

      // Import education
      for (const edu of extractedData.education) {
        const { error: eduError } = await supabase
          .from('education')
          .insert({
            user_id: user.id,
            institution: edu.school,
            degree: edu.degree,
            field_of_study: edu.fieldOfStudy,
            start_date: edu.startDate,
            end_date: edu.endDate,
            description: edu.description,
          });

        if (eduError) throw eduError;
      }

      // Import skills
      for (const skill of extractedData.skills) {
        const { error: skillError } = await supabase
          .from('skills')
          .insert({
            user_id: user.id,
            skill_name: skill.name,
            proficiency: 'intermediate',
            category: 'Technical',
          });

        if (skillError) throw skillError;
      }

      // Import languages
      for (const lang of extractedData.languages) {
        const { error: langError } = await supabase
          .from('languages')
          .insert({
            user_id: user.id,
            language_name: lang.name,
            proficiency: lang.proficiency as 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native',
          });

        if (langError) throw langError;
      }

      toast({
        title: 'Import Successful',
        description: 'All LinkedIn data has been imported into your profile!',
      });

      // Reset the form
      setExtractedData(null);
      setLinkedinUrl('');

    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: 'Import Error',
        description: 'Failed to import some data. Please check the logs.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* LinkedIn Authentication Section */}
      <LinkedInOAuth onTokenReceived={handleTokenReceived} />

      {/* LinkedIn Data Extraction Section - Only show after authentication */}
      {accessToken && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
              LinkedIn Data Extraction
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Import your professional data from LinkedIn to automatically populate your CV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Input
                  placeholder="https://linkedin.com/in/your-profile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="flex-1 text-sm sm:text-base"
                />
                <Button 
                  onClick={() => handleLinkedInExtraction(false)}
                  disabled={isExtracting}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
                >
                  {isExtracting ? 'Extracting...' : 'Extract Data'}
                </Button>
              </div>

              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => handleLinkedInExtraction(true)}
                  disabled={isExtracting}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50 w-full sm:w-auto text-sm sm:text-base"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Try Demo Data
                </Button>
              </div>

              {extractedData && (
                <div className="mt-4 sm:mt-6 p-4 border rounded-lg bg-green-50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800 text-sm sm:text-base">Data Extracted Successfully</span>
                    </div>
                    <Button 
                      onClick={handleImportData}
                      disabled={isImporting}
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm sm:text-base"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isImporting ? 'Importing...' : 'Import to Profile'}
                    </Button>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-green-700">
                    <p><strong>Profile:</strong> {extractedData.profile.firstName} {extractedData.profile.lastName}</p>
                    <p><strong>Experiences:</strong> {extractedData.experiences.length} items found</p>
                    <p><strong>Education:</strong> {extractedData.education.length} items found</p>
                    <p><strong>Skills:</strong> {extractedData.skills.length} items found</p>
                    <p><strong>Languages:</strong> {extractedData.languages.length} items found</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
