# SEO-Plan cvolution.ch

Stand: 13.11.2026 · Branch `seo-improvements` · Ziel 90 Tage: Google-Besucher von ca. 170 auf 600+/Monat, Non-Brand > 200/Monat, Warenkorb → Bestätigung > 50 %.

Dieses Dokument begleitet den Code im Branch. Alles, was als «umgesetzt» markiert ist, liegt bereits im Branch; alles andere ist ein Vorschlag mit fertigem Text.

---

## 0. Ausgangslage (Vercel Analytics, 14.10.–13.11.2026)

| Quelle | Besucher |
|---|---|
| LinkedIn (linkedin.com, App, lnkd.in) | 1'352 |
| Direkt / ohne Referrer | 778 |
| Google | 173 |
| Saferpay (Rückkehr nach Zahlung) | 50 |
| Bing, DuckDuckGo, Yahoo | 15 |

Google-Einstiege nach Seite: `/` 95, `/team` 29, `/service-salary` 15, alle Ratgeber zusammen 31. Das bestätigt: Google bringt fast nur Markensuchen («cvolution», Namen des Teams). Non-Brand ist heute praktisch null.

### Annahmen und was ich nicht prüfen konnte

- **Live-Site und Supabase waren aus der Sandbox nicht erreichbar.** Der Crawl lief gegen einen lokalen Production-Build desselben Codes. Abweichungen durch Vercel-Konfiguration (Redirects, Domains, Header) sind nicht erfasst.
- **Blogartikel** liegen in Supabase. Ich kenne nur die Slugs aus Vercel Analytics, nicht Inhalt und Titel. Die Blog-Vorschläge in Abschnitt D4 beruhen auf den Slugs.
- **Suchvolumen** stammen nicht aus einem Keyword-Tool (kein Zugang). «Potenzial» ist eine Einschätzung aus Suchintention, Kaufnähe und heutiger Position. Nach dem Search-Console-Setup mit echten Impressionen ersetzen.
- **Lieferfristen:** Nur «PDF innerhalb von 2 Arbeitstagen» (Lohnanalyse) steht im Code. Für alle anderen Services habe ich keine Fristen versprochen. Bitte FAQ-Texte fachlich gegenlesen (v. a. RAV, Check, Laufbahnberatung).
- **Das Hero-Bild ist 1672 px breit, nicht 3840 px.** Die 3840 kam aus dem `srcset` von next/image: Bei `quality={100}` hat Next.js das Original für die 2048- und 3840-Breiten in voller Qualität neu kodiert.
- **«/data» ist die Datenschutzerklärung.** Sie steht wie gewünscht auf noindex. Das ist üblich und schadet nicht, solange sie verlinkt bleibt (Footer).
- **Custom Events** (Funnel-Tracking) in Vercel Web Analytics brauchen den Pro-Plan.
- **Supabase-Key im Code:** `src/lib/public-blog.ts` enthält den öffentlichen Anon-Key. Das ist so vorgesehen, setzt aber korrekte RLS-Policies voraus. Nicht Teil dieses Auftrags, nur als Hinweis.

---

## A. Audit

Crawl aller öffentlichen Seiten (Sitemap + Nicht-Content-Seiten), Desktop 1440 px bei 2× Pixeldichte. «Interne Links rein» zählt nur Links im Seiteninhalt, nicht in Navigation und Footer. «Wörter» ohne Navigation und Footer. Sortiert nach Traffic-Potenzial, dann nach heutigen Besuchern.

