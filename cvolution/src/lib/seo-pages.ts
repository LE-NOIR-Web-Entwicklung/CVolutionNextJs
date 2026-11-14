import { pageMetadata } from "./seo";

/**
 * Single source of truth for titles (max 60 chars) and descriptions (max 155 chars).
 * Run `node scripts/check-seo-meta.mjs` after changes to verify the limits.
 */
export const PAGE_META = {
  "/": {
    title: "Bewerbungsservice Schweiz: Lebenslauf & Lohnanalyse",
    description:
      "Lebenslauf, Motivationsschreiben, Lohnanalyse und Laufbahnberatung von Recruiting-Profis. Ab CHF 59 – oder Self-Service für CHF 13.90 pro Monat.",
  },
  "/service": {
    title: "Bewerbungsservice: Alle Angebote & Preise | CVolution",
    description:
      "Lohnanalyse ab CHF 69, Lebenslauf und Motivationsschreiben ab CHF 99, Dossier-Check ab CHF 59, Laufbahnberatung CHF 149/Std. Jetzt Angebot wählen.",
  },
  "/service-salary": {
    title: "Lohnanalyse erstellen lassen ab CHF 69 | CVolution",
    description:
      "Ist Ihr Lohn marktgerecht? Persönliche Lohnanalyse mit Branchen- und Kantonsvergleich: als PDF in 2 Arbeitstagen (CHF 69) oder mit Gespräch (CHF 119).",
  },
  "/service-cv": {
    title: "Lebenslauf schreiben lassen: CHF 99 | CVolution",
    description:
      "Professioneller Lebenslauf nach Schweizer Standard: Wir analysieren Ihre Laufbahn, schärfen Ihr Profil und gestalten das Dokument. CHF 99, jetzt bestellen.",
  },
  "/service-motivation": {
    title: "Motivationsschreiben schreiben lassen | CHF 99",
    description:
      "Ein Motivationsschreiben, das zur Stelle passt und nach Ihnen klingt – formuliert von Recruiting-Profis aus der Schweiz. CHF 99, jetzt bestellen.",
  },
  "/service-career": {
    title: "Laufbahnberatung Schweiz | CHF 149 pro Stunde",
    description:
      "Neuorientierung, Weiterbildung oder nächster Karriereschritt: Laufbahnberatung mit über 10 Jahren Recruiting-Erfahrung. CHF 149 pro Stunde – jetzt buchen.",
  },
  "/service-check": {
    title: "Bewerbungsdossier-Check ab CHF 59 | CVolution",
    description:
      "Wir prüfen Lebenslauf, Motivationsschreiben und Zeugnisse auf Inhalt, Aufbau und Wirkung und zeigen konkrete Verbesserungen. Ab CHF 59 – Dossier hochladen.",
  },
  "/service-linkedin": {
    title: "LinkedIn-Profil optimieren lassen | CHF 149",
    description:
      "Mehr Anfragen von Recruitern: Wir schärfen Headline, Info-Text und Erfahrungen Ihres LinkedIn-Profils für die Stellensuche in der Schweiz. CHF 149.",
  },
  "/service-rav": {
    title: "RAV-Unterstützung: Bewerbungen & Nachweise | CVolution",
    description:
      "Hilfe bei RAV-Bewerbungen, Arbeitsbemühungen und Unterlagen – damit Sie die Vorgaben erfüllen und schneller eine neue Stelle finden. Ab CHF 99.",
  },
  "/service-downloads": {
    title: "Lebenslauf-Vorlagen Word & KI-Prompts | ab CHF 19.90",
    description:
      "Lebenslauf-Vorlagen für Word nach Schweizer Standard und Masterprompts für Ihr Motivationsschreiben mit KI. CHF 19.90 pro Dokument, alle 5 für CHF 49.90.",
  },
  "/self": {
    title: "Bewerbung mit KI erstellen | Self-Service CHF 13.90",
    description:
      "Lebenslauf erfassen, Stelle einfügen, Motivationsschreiben mit KI erstellen und Bewerbungen verfolgen – alles in einem Tool. Für CHF 13.90 pro Monat.",
  },
  "/about": {
    title: "Über CVolution | Recruiting-Erfahrung für Ihre Bewerbung",
    description:
      "CVolution aus Oberentfelden AG: über 10 Jahre Recruiting-Erfahrung und mehr als 10'000 gesichtete Lebensläufe – präzise, persönlich und praxisnah.",
  },
  "/team": {
    title: "Team | Ihre Ansprechpartner bei CVolution",
    description:
      "Lernen Sie das Team hinter CVolution kennen: Recruiting- und Software-Erfahrung für Ihre Bewerbung, Ihre Lohnanalyse und Ihren nächsten Karriereschritt.",
  },
  "/contact": {
    title: "Kontakt | CVolution Bewerbungsservice Oberentfelden",
    description:
      "Fragen zu Lebenslauf, Lohnanalyse oder Laufbahnberatung? Schreiben Sie uns oder rufen Sie an: CVolution GmbH, Ausserfeldstrasse 9, 5036 Oberentfelden.",
  },
  "/blog": {
    title: "Karriere-Blog Schweiz: Bewerbung, Lohn & Jobsuche",
    description:
      "Praxisnahe Artikel zu Bewerbung, Lebenslauf, Lohn und Karriere in der Schweiz – von Recruiting-Profis geschrieben und laufend ergänzt.",
  },
  "/agb": {
    title: "AGB | CVolution GmbH",
    description: "Allgemeine Geschäftsbedingungen der CVolution GmbH für Bewerbungsservices, Lohnanalysen, Downloads und den Self-Service.",
  },
  "/impressum": {
    title: "Impressum | CVolution GmbH",
    description: "Impressum der CVolution GmbH, Ausserfeldstrasse 9, 5036 Oberentfelden: Kontaktangaben und rechtliche Hinweise.",
  },

  // Ratgeber
  "/lebenslauf-beispiel": {
    title: "Lebenslauf Beispiel Schweiz: 3 Muster für jede Stufe",
    description:
      "Drei vollständige Lebenslauf-Beispiele für die Schweiz: Berufseinstieg, erfahrene Fachkraft und Führungsperson – mit Erklärungen zu jedem Abschnitt.",
  },
  "/lebenslauf-vorlage-schweiz": {
    title: "Lebenslauf Vorlage Schweiz 2026: Muster & Tipps",
    description:
      "Lebenslauf-Vorlage nach Schweizer Standard: Aufbau, Pflichtangaben, Foto und Layout – mit Muster zum Nachbauen und Tipps von Recruiting-Profis.",
  },
  "/lebenslauf-aufbau": {
    title: "Lebenslauf Aufbau Schweiz: Gliederung Schritt für Schritt",
    description:
      "So bauen Sie Ihren Lebenslauf für die Schweiz auf: richtige Reihenfolge der Abschnitte, was hineingehört und was nicht – mit Beispielen.",
  },
  "/lebenslauf-fehler": {
    title: "Lebenslauf-Fehler: 15 Fehler, die Absagen kosten",
    description:
      "Die 15 häufigsten Fehler im Lebenslauf – von Lücken bis Layout – und wie Sie sie vermeiden. Mit Checkliste von Recruiting-Profis aus der Schweiz.",
  },
  "/lebenslauf-format-schweiz": {
    title: "Lebenslauf Format Schweiz: Länge, Layout & Foto",
    description:
      "Wie lang darf ein Lebenslauf in der Schweiz sein? PDF oder Word, mit oder ohne Foto, welche Schrift? Das richtige Format für Ihre Bewerbung.",
  },
  "/lebenslauf-student": {
    title: "Lebenslauf Student Schweiz: Muster ohne Erfahrung",
    description:
      "Lebenslauf als Student oder Lehrabgänger: So überzeugen Sie ohne viel Berufserfahrung – mit Aufbau, Formulierungen und Tipps für Praktika und Nebenjobs.",
  },
  "/lebenslauf-quereinsteiger": {
    title: "Lebenslauf Quereinsteiger Schweiz: Tipps & Vorlage",
    description:
      "Branchenwechsel geplant? So zeigen Sie übertragbare Kompetenzen im Lebenslauf, erklären den Wechsel und überzeugen Arbeitgeber in der Schweiz.",
  },
  "/motivationsschreiben-tipps": {
    title: "Motivationsschreiben Tipps Schweiz: So überzeugen Sie",
    description:
      "Aufbau, Einstieg, Länge und Schluss: Die wichtigsten Tipps für ein Motivationsschreiben, das Schweizer Arbeitgeber überzeugt – mit Formulierungsbeispielen.",
  },
  "/bewerbung-schreiben": {
    title: "Bewerbung schreiben Schweiz: Die komplette Anleitung",
    description:
      "Bewerbung schreiben in der Schweiz: vom Inserat bis zum fertigen Dossier. Schritt-für-Schritt-Anleitung mit Checkliste für Lebenslauf und Anschreiben.",
  },
  "/bewerbung-schweiz": {
    title: "Bewerbung Schweiz: Dossier, Ablauf & Tipps 2026",
    description:
      "Was gehört ins Bewerbungsdossier in der Schweiz? Unterlagen, Ablauf, Fristen und Besonderheiten des Schweizer Arbeitsmarkts kompakt erklärt.",
  },
  "/bewerbung-vorlage-schweiz": {
    title: "Bewerbung Vorlage Schweiz: Kostenlose Muster 2026",
    description:
      "Kostenlose Bewerbungsvorlagen für die Schweiz: Muster für Motivationsschreiben, Lebenslauf und Deckblatt – mit Hinweisen zum Anpassen an Ihre Stelle.",
  },
  "/bewerbung-nach-kuendigung": {
    title: "Bewerbung nach Kündigung: So erklären Sie den Wechsel",
    description:
      "Gekündigt oder selbst gekündigt? So formulieren Sie den Grund in Lebenslauf und Gespräch, nutzen die Kündigungsfrist und bewerben sich mit Zuversicht.",
  },
  "/bewerbungsgespraech-tipps": {
    title: "Bewerbungsgespräch Tipps: Fragen & Antworten 2026",
    description:
      "Optimal vorbereitet ins Vorstellungsgespräch: häufige Fragen mit Antwortbeispielen, Fragen an den Arbeitgeber und Tipps zur Lohnfrage in der Schweiz.",
  },
  "/lohn-verhandeln-schweiz": {
    title: "Lohn verhandeln Schweiz: Tipps & Formulierungen 2026",
    description:
      "So verhandeln Sie Ihren Lohn erfolgreich: Marktwert ermitteln, Lohnvorstellung begründen, Gegenargumente parieren – mit konkreten Formulierungen.",
  },
  "/lohnanalyse-schweiz": {
    title: "Lohnanalyse Schweiz: Ist Ihr Lohn fair? So prüfen Sie es",
    description:
      "Lohn selbst vergleichen: Welche Quellen zuverlässig sind, welche Faktoren den Lohn bestimmen und ab wann sich eine Lohnverhandlung lohnt.",
  },
  "/lohnrechner-schweiz": {
    title: "Lohnrechner Schweiz 2026: Brutto-Netto berechnen",
    description:
      "Kostenloser Brutto-Netto-Rechner für die Schweiz 2026: AHV, ALV, Pensionskasse und NBU berechnen und Ihren Lohn mit dem Medianlohn vergleichen.",
  },
  "/lohn-nach-beruf": {
    title: "Lohn nach Beruf Schweiz: Medianlöhne aller Berufe",
    description:
      "Was verdient man in der Schweiz? Medianlöhne für alle Berufsgruppen nach offiziellen BFS-Zahlen, mit Detailseiten nach Alter und Geschlecht.",
  },
  "/lohn-nach-kanton": {
    title: "Lohn nach Kanton: Medianlöhne der Schweiz 2024",
    description:
      "Wo verdient man am meisten? Medianlöhne nach Grossregion und Kanton (BFS 2024), Branchenvergleich, Kaufkraft und ob sich Pendeln für mehr Lohn lohnt.",
  },
  "/lohnerhoehung-fordern": {
    title: "Lohnerhöhung fordern: Tipps, Prozente & E-Mail-Vorlage",
    description:
      "Wann und wie viel Lohnerhöhung verlangen? Realistische Prozentsätze, Gesprächsleitfaden in 5 Schritten, E-Mail-Vorlage und was Sie bei einem Nein tun.",
  },
  "/lohnvorstellung-bewerbung": {
    title: "Lohnvorstellung Bewerbung: Formulierungen & Beispiele",
    description:
      "Lohnvorstellung in der Bewerbung angeben: Muss das sein, brutto oder netto, Spanne oder Betrag? Mit Formulierungen für Motivationsschreiben und Gespräch.",
  },
  "/13-monatslohn": {
    title: "13. Monatslohn Schweiz: Pflicht, Berechnung, Kündigung",
    description:
      "Ist der 13. Monatslohn in der Schweiz Pflicht? So wird er berechnet, was bei Kündigung und Probezeit gilt und wie Sie ihn im Lohnvergleich einrechnen.",
  },
  "/rav-bewerbung-tipps": {
    title: "RAV Bewerbung: Arbeitsbemühungen richtig nachweisen",
    description:
      "Wie viele Bewerbungen verlangt das RAV? So erfüllen Sie die Arbeitsbemühungen, dokumentieren sie korrekt und erhöhen Ihre Chancen auf eine Stelle.",
  },
} as const;

