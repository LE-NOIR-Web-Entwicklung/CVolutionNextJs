import { LSE_GROUPS, type LseGroup } from "@/data/bfs-lse-berufsgruppen";

/**
 * Salary pages per job (/lohn/[slug]). Each page targets the search term people use
 * ("Lohn Informatiker") and shows the matching BFS occupational group (CH-ISCO-19, 2-digit),
 * stating openly which group the numbers describe.
 */
export type SalaryJob = {
  slug: string;
  /** Used in "Lohn {keyword} Schweiz" and in running text. */
  keyword: string;
  /** "als Informatikerin oder Informatiker" etc., used in the H1 question. */
  asPhrase: string;
  /** Main BFS group whose median is the headline figure. */
  primary: string;
  /** Further groups shown for context. */
  related: string[];
  intro: string;
  /** Typical jobs in the primary group, so readers know what the number covers. */
  examples: string;
  factors: string[];
};

export const SALARY_JOBS: SalaryJob[] = [
  {
    slug: "informatiker",
    keyword: "Informatiker",
    asPhrase: "als Informatikerin oder Informatiker",
    primary: "25",
    related: ["35", "21"],
    intro:
      "Die Informatik gehört zu den bestbezahlten Berufsfeldern der Schweiz. Wer Software entwickelt, Systeme betreut oder Daten analysiert, liegt im Median deutlich über dem Schnitt aller Berufe – mit grossen Unterschieden je nach Spezialisierung und Branche.",
    examples: "Softwareentwicklung, Systemanalyse, Datenbank- und Netzwerkspezialisten, Applikationsentwicklung.",
    factors: [
      "Spezialisierung: Cloud, Security und Data erzielen höhere Löhne als allgemeiner Support.",
      "Branche: Banken, Versicherungen und Pharma zahlen mehr als Detailhandel oder öffentliche Verwaltung.",
      "Abschluss: Informatik EFZ, HF oder Hochschule – der Einstiegslohn unterscheidet sich deutlich.",
      "Region: Zürich, Zug und Basel liegen über dem Schweizer Schnitt.",
    ],
  },
  {
    slug: "lehrer",
    keyword: "Lehrer",
    asPhrase: "als Lehrerin oder Lehrer",
    primary: "23",
    related: ["53", "26"],
    intro:
      "Lehrpersonen werden meist nach kantonalen Lohnskalen bezahlt. Der Lohn steigt mit den Dienstjahren in festen Stufen und hängt stark von der Schulstufe und vom Kanton ab.",
    examples: "Lehrpersonen an Primar-, Sekundar-, Berufs- und Mittelschulen, Dozierende an Hochschulen.",
    factors: [
      "Kanton: Die kantonalen Lohnreglemente unterscheiden sich um mehrere hundert Franken pro Monat.",
      "Schulstufe: Sekundarstufe II und Hochschulen zahlen mehr als Kindergarten und Primarstufe.",
      "Dienstjahre: Der Lohn steigt in Erfahrungsstufen, oft bis zu 20 Jahre lang.",
      "Pensum: Viele Lehrpersonen arbeiten Teilzeit, die Zahlen hier gelten für 100 %.",
    ],
  },
  {
    slug: "kaufmann-kv",
    keyword: "Kaufmann / Kauffrau (KV)",
    asPhrase: "mit einer KV-Ausbildung",
    primary: "41",
    related: ["33", "43", "42"],
    intro:
      "Die kaufmännische Lehre ist die häufigste Grundbildung der Schweiz. Entsprechend breit ist das Lohnspektrum: von der Sachbearbeitung im Sekretariat bis zur Fachperson im Rechnungswesen oder Personalwesen.",
    examples: "Sachbearbeitung, Sekretariat, Administration, Backoffice.",
    factors: [
      "Weiterbildung: Fachausweise (z. B. Fachfrau/Fachmann im Finanz- und Rechnungswesen oder HR) heben den Lohn deutlich.",
      "Branche: Banken, Versicherungen und die öffentliche Hand zahlen mehr als Handel und Gewerbe.",
      "Verantwortung: Mit Fach- oder Teamverantwortung wechseln Sie in eine höher bezahlte Berufsgruppe.",
      "Region: Städtische Zentren zahlen mehr als ländliche Regionen.",
    ],
  },
  {
    slug: "pflege-gesundheit",
    keyword: "Pflege und Gesundheit",
    asPhrase: "in der Pflege und im Gesundheitswesen",
    primary: "32",
    related: ["22", "53"],
    intro:
      "Im Gesundheitswesen hängt der Lohn stark von der Ausbildungsstufe ab. Fachpersonen Gesundheit (FaGe) und andere Assistenzberufe gehören zur einen Gruppe, Pflegefachpersonen HF/FH zusammen mit Ärztinnen und Ärzten zur anderen – was deren Median nach oben zieht.",
    examples: "Fachpersonen Gesundheit (FaGe), Medizinische Praxisassistenz, Rettungssanität, Pharma-Assistenz. Pflegehilfe und Betreuung zählen zu den Betreuungsberufen.",
    factors: [
      "Ausbildungsstufe: EFZ, HF oder FH bestimmen die Lohnklasse.",
      "Arbeitgeber: Kantonale Spitäler zahlen nach Lohnsystem, private Heime und Spitex teils tiefer.",
      "Zulagen: Nacht-, Wochenend- und Pikettdienste erhöhen das Einkommen, sind im Median aber nicht vollständig enthalten.",
      "Spezialisierung: Intensiv-, Notfall- und Anästhesiepflege werden besser bezahlt.",
    ],
  },
  {
    slug: "ingenieur",
    keyword: "Ingenieur",
    asPhrase: "als Ingenieurin oder Ingenieur",
    primary: "21",
    related: ["31", "25"],
    intro:
      "Ingenieurinnen und Ingenieure mit Hochschulabschluss gehören zu den gut bezahlten Fachkräften. Technikerinnen und Techniker HF bilden eine eigene Gruppe mit etwas tieferem Median.",
    examples: "Maschinen-, Elektro-, Bau- und Umweltingenieure, Architektinnen, Naturwissenschaftlerinnen.",
    factors: [
      "Fachrichtung: Elektrotechnik und Verfahrenstechnik liegen oft über Bau und Umwelt.",
      "Branche: Pharma, Energie und Maschinenindustrie zahlen mehr als Planungsbüros.",
      "Projekt- und Führungsverantwortung: Der grösste Lohnsprung kommt mit der Projektleitung.",
      "Abschluss: ETH, Fachhochschule oder HF wirken sich vor allem beim Einstieg aus.",
    ],
  },
  {
    slug: "elektriker",
    keyword: "Elektriker",
    asPhrase: "als Elektrikerin oder Elektriker",
    primary: "74",
    related: ["72", "31"],
    intro:
      "Elektroinstallateure und Elektronikerinnen sind gesucht. In vielen Betrieben gilt der Gesamtarbeitsvertrag der Branche mit Mindestlöhnen; mit Weiterbildung zum Chefmonteur oder Elektroprojektleiter steigt der Lohn deutlich.",
    examples: "Elektroinstallateure EFZ, Montage-Elektriker, Elektronikerinnen, Telematiker.",
    factors: [
      "Gesamtarbeitsvertrag: Der GAV legt Mindestlöhne nach Ausbildung und Erfahrung fest.",
      "Weiterbildung: Berufsprüfung und höhere Fachprüfung führen zu Projektleitung und Kalkulation.",
      "Erfahrung: Der Lohn steigt vor allem in den ersten zehn Berufsjahren.",
      "Zulagen: Pikett- und Auswärtszulagen kommen zum Grundlohn dazu.",
    ],
  },
  {
    slug: "verkauf",
    keyword: "Verkäufer",
    asPhrase: "im Verkauf",
    primary: "52",
    related: ["42", "33"],
    intro:
      "Im Detailhandel liegen die Löhne unter dem Schweizer Median, viele grosse Detailhändler haben aber Mindestlöhne und Lohnsysteme mit klaren Stufen. Im Aussendienst und im Business-to-Business-Verkauf wird deutlich mehr bezahlt.",
    examples: "Detailhandelsfachleute, Verkaufsberatung, Kassierer/innen, Filialmitarbeitende.",
    factors: [
      "Kanal: Aussendienst und B2B-Verkauf zahlen mehr als Detailhandel.",
      "Variable Anteile: Provisionen und Boni können den Lohn erheblich erhöhen.",
      "Führung: Filialleitung und Abteilungsleitung bringen einen deutlichen Lohnsprung.",
      "Arbeitgeber: Grosse Detailhändler haben eigene Mindestlöhne über dem Branchenschnitt.",
    ],
  },
  {
    slug: "bau-handwerk",
    keyword: "Handwerker und Bau",
    asPhrase: "im Handwerk und auf dem Bau",
    primary: "71",
    related: ["72", "73", "93"],
    intro:
      "Im Bauhauptgewerbe und in vielen Ausbaugewerben regeln Gesamtarbeitsverträge die Mindestlöhne. Mit Weiterbildung zum Polier, Vorarbeiter oder Bauführer steigt der Lohn klar über den Median.",
    examples: "Maurer, Zimmerleute, Maler, Sanitär- und Heizungsinstallateure, Plattenleger, Dachdecker.",
    factors: [
      "Gesamtarbeitsvertrag: Lohnklassen hängen von Ausbildung und Berufserfahrung ab.",
      "Funktion: Vorarbeiter, Polier und Bauführung werden deutlich besser bezahlt.",
      "Region: Die GAV sehen teils regionale Lohnzonen vor.",
      "Saison und Zulagen: Überstunden, Verpflegungs- und Wegzulagen erhöhen das Einkommen.",
    ],
  },
  {
    slug: "gastronomie",
    keyword: "Gastronomie",
    asPhrase: "in der Gastronomie",
    primary: "51",
    related: ["94", "14"],
    intro:
      "Für Köche, Servicemitarbeitende und weitere Berufe im Gastgewerbe gilt der Landes-Gesamtarbeitsvertrag mit Mindestlöhnen nach Ausbildung. Die Löhne liegen unter dem Schweizer Median; in Führungsfunktionen und in der Hotellerie gibt es mehr Spielraum.",
    examples: "Köchinnen und Köche, Servicefachleute, Coiffeure, weitere personenbezogene Dienstleistungen.",
    factors: [
      "L-GAV: Mindestlöhne nach Ausbildungsstufe (ohne Lehre, EFZ, Berufsprüfung).",
      "Funktion: Chef de Partie, Küchenchef und Restaurantleitung erhöhen den Lohn deutlich.",
      "Betriebsart: Hotellerie und Spitzengastronomie zahlen anders als Systemgastronomie.",
      "Trinkgeld und Zuschläge sind im Median nicht oder nur teilweise enthalten.",
    ],
  },
  {
    slug: "chauffeur-logistik",
    keyword: "Chauffeur und Logistik",
    asPhrase: "als Chauffeur oder in der Logistik",
    primary: "83",
    related: ["93", "82"],
    intro:
      "Berufschauffeure, Lokführerinnen und Fahrzeugführer bilden eine eigene Berufsgruppe. Mit Zusatzausweisen (z. B. Gefahrgut oder Kran) und in Spezialtransporten liegt der Lohn höher.",
    examples: "Lastwagen- und Busfahrer, Lokführer, Kranführer, Staplerfahrer, Logistikfahrer.",
    factors: [
      "Ausweiskategorien: C/CE, D und Zusatzausweise wie ADR erhöhen den Marktwert.",
      "Arbeitgeber: Öffentlicher Verkehr hat feste Lohnsysteme, private Transportfirmen variieren stärker.",
      "Arbeitszeiten: Nacht- und Wochenendarbeit sowie Spesen kommen dazu.",
      "Erfahrung und Zuverlässigkeit zählen bei Lohnverhandlungen mehr als Diplome.",
    ],
  },
  {
    slug: "fuehrungskraft",
    keyword: "Führungskraft",
    asPhrase: "als Führungskraft",
    primary: "1",
    related: ["11", "12", "13", "14"],
    intro:
      "Führungskräfte verdienen im Median am meisten aller Berufshauptgruppen. Die Bandbreite ist aber gross: Eine Geschäftsleitung in einem Grosskonzern ist nicht mit der Leitung eines Restaurants vergleichbar.",
    examples: "Geschäftsführung, kaufmännische Leitung, Leitung Produktion und Dienstleistungen, Filial- und Betriebsleitung.",
    factors: [
      "Führungsspanne: Anzahl Mitarbeitende und Budgetverantwortung sind die stärksten Treiber.",
      "Unternehmensgrösse: Grosse Unternehmen zahlen deutlich mehr als KMU.",
      "Variable Vergütung: Boni und Beteiligungen sind im Median nur teilweise enthalten.",
      "Branche: Finanz, Pharma und Beratung liegen über Gastgewerbe und Handel.",
    ],
  },
];

export const LSE_TOTAL = LSE_GROUPS.find((group) => group.code === "total") as LseGroup;

export function lseGroup(code: string) {
  return LSE_GROUPS.find((group) => group.code === code);
}

export function salaryJob(slug: string) {
  return SALARY_JOBS.find((job) => job.slug === slug);
}

/** Detail page for a BFS group, if one exists (used to link from the hub table). */
export function jobForGroup(code: string) {
  return SALARY_JOBS.find((job) => job.primary === code);
}

export function chf(value: number) {
  return `CHF ${value.toLocaleString("de-CH")}`;
}

export function salaryJobTitle(job: SalaryJob) {
  const median = lseGroup(job.primary)?.total?.v ?? 0;
  const long = `Lohn ${job.keyword} Schweiz: Median ${chf(median)}`;
  return long.length <= 60 ? long : `Lohn ${job.keyword}: Median ${chf(median)}`;
}
