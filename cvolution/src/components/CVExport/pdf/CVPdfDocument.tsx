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
    marginRight: "5%"
  },
  sidebarRight: {
    width: "12%",
    backgroundColor: "#005B82",
  },
  main: {
    flexGrow: 1,
    flexDirection: "column", // Inhalt wieder spaltenweise
    padding: 25,
    paddingRight: 55,
    maxWidth: "76%",
  },
  header: {
    marginBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#005B82",
  },
  headline: {
    fontSize: 20,
    color: "gray",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 6,
    color: "#005B82",
    borderBottom: "1 solid #005B82",
    paddingBottom: 3,
  },
  sectionTitleExperience: {
    fontSize: 13,
    fontWeight: "bold",
    // marginTop: 20,
    marginBottom: 6,
    color: "#005B82",
    borderBottom: "1 solid #005B82",
    paddingBottom: 3,
  },
  sectionTitleFirst: {
    fontSize: 13,
    fontWeight: "bold",
    // marginTop: 18,
    marginBottom: 6,
    color: "#005B82",
    borderBottom: "1 solid #005B82",
    paddingBottom: 3,
  },
  itemTitle: { fontSize: 11, fontWeight: "bold", marginTop: 3 },
  itemSubtitle: { fontSize: 10, color: "gray" },
  itemText: { fontSize: 10, marginBottom: 10 },
  expDescriptionText: {
    fontSize: 10,
    // marginBottom: 2,
  },
  descriptionList: {
    marginLeft: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  descriptionListItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 2,
  },
  descriptionBullet: {
    width: 12,
    fontSize: 10,
  },
  descriptionText: {
    fontSize: 10,
    flex: 1,
  },
  skill: { fontSize: 10, marginBottom: 3 },
  language: { fontSize: 10, marginBottom: 3 },
});

// Helper function to format bullet points correctly
const formatBulletPoints = (text: string) => {
  if (!text) return null;
  const lines = text.split(/\r?\n/).filter(line => line.trim());

  return (
    <View style={styles.descriptionList}>
      {lines.map((line, idx) => {
        // Check if line starts with a bullet point (•, *, -, or similar)
        const bulletMatch = line.match(/^[\s]*(•|\-|\*)/);
        const hasBullet = !!bulletMatch;
        const cleanLine = hasBullet ? line.replace(/^[\s]*(•|\-|\*)[\s]*/, '') : line;

        return (
          <View key={idx} style={styles.descriptionListItem}>
            <Text style={styles.descriptionBullet}>
              {hasBullet ? bulletMatch[1] : ''}
            </Text>
            <Text style={styles.descriptionText}>{cleanLine}</Text>
          </View>
        );
      })}
    </View>
  );
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
  // Calculate available space and ensure complete experiences fit on each page
const FIRST_PAGE_AVAILABLE_HEIGHT = 500; // Conservative estimate for space after header and contact info
const CONTINUATION_PAGE_HEIGHT = 700; // Full page height for continuation pages
const EDUCATION_SKILLS_ESTIMATE = 250; // Estimated space needed for education and skills sections

let experiencesFirstPage: any[] = [];
let experiencesPages: any[][] = []; // Array of arrays, each containing experiences for one page
let showEducationSkillsOnFirstPage = false;
let showEducationOnLastExpPage = false;
let showSkillsOnSeparatePage = false;

const estimateExpHeight = (exp: any) => {
  const titleHeight = 20; // Job title with margin
  const companyLocationHeight = 20; // Company, location, dates with margin
  const descriptionLines = exp.description ? exp.description.split(/\r?\n/).length : 0;
  const descriptionHeight = descriptionLines * 15; // Each line approximately 15pt including line height
  const spacing = 25; // Margin between experiences
  return titleHeight + companyLocationHeight + descriptionHeight + spacing;
};

let currentPageHeight = 0;
for (const exp of sortedExperiences) {
  const totalExpHeight = estimateExpHeight(exp);

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
    // Doesn't fit on first page, need to distribute to continuation pages
    break;
  }
}

// Check if education and skills fit on first page
if (currentPageHeight + EDUCATION_SKILLS_ESTIMATE <= FIRST_PAGE_AVAILABLE_HEIGHT && experiencesFirstPage.length === sortedExperiences.length) {
  showEducationSkillsOnFirstPage = true;
}

// Now distribute remaining experiences across continuation pages
const remainingExps = sortedExperiences.slice(experiencesFirstPage.length);
let currentContinuationPage: any[] = [];
let continuationPageHeight = 0;

