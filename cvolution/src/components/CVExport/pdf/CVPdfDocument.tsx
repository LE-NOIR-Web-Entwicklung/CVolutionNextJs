import { CVPdfDesign2 } from './CVPdfDesign2';
import { CVPdfDesign3 } from './CVPdfDesign3';

interface CVPdfDocumentProps {
    user: any;
    profile: any;
    experiences: any[];
    education: any[];
    skills: any[];
    languages: any[];
    design?: 'design1' | 'design2' | 'design3'; // <-- add design prop

}

// Design 1 (default)
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
const styles = StyleSheet.create({
  page: {
    flexDirection: "row", // Sidebar links, Inhalt, Sidebar rechts
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  sidebar: {
    width: "12%",
    backgroundColor: "#005B82",
  },
  main: {
    flexGrow: 1,
    flexDirection: "column", // Inhalt wieder spaltenweise
    padding: 25,
  },
  header: {
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#005B82",
  },
  headline: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 6,
    color: "#005B82",
    borderBottom: "1 solid #005B82",
    paddingBottom: 3,
  },
  itemTitle: { fontSize: 11, fontWeight: "bold", marginTop: 8 },
  itemSubtitle: { fontSize: 10, color: "gray" },
  itemText: { fontSize: 10, marginBottom: 20 },
  skill: { fontSize: 10, marginBottom: 3 },
  language: { fontSize: 10, marginBottom: 3 },
});


export const CVPdfDocument: React.FC<CVPdfDocumentProps> = (props) => {
  const { user, profile, experiences, education, skills, languages, design } = props;

    // Hilfsfunktion für Datumsformatierung
    function formatDate(dateString: string) {
      if (!dateString) return "";
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${month}.${year}`;
    }

    function formatBirthDate(dateString: string) {
      if (!dateString) return "";
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    }
  console.log("CVPdfDocument design prop:", design);
  console.log("CVPdfDocument profile picture URL:", profile?.profile_picture_url);

   if (design === 'design2') {
    return <CVPdfDesign2 user={user} profile={profile} experiences={experiences} education={education} skills={skills} languages={languages} />;
  }
  if (design === 'design3') {
    return <CVPdfDesign3 user={user} profile={profile} experiences={experiences} education={education} skills={skills} languages={languages} />;
  }
  // Default: Design 1
  return (
    <Document>
      {/* First page: header, contact, experience */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}></View>
        <View style={styles.main}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Bild links */}
              {profile?.profile_picture_url ? (
                <Image src={profile.profile_picture_url} style={{ maxHeight: 120, borderRadius: 1 }} />
              ) : (
                <View style={{ width: 100, height: 120, backgroundColor: 'lightgray', borderRadius: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#888', fontSize: 18 }}>Foto</Text>
                </View>
              )}
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.name}>{profile?.full_name}</Text>
                <Text style={styles.headline}>{profile?.headline}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Kontaktdaten</Text>
            <Text style={styles.itemText}>Standort: {profile?.location}</Text>
            <Text style={styles.itemText}>Telefon: {profile?.phone}</Text>
            <Text style={styles.itemText}>E-Mail: {user?.email}</Text>
            <Text style={styles.itemText}>Geburtstag: {formatBirthDate(profile?.birthdate)}</Text>
            <Text style={styles.itemText}>Zivilstand: {profile?.civil_status}</Text>
            <Text style={styles.itemText}>Heimatort: {profile?.place_of_origin}</Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>Berufserfahrung</Text>
            <View
              render={() =>
                Array.isArray(experiences)
                  ? experiences.map((exp) => (
                      <View key={exp.id ?? Math.random()}>
                        <Text style={styles.itemTitle}>
                          {exp.job_title || ""}
                          
                        </Text>
                        <Text>
                          <Text style={styles.itemTitle}>{exp.company || ""}</Text>
                          <Text style={styles.itemTitle}> | {exp.location || ""} </Text>
                          <Text style={styles.itemText}>
                            | {formatDate(exp.start_date)} - {exp.is_current ? "Heute" : formatDate(exp.end_date)} |
                          </Text>
                        </Text>
                  
                        <Text style={styles.itemTitle}>Tätigkeiten</Text>
                        <Text style={styles.itemText}>{exp.description || ""}</Text>
                      </View>
                    ))
                  : []
              }
            />
          </View>
        </View>
        {/* Rechte Sidebar */}
        <View style={styles.sidebar}></View>
      </Page>
      {/* Second page: education and skills */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}></View>
        <View style={styles.main}>
          <View>
            <Text style={styles.sectionTitle}>Aus- & Weiterbildungen</Text>
            <View
              render={() =>
                Array.isArray(education)
                  ? education.map((edu) => (
                      <View key={edu.id ?? Math.random()}>
                        <Text style={styles.itemTitle}>
                          {edu.degree || ""}
                        </Text>
                        <Text>
                          <Text style={styles.itemTitle}>{edu.institution || ""} | </Text>
                          <Text style={styles.itemText}>
                            {formatDate(edu.start_date)} - {edu.is_current ? "heute" : formatDate(edu.end_date)}
                          </Text>
                        </Text>
                        <Text>

                        </Text>
                        <Text style={styles.itemSubtitle}>{edu.field_of_study || ""}</Text>
                        <Text style={styles.itemText}>{edu.description || ""}</Text>
                      </View>
                    ))
                  : []
              }
            />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ width: 120, fontWeight: 'bold' }}>Fremdsprachen</Text>
                <View style={{ flexDirection: 'row', flexGrow: 1 }}>
                  <View style={{ width: 100 }}>
                    {Array.isArray(languages) && languages.length > 0 ? (
                      languages.map((lang) => (
                        <Text key={lang.id ?? Math.random()}>{lang.language_name}</Text>
                      ))
                    ) : (
                      <Text>-</Text>
                    )}
                  </View>
                  <View style={{ width: 100 }}>
                    {Array.isArray(languages) && languages.length > 0 ? (
                      languages.map((lang) => {
                        let prof = lang.proficiency;
                        if (prof === 'beginner') prof = 'Anfänger';
                        else if (prof === 'intermediate') prof = 'Mittelstufe';
                        else if (prof === 'advanced') prof = 'Fortgeschritten';
                        else if (prof === 'expert') prof = 'Experte';
                        else if (prof === 'native') prof = 'Muttersprache';
                        return <Text key={lang.id ?? Math.random()}>{prof}</Text>;
                      })
                    ) : (
                      <Text>-</Text>
                    )}
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ width: 120, fontWeight: 'bold' }}>Führerschein</Text>
                <Text>Kategorie B</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ width: 120, fontWeight: 'bold' }}>Programme</Text>
                <View style={{ flexGrow: 1 }}>
                  {Array.isArray(skills) && skills.length > 0 ? (
                    skills.map((s) => (
                      <Text key={s.id ?? Math.random()}>{s.skill_name}</Text>
                    ))
                  ) : (
                    <Text>SAP</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Rechte Sidebar */}
        <View style={styles.sidebar}></View>
      </Page>
    </Document>
  );
};
  
