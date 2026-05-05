
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkedinIcon, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LinkedInOAuthProps {
  onTokenReceived: (token: string) => void;
}

export const LinkedInOAuth: React.FC<LinkedInOAuthProps> = ({ onTokenReceived }) => {
  const { user } = useAuth();
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate LinkedIn OAuth URL for the current app origin.
    const clientId = '777cnr7lry8ine';
    const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
    const scope = 'openid profile email';
    
    console.log('LinkedIn OAuth Configuration:', {
      clientId,
      currentOrigin: window.location.origin,
      currentHost: window.location.host
    });
    
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${user?.id}`;
    setAuthUrl(url);
    
    console.log('Generated LinkedIn OAuth URL:', url);
  }, [user?.id]);

  const handleLinkedInAuth = () => {
    if (!authUrl) {
      toast({
        title: 'Konfigurationsfehler',
        description: 'LinkedIn OAuth ist nicht ordnungsgemäß konfiguriert.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Opening LinkedIn auth popup with URL:', authUrl);
    setIsLoading(true);
    
    // Open LinkedIn OAuth in a popup
    const popup = window.open(
      authUrl,
      'linkedinAuth',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    );

    // Check if popup was blocked
    if (!popup) {
      toast({
        title: 'Popup blockiert',
        description: 'Bitte erlauben Sie Popups für diese Website.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Listen for the popup to close or receive a message
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setIsLoading(false);
      }
    }, 1000);

    // Listen for messages from the popup
    const messageListener = (event: MessageEvent) => {
      console.log('Received message from popup:', event);
      
      if (event.origin !== window.location.origin) {
        console.log('Message from different origin, ignoring:', event.origin);
        return;
      }
      
      if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
        console.log('LinkedIn auth successful');
        clearInterval(checkClosed);
        popup?.close();
        onTokenReceived(event.data.accessToken);
        window.removeEventListener('message', messageListener);
        setIsLoading(false);
        toast({
          title: 'Erfolgreich',
          description: 'LinkedIn-Authentifizierung erfolgreich!',
        });
      } else if (event.data.type === 'LINKEDIN_AUTH_ERROR') {
        console.error('LinkedIn auth error:', event.data.error);
        clearInterval(checkClosed);
        popup?.close();
        toast({
          title: 'Authentifizierung fehlgeschlagen',
          description: event.data.error || 'Authentifizierung mit LinkedIn fehlgeschlagen.',
          variant: 'destructive',
        });
        window.removeEventListener('message', messageListener);
        setIsLoading(false);
      }
    };

    window.addEventListener('message', messageListener);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <LinkedinIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
          LinkedIn-Authentifizierung
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Authentifizieren Sie sich mit LinkedIn, um auf Ihre Profildaten zuzugreifen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleLinkedInAuth}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 w-full text-sm sm:text-base"
        >
          <LinkedinIcon className="h-4 w-4 mr-2" />
          {isLoading ? 'Authentifizierung läuft...' : 'LinkedIn verbinden'}
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
