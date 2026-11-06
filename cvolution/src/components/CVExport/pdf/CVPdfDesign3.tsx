import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import {
  buildContactRows,
  extractBullets,
  formatDate,
  formatDriverLicense,
  getMaxBullets,
  prepareLanguages,
  splitSkills,
} from './cvPdfShared';

interface CVPdfDesign3Props {
  user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

// Design 3 (Klassisch): tabellarischer Lebenslauf mit Datumsspalte.
// Umsetzung Review-Feedback:
// - Darstellung komplett ueberarbeitet (saubere Spalten, keine Ueberlappungen)
// - Taetigkeiten immer als Bulletpoints (aktuellste Stelle mehr, aeltere weniger)
// - Titel, Firma und Arbeitsort bleiben zusammen auf einer Seite (wrap={false})
// - Leere Felder werden komplett weggelassen
// - Titel, Arbeitgeber und Arbeitsort stehen auf einer Zeile
// - Grosszuegige Abstaende, die Seite wird genutzt statt gequetscht
// - Foto ist genau so hoch wie der Personalien-Block
const PHOTO_MIN_HEIGHT = 96;

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    paddingTop: 32,
    paddingBottom: 30,
    paddingLeft: 52,
    paddingRight: 52,
    color: '#000000',
    lineHeight: 1.25,
  },
  topTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    borderBottom: '1.5 solid #000000',
    paddingBottom: 3,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    minHeight: PHOTO_MIN_HEIGHT,
    marginBottom: 6,
  },
  contactBlock: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'space-between',
  },
  contactRow: {
    flexDirection: 'row',
  },
  contactLabel: {
    width: 90,
    fontSize: 9.5,
  },
  contactValue: {
    flex: 1,
    fontSize: 9.5,
  },
  nameValue: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Der Rahmen uebernimmt per stretch die Hoehe der Personalien, das Bild fuellt ihn.
  photoFrame: {
    width: 92,
    position: 'relative',
    border: '1 solid #000000',
  },
  photo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    objectFit: 'cover',
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    borderBottom: '1.5 solid #000000',
    paddingBottom: 3,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  itemDate: {
    width: 105,
    fontSize: 9.5,
    flexShrink: 0,
  },
  itemBody: {
    flex: 1,
  },
  itemLine: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  bulletRow: {
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 1.5,
  },
  bulletPoint: {
    width: 10,
    fontSize: 9.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  skillLabel: {
    width: 105,
    fontSize: 9.5,
    fontWeight: 'bold',
    flexShrink: 0,
  },
  skillContent: {
    flex: 1,
  },
  languageRow: {
    flexDirection: 'row',
    marginBottom: 0.5,
  },
  languageName: {
    width: 100,
    fontSize: 9.5,
  },
  languageLevel: {
    flex: 1,
    fontSize: 9.5,
  },
});

const formatRange = (startDate?: string | null, endDate?: string | null, isCurrent?: boolean) => {
  const start = formatDate(startDate ?? "");
  const end = isCurrent ? 'heute' : formatDate(endDate ?? "");
  if (!start && !end) return '';
  return `${start} - ${end}`;
};

// Stellentitel fett, Arbeitgeber und Ort direkt dahinter auf derselben Zeile
const ItemLine = ({ title, meta }: { title: string; meta: string }) => (
  <Text style={styles.itemLine}>
    <Text style={styles.itemTitle}>{title}</Text>
    {title && meta ? `, ${meta}` : meta}
  </Text>
);

const Bullets = ({ items }: { items: string[] }) => (
  <View>
    {items.map((text, idx) => (
      <View key={idx} style={styles.bulletRow}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
      </View>
    ))}
  </View>
);

