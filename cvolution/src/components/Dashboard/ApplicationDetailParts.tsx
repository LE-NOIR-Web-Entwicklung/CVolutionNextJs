import React from 'react';
import { Check, X } from 'lucide-react';
import { APPLICATION_END_STATES, APPLICATION_STATUSES, APPLICATION_STEPS, applicationStepIndex, type ApplicationStatus } from '@/lib/applications';

export function DetailCard({ id, title, description, action, children }: { id?: string; title: string; description?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 id={id ? `${id}-title` : undefined} className="text-base font-semibold text-slate-950">{title}</h3>
          {description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const endStateStyles: Record<string, { active: string; icon: React.ElementType }> = {
  offer: { active: 'border-emerald-600 bg-emerald-600 text-white', icon: Check },
  rejected: { active: 'border-rose-600 bg-rose-600 text-white', icon: X },
};

// Horizontal steps from sm upwards, a plain select on phones.
export function StatusStepper({ value, onChange, disabled }: { value: ApplicationStatus; onChange: (status: ApplicationStatus) => void; disabled: boolean }) {
  const current = applicationStepIndex(value);
  return (
    <div>
      <label htmlFor="application-status" className="mb-1.5 block text-sm font-medium text-slate-900 sm:sr-only">Status</label>
      <select
        id="application-status"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as ApplicationStatus)}
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] sm:hidden"
      >
        {Object.entries(APPLICATION_STATUSES).map(([status, label]) => <option key={status} value={status}>{label}</option>)}
      </select>

      <div role="group" aria-label="Status" className="hidden sm:block">
        <ol className="flex items-center">
          {APPLICATION_STEPS.map((step, index) => {
            const done = value !== 'withdrawn' && index < current;
            const active = step === value;
            return (
              <li key={step} className="flex flex-1 items-center">
                <button
                  type="button"
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => onChange(step)}
                  className="group flex min-w-0 items-center gap-2 rounded-md py-1 pr-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] disabled:cursor-not-allowed"
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${active ? 'border-[#204878] bg-[#204878] text-white' : done ? 'border-[#204878] bg-[#EEF4FA] text-[#204878]' : 'border-slate-300 bg-white text-slate-500 group-hover:border-slate-400'}`}>
                    {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  <span className={`truncate ${active ? 'font-semibold text-slate-950' : 'text-slate-600 group-hover:text-slate-900'}`}>{APPLICATION_STATUSES[step]}</span>
                </button>
                <span aria-hidden="true" className={`mx-1 h-0.5 flex-1 rounded ${done ? 'bg-[#204878]' : 'bg-slate-200'}`} />
              </li>
            );
          })}
          <li className="flex shrink-0 gap-1.5">
            {APPLICATION_END_STATES.map((step) => {
              const active = step === value;
              const { active: activeClass, icon: Icon } = endStateStyles[step];
              return (
                <button
                  key={step}
                  type="button"
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => onChange(step)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] disabled:cursor-not-allowed ${active ? activeClass : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}
                >
                  <Icon className="h-3.5 w-3.5" />{APPLICATION_STATUSES[step]}
                </button>
              );
            })}
          </li>
        </ol>
        <div className="mt-2 text-xs text-slate-500">
          {value === 'withdrawn' ? (
            <>Diese Bewerbung ist zurückgezogen. Wählen Sie oben einen Schritt, um sie wieder aufzunehmen.</>
          ) : (
            <button type="button" disabled={disabled} onClick={() => onChange('withdrawn')} className="underline-offset-2 hover:text-slate-800 hover:underline disabled:cursor-not-allowed">
              Als zurückgezogen markieren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SaveState({ saving, failed, dirty, isNew }: { saving: boolean; failed: boolean; dirty: boolean; isNew: boolean }) {
  const [text, tone] = saving ? ['Speichert …', 'text-slate-500']
    : failed && dirty ? ['Fehler beim Speichern', 'text-red-700']
    : dirty ? ['Ungespeicherte Änderungen', 'text-amber-700']
    : isNew ? ['Neue Bewerbung', 'text-slate-500']
    : ['Alle Änderungen gespeichert', 'text-emerald-700'];
  const dot = saving ? 'bg-slate-400 animate-pulse' : failed && dirty ? 'bg-red-600' : dirty ? 'bg-amber-500' : isNew ? 'bg-slate-300' : 'bg-emerald-600';
  return (
    <p role="status" className={`inline-flex items-center gap-1.5 text-xs ${tone}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />{text}
    </p>
  );
}