| # | Seite | Potenzial | Besucher 30 T. (davon Google) | Title vorher → nachher | Description | H1 vorher → nachher | Canonical | Index | Wörter | Interne Links rein (Body) | Links raus | Bilder (KB, 2x) | JSON-LD nachher |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/service-salary` | Sehr hoch | 1173 (15) | CVolution GmbH → **Lohnanalyse erstellen lassen ab CHF 69 \| CVolution** | generisch → 150 Z. | Wissen, wo Ihr Lohn im Markt steht. → **Lohnanalyse Schweiz: Wissen, wo Ihr Lohn im Markt steht.** | nein → ja | index → index | 160 → 588 | 4 → 4 | 4 | 158 → 11 | Org/LocalBusiness, Service, BreadcrumbList, FAQPage |
| 2 | `/` | Sehr hoch | 368 (95) | CVolution GmbH → **Bewerbungsservice Schweiz: Lebenslauf & Lohnanalyse** | 36 Z. → 144 Z. | Unsere Bewerbung, deine Entwicklung! → **Bewerbungsservice Schweiz: Lebenslauf, Lohnanalyse & Laufbahnberatung** | nein → ja | index → index | 225 → 348 | 2 → 2 | 27 | 651 → 73 | Org/LocalBusiness |
| 3 | `/service-cv` | Hoch | 230 (3) | CVolution GmbH → **Lebenslauf schreiben lassen: CHF 99 \| CVolution** | generisch → 155 Z. | Ein Lebenslauf, der sofort Orientierung gibt. → **Lebenslauf schreiben lassen – klar, professionell, nach Schweizer Stan** | nein → ja | index → index | 170 → 353 | 13 → 7 | 6 | 156 → 10 | Org/LocalBusiness, Service, BreadcrumbList, FAQPage |
| 4 | `/lebenslauf-beispiel` | Hoch | 13 (5) | Lebenslauf Beispiel Schweiz 2026 \| Vollständige Muster für alle Berufe → **Lebenslauf Beispiel Schweiz: 3 Muster für jede Stufe** | 163 Z. → 148 Z. | Lebenslauf Beispiel Schweiz – Vollständige Muster für alle K → **Lebenslauf Beispiel Schweiz – Vollständige Muster für alle Karrierestu** | ja → ja | index → index | 444 → 835 | 1 → 3 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 5 | `/lebenslauf-vorlage-schweiz` | Hoch | 12 (6) | Lebenslauf Vorlage Schweiz 2026 \| Kostenlose Muster & Tipps → **Lebenslauf Vorlage Schweiz 2026: Muster & Tipps** | 159 Z. → 143 Z. | Lebenslauf Vorlage Schweiz: Professionelle Muster für den Sc → **Lebenslauf Vorlage Schweiz: Professionelle Muster für den Schweizer Ar** | ja → ja | index → index | 574 → 582 | 8 → 11 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 6 | `/lohnanalyse-schweiz` | Hoch | 7 (6) | Lohnanalyse Schweiz 2026 \| Ihren Marktwert kennen und nutzen → **Lohnanalyse Schweiz: Ist Ihr Lohn fair? So prüfen Sie es** | 165 Z. → 137 Z. | Lohnanalyse Schweiz – Ihren Marktwert kennen und einsetzen → **Lohnanalyse Schweiz: So prüfen Sie selbst, ob Ihr Lohn fair ist** | ja → ja | index → index | 724 → 807 | 1 → 3 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 7 | `/bewerbung-vorlage-schweiz` | Hoch | 5 (3) | Bewerbung Vorlage Schweiz 2026 \| Kostenlose Muster & Tipps → **Bewerbung Vorlage Schweiz: Kostenlose Muster 2026** | 173 Z. → 149 Z. | Bewerbung Vorlage Schweiz – Vollständige Muster und Anleitun → **Bewerbung Vorlage Schweiz – Vollständige Muster und Anleitungen** | ja → ja | index → index | 458 → 466 | 0 → 3 | 4 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 8 | `/bewerbungsgespraech-tipps` | Hoch | 4 (0) | Bewerbungsgespräch Tipps Schweiz 2026 \| Vorbereitung & häufige Fragen → **Bewerbungsgespräch Tipps: Fragen & Antworten 2026** | 167 Z. → 149 Z. | Bewerbungsgespräch Tipps: Optimal vorbereitet für das Interv → **Bewerbungsgespräch Tipps: Optimal vorbereitet für das Interview in der** | ja → ja | index → index | 729 → 743 | 5 → 8 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 9 | `/lohn-verhandeln-schweiz` | Hoch | 4 (2) | Lohn verhandeln Schweiz 2026 \| Tipps für mehr Gehalt → **Lohn verhandeln Schweiz: Tipps & Formulierungen 2026** | 181 Z. → 145 Z. | Lohn verhandeln in der Schweiz – Strategien, Tipps und Formu → **Lohn verhandeln in der Schweiz – Strategien, Tipps und Formulierungen** | ja → ja | index → index | 826 → 838 | 2 → 4 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 10 | `/bewerbung-schreiben` | Hoch | 1 (0) | Bewerbung schreiben Schweiz 2026 \| Vollständige Anleitung → **Bewerbung schreiben Schweiz: Die komplette Anleitung** | 173 Z. → 150 Z. | Bewerbung schreiben in der Schweiz: Die vollständige Anleitu → **Bewerbung schreiben in der Schweiz: Die vollständige Anleitung 2026** | ja → ja | index → index | 739 → 752 | 7 → 11 | 4 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 11 | `/motivationsschreiben-tipps` | Hoch | 0 (0) | Motivationsschreiben Tipps Schweiz 2026 \| So überzeugen Sie Arbeitgeber → **Motivationsschreiben Tipps Schweiz: So überzeugen Sie** | 152 Z. → 155 Z. | Motivationsschreiben Tipps: So überzeugen Sie Schweizer Arbe → **Motivationsschreiben Tipps: So überzeugen Sie Schweizer Arbeitgeber** | ja → ja | index → index | 737 → 748 | 1 → 4 | 4 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 12 | `/service` | Mittel | 455 (5) | CVolution GmbH → **Bewerbungsservice: Alle Angebote & Preise \| CVolution** | generisch → 146 Z. | Das passende Paket für Ihren nächsten Karriereschritt. → **Bewerbungsservice: das passende Paket für Ihren nächsten Karriereschri** | nein → ja | index → index | 201 → 202 | 19 → 19 | 9 | 173 → 21 | Org/LocalBusiness |
| 13 | `/self` | Mittel | 120 (0) | CVolution GmbH → **Bewerbung mit KI erstellen \| Self-Service CHF 13.90** | generisch → 149 Z. | Von der Stellenanzeige zur fertigen Bewerbung → **Von der Stellenanzeige zur fertigen Bewerbung** | nein → ja | index → index | 263 → 263 | 2 → 3 | 2 | 505 → 88 | Org/LocalBusiness |
| 14 | `/service-career` | Mittel | 93 (3) | CVolution GmbH → **Laufbahnberatung Schweiz \| CHF 149 pro Stunde** | generisch → 154 Z. | Mehr Klarheit für Ihren beruflichen Weg. → **Laufbahnberatung: mehr Klarheit für Ihren beruflichen Weg** | nein → ja | index → index | 148 → 272 | 3 → 5 | 3 | 157 → 10 | Org/LocalBusiness, Service, BreadcrumbList, FAQPage |
| 15 | `/service-check` | Mittel | 38 (4) | CVolution GmbH → **Bewerbungsdossier-Check ab CHF 59 \| CVolution** | generisch → 155 Z. | Konkretes Feedback für bessere Unterlagen. → **Bewerbungsdossier-Check: konkretes Feedback für bessere Unterlagen** | nein → ja | index → index | 114 → 225 | 2 → 4 | 3 | 156 → 10 | Org/LocalBusiness, Service, BreadcrumbList, FAQPage |
| 16 | `/service-linkedin` | Mittel | 29 (1) | CVolution GmbH → **LinkedIn-Profil optimieren lassen \| CHF 149** | generisch → 147 Z. | Ein LinkedIn-Profil, das Recruiter schneller überzeugt. → **LinkedIn-Profil optimieren lassen – damit Recruiter Sie finden** | nein → ja | index → index | 134 → 251 | 2 → 2 | 3 | 157 → 10 | Org/LocalBusiness, Service, BreadcrumbList, FAQPage |
| 17 | `/service-motivation` | Mittel | 20 (0) | CVolution GmbH → **Motivationsschreiben schreiben lassen \| CHF 99** | generisch → 145 Z. | Ein Schreiben, das nach Ihnen klingt. → **Motivationsschreiben schreiben lassen – passend zur Stelle, authentisc** | nein → ja | index → index | 149 → 292 | 3 → 4 | 3 | 157 → 10 | Org/LocalBusiness, Service, BreadcrumbList, FAQPage |
| 18 | `/service-rav` | Mittel | 16 (0) | CVolution GmbH → **RAV-Unterstützung: Bewerbungen & Nachweise \| CVolution** | generisch → 143 Z. | Sicher durch Anforderungen und Nachweise. → **RAV-Unterstützung: Bewerbungen und Nachweise sicher erfüllen** | nein → ja | index → index | 150 → 259 | 3 → 3 | 3 | 157 → 10 | Org/LocalBusiness, Service, BreadcrumbList, FAQPage |
| 19 | `/service-downloads` | Mittel | 6 (0) | Downloads: Masterprompts und Lebenslauf-Vorlagen \| CVolution → **Lebenslauf-Vorlagen Word & KI-Prompts \| ab CHF 19.90** | 133 Z. → 153 Z. | Unsere Vorlagen für Ihre Bewerbung, sofort verfügbar. → **Lebenslauf-Vorlagen für Word und KI-Prompts für Ihr Motivationsschreib** | nein → ja | index → index | 210 → 232 | 2 → 2 | 3 | 230 → 74 | Org/LocalBusiness, Service |
| 20 | `/lebenslauf-aufbau` | Mittel | 6 (0) | Lebenslauf Aufbau Schweiz 2026 \| Struktur & Gliederung erklärt → **Lebenslauf Aufbau Schweiz: Gliederung Schritt für Schritt** | 149 Z. → 136 Z. | Lebenslauf Aufbau: Die richtige Gliederung für den Schweizer → **Lebenslauf Aufbau: Die richtige Gliederung für den Schweizer Arbeitsma** | ja → ja | index → index | 620 → 627 | 6 → 9 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 21 | `/lebenslauf-fehler` | Mittel | 5 (0) | Lebenslauf Fehler vermeiden 2026 \| Die 15 häufigsten Schwachstellen → **Lebenslauf-Fehler: 15 Fehler, die Absagen kosten** | 176 Z. → 145 Z. | Lebenslauf-Fehler: Die 15 häufigsten Schwachstellen im Schwe → **Lebenslauf-Fehler: Die 15 häufigsten Schwachstellen im Schweizer CV** | ja → ja | index → index | 621 → 634 | 4 → 7 | 4 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 22 | `/lebenslauf-student` | Mittel | 3 (3) | Lebenslauf Student Schweiz 2026 \| Vorlage & Tipps ohne viel Erfahrung → **Lebenslauf Student Schweiz: Muster ohne Erfahrung** | 161 Z. → 152 Z. | Lebenslauf als Student – Überzeugend auch ohne viel Berufser → **Lebenslauf als Student – Überzeugend auch ohne viel Berufserfahrung** | ja → ja | index → index | 550 → 561 | 0 → 2 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 23 | `/lebenslauf-format-schweiz` | Mittel | 2 (0) | Lebenslauf Format Schweiz 2026 \| Layout, Länge und Gestaltung → **Lebenslauf Format Schweiz: Länge, Layout & Foto** | 159 Z. → 140 Z. | Lebenslauf Format Schweiz – Layout, Länge und Gestaltung ric → **Lebenslauf Format Schweiz – Layout, Länge und Gestaltung richtig wähle** | ja → ja | index → index | 504 → 515 | 0 → 2 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 24 | `/rav-bewerbung-tipps` | Mittel | 1 (0) | RAV Bewerbung Tipps Schweiz 2026 \| Anforderungen & Vorgehen → **RAV Bewerbung: Arbeitsbemühungen richtig nachweisen** | 155 Z. → 146 Z. | RAV Bewerbung Tipps – Anforderungen erfüllen und gezielt suc → **RAV Bewerbung Tipps – Anforderungen erfüllen und gezielt suchen** | ja → ja | index → index | 665 → 674 | 1 → 3 | 4 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 25 | `/lebenslauf-quereinsteiger` | Mittel | 0 (0) | Lebenslauf Quereinsteiger Schweiz 2026 \| Tipps & Vorlage → **Lebenslauf Quereinsteiger Schweiz: Tipps & Vorlage** | 164 Z. → 142 Z. | Lebenslauf als Quereinsteiger – So überzeugen Sie trotz Bran → **Lebenslauf als Quereinsteiger – So überzeugen Sie trotz Branchenwechse** | ja → ja | index → index | 568 → 579 | 0 → 2 | 4 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 26 | `/bewerbung-schweiz` | Mittel | 0 (0) | Bewerbung Schweiz 2026 \| Alles über den Schweizer Bewerbungsprozess → **Bewerbung Schweiz: Dossier, Ablauf & Tipps 2026** | 187 Z. → 140 Z. | Bewerbung in der Schweiz: Was Sie über den Schweizer Arbeits → **Bewerbung in der Schweiz: Was Sie über den Schweizer Arbeitsmarkt wiss** | ja → ja | index → index | 547 → 560 | 5 → 8 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 27 | `/bewerbung-nach-kuendigung` | Mittel | 0 (0) | Bewerbung nach Kündigung Schweiz 2026 \| Tipps & Strategien → **Bewerbung nach Kündigung: So erklären Sie den Wechsel** | 177 Z. → 150 Z. | Bewerbung nach einer Kündigung – Strategien für die Jobsuche → **Bewerbung nach einer Kündigung – Strategien für die Jobsuche in der Sc** | ja → ja | index → index | 703 → 714 | 0 → 4 | 5 | 155 → 9 | Org/LocalBusiness, Article, BreadcrumbList, FAQPage |
| 28 | `/team` | Niedrig (Marke) | 141 (29) | CVolution GmbH → **Team \| Ihre Ansprechpartner bei CVolution** | generisch → 152 Z. | Das Team hinter CVolution → **Das Team hinter CVolution** | nein → ja | index → index | 36 → 36 | 0 → 0 | 0 | 240 → 68 | Org/LocalBusiness |
| 29 | `/about` | Niedrig (Marke) | 90 (2) | Über uns → **Über CVolution \| Recruiting-Erfahrung für Ihre Bewerbung** | generisch → 146 Z. | Bewerbungen, die klar zeigen, wer Sie sind. → **Bewerbungen, die klar zeigen, wer Sie sind.** | nein → ja | index → index | 175 → 175 | 0 → 0 | 0 | 419 → 49 | Org/LocalBusiness |
| 30 | `/contact` | Niedrig (Marke) | 41 (2) | CVolution GmbH → **Kontakt \| CVolution Bewerbungsservice Oberentfelden** | generisch → 150 Z. | Kontaktieren Sie uns → **Kontaktieren Sie uns** | nein → ja | index → index | 18 → 18 | 0 → 0 | 1 | 155 → 9 | Org/LocalBusiness |
| 31 | `/blog` | Niedrig | 31 (0) | Blog \| CVolution → **Karriere-Blog Schweiz: Bewerbung, Lohn & Jobsuche** | 102 Z. → 134 Z. | Karriere aus erster Hand → **Karriere aus erster Hand** | nein → ja | index → index | 32 → 32 | 0 → 1 | 0 | 155 → 9 | Org/LocalBusiness |
| 32 | `/impressum` | Keins | 10 (0) | CVolution GmbH → **Impressum \| CVolution GmbH** | generisch → 110 Z. | Impressum → **Impressum** | nein → ja | index → index | 172 → 172 | 0 → 0 | 0 | 155 → 9 | Org/LocalBusiness |
| 33 | `/agb` | Keins | 9 (0) | CVolution GmbH → **AGB \| CVolution GmbH** | generisch → 120 Z. | Allgemeine Geschäftsbedingungen (AGB) → **Allgemeine Geschäftsbedingungen (AGB)** | nein → ja | index → index | 485 → 485 | 1 → 1 | 0 | 155 → 9 | Org/LocalBusiness |
| 34 | `/cart` | – (noindex) | 152 (3) | CVolution GmbH → **Warenkorb \| CVolution** | generisch → – | Warenkorb → **Warenkorb** | nein → – | index → noindex, follow | 15 → 15 | 0 → 0 | 1 | 155 → 9 | Org/LocalBusiness |
| 35 | `/confirmation` | – (noindex) | 55 (0) | CVolution GmbH → **Bestellbestätigung \| CVolution** | generisch → – | Vielen Dank für Ihre Bestellung! → **Vielen Dank für Ihre Bestellung!** | nein → – | index → noindex, follow | 26 → 26 | 0 → 0 | 1 | 155 → 9 | Org/LocalBusiness |
| 36 | `/self/login` | – (noindex) | 31 (0) | CVolution GmbH → **Self-Service Login \| CVolution** | generisch → – | fehlt → **fehlt** | nein → – | index → noindex, follow | 23 → 23 | 1 → 1 | 0 | 155 → 9 | Org/LocalBusiness |
| 37 | `/data` | – (noindex) | 2 (0) | CVolution GmbH → **Datenschutzerklärung \| CVolution** | generisch → – | Datenschutzerklärung → **Datenschutzerklärung** | nein → – | index → noindex, follow | 570 → 570 | 0 → 0 | 0 | 155 → 9 | Org/LocalBusiness |
| 38 | `/service-salary-tel` | – (noindex) | 1 (0) | CVolution GmbH → **Lohnanalyse mit Gespräch bestellen \| CVolution** | generisch → – | fehlt → **fehlt** | nein → – | index → noindex, follow | 42 → 42 | 0 → 0 | 0 | 0 → 0 | Org/LocalBusiness |
| 39 | `/service-salary-pdf` | – (noindex) | 0 (0) | CVolution GmbH → **Lohnanalyse als PDF bestellen \| CVolution** | generisch → – | fehlt → **fehlt** | nein → – | index → noindex, follow | 42 → 42 | 0 → 0 | 0 | 0 → 0 | Org/LocalBusiness |