export const CVPdfDesign3: React.FC<CVPdfDesign3Props> = ({
  user,
  profile,
  experiences,
  education,
  skills,
  languages,
}) => {
  const contactRows = buildContactRows(user, profile);
  const preparedLanguages = prepareLanguages(languages);
  const { abilities, driverLicenses } = splitSkills(skills);
  const hasKnowledgeSection = preparedLanguages.length > 0 || abilities.length > 0 || driverLicenses.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Titel */}
        <Text style={styles.topTitle}>Lebenslauf</Text>

        {/* Header: Kontaktdaten links, Foto rechts, nur vorhandene Felder */}
        <View style={styles.headerRow}>
          <View style={styles.contactBlock}>
            {profile?.full_name ? (
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Name</Text>
                <Text style={styles.nameValue}>{profile.full_name}</Text>
              </View>
            ) : null}
            {contactRows.map((row) => (
              <View key={row.label} style={styles.contactRow}>
                <Text style={styles.contactLabel}>{row.label}</Text>
                <Text style={styles.contactValue}>{row.value}</Text>
              </View>
            ))}
          </View>
          {profile?.profile_picture_url ? (
            <View style={styles.photoFrame}>
              <Image src={profile.profile_picture_url} style={styles.photo} />
            </View>
          ) : null}
        </View>

        {/* Berufliche Erfahrung */}
        {experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Berufliche Erfahrung</Text>
            {experiences.map((exp, idx) => {
              const bullets = extractBullets(exp.description, getMaxBullets(idx));
              const meta = [exp.company, exp.location].filter(Boolean).join(', ');

              return (
                <View key={exp.id ?? idx} style={styles.itemRow} wrap={false}>
                  <Text style={styles.itemDate}>
                    {formatRange(exp.start_date, exp.end_date, exp.is_current)}
                  </Text>
                  <View style={styles.itemBody}>
                    <ItemLine title={exp.job_title || ''} meta={meta} />
                    {bullets.length > 0 && <Bullets items={bullets} />}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Aus- & Weiterbildungen */}
        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Aus- &amp; Weiterbildungen</Text>
            {education.map((edu, idx) => {
              const meta = [edu.institution, edu.place].filter(Boolean).join(', ');
              const bullets = extractBullets(edu.description, 3);

              return (
                <View key={edu.id ?? idx} style={styles.itemRow} wrap={false}>
                  <Text style={styles.itemDate}>
                    {formatRange(edu.start_date, edu.end_date, edu.is_current)}
                  </Text>
                  <View style={styles.itemBody}>
                    <ItemLine title={[edu.degree, edu.field_of_study].filter(Boolean).join(', ')} meta={meta} />
                    {bullets.length > 0 && <Bullets items={bullets} />}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Kenntnisse & Faehigkeiten: leere Bereiche werden weggelassen */}
        {hasKnowledgeSection && (
          <View>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>Kenntnisse &amp; Fähigkeiten</Text>

            {preparedLanguages.length > 0 && (
              <View style={styles.skillRow} wrap={false}>
                <Text style={styles.skillLabel}>Sprachen</Text>
                <View style={styles.skillContent}>
                  {preparedLanguages.map((lang) => (
                    <View key={lang.id} style={styles.languageRow}>
                      <Text style={styles.languageName}>{lang.name}</Text>
                      <Text style={styles.languageLevel}>{lang.level}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {abilities.length > 0 && (
              <View style={styles.skillRow} wrap={false}>
                <Text style={styles.skillLabel}>Fähigkeiten</Text>
                <View style={styles.skillContent}>
                  {abilities.map((s, idx) => (
                    <View key={s.id ?? idx} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{s.skill_name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {driverLicenses.length > 0 && (
              <View style={styles.skillRow} wrap={false}>
                <Text style={styles.skillLabel}>Führerschein</Text>
                <View style={styles.skillContent}>
                  {driverLicenses.map((s, idx) => (
                    <Text key={s.id ?? idx} style={{ fontSize: 9.5, marginBottom: 0.5 }}>
                      {formatDriverLicense(s)}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};