export type PagePath = keyof typeof PAGE_META;

export function metaFor(path: PagePath, options: { type?: "website" | "article"; image?: string } = {}) {
  return pageMetadata({ ...PAGE_META[path], path, ...options });
}

export type GuideCategory = "Lebenslauf" | "Bewerbung" | "Lohn" | "RAV";

export type Guide = {
  path: PagePath;
  label: string;
  teaser: string;
  category: GuideCategory;
  /** Paid service this guide should convert into. */
  service: ServiceCta;
};

export type ServiceCta = {
  href: string;
  heading: string;
  text: string;
  button: string;
};

const CTA_SALARY_CALL: ServiceCta = {
  href: "/service-salary",
  heading: "Mit Zahlen ins Lohngespräch",
  text: "Die Lohnanalyse mit Gespräch zeigt Ihren Marktwert nach Funktion, Branche und Kanton – und wir bereiten gemeinsam Ihre Argumente vor. CHF 119.",
  button: "Lohnanalyse mit Gespräch",
};
const CTA_CV: ServiceCta = {
  href: "/service-cv",
  heading: "Lieber gleich einen fertigen Lebenslauf?",
  text: "Wir analysieren Ihre Laufbahn, schärfen Ihr Profil und gestalten Ihren Lebenslauf nach Schweizer Standard – für CHF 99.",
  button: "Lebenslauf schreiben lassen",
};
const CTA_CHECK: ServiceCta = {
  href: "/service-check",
  heading: "Sind Ihre Unterlagen wirklich fehlerfrei?",
  text: "Wir prüfen Ihren Lebenslauf und Ihr Dossier auf Inhalt, Aufbau und Wirkung und geben Ihnen konkrete Verbesserungen – ab CHF 59.",
  button: "Dossier prüfen lassen",
};
const CTA_MOTIVATION: ServiceCta = {
  href: "/service-motivation",
  heading: "Ihr Motivationsschreiben, von Profis formuliert",
  text: "Wir schreiben ein Motivationsschreiben, das zur Stelle passt und nach Ihnen klingt – für CHF 99.",
  button: "Motivationsschreiben bestellen",
};
const CTA_SALARY: ServiceCta = {
  href: "/service-salary",
  heading: "Kennen Sie Ihren Marktwert?",
  text: "Unsere Lohnanalyse vergleicht Ihren Lohn mit Branche, Kanton und Erfahrung und liefert Ihnen Argumente für die Verhandlung – ab CHF 69.",
  button: "Lohnanalyse bestellen",
};
const CTA_CAREER: ServiceCta = {
  href: "/service-career",
  heading: "Unsicher, wie es beruflich weitergeht?",
  text: "In der Laufbahnberatung klären wir Ihre Ziele und Stärken und legen konkrete nächste Schritte fest – CHF 149 pro Stunde.",
  button: "Laufbahnberatung buchen",
};
const CTA_RAV: ServiceCta = {
  href: "/service-rav",
  heading: "Unterstützung für Ihre RAV-Bewerbungen",
  text: "Wir bringen Ihre Unterlagen auf Stand und helfen Ihnen, die Arbeitsbemühungen sauber zu erfüllen – ab CHF 99.",
  button: "RAV-Unterstützung anfragen",
};
const CTA_SELF: ServiceCta = {
  href: "/self",
  heading: "Bewerbungen selbst erstellen – mit KI",
  text: "Mit dem Self-Service erfassen Sie Ihren Lebenslauf einmal und erstellen für jede Stelle ein passendes Motivationsschreiben – CHF 13.90 pro Monat.",
  button: "Self-Service starten",
};

