import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

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

const PLACEHOLDER_IMG = 'https://randomuser.me/api/portraits/men/1.jpg';

export const LebenslaufPDF_Classic = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.leftCol}>
          <Text style={styles.title}>Lebenslauf / Profil</Text>
          <View style={styles.contactTable}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Name</Text>
              <Text style={styles.contactValue}>Max Mustermann</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Adresse</Text>
              <Text style={styles.contactValue}>Musterstrasse 12, 5000 Musterstadt</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Tel.</Text>
              <Text style={styles.contactValue}>076 000 00 00</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>E-Mail</Text>
              <Text style={styles.contactValue}>max.mustermann@muster.ch</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Geburtsdatum</Text>
              <Text style={styles.contactValue}>10. Januar 1990</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Zivilstand</Text>
              <Text style={styles.contactValue}>verheiratet, 2 Kinder / ledig</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Heimatort</Text>
              <Text style={styles.contactValue}>Musterstadt, Schweiz</Text>
            </View>
          </View>
        </View>
        <View style={styles.rightCol}>
          <Image src={PLACEHOLDER_IMG} style={styles.profilePic} />
        </View>
      </View>
      {/* Berufliche Erfahrung */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Berufliche Erfahrung</Text>
        {[{
          period: '02.2022 – heute',
          job: 'Stellentitel',
          company: 'Mustermann AG, Musterstadt AG',
          tasks: ['Tätigkeit', 'Tätigkeit', 'Tätigkeit', 'Tätigkeit'],
        }, {
          period: '05.2020 – 02.2022',
          job: 'Stellentitel',
          company: 'Mustermann AG, Musterstadt AG',
          tasks: ['Tätigkeit', 'Tätigkeit', 'Tätigkeit', 'Tätigkeit'],
        }, {
          period: '03.2019 – 05.2020',
          job: 'Stellentitel',
          company: 'Mustermann AG, Musterstadt AG',
          tasks: ['Tätigkeit', 'Tätigkeit', 'Tätigkeit'],
        }].map((exp, i) => (
          <View key={i} style={styles.expBlock}>
            <View style={styles.expHeader}>
              <Text style={styles.expPeriod}>{exp.period}</Text>
              <Text style={styles.expPosition}>{exp.job},</Text>
              <Text style={styles.expCompany}>{exp.company}</Text>
            </View>
            <View style={styles.expTasks}>
              {exp.tasks.map((task, t) => (
                <Text key={t} style={styles.bullet}>• {task}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>
      {/* Ausbildungen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ausbildungen / Weiterbildungen</Text>
        {[{
          period: '02.2020 – 06.2020',
          text: 'Weiterbildung zur Personalassistentin, Musterschule AG',
        }, {
          period: '08.2015 – 07.2018',
          text: 'Ausbildung zur Kauffrau AG, Musterschule AG',
        }].map((edu, i) => (
          <View key={i} style={styles.eduBlock}>
            <Text style={styles.eduPeriod}>{edu.period}</Text>
            <Text style={styles.eduText}>{edu.text}</Text>
          </View>
        ))}
      </View>
      {/* Kenntnisse & Fähigkeiten */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
        <View style={styles.skillSection}>
          <Text style={styles.skillTitle}>Sprachen</Text>
          <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>Deutsch</Text>
            <Text style={styles.skillValue}>Muttersprache</Text>
            <Text style={styles.skillLabel}>Englisch</Text>
            <Text style={styles.skillValue}>Gute Kenntnisse</Text>
            <Text style={styles.skillLabel}>Französisch</Text>
            <Text style={styles.skillValue}>Gute Kenntnisse</Text>
          </View>
          <Text style={[styles.skillTitle, { marginTop: 6 }]}>Führerschein</Text>
          <Text style={styles.skillValue}>Kategorie B</Text>
          <Text style={[styles.skillTitle, { marginTop: 6 }]}>Programme</Text>
          <Text style={styles.skillValue}>SAP</Text>
        </View>
      </View>
    </Page>
  </Document>
); 