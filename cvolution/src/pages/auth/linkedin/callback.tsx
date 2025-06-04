
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const LinkedInCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      console.log('LinkedIn callback received:', { 
        code: code?.substring(0, 10) + '...', 
        state, 
        error,
        fullUrl: window.location.href,
        origin: window.location.origin,
        host: window.location.host
      });

      if (error) {
        console.error('LinkedIn auth error:', error);
        // Send error to parent window
        window.opener?.postMessage({
          type: 'LINKEDIN_AUTH_ERROR',
          error: error as string
        }, window.location.origin);
        window.close();
        return;
      }

      if (code) {
        try {
          console.log('Exchanging code for token via Supabase edge function...');
          
          const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
          console.log('Using redirect URI:', redirectUri);
          
          // Use Supabase edge function for token exchange
          const { data, error: exchangeError } = await supabase.functions.invoke('linkedin-token-exchange', {
            body: { 
              code: code as string,
              redirectUri,
            }
          });

          console.log('Token exchange response:', { 
            hasData: !!data,
            hasError: !!exchangeError,
            error: exchangeError,
            data: data ? { hasAccessToken: !!data.access_token } : null
          });

          if (exchangeError) {
            console.error('Supabase function error:', exchangeError);
            throw new Error(exchangeError.message || 'Token exchange failed');
          }

          if (data?.access_token) {
            console.log('Token received successfully');
            // Send success to parent window
            window.opener?.postMessage({
              type: 'LINKEDIN_AUTH_SUCCESS',
              accessToken: data.access_token
            }, window.location.origin);
          } else {
            throw new Error('Failed to get access token');
          }
        } catch (error) {
          console.error('Token exchange failed:', error);
          // Send error to parent window
          window.opener?.postMessage({
            type: 'LINKEDIN_AUTH_ERROR',
            error: error instanceof Error ? error.message : 'Authentifizierung fehlgeschlagen'
          }, window.location.origin);
        }
      }

      // Close the popup window
      setTimeout(() => {
        window.close();
      }, 1000);
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>LinkedIn-Authentifizierung wird verarbeitet...</p>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-left max-w-md">
          <p><strong>Debug Info:</strong></p>
          <p>URL: {window.location.href}</p>
          <p>Origin: {window.location.origin}</p>
          <p>Host: {window.location.host}</p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInCallback;