/**
 * Pages that are temporarily switched off: they return 404, are left out of the sitemap
 * and are not linked anywhere. Remove a path here to publish the page again.
 */
export const HIDDEN_PATHS: ReadonlySet<string> = new Set(["/lohnrechner-schweiz"]);

export function isHiddenPath(path: string) {
  return HIDDEN_PATHS.has(path);
}

const ALL_GUIDES: Guide[] = [
  { path: "/lohnrechner-schweiz", label: "Lohnrechner Brutto-Netto", teaser: "Nettolohn berechnen und mit dem Median vergleichen.", category: "Lohn", service: CTA_SALARY },
  { path: "/lohn-nach-beruf", label: "Lohn nach Beruf", teaser: "Medianlöhne aller Berufe nach BFS.", category: "Lohn", service: CTA_SALARY },
  { path: "/lohn-nach-kanton", label: "Lohn nach Kanton", teaser: "Medianlöhne nach Region und Branche.", category: "Lohn", service: CTA_SALARY },
  { path: "/lohnanalyse-schweiz", label: "Lohnanalyse Schweiz", teaser: "Lohn selbst vergleichen und fair einordnen.", category: "Lohn", service: CTA_SALARY },
  { path: "/lohn-verhandeln-schweiz", label: "Lohn verhandeln", teaser: "Strategien und Formulierungen für mehr Lohn.", category: "Lohn", service: CTA_SALARY },
  { path: "/lohnerhoehung-fordern", label: "Lohnerhöhung fordern", teaser: "Zeitpunkt, Prozente und E-Mail-Vorlage.", category: "Lohn", service: CTA_SALARY_CALL },
  { path: "/lohnvorstellung-bewerbung", label: "Lohnvorstellung Bewerbung", teaser: "Richtig angeben und begründen.", category: "Lohn", service: CTA_SALARY },
  { path: "/13-monatslohn", label: "13. Monatslohn", teaser: "Pflicht, Berechnung und Kündigung.", category: "Lohn", service: CTA_SALARY },
  { path: "/lebenslauf-beispiel", label: "Lebenslauf Beispiel", teaser: "Drei vollständige Muster für jede Karrierestufe.", category: "Lebenslauf", service: CTA_CV },
  { path: "/lebenslauf-vorlage-schweiz", label: "Lebenslauf Vorlage", teaser: "Schweizer Vorlage mit Aufbau und Pflichtangaben.", category: "Lebenslauf", service: CTA_CV },
  { path: "/lebenslauf-aufbau", label: "Lebenslauf Aufbau", teaser: "Die richtige Gliederung Schritt für Schritt.", category: "Lebenslauf", service: CTA_CV },
  { path: "/lebenslauf-format-schweiz", label: "Lebenslauf Format", teaser: "Länge, Layout, Foto und Dateiformat.", category: "Lebenslauf", service: CTA_CV },
  { path: "/lebenslauf-fehler", label: "Lebenslauf-Fehler", teaser: "15 Fehler, die Absagen kosten.", category: "Lebenslauf", service: CTA_CHECK },
  { path: "/lebenslauf-student", label: "Lebenslauf Student", teaser: "Überzeugen ohne viel Berufserfahrung.", category: "Lebenslauf", service: CTA_CV },
  { path: "/lebenslauf-quereinsteiger", label: "Lebenslauf Quereinsteiger", teaser: "Übertragbare Kompetenzen richtig zeigen.", category: "Lebenslauf", service: CTA_CAREER },
  { path: "/motivationsschreiben-tipps", label: "Motivationsschreiben Tipps", teaser: "Aufbau, Einstieg und Schluss, die überzeugen.", category: "Bewerbung", service: CTA_MOTIVATION },
  { path: "/bewerbung-schreiben", label: "Bewerbung schreiben", teaser: "Vom Inserat bis zum fertigen Dossier.", category: "Bewerbung", service: CTA_SELF },
  { path: "/bewerbung-schweiz", label: "Bewerbung Schweiz", teaser: "Dossier, Ablauf und Besonderheiten.", category: "Bewerbung", service: CTA_CHECK },
  { path: "/bewerbung-vorlage-schweiz", label: "Bewerbung Vorlage", teaser: "Muster für Motivationsschreiben und Dossier.", category: "Bewerbung", service: CTA_MOTIVATION },
  { path: "/bewerbungsgespraech-tipps", label: "Bewerbungsgespräch Tipps", teaser: "Häufige Fragen und gute Antworten.", category: "Bewerbung", service: CTA_CAREER },
  { path: "/bewerbung-nach-kuendigung", label: "Bewerbung nach Kündigung", teaser: "Den Wechsel souverän erklären.", category: "Bewerbung", service: CTA_CAREER },
  { path: "/rav-bewerbung-tipps", label: "RAV Bewerbung", teaser: "Arbeitsbemühungen richtig erfüllen.", category: "RAV", service: CTA_RAV },
];