**Wichtigste Befunde vorher:**

1. 16 von 17 Nicht-Ratgeber-Seiten hatten Title «CVolution GmbH» und dieselbe Description. Google konnte sie nicht unterscheiden.
2. Kein Canonical ausserhalb der Ratgeber, `<html lang="en">` auf einer deutschsprachigen Seite.
3. Kein Organization-, LocalBusiness- oder Service-Markup. FAQ-Markup der Ratgeber wurde per `next/script` erst nach der Hydration eingefügt.
4. Das Logo (1086 px, 158 KB) wurde auf jeder Seite zweimal in voller Grösse geladen. Startseite: 651 KB Bilder, davon Teamfotos mit `fill` ohne `sizes` (bis 1.6 MB Original).
5. Ratgeber wie `/lebenslauf-format-schweiz`, `/lebenslauf-student`, `/lebenslauf-quereinsteiger` und `/bewerbung-nach-kuendigung` hatten **null** Body-Links von anderen Seiten (nur Footer).
6. Service-Seiten mit 114–170 Wörtern: zu dünn, um für «Lebenslauf schreiben lassen» o. ä. zu ranken.
7. Ratgeber-Titles 52–71 Zeichen, mehrere in den SERPs abgeschnitten. Descriptions 155–197 Zeichen.

### ✅ Checkliste A

- [x] Crawl vorher/nachher (`scripts`: Crawler im Sandbox-Scratchpad, Ergebnis oben)
- [ ] Nach Deployment: Live-Crawl mit Screaming Frog (kostenlos bis 500 URLs) gegen `https://cvolution.ch` und mit der Tabelle vergleichen
- [ ] Nach 4 Wochen: Spalte «Potenzial» durch echte Impressionen aus Search Console ersetzen

---

## B. Metadata

**Umgesetzt.** Alle Titles und Descriptions stehen zentral in `src/lib/seo-pages.ts` (`PAGE_META`). Jede Route exportiert sie mit einer Zeile:

```ts
import { metaFor } from "@/lib/seo-pages";
export const metadata = metaFor("/service-cv");
```

`metaFor` erzeugt Title (absolut, ohne Template-Suffix), Description, Canonical, Open Graph (`de_CH`) und Twitter Card. Client-Seiten (`/contact`, `/team`, `/agb`, `/impressum`, `/service`) bekommen die Metadaten über eine `layout.tsx` im Ordner.

Prüfen nach jeder Änderung:

```bash
cd cvolution && node scripts/check-seo-meta.mjs
# 33 pages checked, 0 problems  (Title ≤ 60, Description ≤ 155, kein ß, keine Duplikate)
```

