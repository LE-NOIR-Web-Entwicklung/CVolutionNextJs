import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface CVPdfDesign2Props {
  user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

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
    backgroundColor: "#f2f2f2",
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
    color: "#252525",
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
    color: "#252525",
    borderBottom: "1 solid #f2f2f2",
    paddingBottom: 3,
  },
  itemTitle: { fontSize: 11, fontWeight: "bold", marginTop: 8 },
  itemSubtitle: { fontSize: 10, color: "gray" },
  itemText: { fontSize: 10, marginBottom: 10 },
  skill: { fontSize: 10, marginBottom: 3 },
  language: { fontSize: 10, marginBottom: 3 },
});
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

export const CVPdfDesign2: React.FC<CVPdfDesign2Props> = ({
  user,
  profile,
  experiences,
  education,
  skills,
  languages,
}) => (
  <Document>
    {/* First page: header, contact, experience */}
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}></View>
      <View style={styles.main}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.name}>{profile?.full_name}</Text>
              <Text style={styles.headline}>{profile?.headline}</Text>
            </View>
            {profile?.profile_picture_url ? (
              <Image src={profile.profile_picture_url} style={{ maxHeight: 120, borderRadius: 1, marginLeft: 16 }} />
            ) : (
              <View style={{ width: 100, height: 120, backgroundColor: 'lightgray', borderRadius: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 16 }}>
                <Text style={{ color: '#888', fontSize: 18 }}>Foto</Text>
              </View>
            )}
          </View>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Kontaktdaten</Text>
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <View style={{ flexDirection: 'column', width: 60 }}>
              <Text style={styles.itemText}>Standort:</Text>
              <Text style={styles.itemText}>Telefon:</Text>
              <Text style={styles.itemText}>E-Mail:</Text>
              <Text style={styles.itemText}>Geburtstag:</Text>
              <Text style={styles.itemText}>Zivilstand:</Text>
              <Text style={styles.itemText}>Heimatort:</Text>
            </View>
            <View style={{ flexDirection: 'column', marginLeft: 0, flexGrow: 1 }}>
              <Text style={styles.itemText}>{profile?.location || '-'}</Text>
              <Text style={styles.itemText}>{profile?.phone || '-'}</Text>
              <Text style={styles.itemText}>{user?.email || '-'}</Text>
              <Text style={styles.itemText}>{formatBirthDate(profile?.birthdate) || '-'}</Text>
              <Text style={styles.itemText}>{profile?.civil_status || '-'}</Text>
              <Text style={styles.itemText}>{profile?.place_of_origin || '-'}</Text>
            </View>
          </View>
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
                
                      <Text style={styles.itemSubtitle}> </Text>
                      {exp.description
                        ? exp.description.split(/\r?\n/).map((line: string, idx: number) => (
                            line.trim() ? <Text style={styles.itemText} key={idx}>• {line}</Text> : null
                          ))
                        : null}
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
                      {edu.description
                        ? edu.description.split(/\r?\n/).map((line: string, idx: number) => (
                            line.trim() ? <Text style={styles.itemText} key={idx}>• {line}</Text> : null
                          ))
                        : null}
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
              <View style={{ flexGrow: 1 }}>
                {Array.isArray(skills) && skills.length > 0 ? (
                  skills
                    .filter((s) => s.skill_name && s.category.toLowerCase() === 'führerschein')
                    .map((s) => (
                      <Text key={s.id ?? Math.random()}>{s.skill_name}</Text>
                    ))
                ) : (
                  <Text>-</Text>
                )}
              </View>        </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ width: 120, fontWeight: 'bold' }}>Programme</Text>
              <View style={{ flexGrow: 1 }}>
                {Array.isArray(skills) && skills.length > 0 ? (
                  skills
                    .filter((s) => s.skill_name && s.category.toLowerCase() !== 'führerschein')
                    .map((s) => (
                      <Text key={s.id ?? Math.random()}>{s.skill_name}</Text>
                    ))
                ) : (
                  <Text>-</Text>
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