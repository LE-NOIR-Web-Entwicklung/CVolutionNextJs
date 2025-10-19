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
  itemText: { fontSize: 10, marginBottom: 10 },
  skill: { fontSize: 10, marginBottom: 3 },
  language: { fontSize: 10, marginBottom: 3 },
});

// Helper function to format bullet points correctly
const formatBulletPoints = (text: string) => {
  if (!text) return null;
  return text.split(/\r?\n/).map((line, idx) => {
    if (line.trim().startsWith('-')) {
      return (
        <Text key={idx} style={{ ...styles.itemText, marginLeft: 10 }}>
          {line.trim()}
        </Text>
      );
    }
    return line.trim() ? (
      <Text key={idx} style={styles.itemText}>
        {line}
      </Text>
    ) : null;
  });
};

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

    // Sortiere experiences: aktuell zuerst, dann nach neustem Enddatum
    const sortedExperiences = Array.isArray(experiences)
      ? [...experiences].sort((a, b) => {
          if (a.is_current && !b.is_current) return -1;
          if (!a.is_current && b.is_current) return 1;
          // Beide nicht aktuell: nach Enddatum absteigend
          const aDate = a.end_date ? new Date(a.end_date).getTime() : 0;
          const bDate = b.end_date ? new Date(b.end_date).getTime() : 0;
          return bDate - aDate;
        })
      : [];

          // Sortiere education: aktuell zuerst, dann nach neustem Enddatum
    const sortedEducation = Array.isArray(education)
      ? [...education].sort((a, b) => {
          if (a.is_current && !b.is_current) return -1;
          if (!a.is_current && b.is_current) return 1;
          // Beide nicht aktuell: nach Enddatum absteigend
          const aDate = a.end_date ? new Date(a.end_date).getTime() : 0;
          const bDate = b.end_date ? new Date(b.end_date).getTime() : 0;
          return bDate - aDate;
        })
      : [];

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
    return <CVPdfDesign2 user={user} profile={profile} experiences={sortedExperiences} education={sortedEducation} skills={skills} languages={languages} />;
  }
  if (design === 'design3') {
    return <CVPdfDesign3 user={user} profile={profile} experiences={sortedExperiences} education={sortedEducation} skills={skills} languages={languages} />;
  }
  // Default: Design 1
  // Split experiences so that no experience is split between pages
  // Adjust logic to prevent splitting experiences with bullet points across pages
const MAX_EXPERIENCES_FIRST_PAGE = 6; // adjust as needed for spacing
let experiencesFirstPage = [];
let experiencesExtraPages = [];
if (sortedExperiences.length > MAX_EXPERIENCES_FIRST_PAGE) {
  // Ensure no experience with bullet points splits across pages
  let currentPageCount = 0;
  for (const exp of sortedExperiences) {
    const bulletPointCount = exp.description ? exp.description.split(/\r?\n/).length : 0;
    const estimatedHeight = bulletPointCount * 10; // Adjust height estimation as needed

    if (currentPageCount + estimatedHeight > MAX_EXPERIENCES_FIRST_PAGE) {
      experiencesExtraPages.push(exp);
    } else {
      experiencesFirstPage.push(exp);
      currentPageCount += estimatedHeight;
    }
  }
} else {
  experiencesFirstPage = sortedExperiences;
  experiencesExtraPages = [];
}

  return (
    <Document>
      {/* First page: header, contact, experience (first N, but do not split experience) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}></View>
        <View style={styles.main}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Bild links */}
              {profile?.profile_picture_url ? (
                <Image src={profile.profile_picture_url} style={{ maxHeight: 170, borderRadius: 1 }} />
              ) : (
                <View style={{ width: 80, height: 100, backgroundColor: 'lightgray', borderRadius: 1, justifyContent: 'center', alignItems: 'center' }}>
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
            <View>
              {Array.isArray(experiencesFirstPage)
                ? experiencesFirstPage.map((exp) => (
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
                        ? formatBulletPoints(exp.description)
                        : null}
                    </View>
                  ))
                : null}
            </View>
          </View>
        </View>
        {/* Rechte Sidebar */}
        <View style={styles.sidebar}></View>
      </Page>

      {/* Additional pages for extra experiences */}
      {experiencesExtraPages.length > 0 && (
        experiencesExtraPages.map((exp, idx) => (
          <Page key={exp.id ?? idx} size="A4" style={styles.page}> 
            <View style={styles.sidebar}></View>
            <View style={styles.main}>
              <View>
                <Text style={styles.sectionTitle}>{idx === 0 ? "Berufserfahrung (Fortsetzung)" : "Berufserfahrung"}</Text>
                <View>
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
                      ? formatBulletPoints(exp.description)
                      : null}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.sidebar}></View>
          </Page>
        ))
      )}

      {/* Second page: education and skills */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}></View>
        <View style={styles.main}>
          <View>
            <Text style={styles.sectionTitle}>Aus- & Weiterbildungen</Text>
            <View
              render={() =>
                Array.isArray(sortedEducation)
                  ? sortedEducation.map((edu) => (
                      <View key={edu.id ?? Math.random()}>
                        <Text style={styles.itemTitle}>
                          {edu.degree || ""}
                        </Text>
                        <Text>
                          <Text style={styles.itemTitle}>{edu.institution || ""} | </Text>
                          <Text style={styles.itemTitle}>{edu.place || ""} | </Text>
                          <Text style={styles.itemText}>
                            {formatDate(edu.start_date)} - {edu.is_current ? "heute" : formatDate(edu.end_date)}
                          </Text>
                        </Text>
                        <Text>

                        </Text>
                        <Text style={styles.itemSubtitle}>{edu.field_of_study || ""}</Text>
                        {edu.description
                          ? edu.description.split(/\r?\n/).map((line: string, idx: number) => (
                              line.trim() ? <Text style={styles.itemText} key={idx}>{line}</Text> : null
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
                        if (prof === 'beginner') prof = 'C1';
                        else if (prof === 'intermediate') prof = 'C2';
                        else if (prof === 'advanced') prof = 'B2';
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
                      .filter((s) => s.skill_name && s.category && s.category.toLowerCase() === 'führerschein')
                      .map((s) => (
                        <Text key={s.id ?? Math.random()}>{s.skill_name}</Text>
                      ))
                  ) : (
                    <Text>-</Text>
                  )}
                </View>        </View>
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ width: 120, fontWeight: 'bold' }}>Fähigkeiten</Text>
                <View style={{ flexGrow: 1 }}>
                  {Array.isArray(skills) && skills.length > 0 ? (
                    skills
                      .filter((s) => s.skill_name && (!s.category || s.category.toLowerCase() !== 'führerschein'))
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
};