/** Guides that are live and may be listed or linked. */
export const GUIDES: Guide[] = ALL_GUIDES.filter((guide) => !isHiddenPath(guide.path));

/** Looks up any guide, hidden ones included, so their service CTA keeps working on other pages. */
export function guideFor(path: string) {
  return ALL_GUIDES.find((guide) => guide.path === path);
}

/** Guides shown on each service page, most relevant first. */
export const SERVICE_GUIDES: Record<string, PagePath[]> = {
  "/service-salary": ["/lohnrechner-schweiz", "/lohn-nach-beruf", "/lohn-nach-kanton", "/lohnanalyse-schweiz", "/lohn-verhandeln-schweiz", "/lohnerhoehung-fordern", "/lohnvorstellung-bewerbung", "/13-monatslohn", "/bewerbungsgespraech-tipps"],
  "/service-cv": ["/lebenslauf-beispiel", "/lebenslauf-vorlage-schweiz", "/lebenslauf-aufbau", "/lebenslauf-format-schweiz", "/lebenslauf-fehler", "/lebenslauf-student"],
  "/service-motivation": ["/motivationsschreiben-tipps", "/bewerbung-vorlage-schweiz", "/bewerbung-schreiben", "/lohnvorstellung-bewerbung"],
  "/service-career": ["/lebenslauf-quereinsteiger", "/bewerbung-nach-kuendigung", "/bewerbungsgespraech-tipps"],
  "/service-check": ["/lebenslauf-fehler", "/bewerbung-schweiz", "/bewerbung-schreiben"],
  "/service-linkedin": ["/bewerbung-schweiz", "/lebenslauf-aufbau", "/bewerbung-nach-kuendigung"],
  "/service-rav": ["/rav-bewerbung-tipps", "/bewerbung-nach-kuendigung", "/bewerbung-schreiben"],
  "/service-downloads": ["/lebenslauf-vorlage-schweiz", "/bewerbung-vorlage-schweiz", "/motivationsschreiben-tipps"],
};

export function guidesForService(servicePath: string) {
  return (SERVICE_GUIDES[servicePath] || [])
    .filter((path) => !isHiddenPath(path))
    .map((path) => guideFor(path)).filter((g): g is Guide => Boolean(g));
}

/** Picks the paid service a blog post should lead to, based on its title and tags. */
export function ctaForTopic(text: string): ServiceCta {
  const t = text.toLowerCase();
  if (/lohn|gehalt|salär|verdien|marktwert/.test(t)) return CTA_SALARY;
  if (/\brav\b|arbeitslos|arbeitsbemühung/.test(t)) return CTA_RAV;
  if (/motivationsschreiben|anschreiben/.test(t)) return CTA_MOTIVATION;
  if (/lebenslauf|\bcv\b/.test(t)) return CTA_CV;
  if (/karriere|laufbahn|neuorientierung|quereinst|kündigung/.test(t)) return CTA_CAREER;
  return CTA_SELF;
}
