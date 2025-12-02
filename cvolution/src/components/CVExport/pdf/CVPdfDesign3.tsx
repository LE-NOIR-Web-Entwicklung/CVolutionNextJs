import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

interface CVPdfDesign3Props {
  user: any;
  profile: any;
  experiences: any[];
  education: any[];
  skills: any[];
  languages: any[];
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingHorizontal: 40,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
    color: "#000000",
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.35,
  },
  topTitle: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottom: "1 solid #000",
    paddingTop: 6,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 10,
  },
  contact: {
    flexGrow: 1,
  },
  contactRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 90,
    fontWeight: "normal",
  },
  value: {
    flexGrow: 1,
  },
  nameRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  nameValue: {
    flexGrow: 1,
    fontSize: 12,
  },
  photo: {
    width: 150,
    height: 150,
    border: "2 solid #000",
    objectFit: "cover",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 6,
    borderBottom: "2 solid #000",
    paddingBottom: 3,
  },
  expRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 6,
  },
  expDate: {
    width: 130,
    fontWeight: "bold",
    flexShrink: 0,
  },
  expDateSub: {
    width: 130,
    flexShrink: 0,
  },
  expBody: {
    flex: 1,
    maxWidth: 400,
  },
  expTitle: {
    fontWeight: "bold",
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
    paddingLeft: 14
  },
  eduRow: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 2,
  },
  eduBody: {
    flex: 1,
    maxWidth: 400,
  },
  skillsGrid: {
    marginTop: 10,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  skillLabel: {
    width: 120,
    fontWeight: "bold",
  },
  skillValue: {
    flexDirection: "row",
    gap: 20,
  },
});

const formatRange = (start: string, end?: string, isCurrent?: boolean) => {
  const right = isCurrent ? "heute" : end ?? "";
  return `${start} – ${right}`;
};

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

