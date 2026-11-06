export const SERVICE_DOWNLOAD_PRICE = 19.9;
export const SERVICE_DOWNLOADS_PATH = "/service-downloads";
export const SERVICE_DOWNLOAD_MAX_PER_DOCUMENT = 3;
export const SERVICE_DOWNLOAD_VALID_DAYS = 30;

export const SERVICE_DOWNLOADS = [
  {
    key: "download_cv_akzent",
    label: "Lebenslauf-Vorlage Modern",
    group: "cv",
    format: "Word",
    description: "Markante Vorlage mit farbiger Seitenleiste und Foto. Direkt in Word mit Ihren Angaben ausfüllen.",
    file: "lebenslauf-akzent.docx",
    downloadName: "CVolution-Lebenslauf-Modern.docx",
    preview: "/images/cv-designs/cv-design-modern.png",
  },
  {
    key: "download_cv_klar",
    label: "Lebenslauf-Vorlage Zeitlos",
    group: "cv",
    format: "Word",
    description: "Ruhige Vorlage mit grossem Namen und viel Weissraum. Direkt in Word mit Ihren Angaben ausfüllen.",
    file: "lebenslauf-klar.docx",
    downloadName: "CVolution-Lebenslauf-Zeitlos.docx",
    preview: "/images/cv-designs/cv-design-zeitlos.png",
  },
  {
    key: "download_cv_klassisch",
    label: "Lebenslauf-Vorlage Klassisch",
    group: "cv",
    format: "Word",
    description: "Sachliche Vorlage mit Zeitachse und klaren Trennlinien. Direkt in Word mit Ihren Angaben ausfüllen.",
    file: "lebenslauf-klassisch.docx",
    downloadName: "CVolution-Lebenslauf-Klassisch.docx",
    preview: "/images/cv-designs/cv-design-klassisch.png",
  },
  {
    key: "download_prompt_spontan",
    label: "Masterprompt Spontanbewerbung",
    group: "prompt",
    format: "PDF",
    description: "Ihr Motivationsschreiben für eine Spontanbewerbung: PDF, Lebenslauf und Firmenhomepage in die KI Ihrer Wahl laden, Rückfragen beantworten, fertig.",
    file: "masterprompt-spontanbewerbung.pdf",
    downloadName: "CVolution-Masterprompt-Spontanbewerbung.pdf",
  },
  {
    key: "download_prompt_inserat",
    label: "Masterprompt Bewerbung Stelleninserat",
    group: "prompt",
    format: "PDF",
    description: "Ihr Motivationsschreiben passend zur Stelle: PDF, Lebenslauf und Stelleninserat in die KI Ihrer Wahl laden, Rückfragen beantworten, fertig.",
    file: "masterprompt-stelleninserat.pdf",
    downloadName: "CVolution-Masterprompt-Bewerbung-Stelleninserat.pdf",
  },
] as const;

export type ServiceDownload = (typeof SERVICE_DOWNLOADS)[number];
export type ServiceDownloadKey = ServiceDownload["key"];

export function getServiceDownload(key: unknown): ServiceDownload | null {
  return SERVICE_DOWNLOADS.find((download) => download.key === key) ?? null;
}

export function isServiceDownloadKey(key: unknown): key is ServiceDownloadKey {
  return getServiceDownload(key) !== null;
}
