export const CHECK_SERVICE_UNIT_PRICE = 59;

export const CHECK_DOCUMENT_OPTIONS = [
  { key: "lebenslauf", label: "Lebenslauf" },
  { key: "motivationsschreiben", label: "Motivationsschreiben" },
  { key: "arbeitszeugnisse", label: "Arbeitszeugnisse" },
  { key: "weitere-dokumente", label: "Weitere Dokumente" },
] as const;

export type CheckDocumentKey = (typeof CHECK_DOCUMENT_OPTIONS)[number]["key"];

const CHECK_DOCUMENT_KEYS = CHECK_DOCUMENT_OPTIONS.map((option) => option.key);

export const DEFAULT_CHECK_DOCUMENT_SELECTIONS: CheckDocumentKey[] = ["lebenslauf"];

export function isCheckDocumentKey(value: unknown): value is CheckDocumentKey {
  return typeof value === "string" && CHECK_DOCUMENT_KEYS.includes(value as CheckDocumentKey);
}

export function normalizeCheckDocumentSelections(value: unknown): CheckDocumentKey[] {
  if (!Array.isArray(value)) return DEFAULT_CHECK_DOCUMENT_SELECTIONS;

  const selections = value.filter(isCheckDocumentKey);
  const uniqueSelections = CHECK_DOCUMENT_OPTIONS
    .map((option) => option.key)
    .filter((key) => selections.includes(key));

  return uniqueSelections.length > 0 ? uniqueSelections : DEFAULT_CHECK_DOCUMENT_SELECTIONS;
}

export function getCheckDocumentLabels(value: unknown): string[] {
  const selections = normalizeCheckDocumentSelections(value);
  return CHECK_DOCUMENT_OPTIONS
    .filter((option) => selections.includes(option.key))
    .map((option) => option.label);
}
