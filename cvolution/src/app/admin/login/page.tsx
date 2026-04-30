"use client";

import React, { useState } from 'react';
import { adminSupabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ADMIN_SESSION_STORAGE_KEY = 'cvolution-admin-session';

const waitForAdminSession = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data } = await adminSupabase.auth.getSession();
    if (data.session) return data.session;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return null;
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Versuche Login mit Supabase Auth
      const { data, error } = await adminSupabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        toast({
          title: 'Login fehlgeschlagen',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Prüfe ob User Admin ist
      const adminEmails = ['jan@cvolution.ch', 'armend@cvolution.ch'];
      const userEmail = data.user?.email?.toLowerCase() || '';

      if (data.user && adminEmails.includes(userEmail)) {
        if (!data.session) {
          throw new Error('Admin-Session konnte nicht erstellt werden.');
        }

        if (data.session) {
          await adminSupabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });

          localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            email: userEmail,
          }));
        }

        const verifiedSession = await waitForAdminSession();
        if (!verifiedSession) {
          throw new Error('Admin-Session konnte nicht gespeichert werden. Bitte Browser-Speicher fuer diese Seite erlauben.');
        }

        // Setze Admin-Session im localStorage
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_email', userEmail);

        toast({
          title: 'Erfolgreich angemeldet',
          description: 'Willkommen im Admin-Dashboard',
        });

        window.location.assign('/admin');
      } else {
        // User ist kein Admin - ausloggen
        await adminSupabase.auth.signOut();
        setErrorMessage('Sie haben keine Admin-Berechtigung.');
        toast({
          title: 'Zugriff verweigert',
          description: 'Sie haben keine Admin-Berechtigung.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.');
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-[#204878]" />
          </div>
          <CardTitle className="text-2xl text-black text-center">Admin Login</CardTitle>
          <CardDescription className="text-center text-black">
            Melden Sie sich mit Ihren Admin-Zugangsdaten an
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-black font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@cvolution.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-gray-50 text-black'
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-black font-medium">
                Passwort
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='bg-gray-50 text-black'
                disabled={loading}
              />
            </div>
            {errorMessage && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#204878] hover:bg-[#1a3a5f]"
              disabled={loading}
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
