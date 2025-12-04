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
    marginTop: 9,
    marginBottom: 6,
    color: "#252525",
    borderBottom: "1 solid #f2f2f2",
    paddingBottom: 3,
  },
  sectionTitleFirst: {
    fontSize: 13,
    fontWeight: "bold",
    // marginTop: 18,
    marginBottom: 6,
    color: "#252525",
    borderBottom: "1 solid #f2f2f2",
    paddingBottom: 3,
  },
  itemTitle: { fontSize: 11, fontWeight: "bold", marginTop: 8 },
  itemSubtitle: { fontSize: 10, color: "gray" },
  itemText: { fontSize: 10, marginBottom: 10 },
  expDescriptionText: {
    fontSize: 10,
    marginBottom: 2,
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
  const FIRST_PAGE_AVAILABLE_HEIGHT = 700; // Conservative - leave room for education/skills
  const CONTINUATION_PAGE_HEIGHT = 700; // Full page height for continuation pages
  let experiencesFirstPage: any[] = [];
  let experiencesPages: any[][] = []; // Array of arrays, each containing experiences for one page
  let showEducationOnFirstPage = false;
  let showSkillsOnFirstPage = false;

  const estimateExpHeight = (exp: any) => {
    const titleHeight = 20; // Job title with margin
    const companyLocationHeight = 20; // Company, location, dates with margin
    const descriptionLines = exp.description ? exp.description.split(/\r?\n/).length : 0;
    const descriptionHeight = descriptionLines * 15; // Each line approximately 15pt including line height
    const spacing = 25; // Margin between experiences
    return titleHeight + companyLocationHeight + descriptionHeight + spacing;
  };

  const estimateEducationHeight = () => {
    const sectionTitleHeight = 30;
    const itemHeight = education.length * 60; // Approximate height per education item
    return sectionTitleHeight + itemHeight;
  };

  const estimateSkillsHeight = () => {
    const sectionTitleHeight = 30;
    const languagesHeight = Math.max(1, (languages?.length || 0)) * 15 + 20;
    const skillsCount = skills?.filter((s: any) => !s.category || s.category.toLowerCase() !== 'führerschein').length || 0;
    const skillsHeight = Math.max(1, skillsCount) * 15 + 20;
    const driverLicenseHeight = skills?.filter((s: any) => s.category?.toLowerCase() === 'führerschein').length ? 40 : 20;
    return sectionTitleHeight + languagesHeight + skillsHeight + driverLicenseHeight;
  };

  let currentPageHeight = 0;
  for (const exp of experiences) {
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
  const educationHeight = estimateEducationHeight();
  const skillsHeight = estimateSkillsHeight();
  const totalAvailableHeight = 700; // Total page height

  if (currentPageHeight + educationHeight + skillsHeight <= totalAvailableHeight) {
    // Both fit on first page
    showEducationOnFirstPage = true;
    showSkillsOnFirstPage = true;
  } else if (currentPageHeight + educationHeight <= totalAvailableHeight) {
    // Only education fits
    showEducationOnFirstPage = true;
    showSkillsOnFirstPage = false;
  }

  // Now distribute remaining experiences across continuation pages
  const remainingExps = experiences.slice(experiencesFirstPage.length);
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
                    marginLeft: 50,
                    marginTop: 0,
                    border: '10 solid #000000',
                  }}
                />
              ) : (
                <View style={{ width: 120, height: 140, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center', marginLeft: 40, marginTop: 0, border: '10 solid #000000' }}>
                  <Text style={{ color: '#888', fontSize: 18 }}>Foto</Text>
                </View>
              )}
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
            <Text style={styles.sectionTitle}>Berufserfahrung</Text>
            <View>
              {Array.isArray(experiencesFirstPage)
                ? experiencesFirstPage.map((exp) => (
                    <View key={exp.id ?? Math.random()} style={styles.itemText}>
                      <Text style={styles.itemTitle}>{exp.job_title || ""}</Text>
                      <Text>
                        <Text style={styles.itemTitle}>{exp.company || ""}</Text>
                        <Text style={styles.itemTitle}>, {exp.location || ""} </Text>
                        <Text style={styles.itemText}>
                          | {formatDate(exp.start_date)} - {exp.is_current ? "Heute" : formatDate(exp.end_date)} |
                        </Text>
                      </Text>
                      <Text style={styles.itemSubtitle}> </Text>
                      {exp.description ? (
                        <View style={styles.descriptionList}>
                          {exp.description.split(/\r?\n/).filter((line: string) => line.trim()).map((line: string, idx: number) => {
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
                      ) : null}
                    </View>
                  ))
                : null}
            </View>
          </View>
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
                      {exp.description ? (
                        <View style={styles.descriptionList}>
                          {exp.description.split(/\r?\n/).filter((line: string) => line.trim()).map((line: string, idx: number) => {
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
                      ) : null}
                    </View>
                  ))}
                </View>

                {/* Add education and skills on the last experience page */}
                {isLastExperiencePage && (
                  <>
                    <View wrap={false}>
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
                                {edu.description ? (
                                  <View style={styles.descriptionList}>
                                    {edu.description.split(/\r?\n/).filter((line: string) => line.trim()).map((line: string, idx: number) => {
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
                                ) : null}
                              </View>
                            ))
                          : []}
                      </View>
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
                                  <Text key={lang.id ?? Math.random()}>{lang.language_name?.split(' ')[0] || lang.language_name}</Text>
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
              <View style={styles.sidebarRight}></View>
            </Page>
          );
        })
      ) : null}

      {/* If no additional experience pages, create a separate education and skills page */}
      {experiencesPages.length === 0 && (
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
                        <Text key={lang.id ?? Math.random()}>{lang.language_name?.split(' ')[0] || lang.language_name}</Text>
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
          <View style={styles.sidebarRight}></View>
        </Page>
      )}
    </Document>
  );
};