| Seite | Title (Zeichen) | Description (Zeichen) |
|---|---|---|
| `/` | Bewerbungsservice Schweiz: Lebenslauf & Lohnanalyse (51) | Lebenslauf, Motivationsschreiben, Lohnanalyse und Laufbahnberatung von Recruiting-Profis. Ab CHF 59 – oder Self-Service für CHF 13.90 pro Monat. (144) |
| `/service-salary` | Lohnanalyse erstellen lassen ab CHF 69 \| CVolution (50) | Ist Ihr Lohn marktgerecht? Persönliche Lohnanalyse mit Branchen- und Kantonsvergleich: als PDF in 2 Arbeitstagen (CHF 69) oder mit Gespräch (CHF 119). (150) |
| `/service-cv` | Lebenslauf schreiben lassen: CHF 99 \| CVolution (47) | Professioneller Lebenslauf nach Schweizer Standard: Wir analysieren Ihre Laufbahn, schärfen Ihr Profil und gestalten das Dokument. CHF 99, jetzt bestellen. (155) |
| `/service-motivation` | Motivationsschreiben schreiben lassen \| CHF 99 (46) | Ein Motivationsschreiben, das zur Stelle passt und nach Ihnen klingt – formuliert von Recruiting-Profis aus der Schweiz. CHF 99, jetzt bestellen. (145) |
| `/service-career` | Laufbahnberatung Schweiz \| CHF 149 pro Stunde (45) | Neuorientierung, Weiterbildung oder nächster Karriereschritt: Laufbahnberatung mit über 10 Jahren Recruiting-Erfahrung. CHF 149 pro Stunde – jetzt buchen. (154) |
| `/service-check` | Bewerbungsdossier-Check ab CHF 59 \| CVolution (45) | Wir prüfen Lebenslauf, Motivationsschreiben und Zeugnisse auf Inhalt, Aufbau und Wirkung und zeigen konkrete Verbesserungen. Ab CHF 59 – Dossier hochladen. (155) |
| `/service-linkedin` | LinkedIn-Profil optimieren lassen \| CHF 149 (43) | Mehr Anfragen von Recruitern: Wir schärfen Headline, Info-Text und Erfahrungen Ihres LinkedIn-Profils für die Stellensuche in der Schweiz. CHF 149. (147) |
| `/service-rav` | RAV-Unterstützung: Bewerbungen & Nachweise \| CVolution (54) | Hilfe bei RAV-Bewerbungen, Arbeitsbemühungen und Unterlagen – damit Sie die Vorgaben erfüllen und schneller eine neue Stelle finden. Ab CHF 99. (143) |
| `/service-downloads` | Lebenslauf-Vorlagen Word & KI-Prompts \| ab CHF 19.90 (52) | Lebenslauf-Vorlagen für Word nach Schweizer Standard und Masterprompts für Ihr Motivationsschreiben mit KI. CHF 19.90 pro Dokument, alle 5 für CHF 49.90. (153) |
| `/service` | Bewerbungsservice: Alle Angebote & Preise \| CVolution (53) | Lohnanalyse ab CHF 69, Lebenslauf und Motivationsschreiben ab CHF 99, Dossier-Check ab CHF 59, Laufbahnberatung CHF 149/Std. Jetzt Angebot wählen. (146) |
| `/self` | Bewerbung mit KI erstellen \| Self-Service CHF 13.90 (51) | Lebenslauf erfassen, Stelle einfügen, Motivationsschreiben mit KI erstellen und Bewerbungen verfolgen – alles in einem Tool. Für CHF 13.90 pro Monat. (149) |
| Ratgeber, About, Team, Kontakt, Blog, AGB, Impressum | siehe `src/lib/seo-pages.ts` | alle ≤ 155 |

Blogartikel: `generateMetadata` setzt jetzt Canonical und Open Graph. Der Title lautet «Titel \| CVolution», wenn das unter 60 Zeichen bleibt, sonst nur der Titel. Die Description ist der Excerpt, gekürzt auf 155 Zeichen. **Gute Blog-Titles entstehen also im Admin-Panel** (siehe D4).

### ✅ Checkliste B

- [x] 33 Seiten mit eindeutigem Title/Description, Checker grün
- [ ] Nach Deployment: `view-source:https://cvolution.ch/service-salary` → `<title>`, `<meta name="description">`, `<link rel="canonical">` vorhanden
- [ ] Search Console → Seiten → «Duplikat – Google hat eine andere kanonische Seite gewählt» sollte nach 2–4 Wochen leer sein

---

## C. Technical SEO

### C1 Noindex — umgesetzt

`noindex, follow` via `layout.tsx` bzw. Page-Metadata für: `/cart`, `/confirmation`, `/data`, `/self/login`, `/service-salary-pdf`, `/service-salary-tel`, `/admin`, `/dashboard`. `/downloads/[token]` war bereits noindex.

Wichtig: Diese Seiten sind in `robots.txt` **nicht** gesperrt. Google muss sie crawlen dürfen, um das noindex zu sehen. Gesperrt bleiben nur `/admin`, `/dashboard`, `/api/` und `/downloads/` (private Token-Links).

### C2 Canonicals — umgesetzt

Jede indexierbare Seite hat ein absolutes Canonical auf `https://cvolution.ch/...` (ohne Slash am Ende, ohne www). **Bitte in Vercel prüfen:** `www.cvolution.ch` muss per 308 auf `cvolution.ch` umleiten (Project → Settings → Domains).

### C3 sitemap.xml und robots.txt — umgesetzt

- `src/app/sitemap.ts` baut die Liste aus `PAGE_META` (33 Seiten) plus alle veröffentlichten Blogartikel aus Supabase, mit `lastModified` aus `updated_at`. Revalidierung stündlich, damit neue Artikel ohne Deploy erscheinen.
- `src/app/robots.ts`: siehe C1, mit `Sitemap:`-Zeile.
- Neue Seiten erscheinen automatisch in der Sitemap, sobald sie in `PAGE_META` eingetragen sind.

### C4 Strukturierte Daten — umgesetzt

| Typ | Wo | Datei |
|---|---|---|
| Organization + ProfessionalService (LocalBusiness, Ausserfeldstrasse 9, 5036 Oberentfelden) + WebSite | jede Seite | `src/app/layout.tsx`, `organizationSchema()` |
| Service mit Offers (CHF) + BreadcrumbList | alle Service-Seiten | `ServiceDetailPage.tsx`, `service-salary/page.tsx`, `service-downloads/page.tsx` |
| FAQPage | Service-Seiten, `/service-salary`, alle Ratgeber | `FaqSection.tsx`, `GuideSchema.tsx` |
| Article + BreadcrumbList | alle 16 Ratgeber, alle Blogartikel | `GuideSchema.tsx`, `blog/[slug]/page.tsx` |

Alles wird als `<script type="application/ld+json">` im Server-HTML ausgeliefert (vorher `next/script`, also erst nach dem JavaScript).

`ProfessionalService` ist der LocalBusiness-Untertyp für Dienstleister. Bei Öffnungszeiten oder Geokoordinaten bitte in `src/lib/seo.ts` → `BUSINESS` ergänzen (`openingHoursSpecification`, `geo`). Ich habe sie nicht erfunden.

Hinweis: FAQ-Rich-Results zeigt Google seit 2023 nur noch für Behörden- und Gesundheitsseiten. Das Markup hilft trotzdem beim Verständnis der Seite und bei KI-Antworten (AI Overviews). Erwarten Sie keine aufklappbaren FAQs in den Suchergebnissen.

### C5 Bilder und Core Web Vitals — umgesetzt

| Massnahme | Vorher | Nachher |
|---|---|---|
| Hero `hero2.png` (LCP-Element der Startseite) | q100, WebP, bis 3840 w → ca. 245 KB bei 2× | q75, **AVIF** 1920 w → **34 KB** |
| Team-Hintergrund | q100 → ca. 200 KB | q75 AVIF → 13 KB |
| Teamfotos (`fill` ohne `sizes`) | Breite = Viewport, Originale bis 1.6 MB | `sizes` 96/144 px → 3 KB je Foto |
| Logo Navbar + Footer | 158 KB PNG (1086×230) | 9 KB (`logo-header.png`, 340×72) |
| Self-Service Design-Vorschauen | 3 × 120 KB PNG via `<img>` | next/image, responsiv |
| Bilder gesamt Startseite (2×) | **651 KB** | **73 KB** |
| Bilder Ratgeber / Service-Seiten | 155–158 KB | 9–11 KB |
| `next.config.ts` | WebP, Breiten bis 3840 | AVIF + WebP, Breiten bis 1920, Cache 30 Tage |

