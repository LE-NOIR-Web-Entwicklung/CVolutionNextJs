import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

export interface MinimalProfile {
  full_name?: string;
  position?: string;
  address?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  marital_status?: string;
  origin?: string;
  profile_picture_url?: string;
  driver_license?: string;
}

export interface MinimalExperience {
  job_title: string;
  company: string;
  location?: string;
  period?: string;
  tasks?: string[];
}

export interface MinimalSkill {
  language?: string;
  level?: string;
}

export interface MinimalOtherSkill {
  category: string;
  value: string;
}

interface LebenslaufPDFMinimalProps {
  profile: MinimalProfile;
  experiences: MinimalExperience[];
  languages: MinimalSkill[];
  programs: string[];
  skills?: MinimalOtherSkill[];
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f9fafb',
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 36,
    paddingTop: 32,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    border: '1 solid #e5e7eb',
    borderRadius: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 0,
    marginTop: 2,
  },
  position: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
    marginTop: 2,
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4b5563',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: '#6b7280',
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
  expPosition: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#111827',
    marginRight: 6,
  },
  expCompany: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#111827',
    marginRight: 6,
  },
  expPeriod: {
    fontSize: 11,
    color: '#6b7280',
  },
  expTasks: {
    marginLeft: 16,
    marginTop: 2,
  },
  bullet: {
    fontSize: 11,
    marginBottom: 1,
  },
});

const PLACEHOLDER_IMG = 'https://randomuser.me/api/portraits/men/1.jpg';

export const LebenslaufPDF_Minimal: React.FC<LebenslaufPDFMinimalProps> = ({ profile, experiences, languages, programs, skills = [] }) => {
  const fuehrerschein = (skills.find(s => s.category.toLowerCase().includes('führerschein'))?.value) || profile.driver_license || 'Kategorie B';
  return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.leftCol}>
          <Text style={styles.name}>{profile.full_name || 'MAX MUSTER'}</Text>
          <Text style={styles.position}>{profile.position || 'Musterposition'}</Text>
          <View style={styles.contactTable}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Adresse</Text>
              <Text style={styles.contactValue}>{profile.address || 'Musterstrasse 12, 5000 Musterstadt'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Tel.</Text>
              <Text style={styles.contactValue}>{profile.phone || '076 000 00 00'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>E-Mail</Text>
              <Text style={styles.contactValue}>{profile.email || 'max.mustermann@muster.ch'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Geb.</Text>
              <Text style={styles.contactValue}>{profile.birthdate || '10. Januar 1990'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Zivilstand</Text>
              <Text style={styles.contactValue}>{profile.marital_status || 'verheiratet, 2 Kinder / ledig'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Heimatort</Text>
              <Text style={styles.contactValue}>{profile.origin || 'Musterstadt, Schweiz'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightCol}>
          <Image src={profile.profile_picture_url || PLACEHOLDER_IMG} style={styles.profilePic} />
        </View>
      </View>
      {/* Berufliche Erfahrung */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Berufliche Erfahrung</Text>
        {(experiences.length > 0 ? experiences : [
          {
            job_title: 'Musterposition',
            company: 'Musterfirma, Musterstadt',
            period: '| Februar 2021 – Heute |',
            tasks: ['Tätigkeit', 'Tätigkeit', 'Tätigkeit', 'Tätigkeit'],
          },
        ]).map((exp, i) => (
          <View key={i} style={styles.expBlock}>
            <View style={styles.expHeader}>
              <Text style={styles.expPosition}>{exp.job_title}</Text>
              <Text style={styles.expCompany}>{exp.company}</Text>
              <Text style={styles.expPeriod}>{exp.period || ''}</Text>
            </View>
            <View style={styles.expTasks}>
              {(exp.tasks || []).map((task, t) => (
                <Text key={t} style={styles.bullet}>• {task}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>
      {/* Kenntnisse & Fähigkeiten */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2, color: '#4b5563' }}>Sprachen</Text>
          <View style={{ flexDirection: 'row', marginBottom: 2 }}>
            {(languages.length > 0 ? languages : [
              { language: 'Deutsch', level: 'Muttersprache' },
              { language: 'Englisch', level: 'Gute Kenntnisse' },
              { language: 'Französisch', level: 'Gute Kenntnisse' },
            ]).map((lang, i) => (
              <React.Fragment key={i}>
                <Text style={{ width: 90, fontWeight: 'bold', fontSize: 11, color: '#6b7280' }}>{lang.language}</Text>
                <Text style={{ fontSize: 11, color: '#222', flex: 1 }}>{lang.level}</Text>
              </React.Fragment>
            ))}
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 6, color: '#4b5563' }}>Führerschein</Text>
          <Text style={{ fontSize: 11, color: '#222' }}>{profile.driver_license || 'Kategorie B'}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 6, color: '#4b5563' }}>Programme</Text>
          <Text style={{ fontSize: 11, color: '#222' }}>{programs.length > 0 ? programs.join(', ') : 'SAP'}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
} 