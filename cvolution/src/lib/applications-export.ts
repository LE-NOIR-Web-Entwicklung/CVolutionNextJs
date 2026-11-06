import JSZip from 'jszip';
import { formatApplicationDate } from './application-dates';
import { APPLICATION_STATUSES, type Application } from './applications';

const COLUMNS: Array<[string, (application: Application) => string]> = [
  ['Unternehmen', (row) => row.company],
  ['Stelle', (row) => row.job_title],
  ['Status', (row) => APPLICATION_STATUSES[row.status]],
  ['Bewerbungsfrist', (row) => formatApplicationDate(row.deadline)],
  ['Versendet am', (row) => formatApplicationDate(row.applied_at)],
  ['Gespräch 1', (row) => formatApplicationDate(row.interview1_at)],
  ['Gespräch 2', (row) => formatApplicationDate(row.interview2_at)],
  ['Zusage / Absage', (row) => formatApplicationDate(row.decision_at)],
  ['Nächster Schritt', (row) => row.next_action],
  ['Nächster Schritt bis', (row) => formatApplicationDate(row.next_action_at)],
  ['Ansprechperson', (row) => row.motivation_form.recipient],
  ['Adresse', (row) => row.motivation_form.companyStreet],
  ['PLZ', (row) => row.motivation_form.companyPostalCode],
  ['Ort', (row) => row.motivation_form.companyCity],
  ['Inserat-Link', (row) => row.motivation_form.jobAdUrl],
  ['Inserat', (row) => row.motivation_form.jobAd],
  ['Motivationsschreiben', (row) => row.motivation_letter],
  ['Notizen', (row) => row.notes],
  ['Erfasst am', (row) => formatApplicationDate(row.created_at.slice(0, 10))],
  ['Zuletzt bearbeitet', (row) => formatApplicationDate(row.updated_at.slice(0, 10))],
];

function columnName(index: number): string {
  return index < 26 ? String.fromCharCode(65 + index) : `A${String.fromCharCode(65 + index - 26)}`;
}

function xmlText(value: string): string {
  return value
    .replace(/[^\t\n\r -퟿-�]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Inline strings, so a value starting with "=" stays text and is never run as a formula.
function sheetRow(values: string[], rowNumber: number, style = 0): string {
  const cells = values.map((value, index) => `<c r="${columnName(index)}${rowNumber}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xmlText(value)}</t></is></c>`);
  return `<row r="${rowNumber}">${cells.join('')}</row>`;
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const SHEET_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const DOC_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

export const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function applicationsWorkbook(applications: Application[]): Promise<Blob> {
  const rows = [
    sheetRow(COLUMNS.map(([title]) => title), 1, 1),
    ...applications.map((application, index) => sheetRow(COLUMNS.map(([, value]) => value(application)), index + 2)),
  ];
  const lastCell = `${columnName(COLUMNS.length - 1)}${applications.length + 1}`;
  const zip = new JSZip();
  zip.file('[Content_Types].xml', `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`);
  zip.file('_rels/.rels', `${XML_HEADER}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${DOC_REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  zip.file('xl/workbook.xml', `${XML_HEADER}<workbook xmlns="${SHEET_NS}" xmlns:r="${DOC_REL}"><sheets><sheet name="Bewerbungen" sheetId="1" r:id="rId1"/></sheets></workbook>`);
  zip.file('xl/_rels/workbook.xml.rels', `${XML_HEADER}<Relationships xmlns="${REL_NS}"><Relationship Id="rId1" Type="${DOC_REL}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${DOC_REL}/styles" Target="styles.xml"/></Relationships>`);
  zip.file('xl/styles.xml', `${XML_HEADER}<styleSheet xmlns="${SHEET_NS}"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>`);
  zip.file('xl/worksheets/sheet1.xml', `${XML_HEADER}<worksheet xmlns="${SHEET_NS}"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="${COLUMNS.length}" width="22" customWidth="1"/></cols><sheetData>${rows.join('')}</sheetData><autoFilter ref="A1:${lastCell}"/></worksheet>`);
  return zip.generateAsync({ type: 'blob', mimeType: XLSX_TYPE });
}
