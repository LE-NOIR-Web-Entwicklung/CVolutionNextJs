import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type DownloadLicense = {
  buyerName: string | null;
  email: string;
  orderReference: string;
};

export function getLicenseText({ buyerName, email, orderReference }: DownloadLicense) {
  const buyer = buyerName?.trim() ? `${buyerName.trim()}, ${email}` : email;
  return `Lizenziert für ${buyer} · Bestellung ${orderReference} · Weitergabe nicht gestattet`;
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// The standard PDF fonts only cover Latin-1, so other characters in a name become "?".
function toPdfText(value: string) {
  return value.normalize("NFC").replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

export async function personalizePdf(source: Uint8Array, license: DownloadLicense) {
  const pdf = await PDFDocument.load(source, { updateMetadata: false });
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const text = toPdfText(getLicenseText(license));
  const margin = 36;

  for (const page of pdf.getPages()) {
    const size = Math.min(6.5, 6.5 * ((page.getWidth() - margin * 2) / font.widthOfTextAtSize(text, 6.5)));
    page.drawText(text, { x: margin, y: 16, size, font, color: rgb(0.45, 0.5, 0.56) });
  }

  pdf.setAuthor("CVolution");
  pdf.setSubject(getLicenseText(license));
  return pdf.save();
}

// A CV goes to employers, so the Word templates carry the licence in the file
// properties only, never visibly on the page.
export async function personalizeDocx(source: Uint8Array, license: DownloadLicense) {
  const zip = await JSZip.loadAsync(source);
  const text = escapeXml(getLicenseText(license));
  zip.file(
    "docProps/core.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Lebenslauf-Vorlage</dc:title><dc:subject>${text}</dc:subject><dc:creator>CVolution</dc:creator><dc:description>${text}</dc:description><cp:lastModifiedBy>CVolution</cp:lastModifiedBy></cp:coreProperties>`
  );
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
}

export function personalizeDownload(fileName: string, source: Uint8Array, license: DownloadLicense) {
  return fileName.endsWith(".pdf") ? personalizePdf(source, license) : personalizeDocx(source, license);
}
