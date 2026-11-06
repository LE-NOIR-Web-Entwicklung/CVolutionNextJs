import React from 'react';
import { Check, X } from 'lucide-react';
import { APPLICATION_STATUSES, applicationStepIndex, previousApplicationStatus, type ApplicationDateKey, type ApplicationInput, type ApplicationStatus } from '@/lib/applications';
import { ApplicationDateInput } from './ApplicationDateInput';

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

type Progress = Pick<ApplicationInput, 'status' | ApplicationDateKey>;

const STEPS: Array<{ status: ApplicationStatus; dateKey: ApplicationDateKey; dateLabel: string }> = [
  { status: 'sent', dateKey: 'applied_at', dateLabel: 'Versendet am' },
  { status: 'interview', dateKey: 'interview1_at', dateLabel: 'Gespräch 1 am' },
  { status: 'interview2', dateKey: 'interview2_at', dateLabel: 'Gespräch 2 am' },
];

const outcomes: Array<{ status: ApplicationStatus; active: string; icon: React.ElementType }> = [
  { status: 'offer', active: 'border-emerald-600 bg-emerald-600 text-white', icon: Check },
  { status: 'rejected', active: 'border-rose-600 bg-rose-600 text-white', icon: X },
];

function StepColumn({ reached, label, children }: { reached: boolean; label: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="min-w-0">
      <div className={`mb-2 h-1 rounded-full ${reached ? 'bg-[#204878]' : 'bg-slate-200'}`} />
      <div className="mb-2 flex min-h-8 items-center">{label}</div>
      {children}
    </li>
  );
}

// One column per step with its own date: Versendet, Gespräch 1, Gespräch 2, Zusage / Absage.
export function StatusStepper({ value, onStatusChange, onDateChange, disabled }: { value: Progress; onStatusChange: (status: ApplicationStatus) => void; onDateChange: (key: ApplicationDateKey, date: string | null) => void; disabled: boolean }) {
  const current = value.status === 'withdrawn' ? -1 : applicationStepIndex(value.status);
  const toggle = (status: ApplicationStatus) => onStatusChange(status === value.status ? previousApplicationStatus(value) : status);
  return (
    <div>
      <ol className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-3">
        {STEPS.map(({ status, dateKey, dateLabel }) => {
          const reached = current >= applicationStepIndex(status);
          return (
            <StepColumn
              key={status}
              reached={reached}
              label={(
                <button type="button" aria-pressed={value.status === status} disabled={disabled} onClick={() => toggle(status)} className={`inline-flex items-center gap-1.5 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] disabled:cursor-not-allowed ${value.status === status ? 'font-semibold text-slate-950' : reached ? 'text-slate-800' : 'text-slate-500 hover:text-slate-900'}`}>
                  {reached && <Check className="h-3.5 w-3.5 text-[#204878]" />}{APPLICATION_STATUSES[status]}
                </button>
              )}
            >
              <label htmlFor={`application-${dateKey}`} className="sr-only">{dateLabel}</label>
              <ApplicationDateInput id={`application-${dateKey}`} label={dateLabel} value={value[dateKey]} onChange={(date) => onDateChange(dateKey, date)} disabled={disabled} />
            </StepColumn>
          );
        })}
        <StepColumn
          reached={value.status === 'offer' || value.status === 'rejected'}
          label={(
            <div role="group" aria-label="Entscheid" className="flex gap-1.5">
              {outcomes.map(({ status, active, icon: Icon }) => (
                <button key={status} type="button" aria-pressed={value.status === status} disabled={disabled} onClick={() => toggle(status)} className={`inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#204878] disabled:cursor-not-allowed ${value.status === status ? active : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}>
                  <Icon className="h-3.5 w-3.5" />{APPLICATION_STATUSES[status]}
                </button>
              ))}
            </div>
          )}
        >
          <label htmlFor="application-decision_at" className="sr-only">Zusage / Absage am</label>
          <ApplicationDateInput id="application-decision_at" label="Zusage / Absage am" value={value.decision_at} onChange={(date) => onDateChange('decision_at', date)} disabled={disabled} />
        </StepColumn>
      </ol>
      <div className="mt-3 text-xs text-slate-500">
        {value.status === 'withdrawn' ? (
          <>Diese Bewerbung ist zurückgezogen. Wählen Sie oben einen Schritt, um sie wieder aufzunehmen.</>
        ) : (
          <button type="button" disabled={disabled} onClick={() => onStatusChange('withdrawn')} className="underline-offset-2 hover:text-slate-800 hover:underline disabled:cursor-not-allowed">
            Als zurückgezogen markieren
          </button>
        )}
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
