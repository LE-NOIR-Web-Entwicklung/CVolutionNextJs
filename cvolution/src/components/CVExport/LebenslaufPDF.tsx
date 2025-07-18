import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const BLUE = '#0B6A94';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#e6eef2',
    fontFamily: 'Helvetica',
    fontSize: 11,
  },
  sidebar: {
    width: 60,
    backgroundColor: BLUE,
    height: '100%',
  },
  sidebarRight: {
    width: 60,
    backgroundColor: BLUE,
    height: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  profilePic: {
    width: 120,
    height: 120,
    objectFit: 'cover',
    border: `3 solid ${BLUE}`,
    borderRadius: 4,
    marginRight: 32,
  },
  nameBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BLUE,
    marginBottom: 2,
    lineHeight: 1.1,
  },
  position: {
    fontSize: 14,
    color: '#b0b7bc',
    marginBottom: 8,
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BLUE,
    borderBottomWidth: 2,
    borderBottomColor: BLUE,
    borderBottomStyle: 'solid',
    marginBottom: 8,
    paddingBottom: 2,
  },
  contactTable: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contactLabel: {
    width: 80,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contactValue: {
    flex: 1,
    color: '#222',
    marginBottom: 2,
  },
  expBlock: {
    marginBottom: 16,
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  expPosition: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#222',
    marginRight: 6,
  },
  expCompany: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#222',
    marginRight: 6,
  },
  expPeriod: {
    fontSize: 11,
    color: '#666',
  },
  expTasks: {
    marginLeft: 12,
    marginTop: 2,
  },
  bullet: {
    fontSize: 11,
    marginBottom: 1,
  },
});

export interface LebenslaufProfile {
  full_name?: string;
  position?: string;
  address?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  marital_status?: string;
  origin?: string;
  profile_picture_url?: string;
}

export interface LebenslaufExperience {
  job_title: string;
  company: string;
  location?: string;
  period?: string;
  tasks?: string[];
}

interface LebenslaufPDFProps {
  profile: LebenslaufProfile;
  experiences: LebenslaufExperience[];
}

const PLACEHOLDER_IMG = 'https://randomuser.me/api/portraits/men/1.jpg';

export const LebenslaufPDF: React.FC<LebenslaufPDFProps> = ({ profile, experiences }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar} />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Image src={profile.profile_picture_url || PLACEHOLDER_IMG} style={styles.profilePic} />
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{profile.full_name || 'Max Mustermann'}</Text>
            <Text style={styles.position}>{profile.position || 'Musterposition'}</Text>
          </View>
        </View>
        {/* Kontaktinformationen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontaktinformationen</Text>
          <View style={styles.contactTable}>
            <View>
              <Text style={styles.contactLabel}>Adresse</Text>
              <Text style={styles.contactLabel}>Tel.</Text>
              <Text style={styles.contactLabel}>E-Mail</Text>
              <Text style={styles.contactLabel}>Geb.</Text>
              <Text style={styles.contactLabel}>Zivilstand</Text>
              <Text style={styles.contactLabel}>Heimatort</Text>
            </View>
            <View>
              <Text style={styles.contactValue}>{profile.address || 'Musterstrasse 12, 5000 Musterstadt'}</Text>
              <Text style={styles.contactValue}>{profile.phone || '076 000 00 00'}</Text>
              <Text style={styles.contactValue}>{profile.email || 'max.mustermann@muster.ch'}</Text>
              <Text style={styles.contactValue}>{profile.birthdate || '10. Januar 1990'}</Text>
              <Text style={styles.contactValue}>{profile.marital_status || 'verheiratet, 2 Kinder / ledig'}</Text>
              <Text style={styles.contactValue}>{profile.origin || 'Musterstadt, Schweiz'}</Text>
            </View>
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
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 2 }}>Sprachen</Text>
            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={{ width: 80, fontWeight: 'bold', fontSize: 11 }}>Deutsch</Text>
              <Text style={{ fontSize: 11, color: '#222', flex: 1 }}>Muttersprache</Text>
              <Text style={{ width: 80, fontWeight: 'bold', fontSize: 11 }}>Englisch</Text>
              <Text style={{ fontSize: 11, color: '#222', flex: 1 }}>Gute Kenntnisse</Text>
              <Text style={{ width: 80, fontWeight: 'bold', fontSize: 11 }}>Französisch</Text>
              <Text style={{ fontSize: 11, color: '#222', flex: 1 }}>Gute Kenntnisse</Text>
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 6 }}>Führerschein</Text>
            <Text style={{ fontSize: 11, color: '#222' }}>Kategorie B</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 6 }}>Programme</Text>
            <Text style={{ fontSize: 11, color: '#222' }}>SAP</Text>
          </View>
        </View>
      </View>
      <View style={styles.sidebarRight} />
    </Page>
  </Document>
); 