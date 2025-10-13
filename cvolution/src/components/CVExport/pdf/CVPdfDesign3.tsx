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
    paddingHorizontal: 28,
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
    fontWeight: "bold",
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
    marginTop: 10,
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
  },
  expDateSub: {
    width: 130,
  },
  expBody: {
    flexGrow: 1,
  },
  expTitle: {
    fontWeight: "bold",
  },
  bullet: {
    marginLeft: 14,
    marginBottom: 2,
  },
  eduRow: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 2,
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
}) => (
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
          <Image src={profile.profile_picture_url} style={{ maxHeight: 170, borderRadius: 1, marginLeft: 16 }} />
        ) : (
          <View style={{ width: 100, height: 120, backgroundColor: 'lightgray', borderRadius: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 16 }}>
            <Text style={{ color: '#888', fontSize: 18 }}>Foto</Text>
          </View>
        )}
      </View>

      {/* Berufliche Erfahrung */}
      <Text style={styles.sectionTitle}>Berufliche Erfahrung</Text>
      {Array.isArray(experiences)
        ? experiences.map((exp) => (
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

    {/* </Page> */}
    {/* <Page size="A4" style={styles.page}> */}
      <Text style={styles.sectionTitle}>Aus- & Weiterbildungen</Text>
      {education?.map((edu) => (
        <View key={String(edu.id)} style={styles.eduRow}>
          <Text style={styles.expDateSub}>
            {formatDate(edu.start_date)} - {edu.is_current ? "heute" : formatDate(edu.end_date)}
          </Text>
          <View style={styles.expBody}>
            <Text>
              {`${edu.degree}, ${edu.institution}, ${edu.place}`}
            </Text>
          </View>
        </View>
      ))}

      {/* Kenntnisse & Fähigkeiten */}
  <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{ width: 120, fontWeight: 'bold' }}>Fremdsprachen</Text>
          <View style={{ flexDirection: 'row', flexGrow: 1 }}>
            <View style={{ width: 100 }}>
              {Array.isArray(languages) && languages.length > 0 ? (
                languages.map((lang) => (
                  <Text key={lang.id ?? Math.random()}>{(lang.language_name || '').replace(/\s+/g, ' ').trim()}</Text>
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
          <Text style={{ width: 120, fontWeight: 'bold' }}>Fähigkeiten</Text>
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
      {/* <Text style={styles.sectionTitle}>Kenntnisse & Fähigkeiten</Text>
      <View style={styles.skillsGrid}>
        <View style={styles.skillRow}>
          <Text style={styles.skillLabel}>Fremdsprachen</Text>
          <View style={styles.expBody}>
            {languages?.map((lang) => (
              <Text key={String(lang.id)}>
                {lang.language_name} {lang.proficiency ? ` ${lang.proficiency}` : ""}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.skillRow}>
          <Text style={styles.skillLabel}>Führerschein</Text>
          <Text>Kategorie B</Text>
        </View>

        <View style={styles.skillRow}>
          <Text style={styles.skillLabel}>Fähigkeiten</Text>
          <View style={styles.expBody}>
            {skills?.length
              ? skills.map((s) => <Text key={String(s.id)}>{s.skill_name}</Text>)
              : <Text>SAP</Text>}
          </View>
        </View>
      </View> */}
    </Page>
  </Document>
);
