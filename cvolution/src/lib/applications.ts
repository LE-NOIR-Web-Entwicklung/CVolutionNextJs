export const APPLICATION_STATUSES = {
  draft: 'Noch nicht versendet',
  sent: 'Versendet',
  interview: 'Gespräch 1',
  interview2: 'Gespräch 2',
  offer: 'Zusage',
  rejected: 'Absage',
  withdrawn: 'Zurückgezogen',
} as const;

export type ApplicationStatus = keyof typeof APPLICATION_STATUSES;

export type MotivationForm = {
  applicationType: 'reactive' | 'spontaneous';
  jobTitle: string;
  company: string;
  companyStreet: string;
  companyPostalCode: string;
  companyCity: string;
  recipient: string;
  jobAd: string;
  jobAdUrl: string;
  language: 'de-CH' | 'de' | 'en' | 'fr';
};

export type MotivationDraft = { form: MotivationForm; letter: string };

export type ApplicationInput = {
  company: string;
  job_title: string;
  status: ApplicationStatus;
  applied_at: string | null;
  interview1_at: string | null;
  interview2_at: string | null;
  decision_at: string | null;
  deadline: string | null;
  next_action_at: string | null;
  next_action: string;
  notes: string;
  motivation_form: MotivationForm;
  motivation_letter: string;
};

export type Application = ApplicationInput & {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type JobAdExtraction = Pick<ApplicationInput, 'company' | 'job_title' | 'deadline' | 'motivation_form'>;

export function emptyMotivationForm(): MotivationForm {
  return { applicationType: 'reactive', jobTitle: '', company: '', companyStreet: '', companyPostalCode: '', companyCity: '', recipient: '', jobAd: '', jobAdUrl: '', language: 'de-CH' };
}

export function emptyApplication(): ApplicationInput {
  return { company: '', job_title: '', status: 'draft', applied_at: null, interview1_at: null, interview2_at: null, decision_at: null, deadline: null, next_action_at: null, next_action: '', notes: '', motivation_form: emptyMotivationForm(), motivation_letter: '' };
}

export class ApplicationInputError extends Error {}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ApplicationInputError('Ungültige Bewerbungsdaten.');
  return value as Record<string, unknown>;
}

function text(value: unknown, max: number, label: string, required = false): string {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) {
    throw new ApplicationInputError(`${label}: Bitte geben Sie ${required ? 'einen Wert mit ' : ''}höchstens ${max} Zeichen ein.`);
  }
  return value.trim();
}

