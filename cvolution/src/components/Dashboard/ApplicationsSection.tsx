import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarClock, Download, FileText, Loader2, Plus, RefreshCw, Search, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { APPLICATION_STATUSES, applicationInput, emptyApplication, filterApplications, isActionDue, isApplicationOpen, type Application, type ApplicationInput, type ApplicationStatus, type MotivationDraft } from '@/lib/applications';
import { ApplicationRequestError, deleteApplication, downloadApplications, extractApplication, loadApplications, saveApplication } from '@/lib/applications-client';
import { MotivationLetterSection } from './MotivationLetterSection';
import { ApplicationDateInput } from './ApplicationDateInput';

type Props = {
  hasSelfServiceAccess: boolean;
  onRequirePayment: () => void;
  onExportCv: () => void;
  incomingApplication: Application | null;
  onDirtyChange: (dirty: boolean) => void;
};

const primaryButton = 'bg-[#204878] text-white hover:bg-[#1a3a66]';
const outlineButton = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
const selectClass = 'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878]';
const statusStyles: Record<ApplicationStatus, string> = {
  draft: 'border-slate-200 bg-slate-50 text-slate-600',
  sent: 'border-blue-200 bg-blue-50 text-blue-800',
  interview: 'border-amber-200 bg-amber-50 text-amber-800',
  offer: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rejected: 'border-rose-200 bg-rose-50 text-rose-800',
  withdrawn: 'border-slate-200 bg-slate-50 text-slate-600',
};