`priority` liegt nur noch auf dem Hero (Startseite) und den Icons im sichtbaren Bereich der Service-Seiten.

**Erwartete Core-Web-Vitals-Effekte** (Schätzung, nicht gemessen, da die Live-Site nicht erreichbar war):

- **LCP Startseite mobil:** Das LCP-Bild wird ca. 7× kleiner. Auf 4G (ca. 1.6 Mbit/s im Lighthouse-Profil) entspricht das ca. 1.0–1.2 s weniger Download. Erwartung: LCP von geschätzt 3–4 s auf unter 2.5 s («gut»).
- **LCP Ratgeber/Service:** Dort war das 158-KB-Logo das grösste frühe Bild. Erwartung: 0.3–0.6 s besser.
- **CLS:** Logo hat jetzt `width`/`height` → kein Layout-Sprung in der Navbar.
- **INP:** Startseite und `/service-salary` sind keine Client-Komponenten mehr (vorher `"use client"` ohne Grund). Weniger JavaScript bei der Hydration.

Messen nach Deployment: PageSpeed Insights für `/`, `/service-salary`, `/lebenslauf-beispiel` (mobil), Werte hier eintragen. Felddaten (CrUX) erscheinen erst bei genug Traffic, also vorerst Labordaten verwenden.

### ✅ Checkliste C

- [x] noindex auf 8 Routen, robots.txt korrekt, Sitemap mit 33 Seiten + Blog
- [x] JSON-LD auf allen Seiten, serverseitig
- [x] Bilder optimiert, Build grün
- [ ] Rich Results Test (search.google.com/test/rich-results) für `/`, `/service-salary`, `/lebenslauf-beispiel`: keine Fehler
- [ ] `https://cvolution.ch/robots.txt` und `/sitemap.xml` live aufrufen
- [ ] `curl -sI https://www.cvolution.ch` → 308 auf `https://cvolution.ch/`
- [ ] PageSpeed Insights vorher/nachher dokumentieren

---

## D. Content

### D1 Überschneidung `/lohnanalyse-schweiz` vs. `/service-salary` — entschieden: differenzieren und verlinken

Nicht zusammenlegen: Die beiden Seiten bedienen verschiedene Suchintentionen. Zusammengelegt würde eine Seite beide schlecht bedienen.

| | `/lohnanalyse-schweiz` (Ratgeber) | `/service-salary` (Angebot) |
|---|---|---|
| Intention | informativ: «Ist mein Lohn fair?», «Lohn vergleichen Schweiz», «Medianlohn» | transaktional: «Lohnanalyse erstellen lassen», «Lohnanalyse Kosten», «Lohncheck Experte» |
| Title | Lohnanalyse Schweiz: Ist Ihr Lohn fair? So prüfen Sie es | Lohnanalyse erstellen lassen ab CHF 69 \| CVolution |
| H1 | Lohnanalyse Schweiz: So prüfen Sie selbst, ob Ihr Lohn fair ist | Lohnanalyse Schweiz: Wissen, wo Ihr Lohn im Markt steht. |
| Übergabe | Box direkt unter der Einleitung + Schritt im Text + Abschluss-CTA → `/service-salary` | Absatz «Sie möchten Ihren Lohn zuerst selbst einordnen?» → Ratgeber, FAQ-Antwort verweist auf Ratgeber |

### D2 `/service-salary` ausgebaut — umgesetzt (160 → 588 Wörter)

Neu: Ablauf in 3 Schritten, «Was in Ihre Lohnanalyse einfliesst», FAQ mit 7 Fragen (inkl. «Wie viel sollte ich verdienen?», «Wie funktioniert eine Lohnanalyse?», «Was kostet…», «Wie lange…», «Welche Angaben…», Unterschied zu Lohnrechnern, Einsatzzwecke), passende Ratgeber und eine CTA-Leiste mit beiden Varianten direkt in den Warenkorb.

### D3 Ratgeber vertiefen

**Umgesetzt:** `/lebenslauf-beispiel` hat jetzt drei vollständige Beispiele (Berufseinstieg nach der Lehre, erfahrene Fachkraft, Führungsperson) mit Sprungnavigation und «Darauf kommt es an». 444 → 835 Wörter. Nebenbei korrigiert: Im alten Beispiel war eine «Senior Marketing Managerin» nur als Kauffrau mit Weiterbildung zur Personalassistentin ausgebildet. Das wirkte unglaubwürdig.

**Nächste Ausbauten** (nach Priorität, je ca. 2–3 h Text):

| Ratgeber | Heute | Lücke | Ausbau |
|---|---|---|---|
| `/lebenslauf-vorlage-schweiz` | 582 W. | Verspricht «Muster», zeigt kein vollständiges | Eine vollständige Vorlage im Stil von `/lebenslauf-beispiel` + Abschnitt «Vorlage als Word herunterladen» → Link auf `/service-downloads` (bezahlte Vorlagen) |
| `/bewerbung-vorlage-schweiz` | 466 W. | Kein ausformuliertes Motivationsschreiben | 2 komplette Motivationsschreiben (KV, Pflege), Aufbau annotiert → CTA Motivationsschreiben |
| `/lohn-verhandeln-schweiz` | 838 W. | gut | Tabelle «Formulierungen für 5 Situationen» (Lohnrunde, Beförderung, neues Angebot, Gegenangebot, Absage) + Verweis Lohnanalyse als Argument |
| `/lebenslauf-format-schweiz` | 515 W. | Fragen zu Foto, PDF/Word, Länge nur kurz | Abschnitt «Lebenslauf-Länge nach Karrierestufe» + Foto-Checkliste |
| `/bewerbungsgespraech-tipps` | 743 W. | Lohnfrage im Gespräch | Abschnitt «Wie hoch ist Ihre Lohnvorstellung?» mit 3 Antwortbeispielen → Lohnanalyse |

### D4 Blog: Slugs und Titel nach Suchintention

Bekannte Slugs (aus Analytics, 1–3 Besucher/Monat). Vorschläge:

| Heute | Neuer Slug | Neuer Titel (≤ 60) | Excerpt/Description (≤ 155) | CTA |
|---|---|---|---|---|
| `wie-du-als-kandidat-bei-einem-unternehmer-punkten-kannst-interview-mit-patrick-mollet` | `bewerbung-kmu-tipps` | Bewerbung bei KMU: Was Unternehmer wirklich wollen | Ein Unternehmer erzählt, worauf er bei Bewerbungen achtet – und wie Sie bei KMU in der Schweiz punkten. Mit Tipps für Dossier und Gespräch. | Self-Service |
| `motivationsschreiben-ein-relikt-vergangener-tage-oder-ein-gamechanger` | `braucht-es-noch-ein-motivationsschreiben` | Braucht es noch ein Motivationsschreiben? | Viele Firmen verzichten aufs Motivationsschreiben – andere lesen es zuerst. Wann es sich lohnt und wie es in 2026 aussehen sollte. | Motivationsschreiben |
| `bewirb-dich-nicht-jetzt-die-richtige-bewerbungsstrategie` | `bewerbungsstrategie` | Bewerbungsstrategie: Weniger bewerben, mehr Zusagen | Warum Massenbewerbungen scheitern und wie Sie mit einer klaren Strategie weniger Bewerbungen schreiben und mehr Einladungen erhalten. | Laufbahnberatung |
| `warum-gute-kandidaten-trotzdem-absagen-erhalten` | `absage-trotz-qualifikation` | Absage trotz Qualifikation: 7 Gründe und was hilft | Sie passen perfekt und erhalten trotzdem Absagen? Die häufigsten Gründe aus Sicht von Recruitern – und wie Sie sie beheben. | Dossier-Check |
| `wie-viel-verdient-man-als` | `lohn-nach-beruf-schweiz` | Wie viel verdient man als …? Löhne nach Beruf | Lohnspannen für häufige Berufe in der Schweiz – und warum Ihr persönlicher Marktwert davon abweichen kann. | Lohnanalyse |
| `die-reise-der-lohntransparenz` | `lohntransparenz-schweiz` | Lohntransparenz Schweiz: Was gilt, was kommt | Was das Gleichstellungsgesetz verlangt, was die EU-Lohntransparenzrichtlinie für Schweizer Firmen bedeutet und wie Sie davon profitieren. | Lohnanalyse |
| `der-perfekte-nebenjob` | `nebenjob-schweiz` | Nebenjob Schweiz: Regeln, Steuern und gute Ideen | Was Sie beim Nebenjob in der Schweiz beachten müssen: Arbeitsvertrag, AHV, Steuern und Konkurrenzverbot – plus Ideen für Studierende. | Self-Service |