export const CVPdfDesign3: React.FC<CVPdfDesign3Props> = ({
  user,
  profile,
  experiences,
  education,
  skills,
  languages,
}) => {
  // Split experiences so that no experience is split between pages
  // Calculate available space and ensure complete experiences fit on each page
  const FIRST_PAGE_AVAILABLE_HEIGHT = 480; // Conservative estimate for space after header
  const CONTINUATION_PAGE_HEIGHT = 700; // Full page height for continuation pages
  let experiencesFirstPage: any[] = [];
  let experiencesPages: any[][] = []; // Array of arrays, each containing experiences for one page

  const estimateExpHeight = (exp: any) => {
    const titleHeight = 20; // Job title with margin
    const companyLocationHeight = 20; // Company, location, dates with margin
    const descriptionLines = exp.description ? exp.description.split(/\r?\n/).length : 0;
    const descriptionHeight = descriptionLines * 15; // Each line approximately 15pt including line height
    const spacing = 20; // Margin between experiences
    return titleHeight + companyLocationHeight + descriptionHeight + spacing;
  };

  let currentPageHeight = 0;
  for (const exp of experiences) {
    const totalExpHeight = estimateExpHeight(exp);

    if (experiencesFirstPage.length === 0) {
      // First experience always goes on first page
      experiencesFirstPage.push(exp);
      currentPageHeight += totalExpHeight;
    } else if (currentPageHeight + totalExpHeight <= FIRST_PAGE_AVAILABLE_HEIGHT) {
      // Fits on first page
      experiencesFirstPage.push(exp);
      currentPageHeight += totalExpHeight;
    } else {
      // Doesn't fit on first page
      break;
    }
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
      <Page size="A4" style={styles.page}>
        {/* Titel */}
        <Text style={styles.topTitle}>Lebenslauf / Profil</Text>

        {/* Header mit Kontaktdaten + Foto */}
        <View style={styles.headerRow}>
          <View style={styles.contact}>
            <View style={styles.nameRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.nameValue}>{profile?.full_name || ""}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.label}>Adresse</Text>
              <Text style={styles.value}>
                {(profile?.address_line1 || "") + (profile?.address_line1 && profile?.address_line2 ? "\n" : "") + (profile?.address_line2 || profile?.location || "")}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.label}>Tel.</Text>
              <Text style={styles.value}>{profile?.phone || ""}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.label}>E-Mail</Text>
              <Text style={styles.value}>{user?.email || ""}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.label}>Geburtsdatum</Text>
              <Text style={styles.value}>{formatBirthDate(profile?.birthdate) || '-'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.label}>Zivilstand</Text>
              <Text style={styles.value}>{profile?.civil_status || ""}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.label}>Heimatort</Text>
              <Text style={styles.value}>{profile?.place_of_origin || ""}</Text>
            </View>
          </View>

          {profile?.profile_picture_url ? (
            <Image
              src={profile.profile_picture_url}
              style={{
                width: 120,
                height: 140,
                objectFit: 'cover',
                marginLeft: 16,
                border: '10 solid #000000',
              }}
            />
          ) : (
            <View style={{ width: 120, height: 140, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center', marginLeft: 16, border: '10 solid #000000' }}>
              <Text style={{ color: '#888', fontSize: 18 }}>Foto</Text>
            </View>
          )}
        </View>

        {/* Berufliche Erfahrung */}
        <Text style={styles.sectionTitle}>Berufliche Erfahrung</Text>
        {Array.isArray(experiencesFirstPage)
          ? experiencesFirstPage.map((exp) => (
              <View key={exp.id ?? Math.random()} style={styles.expRow}>
                <Text style={styles.expDate}>
                  {formatRange(
                    exp.start_date ? formatDate(exp.start_date) : "",
                    exp.end_date ? formatDate(exp.end_date) : "",
                    exp.is_current
                  )}
                </Text>
                <View style={styles.expBody}>
                  <Text>
                    <Text style={styles.expTitle}>{exp.job_title || ""}</Text>
                    <Text style={styles.expTitle}>, {exp.company || ""}</Text>
                    <Text style={styles.expTitle}>, {exp.location || ""} </Text>
                  </Text>
                  {exp.description
                    ? exp.description.split(/\r?\n/).map((line: string, idx: number) => (
                        line.trim() ? <Text style={styles.bullet} key={idx}>{line}</Text> : null
                      ))
                    : null}
                </View>
              </View>
            ))
          : []}
      </Page>

      {/* Additional pages for extra experiences - multiple experiences per page */}
      {experiencesPages.length > 0 ? (
        experiencesPages.map((pageExps: any[], pageIdx: number) => {
          const isLastExperiencePage = pageIdx === experiencesPages.length - 1;

          return (
            <Page key={`page-${pageIdx}`} style={styles.page}>
              {pageExps.map((exp: any) => (
                <View key={exp.id ?? Math.random()} style={styles.expRow}>
                  <Text style={styles.expDate}>
                    {formatRange(
                      exp.start_date ? formatDate(exp.start_date) : "",
                      exp.end_date ? formatDate(exp.end_date) : "",
                      exp.is_current
                    )}
                  </Text>
                  <View style={styles.expBody}>
                    <Text>
                      <Text style={styles.expTitle}>{exp.job_title || ""}</Text>
                      <Text style={styles.expTitle}>, {exp.company || ""}</Text>
                      <Text style={styles.expTitle}>, {exp.location || ""} </Text>
                    </Text>
                    {exp.description
                      ? exp.description.split(/\r?\n/).map((line: string, idx: number) => (
                          line.trim() ? <Text style={styles.bullet} key={idx}>{line}</Text> : null
                        ))
                      : null}
                  </View>
                </View>
              ))}

              {/* Add education and skills on the last experience page */}
              {isLastExperiencePage && (
                <>
                  <View wrap={false}>
                    <Text style={styles.sectionTitle}>Aus- & Weiterbildungen</Text>
                    {education?.map((edu) => (
                      <View key={String(edu.id)} style={styles.eduRow}>
                        <Text style={styles.expDateSub}>
                          {formatDate(edu.start_date)} - {edu.is_current ? "heute" : formatDate(edu.end_date)}
                        </Text>
                        <View style={styles.eduBody}>
                          <Text>
                            {`${edu.degree}, ${edu.institution}, ${edu.place}`}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View wrap={false}>
                    <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
                  <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' }}>
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
                              let prof = (lang.proficiency || '').replace(/\s+/g, ' ').trim();
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
                    <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' }}>
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
                    <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' }}>
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
            </Page>
          );
        })
      ) : null}

      {/* If no additional experience pages, create a separate education and skills page */}
      {experiencesPages.length === 0 && (
        <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Aus- & Weiterbildungen</Text>
        {education?.map((edu) => (
          <View key={String(edu.id)} style={styles.eduRow}>
            <Text style={styles.expDateSub}>
              {formatDate(edu.start_date)} - {edu.is_current ? "heute" : formatDate(edu.end_date)}
            </Text>
            <View style={styles.eduBody}>
              <Text>
                {`${edu.degree}, ${edu.institution}, ${edu.place}`}
              </Text>
            </View>
          </View>
        ))}

        {/* Kenntnisse & Fähigkeiten */}
        <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start'}}>
            <Text style={{ width: 120, fontWeight: 'bold' }}>Fremdsprachen</Text>
            <View style={{ flexDirection: 'row', flexGrow: 1 }}>
              <View style={{ width: 100, marginLeft: 13 }}>
                {Array.isArray(languages) && languages.length > 0 ? (
                  languages.map((lang) => (
                    <Text key={lang.id ?? Math.random()}>{lang.language_name?.split(' ')[0] || lang.language_name}</Text>
                  ))
                ) : (
                  <Text>-</Text>
                )}
              </View>
              <View style={{ width: 100, marginLeft: 13 }}>
                {Array.isArray(languages) && languages.length > 0 ? (
                  languages.map((lang) => {
                    let prof = (lang.proficiency || '').replace(/\s+/g, ' ').trim();
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
          <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' }}>
            <Text style={{ width: 120, fontWeight: 'bold' }}>Fähigkeiten</Text>
            <View style={{ flexGrow: 1, marginLeft: 13 }}>
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
          <View style={{ flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start'}}>
            <Text style={{ width: 120, fontWeight: 'bold' }}>Führerschein</Text>
            <View style={{ flexGrow: 1, marginLeft: 13 }}>
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
      </Page>
      )}
    </Document>
  );
};
