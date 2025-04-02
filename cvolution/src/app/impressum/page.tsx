"use client";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Impressum</h1>
        <div className="space-y-8">
          {/* Section 1: Company Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4 mt-4">Angaben gemäß § 5 TMG</h2>
            <p className="text-lg leading-relaxed">
              CVolution GmbH <br />
              Kasernenstrasse 28 <br />
              5000 Aarau <br />
              Schweiz
            </p>
          </section>

          {/* Section 2: Contact Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4 mt-4">Kontakt</h2>
            <p className="text-lg leading-relaxed">
              Telefon: +41 76 440 51 51 <br />
              E-Mail: <a href="mailto:info@cvolution.ch" className="text-blue-500 hover:underline">info@cvolution.ch</a>
            </p>
          </section>

          {/* Section 3: Represented By */}
          <section>
            <h2 className="text-2xl font-bold mb-4 mt-4">Vertreten durch</h2>
            <p className="text-lg leading-relaxed">
              Armend Mustafa <br />
              Geschäftsführer
            </p>
          </section>

          {/* Section 4: Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold mb-4 mt-4">Haftungsausschluss</h2>
            <p className="text-lg leading-relaxed">
            Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit sowie Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu entfernen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
            </p>
          </section>

          {/* Section 5: Links */}
          <section>
            <h3 className="text-xl font-bold mb-2">Haftung für Links</h3>
            <p className="text-lg leading-relaxed">
            WVerweise und Links von unserer Webseite auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.
            </p>
          </section>

          {/* Section 6: Copyright */}
          <section>
            <h2 className="text-2xl font-bold mb-4 mt-4">Urheberrecht</h2>
            <p className="text-lg leading-relaxed">
            Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos, PDF oder anderen Dateien auf der Webseite gehören ausschliesslich Meron AG oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.
            </p>
          </section>

          {/* Section 7: end */}
          <section>
            <p className="text-lg leading-relaxed">
            Aarau / 03.01.2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}