Die Texte reden Leser teils mit «du» an («bewirb-dich», «wie-du»). Beim Umbenennen auf Sie-Form umstellen, passend zum Rest der Seite.

**Ablauf je Artikel:**

1. ✅ Die sieben Weiterleitungen oben stehen bereits in `src/lib/blog-redirects.ts`.
2. Im Admin-Panel Slug, Titel und Excerpt ändern – oder alle sieben auf einmal mit `docs/seo/blog-slugs-d4.sql` (Supabase SQL-Editor).
3. Texte von «du» auf «Sie» umstellen (nur im Admin-Panel).

Die Reihenfolge spielt keine Rolle mehr: `/blog/[slug]` leitet eine alte URL erst mit 308 weiter, wenn ein veröffentlichter Artikel mit dem neuen Slug existiert. Bis dahin zeigt die alte URL weiter den Artikel. Für weitere Umbenennungen genügt ein neuer Eintrag in `blog-redirects.ts`.

Ausserdem umgesetzt: Am Ende jedes Blogartikels steht ein passender Service-CTA, gewählt anhand von Titel und Tags (`ctaForTopic` in `seo-pages.ts`).

### D5 15 neue Seiten

Reihenfolge = empfohlene Produktionsreihenfolge (Lohn-Cluster zuerst, weil dort heute der meiste Traffic und das klarste Produkt liegt). Jede neue Seite: in `PAGE_META` und `GUIDES` eintragen, `GuideSchema` + `GuideCta` einbinden. Dann erscheint sie automatisch in Sitemap, Startseite und passenden Service-Seiten.

| # | Pfad | Ziel-Keyword | Intention | Gliederung (H2) | Führt zu |
|---|---|---|---|---|---|
| 1 ✅ | `/lohnrechner-schweiz` | lohnrechner schweiz | Tool / informativ | Brutto-Netto-Rechner (Client-Tool: AHV/IV/EO 5.3 %, ALV 1.1 %, BVG-Schätzung nach Alter) · So lesen Sie das Ergebnis · Warum Rechner nicht alles zeigen · FAQ | Lohnanalyse PDF |
| 2 ✅ | `/lohn-nach-beruf` (Hub) + `/lohn/[beruf]` | lohn [beruf] schweiz (z. B. «lohn kaufmann schweiz», «lohn pflegefachfrau») | informativ | Lohnspanne nach Erfahrung · nach Kanton · nach Branche · Was den Lohn erhöht · FAQ. Start mit 10 Berufen mit hohem Suchvolumen, Daten aus der BFS-LSE (Quelle nennen) | Lohnanalyse |
| 3 ✅ | `/lohn-nach-kanton` | lohn zürich / lohn nach kanton schweiz | informativ | Medianlöhne nach Grossregion (BFS) · Kaufkraft und Steuern · Pendeln lohnt sich? · FAQ | Lohnanalyse |
| 4 | `/lohnverhandlung-tipps` | lohnverhandlung tipps | informativ | **Nicht neu bauen:** `/lohn-verhandeln-schweiz` deckt das ab. Stattdessen dort H2 «Lohnverhandlung: 10 Tipps» ergänzen, damit keine zwei Seiten um das Keyword konkurrieren | – |
| 5 ✅ | `/lohnerhoehung-fordern` | lohnerhöhung verlangen / lohnerhöhung brief | informativ + Vorlage | Wann fragen · Wie viel ist realistisch (%) · Gesprächsleitfaden · E-Mail-Vorlage · Was tun bei Nein | Lohnanalyse mit Gespräch |
| 6 ✅ | `/lohnvorstellung-bewerbung` | lohnvorstellung bewerbung | informativ | Muss ich sie angeben? · Formulierung im Motivationsschreiben · Antwort im Gespräch · Brutto vs. Gesamtpaket | Lohnanalyse |
| 7 ✅ | `/13-monatslohn` | 13. monatslohn schweiz | informativ | Pflicht oder nicht? · Berechnung (pro rata) · bei Kündigung · im Lohnvergleich richtig einrechnen | Lohnanalyse |
| 8 | `/arbeitszeugnis-schweiz` | arbeitszeugnis schweiz / zeugniscodes | informativ | Zwischen- vs. Schlusszeugnis · Anspruch (OR 330a) · Zeugnissprache entschlüsseln (Tabelle) · Zeugnis anfechten | Dossier-Check |
| 9 | `/arbeitszeugnis-formulierungen` | arbeitszeugnis formulierungen | informativ | Noten 1–4 in Formulierungen · Warnsignale · Beispielzeugnis | Dossier-Check |
| 10 | `/rav-anmeldung` | rav anmelden / arbeitslos melden | informativ | Wann anmelden (spätestens 1. Tag) · Unterlagen · Ablauf Erstgespräch · Taggeld kurz erklärt · weiter zu Arbeitsbemühungen | RAV-Unterstützung |
| 11 | `/rav-arbeitsbemuehungen` | rav arbeitsbemühungen anzahl / formular | informativ | Anzahl und Qualität · Formular korrekt ausfüllen · Was zählt (Spontanbewerbung, Temporär) · Einstelltage vermeiden | RAV-Unterstützung |
| 12 | `/motivationsschreiben-beispiel` | motivationsschreiben beispiel | informativ + Vorlage | 4 komplette Beispiele (KV, Pflege, Informatik, Quereinstieg) · annotierter Aufbau · häufige Fehler | Motivationsschreiben + Downloads (Prompts) |
| 13 | `/motivationsschreiben-ki` | motivationsschreiben ki / chatgpt | informativ | Was KI gut kann, was nicht · Prompt-Beispiel · so wird es persönlich · Erkennen Recruiter KI? | Self-Service + Masterprompts |
| 14 | `/kuendigung-schreiben` | kündigung schreiben vorlage schweiz | Vorlage | Fristen nach OR · Vorlage · Einschreiben? · Was nach der Kündigung zu tun ist → `/bewerbung-nach-kuendigung` | Laufbahnberatung |
| 15 | `/linkedin-profil-tipps` | linkedin profil optimieren tipps | informativ | Headline-Formeln · Info-Text-Vorlage · Open to Work: ja oder nein? · Checkliste | LinkedIn-Optimierung |

Zu #2: `/lohn/[beruf]` hat inzwischen 23 Berufe (11 + 12 weitere, je eine eigene BFS-Berufsgruppe). Zu #3: Das BFS veröffentlicht Löhne nach 7 Grossregionen, nicht pro Kanton (Tabelle T1_gr, Import `scripts/import-bfs-lse-regionen.py`); die Seite ordnet jeden Kanton seiner Region zu.

Zu #1: Ein echter Brutto-Netto-Rechner ist der stärkste Traffic-Hebel. Er braucht aber korrekte Sozialversicherungssätze. Die Sätze (AHV/IV/EO 5.3 %, ALV 1.1 % bis CHF 148'200) bitte vor Livegang mit dem aktuellen Jahr abgleichen. Quellensteuer und Kirchensteuer würde ich bewusst weglassen und als Hinweis auf die Lohnanalyse nutzen.

### ✅ Checkliste D

