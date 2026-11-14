import type { ReactNode } from "react";

/**
 * HTML-Nachbildung der drei Lebenslauf-Designs, die im Self-Service (PDF)
 * und unter /service-downloads (Word) verkauft werden:
 * - klassisch: Personalien-Tabelle, Zeitachse links, schwarze Trennlinien
 * - modern:    farbige Seitenleisten, grosser Name in Akzentfarbe
 * - zeitlos:   grosser schwarzer Name, feine graue Linien, viel Weissraum
 * Farben, Abschnittstitel und Reihenfolge folgen den Word-Vorlagen in private-downloads/.
 */

export type CvTemplate = "klassisch" | "modern" | "zeitlos";

export const CV_TEMPLATE_LABEL: Record<CvTemplate, string> = {
  klassisch: "Klassisch",
  modern: "Modern",
  zeitlos: "Zeitlos",
};

export type CvStation = {
  /** z. B. "02.2022 – heute", "2021 – 2024" oder "2023" */
  dates: string;
  role: string;
  /** Firma bzw. Schule, inkl. Ort */
  org?: string;
  tasks?: string[];
};

export type CvData = {
  name: string;
  position: string;
  contact: [string, string][];
  experience: CvStation[];
  education: CvStation[];
  languages: [string, string][];
  skills: [string, string][];
};

const ACCENT = "#156082";
const MUTED = "#A6A6A6";

const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

/** "08.2022 – heute" → "August 2022 – Heute" (Schreibweise der Vorlagen Modern/Zeitlos) */
function longDates(dates: string): string {
  return dates
    .replace(/\b(\d{2})\.(\d{4})\b/g, (match, m: string, y: string) => {
      const month = MONTHS[Number(m) - 1];
      return month ? `${month} ${y}` : match;
    })
    .replace(/\bheute\b/, "Heute");
}

/** Klassisch zeigt Kurzformen wie in der Word-Vorlage */
function klassischLabel(label: string): string {
  return label === "Telefon" ? "Tel." : label;
}

function modernLabel(label: string): string {
  if (label === "Geburtsdatum") return "Geb.";
  if (label === "Telefon") return "Tel.";
  return label;
}

