
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { 
  LinkedinIcon, 
  FileText, 
  Users, 
  Shield, 
  Zap, 
  Download,
  Edit,
  Database,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const NavigationMenu = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <Button asChild variant="outline" size="sm">
        <a href="/auth">Anmelden</a>
      </Button>
      <Button asChild className="bg-blue-600 hover:bg-blue-700" size="sm">
        <a href="/auth">Loslegen</a>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CVolution</h1>
              <Badge variant="secondary" className="ml-2 sm:ml-3 text-xs hidden sm:inline-flex">
                Professionelle Lebenslauf-Plattform
              </Badge>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex">
              <NavigationMenu />
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="mt-8">
                    <NavigationMenu />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Verwandeln Sie Ihr
              <span className="text-blue-600"> LinkedIn-Profil</span>
              <br />
              in einen professionellen Lebenslauf
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              CVolution extrahiert automatisch Ihre beruflichen Daten aus LinkedIn und erstellt 
              schöne, anpassbare Lebensläufe. Verwalten Sie Ihre Karrieregeschichte mit leistungsstarken 
              Bearbeitungstools und exportieren Sie in professionelle Formate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
                <a href="/auth">Starten Sie Ihre Lebenslauf-Reise</a>
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
                Demo ansehen
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Leistungsstarke Funktionen für professionelle Lebensläufe
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Alles was Sie brauchen, um Ihre berufliche Geschichte zu erstellen, zu verwalten und zu teilen
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center sm:text-left">
                  <LinkedinIcon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-4 mx-auto sm:mx-0" />
                  <CardTitle className="text-lg sm:text-xl">LinkedIn-Integration</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Importieren Sie automatisch Ihre beruflichen Daten von LinkedIn mit einem Klick
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center sm:text-left">
                  <Edit className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 mb-4 mx-auto sm:mx-0" />
                  <CardTitle className="text-lg sm:text-xl">Vollständige Bearbeitung</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Erstellen, lesen, aktualisieren und löschen Sie alle Aspekte Ihres beruflichen Profils
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center sm:text-left">
                  <Database className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 mb-4 mx-auto sm:mx-0" />
                  <CardTitle className="text-lg sm:text-xl">Sichere Datenspeicherung</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Ihre Daten werden sicher mit Verschlüsselung und Datenschutz auf Unternehmensniveau gespeichert
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center sm:text-left">
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600 mb-4 mx-auto sm:mx-0" />
                  <CardTitle className="text-lg sm:text-xl">Professioneller Export</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Exportieren Sie Ihren Lebenslauf in professionelle Word-Dokumente mit schöner Formatierung
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center sm:text-left">
                  <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600 mb-4 mx-auto sm:mx-0" />
                  <CardTitle className="text-lg sm:text-xl">Echtzeit-Updates</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Nehmen Sie sofort Änderungen vor und sehen Sie diese in allen Ihren Dokumenten widergespiegelt
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center sm:text-left">
                  <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 mb-4 mx-auto sm:mx-0" />
                  <CardTitle className="text-lg sm:text-xl">DSGVO-konform</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Vollständige Einhaltung der Datenschutzbestimmungen und Datenschutzgesetze
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Wie CVolution funktioniert
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 px-4">
                Bereiten Sie Ihren professionellen Lebenslauf in nur drei einfachen Schritten vor
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center px-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">LinkedIn verbinden</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Fügen Sie Ihre LinkedIn-Profil-URL ein und lassen Sie unser System Ihre beruflichen Daten extrahieren
                </p>
              </div>

              <div className="text-center px-4">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Bearbeiten & Anpassen</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Überprüfen, bearbeiten und verbessern Sie Ihre beruflichen Informationen mit unserem intuitiven Editor
                </p>
              </div>

              <div className="text-center px-4">
                <div className="bg-purple-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Lebenslauf exportieren</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Generieren und laden Sie Ihren professionellen Lebenslauf in verschiedenen Formaten herunter
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Bereit, Ihre Karrieregeschichte zu verwandeln?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Schließen Sie sich Tausenden von Fachkräften an, die CVolution vertrauen, um ihre Karrierereise zu verwalten
            </p>
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto max-w-xs mx-auto">
              <a href="/auth">Kostenlos loslegen</a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">CVolution</h3>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Professionelle Lebenslauf-Management-Plattform mit LinkedIn-Integration. 
                Verwandeln Sie Ihre Karrieregeschichte mit leistungsstarken Bearbeitungstools und schönen Exporten.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-semibold mb-4">Funktionen</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>LinkedIn-Integration</li>
                <li>Professioneller Export</li>
                <li>Sichere Speicherung</li>
                <li>Echtzeit-Bearbeitung</li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>Über uns</li>
                <li>Datenschutzerklärung</li>
                <li>Nutzungsbedingungen</li>
                <li>Kontakt</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>&copy; 2024 CVolution. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
