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

interface CVPdfDesign2Props {
  user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

// Design 2 (Zeitlos): neutrales Layout mit ueberarbeitetem Header.
// Umsetzung Review-Feedback:
// - Header komplett neu aufgebaut (Name links, Foto rechts, sauber ausgerichtet)
// - Taetigkeiten immer als Bulletpoints (aktuellste Stelle mehr, aeltere weniger)
// - Titel, Firma und Arbeitsort bleiben zusammen auf einer Seite (wrap={false})
// - Leere Felder werden komplett weggelassen
// - Kompakte Abstaende, damit der CV wenn moeglich auf eine Seite passt
const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    paddingTop: 30,
    paddingBottom: 34,
    paddingLeft: 56,
    paddingRight: 56,
    color: '#252525',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottom: '1 solid #cfcfcf',
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#252525',
  },
  headline: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  photo: {
    width: 92,
    height: 110,
    objectFit: 'cover',
    border: '1 solid #cfcfcf',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 5,
    color: '#252525',
    borderBottom: '1 solid #cfcfcf',
    paddingBottom: 2,
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  contactLabel: {
    width: 80,
    fontSize: 9.5,
    color: '#666666',
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
    color: '#666666',
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

export const CVPdfDesign2: React.FC<CVPdfDesign2Props> = ({
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
        {/* Header: Name links, Foto rechts */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile?.full_name || ''}</Text>
            {profile?.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}
          </View>
          {profile?.profile_picture_url ? (
            <Image src={profile.profile_picture_url} style={styles.photo} />
          ) : null}
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
        {experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Berufserfahrung</Text>
            {experiences.map((exp, idx) => {
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
        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Aus- &amp; Weiterbildungen</Text>
            {education.map((edu, idx) => {
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