- [x] D1 Lohnseiten differenziert und gegenseitig verlinkt
- [x] D2 FAQ + Ablauf auf `/service-salary`
- [x] D3 `/lebenslauf-beispiel` mit 3 Beispielen
- [x] Service-Seiten: Keyword-H1, je 3–4 FAQs, Ratgeber-Links (114–170 → 225–353 Wörter)
- [ ] D3 Ausbau der 5 Ratgeber oben
- [x] D4 Redirects eingetragen (greifen automatisch nach der Umbenennung)
- [ ] D4 Blog-Slugs, Titel und Excerpts im Admin ändern (oder `blog-slugs-d4.sql`), Texte auf «Sie»
- [ ] D5 Seiten 1–3 in den nächsten 4 Wochen, danach 2 Seiten pro Woche
- [ ] Prüfen: Rich Results Test für `/service-salary` zeigt FAQPage, Service, BreadcrumbList

---

## E. Interne Verlinkung und Conversion

### E1 Verlinkung — umgesetzt

- **Startseite:** neuer Abschnitt «Ratgeber für Ihre Bewerbung in der Schweiz» (`#ratgeber`) mit allen 16 Ratgebern, Lohnthemen zuerst. Jeder Ratgeber hat damit mindestens einen Body-Link von der stärksten Seite.
- **Service-Seiten:** Block «Passende Ratgeber» mit 3–6 thematisch passenden Ratgebern (Mapping `SERVICE_GUIDES` in `seo-pages.ts`).
- **Ratgeber und Blog:** Abschluss-CTA auf den passenden bezahlten Service (`GuideCta`), z. B. Lebenslauf-Fehler → Dossier-Check, Quereinsteiger → Laufbahnberatung, Bewerbung schreiben → Self-Service. Vorher führten alle Lebenslauf-Ratgeber pauschal zu `/service-cv`.
- **Lohnergebnis im Self-Service** (`SalaryAnalysisSection`): Der CTA am Ende hängt jetzt vom Ergebnis ab. Bei «unter dem Markt»: Argumente holen, Gespräch für CHF 119. Bei «marktgerecht»: nächste Lohnstufe. Bei «über dem Markt»: Vorsprung sichern vor einem Wechsel. Der Link führt direkt zum Ablauf auf `/service-salary`.

### E2 Funnel Warenkorb → Bestätigung

**Zahlen:** 152 Besucher auf `/cart`, 55 auf `/confirmation`, 50 Besuche mit Referrer `saferpay.com`.

**Achtung beim Lesen dieser Zahl:** `/confirmation` zeigt auch **fehlgeschlagene** Zahlungen (`?error=…`). 55 ist also die Obergrenze erfolgreicher Bestellungen, nicht die tatsächliche Zahl. Ausserdem zählen Besucher, die nur das Warenkorb-Symbol anklicken (leerer Warenkorb), mit.

**Befunde aus dem Code:**

1. **Doppelte Eingaben bei der Lohnanalyse:** Vorname, Nachname, E-Mail und E-Mail-Bestätigung wurden zweimal verlangt (einmal für die Analyse, einmal als Kontakt). → **Umgesetzt:** Die Kontaktfelder füllen sich automatisch aus den Analyse-Feldern, solange der Kunde sie nicht selbst geändert hat.
2. **Unsichtbare Pflichtlogik:** «Lebenslauf **oder** LinkedIn» war Pflicht, beide Felder waren aber nicht als Pflicht markiert. Der Fehler erschien erst beim Absenden. → **Umgesetzt:** Labels sagen jetzt «(oder LinkedIn-Profil) *».
3. **Pflichtupload Lohnabrechnung vor der Zahlung:** Das ist eine hohe Hürde (Datei suchen, oft auf dem Handy nicht griffbereit). → **Vorschlag:** Upload optional machen und nach der Zahlung per Link in der Bestätigungsmail nachreichen lassen. Das braucht eine Änderung im Order-Prozess. Nicht umgesetzt, weil es Ihren Ablauf bei der Erstellung betrifft. Bitte entscheiden.
4. **Telefon als Pflichtfeld für alle Produkte:** Nötig nur bei «Lohnanalyse mit Gespräch» und Laufbahnberatung. → **Vorschlag:** `required` nur, wenn eines dieser Produkte im Warenkorb liegt.
5. **Pay-Button gesperrt bis AGB-Häkchen,** ohne Hinweis warum. → **Vorschlag:** Button aktiv lassen und beim Klick ohne Häkchen eine Fehlermeldung am Häkchen zeigen. Code:

   ```tsx
   // cart/page.tsx: im handleSubmit ganz oben
   if (!acceptTerms) { setError("Bitte bestätigen Sie die AGB, um fortzufahren."); return; }
   // und beim Button: disabled={isSubmitting}
   ```

6. **Kein Vertrauenssignal am Bezahlknopf.** → **Vorschlag:** Unter «Jetzt bezahlen» eine Zeile: «Sichere Zahlung über Worldline/Saferpay · TWINT oder Kreditkarte · Rechnung per E-Mail».
7. **Messung fehlte.** → **Umgesetzt:** Events über Vercel Analytics (`src/lib/funnel.ts`): `add_to_cart`, `checkout_started`, `checkout_error` (mit Grund), `payment_redirect`, `order_confirmed`, `payment_failed`. Damit sehen Sie, ob Kunden am Formular scheitern (`checkout_error`) oder bei der Zahlung (`payment_redirect` ohne `order_confirmed`). Hinweis: Ein Neuladen der Bestätigungsseite zählt erneut. Massgeblich bleibt die Bestellanzahl in Supabase.

**Ziel > 50 %** messen als `order_confirmed / checkout_started`, nicht als Seitenaufrufe `/confirmation ÷ /cart`.

### ✅ Checkliste E

- [x] Ratgeber-Abschnitt Startseite, Ratgeber-Block auf allen Service-Seiten
- [x] Service-spezifischer CTA am Ende aller 16 Ratgeber + Blogartikel + Lohnergebnis
- [x] Funnel: Autofill Kontaktfelder, klarere Pflichtfelder, Events
- [ ] Entscheid zu Punkt 3 (Lohnabrechnung nach Zahlung) und 4 (Telefon optional)
- [ ] Punkte 5 und 6 umsetzen (je < 30 min)
- [ ] Nach 2 Wochen: Vercel → Analytics → Events, Funnel-Raten eintragen

---

## F. Off-Page und Messung

### F1 Google Search Console

1. search.google.com/search-console → «Property hinzufügen» → **Domain-Property** `cvolution.ch` (deckt www, http und https ab).
2. Google zeigt einen TXT-Record. Er gehört dorthin, wo die DNS-Einträge verwaltet werden: in Vercel unter Team → Domains → cvolution.ch → DNS Records, sonst beim Registrar. Typ `TXT`, Name `@`, Wert `google-site-verification=…`, dann «Bestätigen». Das kann bis zu einer Stunde dauern.
   Alternative ohne DNS: URL-Präfix-Property `https://cvolution.ch/` → Methode «HTML-Tag» → nur den `content`-Wert in Vercel als Env-Variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` setzen und neu deployen. Der Code dafür ist schon im Layout.
3. **Sitemaps** → `sitemap.xml` eintragen → Status «Erfolgreich», 33+ URLs erkannt.
4. **URL-Prüfung** für `/`, `/service-salary`, `/lebenslauf-beispiel`, `/lohnanalyse-schweiz` → «Indexierung beantragen» (max. ca. 10 pro Tag).
5. Nach 7 Tagen: **Seiten** → «Indexiert» sollte die Ratgeber und Service-Seiten enthalten. `/cart` usw. erscheinen unter «Durch noindex-Tag ausgeschlossen». Das ist korrekt.
6. **Leistung** → Filter Suchanfrage «enthält nicht» `cvolution` → das ist Ihre Non-Brand-Kurve (Ziel > 200 Klicks/Monat).
7. Optional: Bing Webmaster Tools → «Aus Google Search Console importieren». Dauert 2 Minuten, Bing liefert auch an DuckDuckGo und Yahoo.

### F2 Google Business Profile (Oberentfelden)

1. business.google.com → «CVolution GmbH» suchen. Falls ein Eintrag existiert: «Inhaberschaft beanspruchen», sonst neu anlegen.
2. **Kategorie:** primär «Karriereberatung» (Career guidance service). Zusätzlich «Personalberatung» und «Lebenslauf-Service», falls vorhanden.
3. **Adresse:** Ausserfeldstrasse 9, 5036 Oberentfelden. Wenn Kunden nicht vor Ort empfangen werden: Adresse **ausblenden** und als Servicegebiet «Schweiz» bzw. Kantone AG, SO, LU, ZH, BE, BS, BL angeben. Das entspricht den Google-Richtlinien für Dienstleister ohne Ladenlokal.
4. **Verifizierung:** meist per Video (Firmenschild, Büro, Geschäftsunterlagen). Dauert einige Tage.
5. **Profil ausfüllen:** Telefon +41 76 440 51 51, Website `https://cvolution.ch/?utm_source=google&utm_medium=organic&utm_campaign=gbp` (so lassen sich GBP-Besucher in Vercel sauber trennen), Öffnungszeiten, Beschreibung (750 Zeichen):

   > CVolution GmbH aus Oberentfelden unterstützt Sie bei Bewerbung und Karriere in der ganzen Schweiz. Mit über 10 Jahren Recruiting-Erfahrung erstellen wir Lebensläufe und Motivationsschreiben, analysieren Ihren Lohn im Branchen- und Kantonsvergleich und begleiten Sie in der Laufbahnberatung. Für Stellensuchende beim RAV bieten wir gezielte Unterstützung bei Unterlagen und Arbeitsbemühungen. Wer selbst schreiben möchte, nutzt unseren Self-Service mit KI für CHF 13.90 pro Monat. Lohnanalyse ab CHF 69, Lebenslauf ab CHF 99, Dossier-Check ab CHF 59.

