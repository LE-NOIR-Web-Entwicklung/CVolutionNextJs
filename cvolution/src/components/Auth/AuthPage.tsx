"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export const AuthPage: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Anmeldefehler",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Willkommen zurück!",
        description: "Sie haben sich erfolgreich angemeldet.",
      });
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: "Registrierungsfehler",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Konto erstellt!",
        description: "Sie werden direkt zum Dashboard weitergeleitet.",
      });
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#204878]">CVolution GmbH</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111827]">Willkommen</h2>
          <p className="mt-2 text-sm text-[#64748B]">Melden Sie sich an oder erstellen Sie ein Konto.</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <CardHeader className="space-y-1 p-0 mb-4">
            <CardTitle className="sr-only">Self-Service Login</CardTitle>
            <CardDescription className="sr-only">
              Melden Sie sich in Ihrem Konto an oder erstellen Sie ein neues Konto.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#F8FAFC] rounded-xl mb-5">
                <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-[#204878] data-[state=active]:text-white text-[#111827] font-semibold">Anmelden</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-[#204878] data-[state=active]:text-white text-[#111827] font-semibold">Registrieren</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2 text-left">
                    <label htmlFor="signin-email" className="text-sm font-semibold text-[#111827]">
                      E-Mail
                    </label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="ihre@email.com"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#111827] focus:border-[#204878] focus:ring-2 focus:ring-[#204878]/10"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label htmlFor="signin-password" className="text-sm font-semibold text-[#111827]">
                      Passwort
                    </label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#111827] focus:border-[#204878] focus:ring-2 focus:ring-[#204878]/10"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#204878] hover:bg-[#1a3a66] text-white font-semibold rounded-xl py-3 transition duration-200" disabled={isLoading}>
                    {isLoading ? "Anmeldung läuft..." : "Anmelden"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2 text-left">
                    <p className="text-xs text-[#64748B]">
                      Ihr Name kann nach der Registrierung nicht mehr geändert werden.
                    </p>
                    <label htmlFor="signup-name" className="text-sm font-semibold text-[#111827]">
                      Vollständiger Name
                    </label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Ihr vollständiger Name"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#111827] focus:border-[#204878] focus:ring-2 focus:ring-[#204878]/10"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-email" className="text-sm font-semibold text-[#111827]">
                      E-Mail
                    </label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="ihre@email.com"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#111827] focus:border-[#204878] focus:ring-2 focus:ring-[#204878]/10"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-password" className="text-sm font-semibold text-[#111827]">
                      Passwort
                    </label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[#111827] focus:border-[#204878] focus:ring-2 focus:ring-[#204878]/10"
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#204878] hover:bg-[#1a3a66] text-white font-semibold rounded-xl py-3 transition duration-200" disabled={isLoading}>
                    {isLoading ? "Konto wird erstellt..." : "Konto erstellen"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </div>
    </div>
  );
};
