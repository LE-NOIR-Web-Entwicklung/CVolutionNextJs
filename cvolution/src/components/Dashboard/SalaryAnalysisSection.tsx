import React, { useEffect, useId, useState } from 'react';
import { AlertCircle, ArrowRight, Check, FileText, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { formatApplicationDate } from '@/lib/application-dates';
import { formatChf, formatSignedChf, formatSignedPercent, type SalaryAnalysis, type SalaryScenarioKey, type SalaryTone } from '@/lib/salary-analysis';

type Props = {
  hasSelfServiceAccess: boolean;
  onRequirePayment: () => void;
  // CV data already captured in the tool; an upload is only asked for without it.
  hasCvData: boolean;
  profileName: string;
  profileBirthdate: string | null;
};

type Unit = 'year' | 'month';

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const fieldClass = 'border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-900';
const toneText: Record<SalaryTone, string> = { positive: 'text-emerald-700', neutral: 'text-amber-700', negative: 'text-red-600' };
const toneDot: Record<SalaryTone, string> = { positive: 'bg-emerald-500', neutral: 'bg-amber-400', negative: 'bg-red-500' };
const scenarioStyles: Record<SalaryScenarioKey, { tile: string; color: string }> = {
  pessimistic: { tile: 'from-[#f39c12] to-[#e67e22]', color: '#e67e22' },
  realistic: { tile: 'from-[#27ae60] to-[#229954]', color: '#27ae60' },
  optimistic: { tile: 'from-[#3498db] to-[#2980b9]', color: '#3498db' },
};

async function salaryRequest(options: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Bitte melden Sie sich erneut an.');
  return fetch('/api/salary-analysis', { ...options, cache: 'no-store', headers: { Authorization: `Bearer ${token}` } });
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3 border-b-2 border-[#4a90e2] pb-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4a90e2] font-semibold text-white">{number}</span>
        <h3 className="text-lg font-semibold text-[#4a90e2] sm:text-xl">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function InfoBox({ title, children, tone = 'blue' }: { title: string; children: React.ReactNode; tone?: 'blue' | 'green' | 'grey' }) {
  const styles = { blue: 'border-[#2196f3] bg-[#e3f2fd]', green: 'border-[#27ae60] bg-[#e8f5e9]', grey: 'border-[#4a90e2] bg-slate-50' }[tone];
  return (
    <div className={`rounded border-l-4 p-4 ${styles}`}>
      <h4 className="mb-1.5 text-sm font-semibold text-slate-900">{title}</h4>
      <div className="text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}

function UnitToggle({ unit, onChange, months }: { unit: Unit; onChange: (unit: Unit) => void; months: number }) {
  return (
    <div role="group" aria-label="Darstellung der Beträge" className="inline-flex rounded-md bg-slate-100 p-0.5 text-xs">
      {([['year', 'Pro Jahr'], ['month', `Pro Monat (× ${months})`]] as const).map(([value, label]) => (
        <button key={value} type="button" aria-pressed={unit === value} onClick={() => onChange(value)} className={`rounded px-2.5 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] ${unit === value ? 'bg-white text-[#204878] shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, reference, referenceLabel, format }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number } }>; reference: number; referenceLabel: string; format: (value: number) => string }) {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) return null;
  const difference = entry.value - reference;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-950">{entry.name}</p>
      <p className="mt-0.5 tabular-nums text-slate-700">{format(entry.value)}</p>
      {difference !== 0 && <p className={`mt-0.5 tabular-nums ${difference > 0 ? 'text-emerald-700' : 'text-red-600'}`}>{format(Math.abs(difference)).replace('CHF', difference > 0 ? '+ CHF' : '- CHF')} zu {referenceLabel}</p>}
    </div>
  );
}

function Report({ analysis, onRestart, onDelete, busy }: { analysis: SalaryAnalysis; onRestart: () => void; onDelete: () => void; busy: boolean }) {
  const { person, salary, market, deviation, summary, social, scenarios, employers, positioning, qualifications, recommendations } = analysis;
  const [unit, setUnit] = useState<Unit>('year');
  const [activeScenario, setActiveScenario] = useState<SalaryScenarioKey>('realistic');
  const convert = (value: number) => (unit === 'year' ? value : Math.round(value / salary.months));
  const format = (value: number) => formatChf(value);
  const scenario = scenarios.find((item) => item.key === activeScenario) || scenarios[1];
  const currentLabel = salary.workload < 100 ? 'Ihr Lohn (100%)' : 'Ihr Lohn';
  const current = convert(salary.totalFullTime);
  const marketBars = [
    { name: currentLabel, value: current, color: '#204878' },
    { name: 'Markt unten', value: convert(market.low), color: '#cbd5e1' },
    { name: 'Marktmedian', value: convert(market.median), color: '#4a90e2' },
    { name: 'Markt oben', value: convert(market.high), color: '#cbd5e1' },
  ];
  const scenarioBars = [
    { name: currentLabel, value: current, color: '#204878', key: null as SalaryScenarioKey | null },
    ...scenarios.map((item) => ({ name: item.label, value: convert(item.amount), color: scenarioStyles[item.key].color, key: item.key as SalaryScenarioKey | null })),
  ];
  const info: Array<[string, string]> = [
    ['Name', person.name], ['Alter', person.age ? `${person.age} Jahre` : ''], ['Position', person.position],
    ['Arbeitgeber', person.employer], ['Arbeitsort', person.workplace], ['Analysedatum', formatApplicationDate(person.analysisDate)],
  ];
  const axisTick = { fontSize: 12, fill: '#475569' };
  const metrics: Array<[string, string, string, string]> = [
    ['Bruttojahreslohn', formatChf(salary.annualGross), salary.monthly ? `${formatChf(salary.monthly)} × ${salary.months} Monatslöhne` : '', 'text-slate-950'],
    ['Abweichung Marktmedian', formatSignedPercent(deviation.percent), `${deviation.rating}, Median ${formatChf(market.median)}`, toneText[deviation.tone]],
    ['Gesamtvergütung', formatChf(salary.total), salary.workload < 100 ? `${formatChf(salary.totalFullTime)} bei 100%` : salary.variable ? `inkl. ${formatChf(salary.variable)} variabel` : 'kein variabler Anteil', 'text-slate-950'],
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <header className="rounded-[10px] bg-gradient-to-br from-[#5b6fd8] to-[#9b7de8] p-5 text-center text-white sm:p-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Lohnanalyse {person.name}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 text-left sm:grid-cols-3 sm:text-center">
          {info.filter(([, value]) => value).map(([label, value]) => (
            <div key={label} className="min-w-0 rounded bg-white/20 px-3 py-2.5">
              <p className="text-xs font-semibold opacity-90">{label}</p>
              <p className="break-words text-sm">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <Section number={1} title="Executive Summary">
        <p className="text-sm leading-6 text-slate-700">{summary.intro}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {metrics.map(([label, value, note, color]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`mt-1.5 text-2xl font-bold tabular-nums ${color}`}>{value}</p>
              {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900">Ihr Lohn im Marktvergleich</h4>
          <UnitToggle unit={unit} onChange={setUnit} months={salary.months} />
        </div>
        <div className="mt-3 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketBars} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
              <CartesianGrid horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={axisTick} tickFormatter={(value) => `${Math.round(value / (unit === 'year' ? 1000 : 1))}${unit === 'year' ? 'k' : ''}`} />
              <YAxis type="category" dataKey="name" width={104} tick={axisTick} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip reference={current} referenceLabel="Ihrem Lohn" format={format} />} />
              <ReferenceLine x={current} stroke="#204878" strokeDasharray="4 4" />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
                {marketBars.map((bar) => <Cell key={bar.name} fill={bar.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-5 space-y-2.5">
          {summary.points.map((point) => (
            <li key={point.title} className="flex gap-2.5 text-sm leading-6 text-slate-700">
              <span aria-hidden="true" className={`mt-2 h-2 w-2 shrink-0 rounded-full ${toneDot[point.tone]}`} />
              <span><strong className={`font-semibold ${toneText[point.tone]}`}>{point.title}:</strong> {point.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section number={2} title="Sozialversicherungen">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead><tr className="border-b-2 border-[#4a90e2] bg-slate-50">{['Sozialversicherung', 'Basis', 'Satz', 'Betrag', 'Bewertung'].map((title) => <th key={title} scope="col" className="px-3 py-2.5 font-semibold text-slate-900">{title}</th>)}</tr></thead>
            <tbody>
              {social.rows.map((row) => {
                const total = /^total/i.test(row.name);
                return (
                  <tr key={row.name} className={`border-b border-slate-200 ${total ? 'bg-slate-100 font-semibold' : ''}`}>
                    <td className="px-3 py-2.5">{row.name}</td>
                    <td className="px-3 py-2.5 tabular-nums">{row.base ? formatChf(row.base) : ''}</td>
                    <td className="px-3 py-2.5 tabular-nums">{row.rate}</td>
                    <td className="px-3 py-2.5 tabular-nums">{row.amount ? formatChf(row.amount) : ''}</td>
                    <td className="px-3 py-2.5 text-slate-600">{row.assessment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <InfoBox tone="green" title={`Berufliche Vorsorge (BVG): ${social.bvg.assessment}`}>
            <p>{social.bvg.text}</p>
            <p className="mt-2 text-xs text-slate-600">
              {[social.bvg.insuredSalary ? `Versicherter Lohn ${formatChf(social.bvg.insuredSalary)}` : '', social.bvg.minimumEmployeeRate && `Mindest-Arbeitnehmeranteil ${social.bvg.minimumEmployeeRate}`, social.bvg.actualEmployeeRate && `Tatsächlich ${social.bvg.actualEmployeeRate}`].filter(Boolean).join(' · ')}
            </p>
          </InfoBox>
        </div>
      </Section>

      <Section number={3} title="Marktvergleich Schweiz">
        <p className="text-sm leading-6 text-slate-700">{market.intro}</p>
        <div role="group" aria-label="Szenario wählen" className="mt-5 grid gap-3 sm:grid-cols-3">
          {scenarios.map((item) => {
            const active = item.key === scenario.key;
            return (
              <button key={item.key} type="button" aria-pressed={active} onClick={() => setActiveScenario(item.key)} className={`rounded-[10px] bg-gradient-to-br p-4 text-center text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] focus-visible:ring-offset-2 ${scenarioStyles[item.key].tile} ${active ? 'shadow-lg ring-2 ring-[#204878] ring-offset-2' : 'opacity-70 hover:opacity-100'}`}>
                <span className="block text-xs font-semibold uppercase tracking-wide">{item.label}</span>
                <span className="mt-2 block text-2xl font-bold tabular-nums">{formatChf(convert(item.amount))}</span>
                <span className="mt-1 block text-sm tabular-nums opacity-95">{formatSignedChf(convert(item.delta))} ({formatSignedPercent(item.deltaPercent)})</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700"><strong className="font-semibold text-slate-900">{scenario.label}:</strong> {scenario.description}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900">Szenarien im Vergleich</h4>
          <UnitToggle unit={unit} onChange={setUnit} months={salary.months} />
        </div>
        <div className="mt-3 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioBars} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ ...axisTick, fontSize: 11 }} interval={0} />
              <YAxis width={44} tick={axisTick} tickFormatter={(value) => `${Math.round(value / (unit === 'year' ? 1000 : 1))}${unit === 'year' ? 'k' : ''}`} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip reference={current} referenceLabel="Ihrem Lohn" format={format} />} />
              <ReferenceLine y={current} stroke="#204878" strokeDasharray="4 4" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={72} className="cursor-pointer" onClick={(data: { payload?: { key?: SalaryScenarioKey | null } }) => { const key = data?.payload?.key; if (key) setActiveScenario(key); }}>
                {scenarioBars.map((bar) => <Cell key={bar.name} fill={bar.color} fillOpacity={!bar.key || bar.key === scenario.key ? 1 : 0.4} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section number={4} title="Positionierung im Markt">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-left text-sm">
            <thead><tr className="border-b-2 border-[#4a90e2] bg-slate-50"><th scope="col" className="px-3 py-2.5 font-semibold text-slate-900">Unternehmenskategorie</th><th scope="col" className="px-3 py-2.5 font-semibold text-slate-900">Lohnspanne (100%)</th></tr></thead>
            <tbody>
              {employers.map((row) => (
                <tr key={row.category} className={`border-b border-slate-200 ${row.current ? 'bg-[#fff3cd]' : ''}`}>
                  <td className="px-3 py-2.5">{row.category}{row.current && <span className="ml-2 text-xs font-medium text-amber-800">Ihre aktuelle Position</span>}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 tabular-nums">{formatChf(row.low)} – {formatChf(row.high).replace('CHF ', '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {positioning.items.map((item) => <InfoBox key={item.title} title={item.title}>{item.text}</InfoBox>)}
        </div>
        {positioning.conclusion && <div className="mt-3"><InfoBox title="Fazit">{positioning.conclusion}</InfoBox></div>}
      </Section>

      <Section number={5} title="Qualifikationsanalyse">
        {qualifications.formal.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[26rem] text-left text-sm">
              <thead><tr className="border-b-2 border-[#4a90e2] bg-slate-50">{['Abschluss', 'Institution', 'Jahr'].map((title) => <th key={title} scope="col" className="px-3 py-2.5 font-semibold text-slate-900">{title}</th>)}</tr></thead>
              <tbody>{qualifications.formal.map((row) => <tr key={row.title} className="border-b border-slate-200"><td className="px-3 py-2.5">{row.title}</td><td className="px-3 py-2.5">{row.institution}</td><td className="px-3 py-2.5 tabular-nums">{row.year}</td></tr>)}</tbody>
            </table>
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InfoBox tone="grey" title="Berufserfahrung">{qualifications.experience}</InfoBox>
          <InfoBox tone="grey" title="Kernkompetenzen">{qualifications.competencies}</InfoBox>
          <InfoBox tone="grey" title="Besonderheiten">{qualifications.specials}</InfoBox>
          <InfoBox title="Marktwert-Einschätzung">{qualifications.marketValue}</InfoBox>
        </div>
      </Section>

      <Section number={6} title="Strategische Empfehlungen">
        <div className="grid gap-6 md:grid-cols-2">
          {([['Kurzfristig (0-12 Monate)', recommendations.short], ['Mittelfristig (12-24 Monate)', recommendations.medium], ['Verhandlungstipps', recommendations.negotiation]] as const).map(([title, items]) => (
            <div key={title}>
              <h4 className="mb-2 border-b-2 border-slate-200 pb-1.5 font-semibold text-[#4a90e2]">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#4a90e2]" /><span>{item}</span></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="mb-2 border-b-2 border-slate-200 pb-1.5 font-semibold text-[#4a90e2]">Langfristig (24+ Monate)</h4>
            <ul className="space-y-2">
              {recommendations.long.map((item) => <li key={item.path} className="flex items-start justify-between gap-3 text-sm leading-6 text-slate-700"><span>{item.path}</span><span className="shrink-0 font-semibold tabular-nums text-slate-900">{item.target}</span></li>)}
            </ul>
          </div>
        </div>
      </Section>

      <footer className="rounded-lg bg-slate-100 p-4 text-center text-xs text-slate-600">
        <p className="font-semibold">Erstellt von CVolution</p>
        <p className="mt-1">Die Marktwerte sind eine KI-Einschätzung und keine statistische Lohnerhebung.</p>
      </footer>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" onClick={onRestart} disabled={busy} className="bg-[#204878] text-white hover:bg-[#1a3a66]"><Sparkles className="h-4 w-4" /> Neue Analyse erstellen</Button>
        <Button type="button" variant="ghost" onClick={onDelete} disabled={busy} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 className="h-4 w-4" /> Analyse löschen</Button>
      </div>
    </div>
  );
}

export function SalaryAnalysisSection({ hasSelfServiceAccess, onRequirePayment, hasCvData, profileName, profileBirthdate }: Props) {
  const { user } = useAuth();
  const fieldId = useId();
  const [analysis, setAnalysis] = useState<SalaryAnalysis | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [payslipName, setPayslipName] = useState('');
  const [cvName, setCvName] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    setAnalysis(null);
    salaryRequest()
      .then(async (response) => { const result = await response.json().catch(() => null); if (active && response.ok) setAnalysis(result?.analysis || null); })
      .catch(() => { /* Without a saved analysis the form is shown. */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!hasSelfServiceAccess) { onRequirePayment(); return; }
    const body = new FormData(event.currentTarget);
    const uploaded = (['payslip', 'cv'] as const).reduce((sum, key) => { const file = body.get(key); return sum + (file instanceof File ? file.size : 0); }, 0);
    if (uploaded > MAX_UPLOAD_BYTES) { setError('Die Dateien sind zusammen zu gross. Bitte verwenden Sie höchstens 4 MB.'); return; }
    setGenerating(true);
    try {
      const response = await salaryRequest({ method: 'POST', body });
      const result = await response.json().catch(() => null);
      if (response.status === 402) { onRequirePayment(); throw new Error('Die AI Lohnanalyse ist im aktiven Self-Service-Abo enthalten.'); }
      if (!response.ok) throw new Error(result?.error || 'Die Erstellung hat zu lange gedauert. Bitte versuchen Sie es erneut.');
      setAnalysis(result.analysis);
      setShowForm(false);
      if (!result.saved) toast({ title: 'Analyse nicht gespeichert', description: 'Die Analyse ist nur sichtbar, bis Sie die Seite neu laden.', variant: 'destructive' });
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Die Lohnanalyse konnte nicht erstellt werden.');
    } finally { setGenerating(false); }
  }

  async function remove() {
    if (!window.confirm('Diese Lohnanalyse endgültig löschen?')) return;
    setDeleting(true);
    try {
      const response = await salaryRequest({ method: 'DELETE' });
      if (!response.ok) throw new Error();
      setAnalysis(null);
      setShowForm(false);
      toast({ title: 'Lohnanalyse gelöscht' });
    } catch {
      toast({ title: 'Löschen fehlgeschlagen', description: 'Bitte versuchen Sie es erneut.', variant: 'destructive' });
    } finally { setDeleting(false); }
  }

  if (loading) return <div role="status" className="flex h-48 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-500 shadow-sm"><Loader2 className="mr-2 h-5 w-5 animate-spin text-[#204878]" /> Wird geladen …</div>;
  if (analysis && !showForm) return <Report analysis={analysis} onRestart={() => setShowForm(true)} onDelete={remove} busy={deleting} />;

  const fileInput = 'block w-full cursor-pointer rounded-md border border-slate-200 bg-white text-sm text-slate-700 file:mr-3 file:cursor-pointer file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-3 file:py-2.5 file:text-sm file:font-medium file:text-slate-700';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-slate-950">AI Lohnanalyse</h2>
      <p className="mt-1 text-sm text-slate-600">Vergleichen Sie Ihren Lohn mit dem Schweizer Markt. Die Analyse erscheint direkt hier im Dashboard.</p>

      {generating && (
        <div role="status" className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 px-6 text-center">
          <Loader2 className="mb-3 h-7 w-7 animate-spin text-[#204878]" />
          <p className="text-sm font-medium text-slate-700">Ihre Lohnanalyse wird erstellt …</p>
          <p className="mt-1 text-xs text-slate-500">Das dauert bis zu einer Minute. Bitte lassen Sie die Seite geöffnet.</p>
        </div>
      )}
      {/* Stays mounted while generating so a failed run keeps the entries and files. */}
      <form onSubmit={submit} className={generating ? 'hidden' : 'mt-6 space-y-5'}>
          <fieldset disabled={!hasSelfServiceAccess} className="min-w-0 space-y-5">
            {(profileName || profileBirthdate) && (
              <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Aus Ihrem Profil: {[profileName, formatApplicationDate(profileBirthdate)].filter(Boolean).join(' · ')}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label htmlFor={`${fieldId}-annual`} className={labelClass}>Bruttojahreslohn *</label><Input id={`${fieldId}-annual`} name="annualGross" required inputMode="numeric" maxLength={12} placeholder="z.B. CHF 85'000" className={fieldClass} /></div>
              <div><label htmlFor={`${fieldId}-workload`} className={labelClass}>Pensum *</label><Input id={`${fieldId}-workload`} name="workload" required inputMode="numeric" maxLength={6} placeholder="z.B. 100%" className={fieldClass} /></div>
              <div><label htmlFor={`${fieldId}-workplace`} className={labelClass}>Arbeitsort *</label><Input id={`${fieldId}-workplace`} name="workplace" required maxLength={80} placeholder="z.B. Zürich" className={fieldClass} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${fieldId}-payslip`} className={labelClass}>Aktuelle Lohnabrechnung *</label>
                <input id={`${fieldId}-payslip`} name="payslip" type="file" required accept="application/pdf,.pdf,image/jpeg,image/png" onChange={(event) => setPayslipName(event.target.files?.[0]?.name || '')} className={fileInput} />
                <p className="mt-1 text-xs text-slate-500">{payslipName || 'PDF, JPG oder PNG, höchstens 4 MB'}</p>
              </div>
              {hasCvData ? (
                <div>
                  <p className={labelClass}>Lebenslauf</p>
                  <p className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"><Check className="h-4 w-4 shrink-0 text-emerald-600" /> Ihr Lebenslauf aus dem CV Self-Service wird verwendet.</p>
                </div>
              ) : (
                <div>
                  <label htmlFor={`${fieldId}-cv`} className={labelClass}>Aktueller Lebenslauf *</label>
                  <input id={`${fieldId}-cv`} name="cv" type="file" required accept="application/pdf,.pdf,image/jpeg,image/png" onChange={(event) => setCvName(event.target.files?.[0]?.name || '')} className={fileInput} />
                  <p className="mt-1 text-xs text-slate-500">{cvName || 'Noch kein Lebenslauf im CV Self-Service erfasst. Name und weitere Angaben übernehmen wir aus der Datei.'}</p>
                </div>
              )}
            </div>
            <div><label htmlFor={`${fieldId}-benefits`} className={labelClass}>Fringe & Benefits</label><Textarea id={`${fieldId}-benefits`} name="benefits" maxLength={1000} placeholder="z.B. Geschäftsauto, Spesenpauschale, zusätzliche Ferien" className={`min-h-20 ${fieldClass}`} /></div>
            <div><label htmlFor={`${fieldId}-linkedin`} className={labelClass}>LinkedIn Profil</label><Input id={`${fieldId}-linkedin`} name="linkedin" maxLength={300} placeholder="www.linkedin.com/in/..." className={fieldClass} /></div>
            <div><label htmlFor={`${fieldId}-notes`} className={labelClass}>Bemerkungen</label><Textarea id={`${fieldId}-notes`} name="notes" maxLength={1000} className={`min-h-20 ${fieldClass}`} /></div>
          </fieldset>

          {error && <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
            <Button type="submit" className="min-h-10 bg-[#204878] text-white hover:bg-[#1a3a66]">
              {hasSelfServiceAccess ? <><FileText className="h-4 w-4" /> Lohnanalyse erstellen</> : 'Abo aktivieren'}
            </Button>
            {analysis && <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setError(''); }} className="min-h-10 text-slate-600 hover:bg-slate-100">Abbrechen</Button>}
          </div>
      </form>
    </div>
  );
}