function dateLabel(value: string | null) {
  return value ? new Intl.DateTimeFormat('de-CH', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T12:00:00Z`)) : '';
}

function StatusOptions({ all = false }: { all?: boolean }) {
  return <>{all && <option value="all">Alle Status</option>}{Object.entries(APPLICATION_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</>;
}

export function ApplicationsSection({ hasSelfServiceAccess, onRequirePayment, onExportCv, incomingApplication, onDirtyChange }: Props) {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | 'all'>('all');
  const [saved, setSaved] = useState<Application | null>(null);
  const [draft, setDraft] = useState<ApplicationInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [working, setWorking] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const busy = saving || working || extracting;
  const dirty = Boolean(draft && JSON.stringify(draft) !== JSON.stringify(saved ? applicationInput(saved) : emptyApplication()));
  const visible = useMemo(() => filterApplications(applications, search, status), [applications, search, status]);

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
      setStatus('all');
      setError('');
      requestAnimationFrame(() => listHeading.current?.focus());
    }
  }, [incomingApplication]);

  useEffect(() => {
    onDirtyChange(dirty || busy);
  }, [dirty, busy, onDirtyChange]);

  function open(application: Application | null) {
    if (busy || (dirty && !window.confirm('Ungespeicherte Änderungen verwerfen?'))) return;
    if (!application && !hasSelfServiceAccess) { onRequirePayment(); return; }
    setSaved(application);
    setDraft(application ? applicationInput(application) : emptyApplication());
    setError('');
    requestAnimationFrame(() => detailHeading.current?.focus());
  }

  function back() {
    if (busy || (dirty && !window.confirm('Ungespeicherte Änderungen verwerfen?'))) return;
    setDraft(null);
    setSaved(null);
    setError('');
    requestAnimationFrame(() => listHeading.current?.focus());
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
    setError('');
    try {
      const application = await saveApplication(next, saved);
      setSaved(saved ? application : null);
      setDraft(saved ? applicationInput(application) : null);
      setApplications((current) => [application, ...current.filter((row) => row.id !== application.id)]);
      if (!saved) {
        setWorking(false);
        setSearch('');
        setStatus('all');
        requestAnimationFrame(() => listHeading.current?.focus());
      }
      return application;
    } catch (err) {
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
      toast({ title: 'Stellenangaben übernommen', description: 'Bitte prüfen und ergänzen Sie die KI-Angaben vor dem Speichern.' });
    } catch (err) {
      if (err instanceof ApplicationRequestError && err.status === 402) onRequirePayment();
      setError(err instanceof Error ? err.message : 'Das Inserat konnte nicht ausgelesen werden.');
    } finally { setExtracting(false); }
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
      setDraft(null);
      setSaved(null);
      toast({ title: 'Bewerbung gelöscht' });
      requestAnimationFrame(() => listHeading.current?.focus());
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
    try { downloadApplications(await loadApplications()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Export fehlgeschlagen.'); }
    finally { setExporting(false); }
  }

  if (!user) return <Alert className="border-slate-200 bg-white text-slate-700"><AlertDescription>Bitte melden Sie sich an, um Ihre Bewerbungen zu verwalten.</AlertDescription></Alert>;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#204878]"><BriefcaseBusiness className="h-4 w-4" /> Ihre Stellensuche</p>
            <h2 ref={listHeading} tabIndex={-1} className="text-2xl font-bold text-slate-950">Bewerbungen</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Stellen sammeln, Schreiben vorbereiten und nächste Schritte im Blick behalten.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={exportAll} disabled={exporting || loading} className={outlineButton}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Daten exportieren
            </Button>
            <Button type="button" onClick={() => open(null)} disabled={busy} className={primaryButton}><Plus className="h-4 w-4" /> Bewerbung erfassen</Button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 sm:gap-4" aria-label="Bewerbungsübersicht">
          {[
            ['Bewerbungen', applications.length],
            ['Offene Bewerbungen', applications.filter(isApplicationOpen).length],
            ['Schritte fällig', applications.filter((application) => isActionDue(application)).length],
          ].map(([label, count]) => <div key={label} className="rounded-lg bg-slate-50 p-3 sm:p-4"><p className="text-xl font-semibold text-[#204878]">{loading ? '–' : count}</p><p className="mt-1 text-xs text-slate-600">{label}</p></div>)}
        </div>
      </section>

      {error && <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700"><AlertDescription>{error}</AlertDescription></Alert>}

      {!hasSelfServiceAccess && <Alert className="border-blue-200 bg-blue-50 text-slate-700"><AlertDescription>
        <p>Der Bewerbungsmanager inklusive KI-Inseratimport ist Teil des Self-Service-Abos. Gespeicherte Bewerbungen bleiben lesbar, löschbar und exportierbar.</p>
        <Button type="button" onClick={onRequirePayment} className={`mt-3 ${primaryButton}`}>Self-Service-Abo aktivieren</Button>
      </AlertDescription></Alert>}

      {draft ? (
        <>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <Button type="button" variant="outline" onClick={back} disabled={busy} className={outlineButton}><ArrowLeft className="h-4 w-4" /> Übersicht</Button>
              <p role="status" className={`text-xs ${dirty ? 'text-amber-700' : 'text-slate-500'}`}>{saving ? 'Wird gespeichert …' : dirty ? 'Ungespeicherte Änderungen' : saved ? 'Alle Änderungen gespeichert' : 'Neue Bewerbung'}</p>
            </div>
            <h2 ref={detailHeading} tabIndex={-1} className="mt-5 break-words text-xl font-semibold text-slate-950">{saved ? `${saved.job_title} · ${saved.company}` : 'Neue Bewerbung erfassen'}</h2>
            <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
              <label htmlFor="application-job-url" className="text-sm font-semibold text-slate-900">Link zum Stelleninserat</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Input id="application-job-url" type="url" inputMode="url" maxLength={500} value={draft.motivation_form.jobAdUrl} onChange={(event) => update('motivation_form', { ...draft.motivation_form, jobAdUrl: event.target.value })} disabled={busy || !hasSelfServiceAccess} placeholder="https://..." className="min-w-0 flex-1 bg-white text-slate-950" />
                <Button type="button" onClick={importJobAd} disabled={busy || !hasSelfServiceAccess || !draft.motivation_form.jobAdUrl.trim()} className={primaryButton}>{extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{extracting ? 'Wird ausgelesen …' : 'Mit KI auslesen'}</Button>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">Die KI übernimmt erkennbare Stellenangaben in den Entwurf. Bitte prüfen und ergänzen Sie die Angaben vor dem Speichern. Geschützte Inserate können Sie manuell erfassen.</p>
            </div>
            <form id="application-details" onSubmit={saveDetails} className="mt-5">
              <fieldset disabled={busy || !hasSelfServiceAccess} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><label htmlFor="application-company" className="text-sm font-semibold text-slate-900">Unternehmen *</label><Input id="application-company" value={draft.company} onChange={(event) => update('company', event.target.value)} required maxLength={140} className="bg-white text-slate-950" /></div>
                <div className="space-y-2"><label htmlFor="application-job" className="text-sm font-semibold text-slate-900">Stellenbezeichnung *</label><Input id="application-job" value={draft.job_title} onChange={(event) => update('job_title', event.target.value)} required maxLength={140} className="bg-white text-slate-950" /></div>
                <div className="space-y-2"><label htmlFor="application-status" className="text-sm font-semibold text-slate-900">Status</label><select id="application-status" value={draft.status} onChange={(event) => update('status', event.target.value as ApplicationStatus)} className={selectClass}><StatusOptions /></select></div>
                <div className="space-y-2"><label htmlFor="application-applied" className="text-sm font-semibold text-slate-900">Versendet am</label><ApplicationDateInput id="application-applied" label="Versendet am" value={draft.applied_at} onChange={(value) => update('applied_at', value)} disabled={busy || !hasSelfServiceAccess} /></div>
                <div className="space-y-2"><label htmlFor="application-deadline" className="text-sm font-semibold text-slate-900">Bewerbungsfrist</label><ApplicationDateInput id="application-deadline" label="Bewerbungsfrist" value={draft.deadline} onChange={(value) => update('deadline', value)} disabled={busy || !hasSelfServiceAccess} /></div>
                <div className="space-y-2"><label htmlFor="application-next-date" className="text-sm font-semibold text-slate-900">Nächste Aktion am</label><ApplicationDateInput id="application-next-date" label="Nächste Aktion am" value={draft.next_action_at} onChange={(value) => update('next_action_at', value)} disabled={busy || !hasSelfServiceAccess} /></div>
                <div className="space-y-2 sm:col-span-2"><label htmlFor="application-next" className="text-sm font-semibold text-slate-900">Nächster Schritt</label><Input id="application-next" value={draft.next_action} onChange={(event) => update('next_action', event.target.value)} maxLength={240} placeholder="Zum Beispiel nachfragen oder Gespräch vorbereiten" className="bg-white text-slate-950" /></div>
                <div className="space-y-2 sm:col-span-2"><label htmlFor="application-notes" className="text-sm font-semibold text-slate-900">Notizen</label><Textarea id="application-notes" value={draft.notes} onChange={(event) => update('notes', event.target.value)} maxLength={5000} className="min-h-28 bg-white text-slate-950" /></div>
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <Button type="submit" className={primaryButton}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Bewerbung speichern</Button>
                  <Button type="button" variant="outline" onClick={onExportCv} className={outlineButton}><Download className="h-4 w-4" /> Aktuellen CV exportieren</Button>
                  {saved && <Button type="button" variant="outline" onClick={reloadSaved} className={outlineButton}><RefreshCw className="h-4 w-4" /> Gespeicherten Stand laden</Button>}
                </div>
              </fieldset>
              {saved && <div className="mt-4 flex justify-end"><Button type="button" variant="outline" onClick={remove} disabled={busy} className="border-red-200 bg-white text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Löschen</Button></div>}
            </form>
            <p className="mt-4 text-xs leading-5 text-slate-500">Der CV verwendet Ihre aktuellen Profildaten. Eine Kopie des versendeten CV wird hier nicht gespeichert. Termine für nächste Aktionen erscheinen in dieser Übersicht.</p>
          </section>
          <MotivationLetterSection
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
        </>
      ) : (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-busy={loading}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input aria-label="Bewerbungen durchsuchen" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Unternehmen oder Stelle suchen" className="bg-white pl-9 text-slate-950" /></div>
            <select aria-label="Nach Status filtern" value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus | 'all')} className={`${selectClass} sm:max-w-56`}><StatusOptions all /></select>
            <Button type="button" variant="outline" onClick={() => void refresh()} disabled={loading} aria-label="Bewerbungen aktualisieren" className={outlineButton}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          </div>
          {loadError && <Alert variant="destructive" className="mt-5 border-red-200 bg-red-50 text-red-700"><AlertDescription>{loadError} <button type="button" onClick={() => void refresh()} className="font-semibold underline">Erneut versuchen</button></AlertDescription></Alert>}
          {loading ? <p role="status" className="py-12 text-center text-sm text-slate-500">Bewerbungen werden geladen …</p> : !loadError && !visible.length ? (
            <div className="py-12 text-center"><BriefcaseBusiness className="mx-auto mb-4 h-9 w-9 text-slate-300" /><h3 className="font-semibold text-slate-900">{applications.length ? 'Keine passenden Bewerbungen' : 'Ihre erste Bewerbung beginnt hier'}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{applications.length ? 'Passen Sie die Suche oder den Statusfilter an.' : 'Erfassen Sie eine Stelle und behalten Sie Schreiben, Termine und Rückmeldungen zusammen.'}</p>{!applications.length && <Button type="button" onClick={() => open(null)} className={`mt-5 ${primaryButton}`}><Plus className="h-4 w-4" /> Erste Bewerbung erfassen</Button>}</div>
          ) : (
            <ul className="mt-5 divide-y divide-slate-100">
              {visible.map((application) => (
                <li key={application.id}>
                  <button type="button" onClick={() => open(application)} className="group flex w-full flex-col gap-3 rounded-lg px-3 py-5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0"><p className="break-words font-semibold text-slate-950">{application.job_title}</p><p className="mt-1 break-words text-sm text-slate-600">{application.company}</p><Badge variant="outline" className={`mt-2 ${statusStyles[application.status]}`}>{APPLICATION_STATUSES[application.status]}</Badge></div>
                    <div className="flex items-center justify-between gap-5 sm:w-72 sm:shrink-0"><div className="min-w-0"><p className={`flex items-center gap-1.5 text-xs ${isActionDue(application) ? 'font-semibold text-amber-700' : 'text-slate-500'}`}><CalendarClock className="h-3.5 w-3.5 shrink-0" />{application.next_action_at ? `${isActionDue(application) ? 'Fällig · ' : ''}${dateLabel(application.next_action_at)}` : 'Kein Datum festgelegt'}</p><p className="mt-1 break-words text-sm text-slate-700">{application.next_action || 'Nächsten Schritt festlegen'}</p>{application.deadline && <p className="mt-1 text-xs text-slate-500">Bewerbungsfrist: {dateLabel(application.deadline)}</p>}</div><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#204878]" /></div>
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
