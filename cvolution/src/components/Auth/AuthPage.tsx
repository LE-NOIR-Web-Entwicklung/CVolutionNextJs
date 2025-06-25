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
        description: "Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">CVolution GmbH</h1>
          <p className="text-black text-base">Professionelle Lebenslauf-Management-Plattform</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <CardHeader className="space-y-1 p-0 mb-6">
            <CardTitle className="text-2xl text-center text-black font-bold">Willkommen</CardTitle>
            <CardDescription className="text-center text-black text-base">
              Melden Sie sich in Ihrem Konto an oder erstellen Sie ein neues
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg mb-6">
                <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-[#204878] data-[state=active]:text-white text-black font-semibold">Anmelden</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-[#204878] data-[state=active]:text-white text-black font-semibold">Registrieren</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2 text-left">
                    <label htmlFor="signin-email" className="text-sm font-medium text-black">
                      E-Mail
                    </label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="ihre@email.com"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label htmlFor="signin-password" className="text-sm font-medium text-black">
                      Passwort
                    </label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200" disabled={isLoading}>
                    {isLoading ? "Anmeldung läuft..." : "Anmelden"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-name" className="text-sm font-medium text-black">
                      Vollständiger Name
                    </label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Ihr vollständiger Name"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-email" className="text-sm font-medium text-black">
                      E-Mail
                    </label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="ihre@email.com"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label htmlFor="signup-password" className="text-sm font-medium text-black">
                      Passwort
                    </label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200" disabled={isLoading}>
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