function PhotoPlaceholder({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-shrink-0 items-center justify-center border border-black bg-gray-200 text-[10px] text-gray-500 ${className}`}
    >
      Foto
    </div>
  );
}

function Bullets({ tasks, className = "" }: { tasks?: string[]; className?: string }) {
  if (!tasks?.length) return null;
  return (
    <ul className={`list-disc space-y-0.5 pl-4 marker:text-black ${className}`}>
      {tasks.map((task) => (
        <li key={task}>{task}</li>
      ))}
    </ul>
  );
}

function SkillRows({ data, labelClass }: { data: CvData; labelClass: string }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[6.5rem_1fr] gap-x-3 sm:grid-cols-[8.5rem_1fr]">
        <div className={labelClass}>Fremdsprachen</div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
          {data.languages.map(([language, level]) => (
            <div key={language} className="contents">
              <span>{language}</span>
              <span>{level}</span>
            </div>
          ))}
        </div>
      </div>
      {data.skills.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-x-3 sm:grid-cols-[8.5rem_1fr]">
          <div className={labelClass}>{label}</div>
          <div>{value}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- Klassisch ---------------------------------- */

function KlassischHeading({ children }: { children: ReactNode }) {
  return <p className="mb-3 mt-5 border-b border-black pb-0.5 text-[13px] font-bold sm:text-[15px]">{children}</p>;
}

/** Eine Station im Klassisch-Stil: Datum links, Titel rechts, Tätigkeiten darunter. */
export function KlassischStation({ station, boldDates = true }: { station: CvStation; boldDates?: boolean }) {
  const title = station.org ? `${station.role}, ${station.org}` : station.role;
  return (
    <div className="grid grid-cols-1 gap-x-3 gap-y-0.5 sm:grid-cols-[8.5rem_1fr]">
      <div className={boldDates ? "font-bold" : ""}>{station.dates}</div>
      <div>
        <p className={boldDates ? "font-bold" : ""}>{title}</p>
        <Bullets tasks={station.tasks} className="mt-1.5" />
      </div>
    </div>
  );
}

function Klassisch({ data }: { data: CvData }) {
  const experience = (
    <>
      <KlassischHeading>Berufliche Erfahrung</KlassischHeading>
      <div className="space-y-4">
        {data.experience.map((s) => <KlassischStation key={s.dates + s.role} station={s} />)}
      </div>
    </>
  );
  const education = (
    <>
      <KlassischHeading>Ausbildungen / Weiterbildungen</KlassischHeading>
      <div className="space-y-2.5">
        {data.education.map((s) => <KlassischStation key={s.dates + s.role} station={s} boldDates={false} />)}
      </div>
    </>
  );

  return (
    <div className="px-5 py-6 sm:px-10 sm:py-9">
      <p className="mb-4 border-b-[3px] border-black pb-0.5 font-bold">Lebenslauf / Profil</p>

      <div className="flex items-start justify-between gap-4">
        <table className="w-full min-w-0 table-fixed">
          <tbody className="align-top">
            {data.contact.map(([label, value]) => (
              <tr key={label}>
                <td className="w-[5.5rem] py-0.5 pr-2 sm:w-[8.5rem]">{klassischLabel(label)}</td>
                <td className="whitespace-pre-line py-0.5 [overflow-wrap:anywhere]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PhotoPlaceholder className="h-[5.5rem] w-[4.5rem] sm:h-[8.5rem] sm:w-[7rem]" />
      </div>


      {experience}
      {education}

      <KlassischHeading>Kenntnisse &amp; Fähigkeiten</KlassischHeading>
      <SkillRows data={data} labelClass="" />
    </div>
  );
}

/* ------------------------------ Modern & Zeitlos ------------------------------ */

function ModernStation({ station, boldRole = true }: { station: CvStation; boldRole?: boolean }) {
  return (
    <div>
      <p className={boldRole ? "font-bold" : ""}>{station.role}</p>
      <p>
        {station.org ? (
          <>
            <span className="font-bold">{station.org}</span>
            <span className="text-gray-400"> ｜</span>{" "}
          </>
        ) : null}
        <span className="whitespace-nowrap">
          {longDates(station.dates)}
          <span className="text-gray-400">｜</span>
        </span>
      </p>
      <Bullets tasks={station.tasks} className="mt-1.5 sm:pl-8" />
    </div>
  );
}

function ModernHeading({ children, modern }: { children: ReactNode; modern: boolean }) {
  return (
    <p
      className="-ml-3 mb-3 mt-5 border-b pb-0.5 pl-3 text-[13px] font-bold sm:-ml-8 sm:mr-[30%] sm:pl-8 sm:text-[15px]"
      style={{ color: modern ? ACCENT : "#000", borderColor: modern ? ACCENT : "#E5E5E5", borderBottomWidth: modern ? 1.5 : 2 }}
    >
      {children}
    </p>
  );
}

function ModernZeitlos({ data, variant }: { data: CvData; variant: "modern" | "zeitlos" }) {
  const modern = variant === "modern";
  const nameParts = data.name.split(" ");
  const lastName = nameParts.pop();
  const firstName = nameParts.join(" ");

  const name = (
    <div className="min-w-0">
      <p
        className="text-[22px] font-bold uppercase leading-[1.35] [overflow-wrap:anywhere] sm:text-[32px]"
        style={{ color: modern ? ACCENT : "#000" }}
      >
        {firstName}
        <br />
        {lastName}
      </p>
      <p className="mt-1.5 sm:mt-3" style={{ color: MUTED }}>{data.position}</p>
    </div>
  );

  const experience = (
    <>
      <ModernHeading modern={modern}>Berufliche Erfahrung</ModernHeading>
      <div className="space-y-4">
        {data.experience.map((s) => <ModernStation key={s.dates + s.role} station={s} />)}
      </div>
    </>
  );
  const education = (
    <>
      <ModernHeading modern={modern}>Aus &amp; Weiterbildungen</ModernHeading>
      <div className="space-y-3">
        {data.education.map((s) => <ModernStation key={s.dates + s.role} station={s} />)}
      </div>
    </>
  );

  const content = (
    <div className="px-5 py-6 sm:px-12 sm:py-10">
      <div className={`flex items-start gap-4 sm:gap-10 ${modern ? "" : "justify-between"}`}>
        {modern ? (
          <>
            <PhotoPlaceholder className="h-[5.5rem] w-[5.5rem] sm:h-[8.5rem] sm:w-[8.5rem]" />
            <div className="pt-1 sm:pt-0">{name}</div>
          </>
        ) : (
          <>
            {name}
            <PhotoPlaceholder className="h-[6rem] w-[4.75rem] sm:h-[9.5rem] sm:w-[7.5rem]" />
          </>
        )}
      </div>

      <div className="sm:pl-6">
        <ModernHeading modern={modern}>Kontaktdaten</ModernHeading>
        <table className="w-full min-w-0 table-fixed">
          <tbody className="align-top">
            {data.contact.map(([label, value]) => (
              <tr key={label}>
                <td className="w-[5.5rem] py-1 pr-2 sm:w-[6rem]">{modernLabel(label)}</td>
                <td className="whitespace-pre-line py-1 [overflow-wrap:anywhere]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>


        {experience}
      {education}

        <ModernHeading modern={modern}>Kenntnisse &amp; Fähigkeiten</ModernHeading>
        <SkillRows data={data} labelClass="" />
      </div>
    </div>
  );

  if (!modern) return content;

  return (
    <div className="flex">
      <div aria-hidden="true" className="w-2 flex-shrink-0 sm:w-12" style={{ background: ACCENT }} />
      <div className="min-w-0 flex-1">{content}</div>
      <div aria-hidden="true" className="w-2 flex-shrink-0 sm:w-12" style={{ background: ACCENT }} />
    </div>
  );
}

/* ---------------------------------- Rahmen ---------------------------------- */

/** Dokument-Look: weisses Blatt mit Arial, wie in Word/PDF. */
export function CvPaper({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-300 bg-white text-[11.5px] leading-snug text-black shadow-md [font-family:Arial,Helvetica,sans-serif] sm:text-[13px]">
      {children}
    </div>
  );
}

export function CvTemplatePreview({ data, template }: { data: CvData; template: CvTemplate }) {
  return (
    <CvPaper>
      {template === "klassisch" ? <Klassisch data={data} /> : <ModernZeitlos data={data} variant={template} />}
    </CvPaper>
  );
}