function date(value: unknown): string | null {
  if (value === null || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new ApplicationInputError('Bitte geben Sie ein gültiges Datum ein.');
  const parsed = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new ApplicationInputError('Bitte geben Sie ein gültiges Datum ein.');
  return value;
}

export function parseApplicationInput(value: unknown): ApplicationInput {
  const input = object(value);
  const defaults = emptyApplication();
  if (Object.keys(input).some((key) => !Object.hasOwn(defaults, key))) throw new ApplicationInputError('Unbekanntes Bewerbungsfeld.');
  if (typeof input.status !== 'string' || !Object.hasOwn(APPLICATION_STATUSES, input.status)) throw new ApplicationInputError('Ungültiger Bewerbungsstatus.');
  const company = text(input.company, 140, 'Unternehmen', true);
  const jobTitle = text(input.job_title, 140, 'Stelle', true);
  const form = object(input.motivation_form);
  if (Object.keys(form).some((key) => !Object.hasOwn(defaults.motivation_form, key))) throw new ApplicationInputError('Unbekanntes Feld im Motivationsschreiben.');
  if (!['reactive', 'spontaneous'].includes(String(form.applicationType))) throw new ApplicationInputError('Ungültige Bewerbungsart.');
  if (!['de-CH', 'de', 'en', 'fr'].includes(String(form.language))) throw new ApplicationInputError('Ungültige Sprache.');
  const jobAdUrl = text(form.jobAdUrl, 500, 'Inserat-Link');
  if (jobAdUrl) {
    let url: URL;
    try { url = new URL(jobAdUrl); } catch { throw new ApplicationInputError('Bitte geben Sie einen vollständigen HTTP(S)-Link ein.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new ApplicationInputError('Bitte geben Sie einen HTTP(S)-Link ohne Zugangsdaten ein.');
  }
  return {
    company,
    job_title: jobTitle,
    status: input.status as ApplicationStatus,
    applied_at: date(input.applied_at),
    // Absent in requests from tabs opened before these fields existed.
    interview1_at: date(input.interview1_at ?? null),
    interview2_at: date(input.interview2_at ?? null),
    decision_at: date(input.decision_at ?? null),
    deadline: date(input.deadline),
    next_action_at: date(input.next_action_at),
    next_action: text(input.next_action, 240, 'Nächster Schritt'),
    notes: text(input.notes, 5000, 'Notizen'),
    motivation_letter: text(input.motivation_letter, 12000, 'Motivationsschreiben'),
    motivation_form: {
      applicationType: form.applicationType as MotivationForm['applicationType'],
      language: form.language as MotivationForm['language'],
      company,
      jobTitle,
      companyStreet: text(form.companyStreet, 160, 'Adresse'),
      companyPostalCode: text(form.companyPostalCode, 16, 'PLZ'),
      companyCity: text(form.companyCity, 80, 'Ort'),
      recipient: text(form.recipient, 180, 'Ansprechperson'),
      jobAd: text(form.jobAd, 9000, 'Inserat'),
      jobAdUrl,
    },
  };
}

export function applicationInput(application: Application): ApplicationInput {
  const { id, user_id, created_at, updated_at, ...input } = application;
  return input;
}

export function isApplicationId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function todayInZurich(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function isApplicationOpen(application: Pick<ApplicationInput, 'status'>): boolean {
  return ['draft', 'sent', 'interview', 'interview2'].includes(application.status);
}

export function isActionDue(application: ApplicationInput, today = todayInZurich()): boolean {
  return isApplicationOpen(application) && Boolean(application.next_action_at && application.next_action_at <= today);
}

export type ApplicationView = 'all' | 'open' | 'interview' | 'interview2' | 'rejected' | 'offer';

export function matchesApplicationView(application: Pick<ApplicationInput, 'status'>, view: ApplicationView): boolean {
  return view === 'all' || (view === 'open' ? isApplicationOpen(application) : application.status === view);
}

export function filterApplications(applications: Application[], search: string, status: ApplicationStatus | 'all', view: ApplicationView = 'all'): Application[] {
  const query = search.trim().toLocaleLowerCase('de-CH');
  return applications.filter((application) =>
    (status === 'all' || application.status === status) &&
    matchesApplicationView(application, view) &&
    `${application.company} ${application.job_title}`.toLocaleLowerCase('de-CH').includes(query)
  ).sort((a, b) => {
    const group = Number(isApplicationOpen(b)) - Number(isApplicationOpen(a));
    if (group) return group;
    const next = (a.next_action_at || '9999-12-31').localeCompare(b.next_action_at || '9999-12-31');
    return next || b.updated_at.localeCompare(a.updated_at);
  });
}

export type ApplicationDateKey = 'applied_at' | 'interview1_at' | 'interview2_at' | 'decision_at';
type ApplicationProgress = Pick<ApplicationInput, 'status' | ApplicationDateKey>;

// Order of the steps; offer and rejected are alternative end states, withdrawn sits apart.
const STEP_ORDER: Partial<Record<ApplicationStatus, number>> = { draft: 0, sent: 1, interview: 2, interview2: 3, offer: 4, rejected: 4 };
const STEP_DATES: Partial<Record<ApplicationStatus, ApplicationDateKey>> = { sent: 'applied_at', interview: 'interview1_at', interview2: 'interview2_at', offer: 'decision_at', rejected: 'decision_at' };

export function applicationStepIndex(status: ApplicationStatus): number {
  return STEP_ORDER[status] ?? 0;
}

export function applicationStatusDate(application: ApplicationProgress): string | null {
  const key = STEP_DATES[application.status];
  return key ? application[key] : null;
}

// Dispatch and decision happen on the day they are marked; interviews get their date from the user.
export function withApplicationStatus<T extends ApplicationProgress>(input: T, status: ApplicationStatus, today = todayInZurich()): T {
  if (status === 'draft') return { ...input, status, applied_at: null };
  const key = STEP_DATES[status];
  if (!key || key === 'interview1_at' || key === 'interview2_at' || input[key]) return { ...input, status };
  return { ...input, status, [key]: today };
}

// Entering a date for a later step moves the application to that step.
export function withApplicationDate<T extends ApplicationProgress>(input: T, key: ApplicationDateKey, value: string | null): T {
  const next = { ...input, [key]: value };
  const step = (Object.keys(STEP_DATES) as ApplicationStatus[]).find((status) => STEP_DATES[status] === key);
  const dated = Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
  return dated && key !== 'decision_at' && step && input.status !== 'withdrawn' && applicationStepIndex(input.status) < applicationStepIndex(step) ? { ...next, status: step } : next;
}

// Clicking the active step again undoes it: back to the latest earlier step that has a date.
export function previousApplicationStatus(input: ApplicationProgress): ApplicationStatus {
  const current = applicationStepIndex(input.status);
  const earlier = (['interview2', 'interview', 'sent'] as ApplicationStatus[]).filter((status) => applicationStepIndex(status) < current);
  return earlier.find((status) => input[STEP_DATES[status] as ApplicationDateKey]) ?? 'draft';
}
