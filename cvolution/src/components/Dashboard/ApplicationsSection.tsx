import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Download, ExternalLink, FileText, Loader2, Plus, RefreshCw, Save, Search, Sparkles, Trash2, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { APPLICATION_STATUSES, applicationInput, applicationStatusDate, emptyApplication, filterApplications, isActionDue, matchesApplicationView, withApplicationDate, withApplicationStatus, type Application, type ApplicationDateKey, type ApplicationInput, type ApplicationStatus, type ApplicationView, type MotivationDraft } from '@/lib/applications';
import { ApplicationRequestError, deleteApplication, downloadApplications, extractApplication, loadApplications, saveApplication } from '@/lib/applications-client';
import { NEW_APPLICATION_ROUTE } from '@/lib/dashboard-routes';
import { downloadMotivationLetterDocx, MotivationLetterRequestError } from '@/lib/motivation-letter-client';
import { DetailCard, SaveState, StatusStepper } from './ApplicationDetailParts';
import { MotivationLetterSection } from './MotivationLetterSection';
import { ApplicationDateInput } from './ApplicationDateInput';

type Props = {
  hasSelfServiceAccess: boolean;
  onRequirePayment: () => void;
  onExportCv: () => void;
  incomingApplication: Application | null;
  onDirtyChange: (dirty: boolean) => void;
  // Application id (or "neu") from the URL; undefined while another area is open.
  routeApplicationId?: string | null;
  onRouteChange: (applicationId: string | null, options?: { replace?: boolean }) => void;
};

const VIEWS: Array<[ApplicationView, string]> = [['all', 'Alle'], ['open', 'Offen'], ['interview', '1. Gespräch'], ['interview2', '2. Gespräch'], ['rejected', 'Absagen'], ['offer', 'Zusagen']];

const primaryButton = 'bg-[#204878] text-white hover:bg-[#1a3a66]';
const outlineButton = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
const fieldLabel = 'text-sm font-medium text-slate-900';
const statusStyles: Record<ApplicationStatus, string> = {
  draft: 'border-slate-200 bg-slate-50 text-slate-600',
  sent: 'border-blue-200 bg-blue-50 text-blue-800',
  interview: 'border-amber-200 bg-amber-50 text-amber-800',
  interview2: 'border-amber-300 bg-amber-100 text-amber-900',
  offer: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rejected: 'border-rose-200 bg-rose-50 text-rose-800',
  withdrawn: 'border-slate-200 bg-slate-50 text-slate-600',
};

function advertHost(url: string) {
  try { return new URL(url.trim()).hostname.replace(/^www\./, ''); } catch { return url.trim(); }
}

