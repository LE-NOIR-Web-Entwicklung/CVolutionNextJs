import { CVPdfDesign2 } from './CVPdfDesign2';
import { CVPdfDesign3 } from './CVPdfDesign3';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import {
  buildContactRows,
  extractBullets,
  formatDate,
  formatDriverLicense,
  getMaxBullets,
  prepareLanguages,
  sortByCurrentThenEndDate,
  splitSkills,
} from './cvPdfShared';

interface CVPdfDocumentProps {
  user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
  design?: 'design1' | 'design2' | 'design3';
}

const ACCENT = '#005B82';

// Design 1: kompaktes Layout mit blauen Seitenbalken.
// Umsetzung Review-Feedback:
// - Taetigkeiten immer als Bulletpoints (aktuellste Stelle mehr, aeltere weniger)
// - Titel, Firma und Arbeitsort bleiben zusammen auf einer Seite (wrap={false})
// - Leere Felder werden komplett weggelassen
// - Kompakte Abstaende, damit der CV wenn moeglich auf eine Seite passt
const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    paddingTop: 28,
    paddingBottom: 32,
    paddingLeft: 58,
    paddingRight: 58,
    color: '#1a1a1a',
  },
  sidebarLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 26,
    backgroundColor: ACCENT,
  },
  sidebarRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 26,
    backgroundColor: ACCENT,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photo: {
    width: 92,
    height: 110,
    objectFit: 'cover',
    border: '1 solid #d0d0d0',
  },
  headerText: {
    marginLeft: 14,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ACCENT,
  },
  headline: {
    fontSize: 12,
    color: '#555555',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 5,
    color: ACCENT,
    borderBottom: `1 solid ${ACCENT}`,
    paddingBottom: 2,
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  contactLabel: {
    width: 80,
    fontSize: 9.5,
  },
  contactValue: {
    flex: 1,
    fontSize: 9.5,
  },
  expItem: {
    marginBottom: 8,
  },
  expTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  expMeta: {
    fontSize: 9.5,
    color: '#444444',
    marginTop: 1,
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: 'row',
    marginLeft: 10,
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
    marginBottom: 4,
  },
  skillLabel: {
    width: 110,
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  skillContent: {
    flex: 1,
  },
  languageRow: {
    flexDirection: 'row',
    marginBottom: 1.5,
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

export const CVPdfDocument: React.FC<CVPdfDocumentProps> = (props) => {
  const { user, profile, experiences, education, skills, languages, design } = props;

  const sortedExperiences = sortByCurrentThenEndDate(experiences);
  const sortedEducation = sortByCurrentThenEndDate(education);

  if (design === 'design2') {
    return <CVPdfDesign2 user={user} profile={profile} experiences={sortedExperiences} education={sortedEducation} skills={skills} languages={languages} />;
  }
  if (design === 'design3') {
    return <CVPdfDesign3 user={user} profile={profile} experiences={sortedExperiences} education={sortedEducation} skills={skills} languages={languages} />;
  }

  const contactRows = buildContactRows(user, profile);
  const preparedLanguages = prepareLanguages(languages);
  const { abilities, driverLicenses } = splitSkills(skills);
  const hasKnowledgeSection = preparedLanguages.length > 0 || abilities.length > 0 || driverLicenses.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.sidebarLeft} fixed />
        <View style={styles.sidebarRight} fixed />

        {/* Header: Foto + Name */}
        <View style={styles.header}>
          {profile?.profile_picture_url ? (
            <Image src={profile.profile_picture_url} style={styles.photo} />
          ) : null}
          <View style={[styles.headerText, !profile?.profile_picture_url ? { marginLeft: 0 } : {}]}>
            <Text style={styles.name}>{profile?.full_name || ''}</Text>
            {profile?.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}
          </View>
        </View>

        {/* Kontaktdaten: nur vorhandene Felder */}
        {contactRows.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Kontaktdaten</Text>
            {contactRows.map((row) => (
              <View key={row.label} style={styles.contactRow}>
                <Text style={styles.contactLabel}>{row.label}:</Text>
                <Text style={styles.contactValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Berufserfahrung */}
        {sortedExperiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Berufserfahrung</Text>
            {sortedExperiences.map((exp, idx) => {
              const bullets = extractBullets(exp.description, getMaxBullets(idx));
              const metaParts = [
                [exp.company, exp.location].filter(Boolean).join(', '),
                `${formatDate(exp.start_date)} - ${exp.is_current ? 'heute' : formatDate(exp.end_date)}`,
              ].filter(Boolean);

              return (
                <View key={exp.id ?? idx} style={styles.expItem} wrap={false}>
                  <Text style={styles.expTitle}>{exp.job_title || ''}</Text>
                  <Text style={styles.expMeta}>{metaParts.join(' | ')}</Text>
                  {bullets.length > 0 && <Bullets items={bullets} />}
                </View>
              );
            })}
          </View>
        )}

        {/* Aus- & Weiterbildungen */}
        {sortedEducation.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Aus- &amp; Weiterbildungen</Text>
            {sortedEducation.map((edu, idx) => {
              const metaParts = [
                [edu.institution, edu.place].filter(Boolean).join(', '),
                `${formatDate(edu.start_date)} - ${edu.is_current ? 'heute' : formatDate(edu.end_date)}`,
              ].filter(Boolean);
              const bullets = extractBullets(edu.description, 3);

              return (
                <View key={edu.id ?? idx} style={styles.expItem} wrap={false}>
                  <Text style={styles.expTitle}>
                    {[edu.degree, edu.field_of_study].filter(Boolean).join(', ')}
                  </Text>
                  <Text style={styles.expMeta}>{metaParts.join(' | ')}</Text>
                  {bullets.length > 0 && <Bullets items={bullets} />}
                </View>
              );
            })}
          </View>
        )}

        {/* Kenntnisse & Faehigkeiten: leere Bereiche werden weggelassen */}
        {hasKnowledgeSection && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Kenntnisse &amp; Fähigkeiten</Text>

            {preparedLanguages.length > 0 && (
              <View style={styles.skillRow}>
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
              <View style={styles.skillRow}>
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
              <View style={styles.skillRow}>
                <Text style={styles.skillLabel}>Führerschein</Text>
                <View style={styles.skillContent}>
                  {driverLicenses.map((s, idx) => (
                    <Text key={s.id ?? idx} style={{ fontSize: 9.5, marginBottom: 1.5 }}>
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
