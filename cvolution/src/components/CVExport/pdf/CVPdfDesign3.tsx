import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface CVPdfDesign3Props {
    user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#eaf0fa',
    padding: 40,
    fontSize: 12,
    color: '#204878',
  },
  header: {
    backgroundColor: '#204878',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headline: {
    fontSize: 12,
    color: '#b3c7e6',
    marginBottom: 8,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 16,
    border: '2px solid #fff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#204878',
    borderBottom: '1px solid #204878',
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#204878',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#4c6c93',
  },
  itemText: {
    fontSize: 10,
    color: '#333',
    marginBottom: 4,
  },
  skill: {
    fontSize: 10,
    color: '#204878',
    marginBottom: 2,
  },
  language: {
    fontSize: 10,
    color: '#204878',
    marginBottom: 2,
  },
});

export const CVPdfDesign3: React.FC<CVPdfDesign3Props> = ({ user, profile, experiences, education, skills, languages }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile?.full_name}</Text>
          <Text style={styles.headline}>{profile?.headline}</Text>
          <Text style={styles.itemText}>{profile?.summary}</Text>
        </View>
        {profile?.profile_picture_url && (
          <Image src={profile.profile_picture_url} style={styles.profilePic} />
        )}
      </View>
      <View>
        <Text style={styles.sectionTitle}>Berufserfahrung</Text>
        {experiences.map((exp) => (
          <View key={exp.id}>
            <Text style={styles.itemTitle}>{exp.job_title} <Text style={styles.itemSubtitle}>@ {exp.company}</Text></Text>
            <Text style={styles.itemSubtitle}>{exp.start_date} - {exp.is_current ? 'heute' : exp.end_date}</Text>
            <Text style={styles.itemText}>{exp.description}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={styles.sectionTitle}>Bildung</Text>
        {education.map((edu) => (
          <View key={edu.id}>
            <Text style={styles.itemTitle}>{edu.degree} <Text style={styles.itemSubtitle}>@ {edu.institution}</Text></Text>
            <Text style={styles.itemSubtitle}>{edu.start_date} - {edu.is_current ? 'heute' : edu.end_date}</Text>
            <Text style={styles.itemSubtitle}>{edu.field_of_study}</Text>
            <Text style={styles.itemText}>{edu.description}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={styles.sectionTitle}>Fähigkeiten</Text>
        {skills.map((skill) => (
          <Text key={skill.id} style={styles.skill}>{skill.skill_name} ({skill.proficiency})</Text>
        ))}
      </View>
      <View>
        <Text style={styles.sectionTitle}>Sprachen</Text>
        {languages.map((lang) => (
          <Text key={lang.id} style={styles.language}>{lang.language_name} ({lang.proficiency})</Text>
        ))}
      </View>
    </Page>
  </Document>
);
