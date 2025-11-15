import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface CVPdfDesign2Props {
  user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

// (Sorting logic moved inside the component)

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
    marginRight: "5%"
  },
  sidebarRight: {
    width: "12%",
    backgroundColor: "#f2f2f2",
  },
  main: {
    flexGrow: 1,
    flexDirection: "column", // Inhalt wieder spaltenweise
    padding: 25,
    paddingRight: 66,
    maxWidth: "76%",
  },
  header: {
    marginBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#252525",
  },
  headline: {
    fontSize: 20,
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
}) => {
  // Split experiences so that no experience is split between pages
  // Calculate available space and ensure complete experiences fit on each page
  const FIRST_PAGE_AVAILABLE_HEIGHT = 320; // Conservative estimate for space after header and contact info
  const CONTINUATION_PAGE_HEIGHT = 700; // Full page height for continuation pages
  let experiencesFirstPage: any[] = [];
  let experiencesExtraPages: any[] = [];

  let currentPageHeight = 0;
  for (const exp of experiences) {
    // Estimate height for this experience - be conservative to avoid splitting
    const titleHeight = 20; // Job title with margin
    const companyLocationHeight = 20; // Company, location, dates with margin
    const descriptionLines = exp.description ? exp.description.split(/\r?\n/).length : 0;
    const descriptionHeight = descriptionLines * 15; // Each line approximately 15pt including line height
    const spacing = 25; // Margin between experiences
    const totalExpHeight = titleHeight + companyLocationHeight + descriptionHeight + spacing;

    // Check if this experience fits on the current page
    if (experiencesFirstPage.length === 0) {
      // First experience always goes on first page
      experiencesFirstPage.push(exp);
      currentPageHeight += totalExpHeight;
    } else if (currentPageHeight + totalExpHeight <= FIRST_PAGE_AVAILABLE_HEIGHT) {
      // Fits on first page
      experiencesFirstPage.push(exp);
      currentPageHeight += totalExpHeight;
    } else {
      // Doesn't fit, move to extra pages
      experiencesExtraPages.push(exp);
    }
  }

  return (
    <Document>
      {/* First page: header, contact, experience */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}></View>
        <View style={styles.main}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row'}}>
              <View style={{ flexGrow: 1 }}>
                <Text style={styles.name}>
                  {profile?.full_name?.toUpperCase().replace(/ /g, '\n')}
                </Text>
                <Text style={styles.headline}>{profile?.headline}</Text>
              </View>
              {profile?.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  style={{
                    width: 120,
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 1,
                    marginLeft: 50,
                    marginTop: 0,
                  }}
                />
              ) : (
                <View style={{ width: 120, height: 140, backgroundColor: 'lightgray', borderRadius: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 40, marginTop: 0, border: '2 solid black' }}>
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
            <View>
              {Array.isArray(experiencesFirstPage)
                ? experiencesFirstPage.map((exp) => (
                    <View key={exp.id ?? Math.random()} style={styles.itemText}>
                      <Text style={styles.itemTitle}>{exp.job_title || ""}</Text>
                      <Text>
                        <Text style={styles.itemTitle}>{exp.company || ""}</Text>
                        <Text style={styles.itemTitle}> , {exp.location || ""} </Text>
                        <Text style={styles.itemText}>
                          | {formatDate(exp.start_date)} - {exp.is_current ? "Heute" : formatDate(exp.end_date)} |
                        </Text>
                      </Text>
                      <Text style={styles.itemSubtitle}> </Text>
                      {exp.description
                        ? exp.description.split(/\r?\n/).map((line: string, idx: number) => (
                            line.trim() ? <Text style={styles.itemText} key={idx}>{line}</Text> : null
                          ))
                        : null}
                    </View>
                  ))
                : null}
            </View>
          </View>
        </View>
        {/* Rechte Sidebar */}
        <View style={styles.sidebarRight}></View>
      </Page>
      {/* Additional pages for extra experiences */}
      {experiencesExtraPages.length > 0 && (
        experiencesExtraPages.map((exp, idx) => (
          <Page key={exp.id ?? idx} size="A4" style={styles.page}> 
            <View style={styles.sidebar}></View>
            <View style={styles.main}>
              <View>
                <Text style={styles.sectionTitle}>{idx === 0 ? "Berufserfahrung" : "Berufserfahrung"}</Text>
                <View style={styles.itemText}>
                  <View key={exp.id ?? Math.random()}>
                    <Text style={styles.itemTitle}>{exp.job_title || ""}</Text>
                    <Text>
                      <Text style={styles.itemTitle}>{exp.company || ""}</Text>
                      <Text style={styles.itemTitle}> , {exp.location || ""} </Text>
                      <Text style={styles.itemText}>
                        | {formatDate(exp.start_date)} - {exp.is_current ? "Heute" : formatDate(exp.end_date)} |
                      </Text>
                    </Text>
                    <Text style={styles.itemSubtitle}> </Text>
                    {exp.description
                      ? exp.description.split(/\r?\n/).map((line: string, idx: number) => (
                          line.trim() ? <Text style={styles.itemText} key={idx}>{line}</Text> : null
                        ))
                      : null}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.sidebarRight}></View>
          </Page>
        ))
      )}
      {/* Second page: education and skills */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}></View>
        <View style={styles.main}>
          <View>
            <Text style={styles.sectionTitle}>Aus- & Weiterbildungen</Text>
            <View>
              {Array.isArray(education)
                ? education.map((edu) => (
                    <View key={edu.id ?? Math.random()}>
                      <Text style={styles.itemTitle}>{edu.degree || ""}</Text>
                      <Text>
                        <Text style={styles.itemTitle}>{edu.institution || ""} , </Text>
                        <Text style={styles.itemTitle}>{edu.place || ""} | </Text>
                        <Text style={styles.itemText}>
                          {formatDate(edu.start_date)} - {edu.is_current ? "heute" : formatDate(edu.end_date)}
                        </Text>
                      </Text>
                      <Text style={styles.itemSubtitle}>{edu.field_of_study || ""}</Text>
                      {edu.description
                        ? edu.description.split(/\r?\n/).map((line: string, idx: number) => (
                            line.trim() ? <Text style={styles.itemText} key={idx}>{line}</Text> : null
                          ))
                        : null}
                    </View>
                  ))
                : []}
            </View>
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
        <View style={styles.sidebarRight}></View>
      </Page>
    </Document>
  );
};