import React from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Shared look of the CV areas, matching Bewerbungen and AI Motivationsschreiben.
export const cvField = 'w-full border-slate-200 bg-white text-slate-950 focus-visible:ring-[#204878]/20';
export const cvLabel = 'mb-1.5 block text-sm font-medium text-slate-900';
export const cvPrimary = 'bg-[#204878] text-white hover:bg-[#1a3a66]';
export const cvSecondary = 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
export const cvIconButton = 'h-8 w-8 rounded-md bg-transparent p-0 text-slate-500 shadow-none hover:bg-slate-100 hover:text-slate-900';
export const cvCheckbox = 'h-4 w-4 rounded border-slate-300 accent-[#204878]';
export const cvFormActions = 'flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row-reverse sm:justify-start';

export function CvPanel({ title, description, action, children, className = '' }: { title: string; description?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </section>
  );
}

export function CvAddButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={`h-9 shrink-0 px-3 ${cvPrimary}`}>
      <Plus className="h-4 w-4" /><span className="hidden sm:inline">Hinzufügen</span>
    </Button>
  );
}

export function CvItemActions({ label, onEdit, onDelete }: { label: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      <Button type="button" onClick={onEdit} aria-label={`${label} bearbeiten`} title="Bearbeiten" className={cvIconButton}><Pencil className="h-4 w-4" /></Button>
      <Button type="button" onClick={onDelete} aria-label={`${label} löschen`} title="Löschen" className={`${cvIconButton} hover:bg-red-50 hover:text-red-700`}><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}

// Inline add/edit forms sit on a tinted surface so they stand apart from the list.
export function CvFormSurface({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#D8E4F0] bg-[#F7FAFD] p-4 sm:p-5">
      {title && <h3 className="mb-4 text-sm font-semibold text-slate-950">{title}</h3>}
      {children}
    </div>
  );
}

export function CvEmpty({ icon: Icon, text, actionLabel, onAction }: { icon: React.ElementType; text: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <Icon className="mb-3 h-8 w-8 text-slate-300" />
      <p className="text-sm text-slate-500">{text}</p>
      {actionLabel && onAction && (
        <Button type="button" onClick={onAction} className={`mt-4 h-9 ${cvSecondary}`}><Plus className="h-4 w-4" />{actionLabel}</Button>
      )}
    </div>
  );
}

export function CvLoading() {
  return (
    <div role="status" className="flex h-48 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-500 shadow-sm">
      <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#204878]" /> Wird geladen …
    </div>
  );
}
