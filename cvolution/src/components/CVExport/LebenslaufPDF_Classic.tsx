import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

// Placeholder image (can be replaced with your own image URL or base64 string)
const PLACEHOLDER_IMG = 'https://via.placeholder.com/110x130.png?text=Foto';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 32,
    paddingTop: 28,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    width: 120,
    alignItems: 'flex-end',
  },
  profilePic: {
    width: 110,
    height: 130,
    objectFit: 'cover',
    border: '2 solid #000',
    borderRadius: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 2,
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    marginBottom: 8,
    paddingBottom: 2,
  },
  contactTable: {
    marginTop: 4,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  contactLabel: {
    width: 90,
    color: '#222',
    fontWeight: 'bold',
  },
  contactValue: {
    color: '#222',
    flex: 1,
  },
  expBlock: {
    marginBottom: 14,
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  expPeriod: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#000',
    width: 70,
  },
  expPosition: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    marginRight: 6,
  },
  expCompany: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    marginRight: 6,
  },
  expTasks: {
    marginLeft: 16,
    marginTop: 2,
  },
  bullet: {
    fontSize: 11,
    marginBottom: 1,
  },
  eduBlock: {
    marginBottom: 8,
  },
  eduPeriod: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#000',
    width: 70,
  },
  eduText: {
    fontSize: 11,
    color: '#222',
  },
  skillSection: {
    marginTop: 12,
  },
  skillTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  skillLabel: {
    width: 90,
    fontWeight: 'bold',
    fontSize: 11,
  },
  skillValue: {
    fontSize: 11,
    color: '#222',
    flex: 1,
  },
});


// Supabase field mapping
interface Profile {
  full_name?: string;
  location?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  marital_status?: string;
  hometown?: string;
  profile_picture_url?: string;
}

interface Experience {
  job: string | undefined;
  period?: string; // e.g. '02.2022 – heute'
  position?: string;
  company?: string;
  tasks?: string[];
}

interface Education {
  period?: string;
  school?: string;
  degree?: string;
  description?: string;
}

interface Language {
  language_name?: string;
  proficiency?: string;
}

interface Skill {
  category?: string | null;
  skill_name?: string;
}

interface LebenslaufPDF_ClassicProps {
  profile?: Profile;
  experiences?: Experience[];
  education?: Education[];
  languages?: Language[];
  skills?: Skill[];
}

export const LebenslaufPDF_Classic = ({
  profile,
  experiences,
  education,
  languages,
  skills,
}: LebenslaufPDF_ClassicProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.leftCol}>
          <Text style={styles.title}>Lebenslauf / Profil</Text>
          <View style={styles.contactTable}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Name</Text>
              <Text style={styles.contactValue}>{profile?.full_name || ''}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Standort</Text>
              <Text style={styles.contactValue}>{profile?.location || ''}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Tel.</Text>
              <Text style={styles.contactValue}>{profile?.phone || ''}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>E-Mail</Text>
              <Text style={styles.contactValue}>{profile?.email || ''}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Geburtsdatum</Text>
              <Text style={styles.contactValue}>{profile?.birthdate || ''}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Zivilstand</Text>
              <Text style={styles.contactValue}>{profile?.marital_status || ''}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Heimatort</Text>
              <Text style={styles.contactValue}>{profile?.hometown || ''}</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightCol}>
          <Image src={profile?.profile_picture_url || PLACEHOLDER_IMG} style={styles.profilePic} />
        </View>
      </View>
      {/* Berufliche Erfahrung */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Berufliche Erfahrung</Text>
        {(experiences || []).slice().reverse().map((exp, i) => (
          <View key={i} style={styles.expBlock}>
            <View style={styles.expHeader}>
              <Text style={styles.expPeriod}>{exp.period || ''}</Text>
              <Text style={styles.expPosition}>
                {exp.position || exp.job || ''}
                {exp.position || exp.job ? ',' : ''}
              </Text>
              <Text style={styles.expCompany}>{exp.company || ''}</Text>
            </View>
            <View style={styles.expTasks}>
              {(exp.tasks || []).map((task, t) => (
                <Text key={t} style={styles.bullet}>• {task}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>
      {/* Ausbildungen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ausbildungen / Weiterbildungen</Text>
        {(education || []).map((edu, i) => (
          <View key={i} style={styles.eduBlock}>
            <Text style={styles.eduPeriod}>{edu.period || ''}</Text>
            <Text style={styles.eduText}>{[edu.degree, edu.school, edu.description].filter(Boolean).join(', ')}</Text>
          </View>
        ))}
      </View>
      {/* Kenntnisse & Fähigkeiten */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
        <View style={styles.skillSection}>
          <Text style={styles.skillTitle}>Sprachen</Text>
          <View style={styles.skillRow}>
            {(languages || []).map((lang, i) => (
              <React.Fragment key={i}>
                <Text style={styles.skillLabel}>{lang.language_name || ''}</Text>
                <Text style={styles.skillValue}>{lang.proficiency || ''}</Text>
              </React.Fragment>
            ))}
          </View>
          <Text style={[styles.skillTitle, { marginTop: 6 }]}>Programme</Text>
          <Text style={styles.skillValue}>{(skills || []).filter(s => s.category === 'Programme').map(s => s.skill_name).join(', ')}</Text>
        </View>
      </View>
    </Page>
  </Document>
);