for (const exp of remainingExps) {
  const totalExpHeight = estimateExpHeight(exp);

  if (currentContinuationPage.length === 0) {
    // First experience on a new continuation page
    currentContinuationPage.push(exp);
    continuationPageHeight = totalExpHeight;
  } else if (continuationPageHeight + totalExpHeight <= CONTINUATION_PAGE_HEIGHT) {
    // Fits on current continuation page
    currentContinuationPage.push(exp);
    continuationPageHeight += totalExpHeight;
  } else {
    // Doesn't fit, start a new page
    experiencesPages.push(currentContinuationPage);
    currentContinuationPage = [exp];
    continuationPageHeight = totalExpHeight;
  }
}

// Don't forget to add the last page if it has experiences
if (currentContinuationPage.length > 0) {
  experiencesPages.push(currentContinuationPage);
  // Check if education and skills fit on the last experience page
  if (continuationPageHeight + EDUCATION_SKILLS_ESTIMATE <= CONTINUATION_PAGE_HEIGHT) {
    showEducationOnLastExpPage = true;
  } else {
    // Education fits but skills need separate page
    showEducationOnLastExpPage = true;
    showSkillsOnSeparatePage = true;
  }
}

  return (
    <Document>
      {/* First page: header, contact, experience (first N, but do not split experience) */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}></View>
        <View style={styles.main}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row' }}>
              {/* Bild links */}
              {profile?.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  style={{
                    width: 120,
                    height: 140,
                    objectFit: 'cover',
                    marginTop: 0,
                    border: '10 solid #000000',
                  }}
                />
              ) : (
                <View style={{ width: 120, height: 140, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center', marginTop: 0, border: '10 solid #000000' }}>
                  <Text style={{ color: '#888', fontSize: 18 }}>Foto</Text>
                </View>
              )}
              <View style={{ marginLeft: 16, marginTop: 0 }}>
                <Text style={styles.name}>
                  {profile?.full_name?.toUpperCase().replace(/ /g, '\n')}
                </Text>
                <Text style={styles.headline}>{profile?.headline}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.sectionTitleFirst}>Kontaktdaten</Text>
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
            <Text style={styles.sectionTitleExperience}>Berufserfahrung</Text>
            <View>
              {Array.isArray(experiencesFirstPage)
                ? experiencesFirstPage.map((exp) => (
                    <View key={exp.id ?? Math.random()}>
                      <Text style={styles.itemTitle}>
                        {exp.job_title || ""}
                      </Text>
                      <Text>
                        <Text style={styles.itemTitle}>{exp.company || ""}</Text>
                        <Text style={styles.itemTitle}>, {exp.location || ""} </Text>
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

          {/* Show education and skills on first page if there's space */}
          {showEducationSkillsOnFirstPage && (
            <>
              <View wrap={false}>
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
                              <Text style={styles.itemTitle}>{edu.institution || ""} , </Text>
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
              <View wrap={false}>
                <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <Text style={{ width: 120, fontWeight: 'bold' }}>Fremdsprachen</Text>
                    <View style={{ flexDirection: 'row', flexGrow: 1 }}>
                      <View style={{ width: 100 }}>
                        {Array.isArray(languages) && languages.length > 0 ? (
                          languages.map((lang) => (
                            <Text key={lang.id ?? Math.random()}>{lang.language_name?.split(' ')[0]}</Text>
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
                            const displayProf = prof?.split(' ')[0] || prof;
                            return <Text key={lang.id ?? Math.random()}>{displayProf}</Text>;
                          })
                        ) : (
                          <Text>-</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <Text style={{ width: 120, fontWeight: 'bold' }}>Fähigkeiten</Text>
                    <View style={{ flexGrow: 1 }}>
                      {(() => {
                        const otherSkills = Array.isArray(skills)
                          ? skills.filter((s) => s.skill_name && (!s.category || s.category.toLowerCase() !== 'führerschein'))
                          : [];

                        if (otherSkills.length === 0) {
                          return <Text>-</Text>;
                        }

                        return otherSkills.map((s) => (
                          <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>• {s.skill_name}</Text>
                        ));
                      })()}
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                    <Text style={{ width: 120, fontWeight: 'bold' }}>Führerschein</Text>
                    <View style={{ flexGrow: 1 }}>
                      {(() => {
                        const driverLicenses = Array.isArray(skills)
                          ? skills.filter((s) => s.skill_name && s.category && s.category.toLowerCase() === 'führerschein')
                          : [];

                        if (driverLicenses.length === 0) {
                          return <Text>-</Text>;
                        }

                        return driverLicenses.map((s) => {
                          const displayName = s.skill_name
                            .replace(/Führerschein Kategorie /gi, '')
                            .replace(/Führerschein/gi, '')
                            .trim();

                          return (
                            <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>
                              Kategorie {displayName || s.skill_name}
                            </Text>
                          );
                        });
                      })()}
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
        {/* Rechte Sidebar */}
        <View style={styles.sidebarRight}></View>
      </Page>

      {/* Additional pages for extra experiences - multiple experiences per page */}
      {experiencesPages.length > 0 ? (
        experiencesPages.map((pageExps: any[], pageIdx: number) => {
          const isLastExperiencePage = pageIdx === experiencesPages.length - 1;

          return (
            <Page key={`page-${pageIdx}`} size="A4" style={styles.page}>
              <View style={styles.sidebar}></View>
              <View style={styles.main}>
                <View>
                  {pageExps.map((exp: any) => (
                    <View key={exp.id ?? Math.random()}>
                      <Text style={styles.itemTitle}>
                        {exp.job_title || ""}
                      </Text>
                      <Text>
                        <Text style={styles.itemTitle}>{exp.company || ""}</Text>
                        <Text style={styles.itemTitle}> , {exp.location || ""} </Text>
                        <Text style={styles.itemText}>
                          | {formatDate(exp.start_date)} - {exp.is_current ? "Heute" : formatDate(exp.end_date)} |
                        </Text>
                      </Text>
                      <Text style={styles.itemSubtitle}> </Text>
                      {exp.description
                        ? formatBulletPoints(exp.description)
                        : null}
                    </View>
                  ))}
                </View>

                {/* Add education and skills on the last experience page if there's space */}
                {isLastExperiencePage && showEducationOnLastExpPage && (
                  <>
                    <View wrap={false}>
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
                                    <Text style={styles.itemTitle}>{edu.institution || ""} , </Text>
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
                    {!showSkillsOnSeparatePage && (
                      <View wrap={false}>
                        <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
                        <View style={{ marginTop: 10 }}>
                          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                            <Text style={{ width: 120, fontWeight: 'bold' }}>Fremdsprachen</Text>
                            <View style={{ flexDirection: 'row', flexGrow: 1 }}>
                              <View style={{ width: 100 }}>
                                {Array.isArray(languages) && languages.length > 0 ? (
                                  languages.map((lang) => (
                                    <Text key={lang.id ?? Math.random()}>{lang.language_name?.split(' ')[0]}</Text>
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
                                    const displayProf = prof?.split(' ')[0] || prof;
                                    return <Text key={lang.id ?? Math.random()}>{displayProf}</Text>;
                                  })
                                ) : (
                                  <Text>-</Text>
                                )}
                              </View>
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                            <Text style={{ width: 120, fontWeight: 'bold' }}>Fähigkeiten</Text>
                            <View style={{ flexGrow: 1 }}>
                              {(() => {
                                const otherSkills = Array.isArray(skills)
                                  ? skills.filter((s) => s.skill_name && (!s.category || s.category.toLowerCase() !== 'führerschein'))
                                  : [];

                                if (otherSkills.length === 0) {
                                  return <Text>-</Text>;
                                }

                                return otherSkills.map((s) => (
                                  <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>• {s.skill_name}</Text>
                                ));
                              })()}
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                            <Text style={{ width: 120, fontWeight: 'bold' }}>Führerschein</Text>
                            <View style={{ flexGrow: 1 }}>
                              {(() => {
                                const driverLicenses = Array.isArray(skills)
                                  ? skills.filter((s) => s.skill_name && s.category && s.category.toLowerCase() === 'führerschein')
                                  : [];

                                if (driverLicenses.length === 0) {
                                  return <Text>-</Text>;
                                }

                                return driverLicenses.map((s) => {
                                  const displayName = s.skill_name
                                    .replace(/Führerschein Kategorie /gi, '')
                                    .replace(/Führerschein/gi, '')
                                    .trim();

                                  return (
                                    <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>
                                      Kategorie {displayName || s.skill_name}
                                    </Text>
                                  );
                                });
                              })()}
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>
              <View style={styles.sidebarRight}></View>
            </Page>
          );
        })
      ) : null}

      {/* Separate page for skills if needed */}
      {showSkillsOnSeparatePage && (
        <Page size="A4" style={styles.page}>
          <View style={styles.sidebar}></View>
          <View style={styles.main}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
              <View style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <Text style={{ width: 120, fontWeight: 'bold' }}>Fremdsprachen</Text>
                  <View style={{ flexDirection: 'row', flexGrow: 1 }}>
                    <View style={{ width: 100 }}>
                      {Array.isArray(languages) && languages.length > 0 ? (
                        languages.map((lang) => (
                          <Text key={lang.id ?? Math.random()}>{lang.language_name?.split(' ')[0]}</Text>
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
                          const displayProf = prof?.split(' ')[0] || prof;
                          return <Text key={lang.id ?? Math.random()}>{displayProf}</Text>;
                        })
                      ) : (
                        <Text>-</Text>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <Text style={{ width: 120, fontWeight: 'bold' }}>Fähigkeiten</Text>
                  <View style={{ flexGrow: 1 }}>
                    {(() => {
                      const otherSkills = Array.isArray(skills)
                        ? skills.filter((s) => s.skill_name && (!s.category || s.category.toLowerCase() !== 'führerschein'))
                        : [];

                      if (otherSkills.length === 0) {
                        return <Text>-</Text>;
                      }

                      return otherSkills.map((s) => (
                        <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>• {s.skill_name}</Text>
                      ));
                    })()}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <Text style={{ width: 120, fontWeight: 'bold' }}>Führerschein</Text>
                  <View style={{ flexGrow: 1 }}>
                    {(() => {
                      const driverLicenses = Array.isArray(skills)
                        ? skills.filter((s) => s.skill_name && s.category && s.category.toLowerCase() === 'führerschein')
                        : [];

                      if (driverLicenses.length === 0) {
                        return <Text>-</Text>;
                      }

                      return driverLicenses.map((s) => {
                        const displayName = s.skill_name
                          .replace(/Führerschein Kategorie /gi, '')
                          .replace(/Führerschein/gi, '')
                          .trim();

                        return (
                          <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>
                            Kategorie {displayName || s.skill_name}
                          </Text>
                        );
                      });
                    })()}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.sidebarRight}></View>
        </Page>
      )}

      {/* If no additional experience pages and not shown on first page, create a separate education and skills page */}
      {experiencesPages.length === 0 && !showEducationSkillsOnFirstPage && sortedExperiences.length > 0 && (
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
                          <Text style={styles.itemTitle}>{edu.institution || ""} , </Text>
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
                        <Text key={lang.id ?? Math.random()}>{lang.language_name?.split(' ')[0]}</Text>
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
                        // Take only first part before space
                        const displayProf = prof?.split(' ')[0] || prof;
                        return <Text key={lang.id ?? Math.random()}>{displayProf}</Text>;
                      })
                    ) : (
                      <Text>-</Text>
                    )}
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ width: 120, fontWeight: 'bold' }}>Fähigkeiten</Text>
                <View style={{ flexGrow: 1 }}>
                  {(() => {
                    const otherSkills = Array.isArray(skills)
                      ? skills.filter((s) => s.skill_name && (!s.category || s.category.toLowerCase() !== 'führerschein'))
                      : [];

                    if (otherSkills.length === 0) {
                      return <Text>-</Text>;
                    }

                    return otherSkills.map((s) => (
                      <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>• {s.skill_name}</Text>
                    ));
                  })()}
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text style={{ width: 120, fontWeight: 'bold' }}>Führerschein</Text>
                <View style={{ flexGrow: 1 }}>
                  {(() => {
                    const driverLicenses = Array.isArray(skills)
                      ? skills.filter((s) => s.skill_name && s.category && s.category.toLowerCase() === 'führerschein')
                      : [];

                    if (driverLicenses.length === 0) {
                      return <Text>-</Text>;
                    }

                    return driverLicenses.map((s) => {
                      // Remove "Führerschein Kategorie " from the name and trim
                      const displayName = s.skill_name
                        .replace(/Führerschein Kategorie /gi, '')
                        .replace(/Führerschein/gi, '')
                        .trim();

                      return (
                        <Text key={s.id ?? Math.random()} style={{ marginBottom: 2 }}>
                          Kategorie {displayName || s.skill_name}
                        </Text>
                      );
                    });
                  })()}
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Rechte Sidebar */}
        <View style={styles.sidebarRight}></View>
      </Page>
      )}
    </Document>
  );
};