function dateLabel(value: string | null) {
  return value ? new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T12:00:00Z`)) : '';
}

export function ApplicationsSection({ hasSelfServiceAccess, onRequirePayment, onExportCv, incomingApplication, onDirtyChange, routeApplicationId, onRouteChange }: Props) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ApplicationView>('all');
  const [saved, setSaved] = useState<Application | null>(null);
  const [draft, setDraft] = useState<ApplicationInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [working, setWorking] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [justImported, setJustImported] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  // Route this component requested and is waiting for; other route changes come from Back/Forward or deep links.
  const pendingRoute = useRef<string | null | undefined>(undefined);
  const openedFromList = useRef(false);
  const busy = saving || working || extracting || downloading;
  const dirty = Boolean(draft && JSON.stringify(draft) !== JSON.stringify(saved ? applicationInput(saved) : emptyApplication()));
  const currentRouteId = draft ? saved?.id ?? NEW_APPLICATION_ROUTE : null;
  const letterWords = draft?.motivation_letter.trim() ? draft.motivation_letter.trim().split(/\s+/).length : 0;
  // A known advert collapses to a one-line summary; editing the link opens the import form again.
  const importSummary = draft && !editingUrl && draft.motivation_form.jobAdUrl.trim() &&
    (justImported || saved?.motivation_form.jobAdUrl === draft.motivation_form.jobAdUrl) ? advertHost(draft.motivation_form.jobAdUrl) : '';
  const visible = useMemo(() => filterApplications(applications, search, 'all', view), [applications, search, view]);
  const viewCounts = useMemo(() => Object.fromEntries(VIEWS.map(([value]) => [value, applications.filter((application) => matchesApplicationView(application, value)).length])) as Record<ApplicationView, number>, [applications]);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setLoadError('');
    try {
      const rows = await loadApplications(signal);
      if (!signal?.aborted) setApplications(rows);
    } catch (err) {
      if (!signal?.aborted) setLoadError(err instanceof Error ? err.message : 'Bewerbungen konnten nicht geladen werden.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  useEffect(() => {
    if (incomingApplication) {
      setApplications((current) => [incomingApplication, ...current.filter((row) => row.id !== incomingApplication.id)]);
      setSaved(null);
      setDraft(null);
      setSearch('');
      setView('all');
      setError('');
      openedFromList.current = false;
      requestAnimationFrame(() => listHeading.current?.focus());
    }
  }, [incomingApplication]);

  useEffect(() => {
    onDirtyChange(dirty || busy);
  }, [dirty, busy, onDirtyChange]);

  function navigateTo(applicationId: string | null, replace = false) {
    pendingRoute.current = applicationId;
    onRouteChange(applicationId, { replace });
  }

  function show(application: Application | null) {
    setJustImported(false);
    setEditingUrl(false);
    setSaveFailed(false);
    setLetterOpen(false);
    setSaved(application);
    setDraft(application ? applicationInput(application) : emptyApplication());
    setError('');
    requestAnimationFrame(() => detailHeading.current?.focus());
  }

  function close() {
    setLetterOpen(false);
    setDraft(null);
    setSaved(null);
    requestAnimationFrame(() => listHeading.current?.focus());
  }

  // Follow Back/Forward and deep links once the list is loaded.
  useEffect(() => {
    if (routeApplicationId === undefined || loading) return;
    if (pendingRoute.current !== undefined) {
      if (pendingRoute.current === routeApplicationId) pendingRoute.current = undefined;
      return;
    }
    if (routeApplicationId === currentRouteId) return;
    openedFromList.current = false;
    if (busy || (dirty && !window.confirm('Ungespeicherte Änderungen verwerfen?'))) { navigateTo(currentRouteId); return; }
    if (routeApplicationId === null) { close(); setError(''); return; }
    if (routeApplicationId === NEW_APPLICATION_ROUTE) { show(null); return; }
    if (loadError) { close(); return; }
    const application = applications.find((row) => row.id === routeApplicationId);
    if (application) { show(application); return; }
    close();
    setError('Diese Bewerbung wurde nicht gefunden. Sie wurde möglicherweise gelöscht.');
    navigateTo(null, true);
    // show/close/navigateTo only read the state listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeApplicationId, currentRouteId, loading, loadError, applications, busy, dirty]);

  function open(application: Application | null) {
    if (busy || (dirty && !window.confirm('Ungespeicherte Änderungen verwerfen?'))) return;
    if (!application && !hasSelfServiceAccess) { onRequirePayment(); return; }
    openedFromList.current = !draft;
    show(application);
    navigateTo(application?.id ?? NEW_APPLICATION_ROUTE);
  }

  function back() {
    if (busy || (dirty && !window.confirm('Ungespeicherte Änderungen verwerfen?'))) return;
    close();
    setError('');
    if (openedFromList.current) {
      // The list is the previous history entry, so Back and this button end in the same place.
      openedFromList.current = false;
      pendingRoute.current = null;
      window.history.back();
    } else navigateTo(null);
  }

  function update<K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) {
    setDraft((current) => {
      if (!current) return current;
      const next = { ...current, [key]: value };
      if (key === 'company' || key === 'job_title') next.motivation_form = { ...current.motivation_form, company: next.company, jobTitle: next.job_title };
      return next;
    });
  }

  function changeLetter(next: MotivationDraft) {
    setDraft((current) => current ? { ...current, company: next.form.company, job_title: next.form.jobTitle, motivation_form: next.form, motivation_letter: next.letter } : current);
  }

  async function persist(next: ApplicationInput): Promise<Application> {
    if (!hasSelfServiceAccess) {
      onRequirePayment();
      throw new Error('Zum Erstellen und Bearbeiten benötigen Sie ein aktives Self-Service-Abo.');
    }
    if (saved && JSON.stringify(next) === JSON.stringify(applicationInput(saved))) return saved;
    setSaving(true);
    setSaveFailed(false);
    setError('');
    try {
      const application = await saveApplication(next, saved);
      setSaved(saved ? application : null);
      setDraft(saved ? applicationInput(application) : null);
      setApplications((current) => [application, ...current.filter((row) => row.id !== application.id)]);
      if (!saved) {
        setWorking(false);
        setSearch('');
        setView('all');
        setLetterOpen(false);
        openedFromList.current = false;
        navigateTo(null, true);
        requestAnimationFrame(() => listHeading.current?.focus());
      }
      return application;
    } catch (err) {
      setSaveFailed(true);
      if (err instanceof ApplicationRequestError && err.status === 402) onRequirePayment();
      throw err;
    } finally { setSaving(false); }
  }

  async function importJobAd() {
    if (!draft || busy) return;
    if (!hasSelfServiceAccess) { onRequirePayment(); return; }
    if ((draft.company || draft.job_title || draft.deadline || draft.motivation_form.jobAd) &&
      !window.confirm('Vorhandene Stellenangaben durch die erkannten Angaben ersetzen? Notizen und Motivationsschreiben bleiben erhalten.')) return;
    setExtracting(true);
    setError('');
    try {
      const extraction = await extractApplication(draft.motivation_form.jobAdUrl);
      setDraft((current) => current ? { ...current, ...extraction, motivation_form: { ...extraction.motivation_form, language: current.motivation_form.language } } : current);
      setJustImported(true);
      setEditingUrl(false);
      toast({ title: 'Stellenangaben übernommen', description: 'Bitte prüfen und ergänzen Sie die KI-Angaben vor dem Speichern.' });
    } catch (err) {
      if (err instanceof ApplicationRequestError && err.status === 402) onRequirePayment();
      setError(err instanceof Error ? err.message : 'Das Inserat konnte nicht ausgelesen werden.');
    } finally { setExtracting(false); }
  }

  function changeStatus(status: ApplicationStatus) {
    setDraft((current) => current && withApplicationStatus(current, status));
  }

  function changeDate(key: ApplicationDateKey, value: string | null) {
    setDraft((current) => current && withApplicationDate(current, key, value));
  }

  async function downloadLetter() {
    if (!draft?.motivation_letter.trim() || busy) return;
    setDownloading(true);
    setError('');
    try {
      const application = hasSelfServiceAccess && (dirty || !saved) ? await persist(draft) : saved;
      await downloadMotivationLetterDocx({ applicationId: application?.id, letter: draft.motivation_letter, jobTitle: draft.job_title, company: draft.company });
    } catch (err) {
      if (err instanceof MotivationLetterRequestError && err.status === 402) onRequirePayment();
      setError(err instanceof Error ? err.message : 'Das DOCX konnte nicht erstellt werden.');
    } finally { setDownloading(false); }
  }

  async function saveDetails(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    try {
      await persist(draft);
      toast({ title: 'Bewerbung gespeichert' });
    } catch (err) { setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen. Ihre Eingaben bleiben erhalten.'); }
  }

  async function saveLetter(next: MotivationDraft) {
    if (!draft) throw new Error('Bitte öffnen Sie eine Bewerbung.');
    const application = await persist({ ...draft, company: next.form.company, job_title: next.form.jobTitle, motivation_form: next.form, motivation_letter: next.letter });
    return application.id;
  }

  async function remove() {
    if (!saved || busy || !window.confirm('Diese Bewerbung mit Inserat, Notizen und gespeichertem Schreiben endgültig löschen?')) return;
    setSaving(true);
    setError('');
    try {
      await deleteApplication(saved.id);
      setApplications((current) => current.filter((row) => row.id !== saved.id));
      close();
      openedFromList.current = false;
      navigateTo(null, true);
      toast({ title: 'Bewerbung gelöscht' });
    } catch (err) { setError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen.'); }
    finally { setSaving(false); }
  }

  async function reloadSaved() {
    if (!saved || busy || (dirty && !window.confirm('Eigene Änderungen verwerfen und den gespeicherten Stand laden?'))) return;
    setSaving(true);
    try {
      const rows = await loadApplications();
      const application = rows.find((row) => row.id === saved.id);
      if (!application) throw new Error('Diese Bewerbung wurde gelöscht. Ihre lokalen Eingaben bleiben erhalten.');
      setApplications(rows);
      setSaved(application);
      setDraft(applicationInput(application));
      setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Laden fehlgeschlagen.'); }
    finally { setSaving(false); }
  }

  async function exportAll() {
    setExporting(true);
    setError('');
    try { await downloadApplications(await loadApplications()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Export fehlgeschlagen.'); }
    finally { setExporting(false); }
  }

  if (!user) return <Alert className="border-slate-200 bg-white text-slate-700"><AlertDescription>Bitte melden Sie sich an, um Ihre Bewerbungen zu verwalten.</AlertDescription></Alert>;

  return (
    <div className="space-y-5">
      {error && <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700"><AlertDescription>{error}</AlertDescription></Alert>}

      {!hasSelfServiceAccess && <Alert className="border-blue-200 bg-blue-50 text-slate-700"><AlertDescription>
        <p>Der Bewerbungsmanager inklusive KI-Inseratimport ist Teil des Self-Service-Abos. Gespeicherte Bewerbungen bleiben lesbar, löschbar und exportierbar.</p>
        <Button type="button" onClick={onRequirePayment} className={`mt-3 ${primaryButton}`}>Self-Service-Abo aktivieren</Button>
      </AlertDescription></Alert>}

      {draft ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <Button type="button" variant="ghost" onClick={back} disabled={busy} className="-ml-2 h-9 px-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950"><ArrowLeft className="h-4 w-4" /> Übersicht</Button>
            <div className="flex flex-wrap items-center gap-3">
              <SaveState saving={saving} failed={saveFailed} dirty={dirty} isNew={!saved} />
              <Button type="submit" form="application-details" disabled={busy || !hasSelfServiceAccess} className={primaryButton}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Bewerbung speichern</Button>
            </div>
          </div>
          <div>
            <h2 ref={detailHeading} tabIndex={-1} className="break-words text-xl font-semibold text-slate-950 sm:text-2xl">{saved ? saved.job_title : 'Neue Bewerbung erfassen'}</h2>
            {saved && (
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                <span className="break-words">{saved.company}</span>
                <Badge variant="outline" className={statusStyles[saved.status]}>{APPLICATION_STATUSES[saved.status]}</Badge>
                <span className="text-xs text-slate-500">Zuletzt gespeichert am {dateLabel(saved.updated_at.slice(0, 10))}</span>
              </p>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <form id="application-details" onSubmit={saveDetails} className="min-w-0">
              <fieldset disabled={busy || !hasSelfServiceAccess} className="min-w-0 space-y-4">
                <DetailCard title="Stelle">
                  {importSummary ? (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      <Sparkles className="h-4 w-4 shrink-0 text-[#204878]" />
                      <span className="min-w-0 break-all">{justImported ? 'Importiert von' : 'Inserat auf'} <a href={draft.motivation_form.jobAdUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#204878] underline-offset-2 hover:underline">{importSummary}<ExternalLink className="h-3 w-3" /></a></span>
                      <span className="ml-auto flex gap-1">
                        <Button type="button" variant="ghost" size="sm" onClick={importJobAd} className="h-8 px-2 text-[#204878] hover:bg-[#EEF4FA]">{extracting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}{extracting ? 'Wird ausgelesen …' : 'Erneut auslesen'}</Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setEditingUrl(true)} className="h-8 px-2 text-slate-600 hover:bg-slate-100">Link ändern</Button>
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3 sm:p-4">
                      <label htmlFor="application-job-url" className="text-sm font-medium text-slate-900">Link zum Stelleninserat</label>
                      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                        <Input id="application-job-url" type="url" inputMode="url" maxLength={500} value={draft.motivation_form.jobAdUrl} onChange={(event) => update('motivation_form', { ...draft.motivation_form, jobAdUrl: event.target.value })} placeholder="https://..." className="min-w-0 flex-1 bg-white text-slate-950" />
                        <Button type="button" onClick={importJobAd} disabled={!draft.motivation_form.jobAdUrl.trim()} className={primaryButton}>{extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{extracting ? 'Wird ausgelesen …' : 'Mit KI auslesen'}</Button>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-600">Die KI übernimmt erkennbare Angaben. Bitte vor dem Speichern prüfen. Geschützte Inserate können Sie manuell erfassen.</p>
                    </div>
                  )}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5"><label htmlFor="application-company" className={fieldLabel}>Unternehmen *</label><Input id="application-company" value={draft.company} onChange={(event) => update('company', event.target.value)} required maxLength={140} className="bg-white text-slate-950" /></div>
                    <div className="space-y-1.5"><label htmlFor="application-job" className={fieldLabel}>Stellenbezeichnung *</label><Input id="application-job" value={draft.job_title} onChange={(event) => update('job_title', event.target.value)} required maxLength={140} className="bg-white text-slate-950" /></div>
                  </div>
                </DetailCard>

                <DetailCard title="Status & Termine">
                  <StatusStepper value={draft} onStatusChange={changeStatus} onDateChange={changeDate} disabled={busy || !hasSelfServiceAccess} />
                </DetailCard>

                <DetailCard title="Notizen">
                  <label htmlFor="application-notes" className="sr-only">Notizen</label>
                  <Textarea id="application-notes" value={draft.notes} onChange={(event) => update('notes', event.target.value)} maxLength={5000} placeholder="Gesprächspartner, Eindrücke, offene Fragen …" className="min-h-24 bg-white text-slate-950" />
                </DetailCard>

                <DetailCard title="Nächster Schritt">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label htmlFor="application-next" className="sr-only">Nächster Schritt</label>
                    <Input id="application-next" value={draft.next_action} onChange={(event) => update('next_action', event.target.value)} maxLength={240} placeholder="Optional, zum Beispiel telefonisch nachfassen" className="min-w-0 flex-1 bg-white text-slate-950" />
                    <span aria-hidden="true" className="text-sm text-slate-500">bis</span>
                    <label htmlFor="application-next-date" className="sr-only">Nächste Aktion am</label>
                    <div className="sm:w-44"><ApplicationDateInput id="application-next-date" label="Nächste Aktion am" value={draft.next_action_at} onChange={(value) => update('next_action_at', value)} disabled={busy || !hasSelfServiceAccess} /></div>
                  </div>
                </DetailCard>
              </fieldset>
            </form>

            <aside className="min-w-0 space-y-4">
              <DetailCard title="Unterlagen">
                <ul className="space-y-2">
                  <li className="rounded-md border border-slate-200 p-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF4FA] text-[#204878]"><FileText className="h-4 w-4" /></span>
                      <div className="min-w-0"><p className="text-sm font-medium text-slate-950">Motivationsschreiben</p><p className="text-xs text-slate-500">{letterWords ? `Entwurf · ${letterWords} Wörter` : 'Noch nicht erstellt'}</p></div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setLetterOpen(true)} className={outlineButton}>{letterWords ? 'Öffnen' : <><Sparkles className="h-3.5 w-3.5" /> Schreiben erstellen</>}</Button>
                      {letterWords > 0 && <Button type="button" variant="outline" size="sm" onClick={downloadLetter} disabled={busy} className={outlineButton}>{downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Word herunterladen</Button>}
                    </div>
                  </li>
                  <li className="rounded-md border border-slate-200 p-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600"><UserRound className="h-4 w-4" /></span>
                      <div className="min-w-0"><p className="text-sm font-medium text-slate-950">Lebenslauf</p><p className="text-xs text-slate-500">Aus Ihren aktuellen Profildaten</p></div>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={onExportCv} className={`mt-3 ${outlineButton}`}><Download className="h-3.5 w-3.5" /> Aktuellen CV exportieren</Button>
                  </li>
                </ul>
              </DetailCard>
              {saved && (
                <div className="flex flex-wrap gap-2 px-1">
                  <Button type="button" variant="ghost" size="sm" onClick={reloadSaved} disabled={busy} className="text-slate-600 hover:bg-slate-100"><RefreshCw className="h-3.5 w-3.5" /> Gespeicherten Stand laden</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={remove} disabled={busy} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 className="h-3.5 w-3.5" /> Löschen</Button>
                </div>
              )}
            </aside>
          </div>

          <Dialog open={letterOpen} onOpenChange={(open) => { if (!working) setLetterOpen(open); }}>
            <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto bg-white text-slate-950">
              <DialogHeader>
                <DialogTitle>Motivationsschreiben</DialogTitle>
                <DialogDescription>Wird beim Erstellen und Herunterladen an dieser Bewerbung gespeichert.</DialogDescription>
              </DialogHeader>
              <MotivationLetterSection
                embedded
                hasSelfServiceAccess={hasSelfServiceAccess}
                onRequirePayment={onRequirePayment}
                draft={{ form: draft.motivation_form, letter: draft.motivation_letter }}
                onDraftChange={changeLetter}
                onSaveDraft={hasSelfServiceAccess ? saveLetter : undefined}
                applicationId={saved?.id}
                autoSaveDraft
                disabled={saving}
                readOnly={!hasSelfServiceAccess}
                onBusyChange={setWorking}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-busy={loading}>
          <div className="flex items-center justify-between gap-3">
            <h2 ref={listHeading} tabIndex={-1} className="text-xl font-semibold text-slate-950">Bewerbungen</h2>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="outline" onClick={exportAll} disabled={exporting || loading} aria-label="Daten exportieren" title="Daten exportieren" className={outlineButton}>
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}<span className="hidden sm:inline">Daten exportieren</span>
              </Button>
              <Button type="button" onClick={() => open(null)} disabled={busy} className={primaryButton}><Plus className="h-4 w-4" /> Bewerbung erfassen</Button>
            </div>
          </div>
          <div role="group" aria-label="Bewerbungen filtern" className="mt-4 flex flex-wrap gap-2">
            {VIEWS.map(([value, label]) => {
              const active = view === value;
              const count = viewCounts[value];
              return (
                <button key={value} type="button" aria-pressed={active} aria-label={`${label} (${loading ? 'wird geladen' : count})`} onClick={() => setView(value)} className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] focus-visible:ring-offset-1 ${active ? 'border-[#204878] bg-[#204878] text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                  {label}<span className={`tabular-nums ${active ? 'text-white/80' : 'text-slate-500'}`}>{loading ? '–' : count}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input aria-label="Bewerbungen durchsuchen" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Unternehmen oder Stelle suchen" className="bg-white pl-9 text-slate-950" /></div>
            <Button type="button" variant="outline" onClick={() => void refresh()} disabled={loading} aria-label="Bewerbungen aktualisieren" className={outlineButton}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          </div>
          {loadError && <Alert variant="destructive" className="mt-5 border-red-200 bg-red-50 text-red-700"><AlertDescription>{loadError} <button type="button" onClick={() => void refresh()} className="font-semibold underline">Erneut versuchen</button></AlertDescription></Alert>}
          {loading ? <p role="status" className="py-12 text-center text-sm text-slate-500">Bewerbungen werden geladen …</p> : !loadError && !visible.length ? (
            <div className="py-12 text-center"><BriefcaseBusiness className="mx-auto mb-4 h-9 w-9 text-slate-300" /><h3 className="font-semibold text-slate-900">{applications.length ? 'Keine passenden Bewerbungen' : 'Ihre erste Bewerbung beginnt hier'}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{applications.length ? 'Passen Sie die Suche oder den Filter an.' : 'Erfassen Sie eine Stelle und behalten Sie Schreiben, Termine und Rückmeldungen zusammen.'}</p>{applications.length ? <Button type="button" variant="outline" onClick={() => { setSearch(''); setView('all'); }} className={`mt-5 ${outlineButton}`}>Filter zurücksetzen</Button> : <Button type="button" onClick={() => open(null)} className={`mt-5 ${primaryButton}`}><Plus className="h-4 w-4" /> Erste Bewerbung erfassen</Button>}</div>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {visible.map((application) => (
                <li key={application.id}>
                  <button type="button" onClick={() => open(application)} className="group flex w-full flex-col gap-3 rounded-lg px-3 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-slate-950">{application.job_title}</p>
                      <p className="mt-1 break-words text-sm text-slate-600">{application.company}</p>
                      {application.next_action && <p className={`mt-1.5 break-words text-xs ${isActionDue(application) ? 'font-medium text-amber-700' : 'text-slate-500'}`}>{application.next_action}{application.next_action_at ? ` · bis ${dateLabel(application.next_action_at)}` : ''}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant="outline" className={statusStyles[application.status]}>{APPLICATION_STATUSES[application.status]}</Badge>
                      {applicationStatusDate(application) && <span className="text-sm tabular-nums text-slate-600">{dateLabel(applicationStatusDate(application))}</span>}
                      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#204878]" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      <p className="text-xs leading-5 text-slate-500">Der Bewerbungsmanager mit KI-Inseratimport ist im Self-Service-Abo enthalten. Nach Abo-Ende bleiben gespeicherte Bewerbungen lesbar, löschbar und exportierbar.</p>
    </div>
  );
}