6. **Produkte/Leistungen:** jede Leistung mit Preis und Link auf die Service-Seite anlegen.
7. **Fotos:** Logo, Titelbild, Teamfotos, 2–3 Screenshots (Lohnanalyse-PDF anonymisiert, Self-Service).
8. **Bewertungen:** Nach jeder abgeschlossenen Bestellung den Bewertungslink mitschicken (GBP → «Bewertungen anfordern» → Kurzlink). Ein Satz in der Lieferungs-Mail genügt. Ziel: 10 Bewertungen in 90 Tagen.
9. **Beiträge:** 1× pro Woche den LinkedIn-Post (F3) als GBP-Beitrag mit Button «Mehr erfahren».

### F3 LinkedIn-Plan → Lohnanalyse

LinkedIn bringt 2/3 des Traffics, aber sinkend. Ziel: Diese Reichweite gezielt auf `/service-salary` und die Lohn-Ratgeber lenken und **messbar** machen.

**Grundregeln**

- Jeder Link mit UTM: `?utm_source=linkedin&utm_medium=social&utm_campaign=<thema>` (in Vercel per `utmCampaign` auswertbar).
- Link nicht im Post-Text, sondern im ersten Kommentar. Posts mit externem Link bekommen weniger Reichweite.
- 3 Posts pro Woche. 2 vom Personenprofil (Armend oder Jan), 1 von der Firmenseite. Personenprofile erreichen deutlich mehr.

**4-Wochen-Rotation** (Di/Do/Sa 07:30)

| Woche | Di (Personenprofil) | Do (Personenprofil) | Sa (Firmenseite) |
|---|---|---|---|
| 1 | Zahl der Woche: «Der Medianlohn in der Schweiz liegt bei CHF 6'788. Und Ihrer?» → `/lohnanalyse-schweiz` | Anonymisierter Fall: «Projektleiterin, 34, Aargau: 11 % unter Markt. Das hat sie daraus gemacht.» → `/service-salary` | Karussell «5 Faktoren, die Ihren Lohn bestimmen» → `/service-salary` |
| 2 | Umfrage: «Wann haben Sie zuletzt Ihren Lohn verhandelt?» → Kommentar mit Ratgeber Lohn verhandeln | 3 Formulierungen für die Lohnrunde → `/lohn-verhandeln-schweiz` | Vorher/Nachher Lebenslauf-Abschnitt → `/lebenslauf-beispiel` |
| 3 | «Lohnfrage im Bewerbungsgespräch: Was antworten Sie?» → `/bewerbungsgespraech-tipps` | Fall 2 (andere Branche/Kanton) → `/service-salary` | Kantonsvergleich als Grafik → `/lohnanalyse-schweiz` |
| 4 | Mythos vs. Fakt: «Lohn ist Tabu in der Schweiz» → `/lohnanalyse-schweiz` | «Was eine Lohnanalyse kostet und was sie bringt» (offen mit Preis CHF 69) → `/service-salary` | Kundenzitat (mit Einverständnis) → `/service-salary` |

**Ziele 90 Tage:** 300 LinkedIn-Besucher/Monat mit `utm_campaign` auf Lohnseiten; davon ≥ 4 % `add_to_cart`.

### F4 Wöchentlicher Report (Vercel Analytics)

Jeden Montag, Zeitraum Mo–So der Vorwoche. Abfragen in Vercel → Project `cvolution-next-js` → Analytics, oder per Vercel MCP `aggregate_pageviews` (so wurden die Zahlen in Abschnitt 0 erhoben):

| # | Kennzahl | Vercel-Abfrage | Ziel |
|---|---|---|---|
| 1 | Besucher nach Quelle | `by: referrerHostname` | LinkedIn stabil, Google steigend |
| 2 | Google-Besucher nach Seite | `by: requestPath`, `filter: referrerHostname eq 'google.com'` | Non-Brand-Seiten (Ratgeber, Service) > 50 % |
| 3 | Google-Besucher gesamt | `count_pageviews` mit Filter wie oben | 140+/Woche bis Tag 90 |
| 4 | LinkedIn-Kampagnen | `by: utmCampaign`, `filter: utmSource eq 'linkedin'` | siehe F3 |
| 5 | Funnel | Analytics → Events: `add_to_cart`, `checkout_started`, `payment_redirect`, `order_confirmed`, `payment_failed` | `order_confirmed / checkout_started` > 50 % |
| 6 | Non-Brand-Klicks | Search Console → Leistung → Abfrage enthält nicht «cvolution» | > 50/Woche bis Tag 90 |
| 7 | Bestellungen und Umsatz | Supabase `orders` (Admin-Panel) | Referenz für 5 |

Vorlage für den Report (in Slack oder E-Mail einfügen):

```
CVolution Wochenreport KW __
Besucher: ____ (LinkedIn ____ · Google ____ · Direkt ____)
Google Top 5 Seiten: ____
Non-Brand-Klicks (GSC): ____ (Vorwoche ____)
Funnel: Warenkorb ____ → Checkout ____ → Zahlung ____ → Bestätigt ____ (Rate ___ %)
Bestellungen: ____ · Umsatz CHF ____
Diese Woche umgesetzt: ____
Nächste Woche: ____
```

Diesen Report kann ich als wöchentlich geplante Aufgabe automatisch erstellen lassen (Vercel-Zahlen per MCP). Search Console und Supabase müsste dann jemand von Hand ergänzen.

### ✅ Checkliste F

- [ ] GSC verifiziert, Sitemap eingereicht, 4 URLs zur Indexierung beantragt
- [ ] Bing Webmaster Tools importiert
- [ ] GBP beansprucht, verifiziert, vollständig, Bewertungslink in Liefer-Mail
- [ ] LinkedIn: UTM-Links für alle Posts, Plan Woche 1 eingeplant
- [ ] Erster Wochenreport am Montag nach Deployment

---

## Meilensteine 90 Tage

| Zeitpunkt | Erwartung |
|---|---|
| Woche 1 | Deployment, GSC/GBP live, Ratgeber neu gecrawlt |
| Woche 2–4 | Neue Titles in den SERPs sichtbar, erste Non-Brand-Impressionen für «lohnanalyse», «lebenslauf beispiel schweiz»; Seiten D5 #1–3 live |
| Woche 4–8 | Ratgeber-Ausbau D3, 2 neue Seiten/Woche, GBP-Bewertungen; Google 300–400 Besucher/Monat |
| Woche 8–12 | Lohn-Cluster (Rechner, Beruf, Kanton) rankt; Google 600+/Monat, davon 200+ Non-Brand |

Das ist realistisch, aber nicht garantiert. Der grösste Hebel ist D5 #1–2 (Rechner, Lohn nach Beruf), weil dort das Suchvolumen liegt. Die Metadaten- und Technik-Fixes sind die Voraussetzung dafür, bringen aber allein keine 400 zusätzlichen Besucher.
