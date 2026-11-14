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
  {
    slug: "pflegefachperson",
    keyword: "Pflegefachfrau / Pflegefachmann",
    asPhrase: "als Pflegefachfrau oder Pflegefachmann",
    primary: "22",
    related: ["32", "53"],
    intro:
      "Pflegefachpersonen HF und FH zählen in der Statistik zu den Spezialistinnen und Spezialisten in Gesundheitsberufen – zusammen mit Ärztinnen, Apothekern und Therapeutinnen. Der Median dieser Gruppe liegt deshalb höher als der typische Pflegelohn. Für Fachpersonen Gesundheit (FaGe) gilt die Gruppe der Assistenzberufe.",
    examples: "Pflegefachpersonen HF/FH, Hebammen, Ärztinnen und Ärzte, Apotheker, Physio- und Ergotherapeutinnen.",
    factors: [
      "Abschluss: HF und FH führen meist in die gleichen Lohnklassen, ein Master oder eine Fachexpertise hebt sie an.",
      "Spezialisierung: Intensiv-, Notfall- und Anästhesiepflege (NDS HF) werden höher eingestuft.",
      "Arbeitgeber: Kantonale Spitäler zahlen nach Lohnsystem, Heime und Spitex teils tiefer.",
      "Zulagen: Nacht-, Wochenend- und Pikettdienste kommen dazu, sind im Median aber nicht vollständig enthalten.",
    ],
  },
  {
    slug: "buchhalter",
    keyword: "Buchhalter",
    asPhrase: "als Buchhalterin oder Buchhalter",
    primary: "33",
    related: ["43", "24"],
    intro:
      "Buchhalterinnen und Buchhalter mit Fachausweis gehören statistisch zu den betriebswirtschaftlichen Fachkräften. Wer Buchungen ohne Weiterbildung erfasst, zählt zu den Bürokräften im Rechnungswesen und verdient im Median deutlich weniger.",
    examples: "Fachleute Finanz- und Rechnungswesen, Treuhänder, Direktionsassistenz, Verwaltungsfachleute, Einkauf.",
    factors: [
      "Weiterbildung: Der eidgenössische Fachausweis und das Diplom Experte Rechnungslegung und Controlling bringen die grössten Sprünge.",
      "Verantwortung: Abschlusserstellung, Konzernreporting und Teamleitung werden höher bezahlt als Kreditoren und Debitoren.",
      "Branche: Banken, Versicherungen und Pharma zahlen mehr als Gewerbe und Treuhand-KMU.",
      "Region: Zürich, Zug und Basel liegen über dem Schweizer Schnitt.",
    ],
  },
  {
    slug: "polymechaniker",
    keyword: "Polymechaniker",
    asPhrase: "als Polymechanikerin oder Polymechaniker",
    primary: "72",
    related: ["31", "81", "82"],
    intro:
      "Polymechanikerinnen, Mechaniker und andere Metallberufe sind das Rückgrat der Schweizer Maschinen-, Elektro- und Metallindustrie (MEM). Mit Weiterbildung zur Technikerin HF oder zum Produktionsleiter steigt der Lohn klar über den Median.",
    examples: "Polymechaniker, Produktionsmechanikerinnen, Konstrukteure, Anlagen- und Apparatebauer, Automobil-Mechatroniker.",
    factors: [
      "Branche: Pharma-, Medtech- und Uhrenindustrie zahlen mehr als Garagen und kleine Werkstätten.",
      "Weiterbildung: Techniker HF, Berufsprüfung oder ein Ingenieurstudium öffnen höhere Lohnklassen.",
      "Spezialisierung: CNC-Programmierung, Automation und Qualitätssicherung sind gefragt.",
      "Schicht: Schicht- und Pikettzulagen erhöhen das Einkommen.",
    ],
  },
  {
    slug: "fachperson-betreuung",
    keyword: "Fachperson Betreuung (FaBe)",
    asPhrase: "als Fachperson Betreuung",
    primary: "53",
    related: ["32", "34"],
    intro:
      "Fachpersonen Betreuung arbeiten in Kitas, Heimen und Institutionen für Menschen mit Beeinträchtigung. Die Löhne liegen unter dem Schweizer Median und unterscheiden sich stark zwischen öffentlichen und privaten Trägern.",
    examples: "Fachpersonen Betreuung Kinder, Betagte und Menschen mit Beeinträchtigung, Pflegehelferinnen, Assistenz Gesundheit und Soziales.",
    factors: [
      "Fachrichtung: Betagten- und Behindertenbetreuung zahlen oft mehr als Kinderbetreuung.",
      "Träger: Öffentliche Institutionen und Gemeinden zahlen meist nach Lohnsystem, private Kitas teils deutlich tiefer.",
      "Weiterbildung: Kindheitspädagogik HF oder Sozialpädagogik HF führen zu höheren Lohnklassen.",
      "Gruppenleitung: Leitungsfunktionen bringen einen spürbaren Lohnsprung.",
    ],
  },
  {
    slug: "jurist",
    keyword: "Jurist",
    asPhrase: "als Juristin oder Jurist",
    primary: "26",
    related: ["34", "24"],
    intro:
      "Juristinnen und Juristen bilden in der Statistik eine Gruppe mit Sozialwissenschaftlerinnen, Journalisten und Kulturberufen. Der Median gibt eine gute Orientierung, Anwältinnen in Wirtschaftskanzleien und Unternehmensjuristen liegen aber oft deutlich darüber.",
    examples: "Juristinnen, Anwälte, Richter, Sozialarbeiterinnen FH, Psychologen, Journalistinnen, Bibliothekare.",
    factors: [
      "Anwaltspatent: Mit Patent steigen Einstiegslohn und Perspektiven deutlich.",
      "Arbeitgeber: Grosskanzleien, Banken und Versicherungen zahlen mehr als Verwaltung und NGOs.",
      "Fachgebiet: Steuer-, Wirtschafts- und Finanzmarktrecht sind besonders gut bezahlt.",
      "Sprachen: Französisch und Englisch auf Verhandlungsniveau erhöhen den Marktwert.",
    ],
  },
  {
    slug: "betriebswirtschafter",
    keyword: "Betriebswirtschafter",
    asPhrase: "als Betriebswirtschafterin oder Betriebswirtschafter",
    primary: "24",
    related: ["12", "33"],
    intro:
      "In diese Gruppe fallen Spezialistinnen und Spezialisten in Finanzen, Personalwesen, Marketing und Unternehmensberatung, meist mit Hochschul- oder höherer Berufsbildung. Der Median liegt klar über dem Schnitt aller Berufe.",
    examples: "Controller, Finanzanalystinnen, HR-Fachleute, Marketing- und Kommunikationsfachleute, Unternehmensberater.",
    factors: [
      "Fachgebiet: Finanzen und Controlling zahlen mehr als Marketing und Kommunikation.",
      "Branche: Banken, Versicherungen, Pharma und Beratung liegen vorne.",
      "Abschluss: Ein Master oder ein CFA, CAS oder MAS stärkt die Verhandlungsposition.",
      "Führung: Mit Team- oder Bereichsleitung wechseln Sie in die Gruppe der Führungskräfte.",
    ],
  },
  {
    slug: "polizei-sicherheit",
    keyword: "Polizei und Sicherheit",
    asPhrase: "bei der Polizei und im Sicherheitsdienst",
    primary: "54",
    related: ["34", "83"],
    intro:
      "Polizistinnen, Feuerwehrleute, Grenzwächter und Sicherheitsangestellte bilden eine gemeinsame Berufsgruppe. Polizeikorps zahlen nach kantonalen oder städtischen Lohnsystemen, private Sicherheitsfirmen nach eigenem GAV – das erklärt die grosse Bandbreite.",
    examples: "Polizistinnen und Polizisten, Berufsfeuerwehr, Grenzwache, Justizvollzug, Sicherheitsangestellte.",
    factors: [
      "Arbeitgeber: Kantons- und Stadtpolizei zahlen deutlich mehr als private Sicherheitsdienste.",
      "Dienstjahre: Öffentliche Lohnsysteme steigen in festen Stufen.",
      "Zulagen: Nacht-, Wochenend- und Schichtzulagen machen einen grossen Teil des Einkommens aus.",
      "Spezialisierung: Kriminalpolizei, Spezialeinheiten und Kader werden höher eingestuft.",
    ],
  },
  {
    slug: "techniker-hf",
    keyword: "Techniker HF",
    asPhrase: "als Technikerin oder Techniker HF",
    primary: "31",
    related: ["21", "72"],
    intro:
      "Technikerinnen und Techniker HF, Zeichner und Laborantinnen gehören zu den ingenieurtechnischen Fachkräften. Mit einer höheren Fachschule liegt der Lohn spürbar über dem Median, aber unter dem von Ingenieurinnen mit Hochschulabschluss.",
    examples: "Techniker HF, Konstrukteurinnen, Bauzeichner, Laborantinnen, Prozessfachleute, Bauleiter.",
    factors: [
      "Fachrichtung: Elektrotechnik, Informatik und Verfahrenstechnik zahlen mehr als Holz- oder Bautechnik.",
      "Branche: Pharma, Energie und Maschinenindustrie liegen vorne.",
      "Projektleitung: Wer Projekte und Budgets führt, verdient deutlich mehr.",
      "Weiterbildung: Ein Nachdiplomstudium HF oder ein Bachelor FH erhöhen den Marktwert.",
    ],
  },
  {
    slug: "kundendienst",
    keyword: "Kundendienst",
    asPhrase: "im Kundendienst und am Empfang",
    primary: "42",
    related: ["41", "52"],
    intro:
      "Mitarbeitende im Kundendienst, im Callcenter, am Empfang oder am Bankschalter gehören zu den Bürokräften mit Kundenkontakt. Der Median liegt unter dem Schweizer Schnitt, mit Sprachen und Fachwissen lässt sich aber mehr erreichen.",
    examples: "Kundenberatung im Contact Center, Empfang und Réception, Bankschalter, Reisebüro, Telefonzentrale.",
    factors: [
      "Sprachen: Französisch, Italienisch oder Englisch sind oft Voraussetzung für höhere Stellen.",
      "Branche: Banken, Versicherungen und Telekom zahlen mehr als Hotellerie und Detailhandel.",
      "Fachwissen: Technischer Support und Second-Level-Support werden besser bezahlt.",
      "Teamleitung: Supervisor- und Teamleiterrollen bringen einen deutlichen Lohnsprung.",
    ],
  },
  {
    slug: "landwirt",
    keyword: "Landwirt und Gärtner",
    asPhrase: "in der Landwirtschaft und im Gartenbau",
    primary: "61",
    related: ["92", "75"],
    intro:
      "Angestellte Landwirtinnen, Gemüsegärtner und Landschaftsgärtnerinnen liegen unter dem Schweizer Median. Für die Landwirtschaft gibt es kantonale Normalarbeitsverträge, für den Gartenbau einen GAV mit Mindestlöhnen.",
    examples: "Landwirtinnen und Landwirte EFZ, Gemüse- und Obstgärtner, Landschaftsgärtnerinnen, Winzer, Tierpfleger.",
    factors: [
      "Fachrichtung: Garten- und Landschaftsbau zahlt meist mehr als Ackerbau und Tierhaltung.",
      "Weiterbildung: Berufsprüfung und Meisterprüfung führen zu Betriebsleitung und Ausbildung.",
      "Kost und Logis: In der Landwirtschaft ist oft ein Teil des Lohns in Naturalleistungen enthalten.",
      "Saison: Arbeitszeiten und Überstunden schwanken stark mit der Saison.",
    ],
  },
  {
    slug: "reinigungskraft",
    keyword: "Reinigungskraft",
    asPhrase: "in der Reinigung",
    primary: "91",
    related: ["94", "96"],
    intro:
      "Reinigungskräfte gehören zu den tiefsten Lohngruppen der Schweiz. In der Deutschschweiz gilt für Reinigungsfirmen ein allgemeinverbindlicher GAV mit Mindestlöhnen; in Kantonen mit Mindestlohn darf ohnehin nicht weniger bezahlt werden.",
    examples: "Gebäude- und Unterhaltsreinigung, Hauswartung, Raumpflege, Haushaltshilfen, Wäscherei.",
    factors: [
      "GAV und Mindestlohn: Gesetzliche und vertragliche Mindestlöhne bilden die Untergrenze.",
      "Ausbildung: Mit EFZ als Gebäudereiniger oder Fachmann Betriebsunterhalt liegen Sie höher.",
      "Spezialreinigung: Reinraum-, Spital- und Fassadenreinigung werden besser bezahlt.",
      "Vorarbeit: Objektleitung und Teamführung erhöhen den Lohn.",
    ],
  },
  {
    slug: "produktionsmitarbeiter",
    keyword: "Produktionsmitarbeiter",
    asPhrase: "in der Produktion",
    primary: "81",
    related: ["82", "93", "72"],
    intro:
      "Produktionsmitarbeitende bedienen Anlagen und Maschinen in Chemie, Kunststoff, Lebensmittel, Papier oder Metall. Ohne Berufsabschluss liegen die Löhne unter dem Median, mit Fachwissen und Schichtzulagen kann es deutlich mehr werden.",
    examples: "Anlagenführer, Maschinenbedienerinnen, Chemie- und Pharmaproduktion, Kunststoff- und Verpackungsanlagen.",
    factors: [
      "Branche: Chemie und Pharma zahlen klar mehr als Lebensmittel- und Textilproduktion.",
      "Schichtarbeit: Nacht- und Wochenendzulagen machen oft 10 % und mehr aus.",
      "Ausbildung: Ein EFZ als Anlagen- und Apparatebauer oder Chemie- und Pharmatechnologe öffnet höhere Stufen.",
      "Verantwortung: Linien- und Schichtleitung werden deutlich besser bezahlt.",
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
