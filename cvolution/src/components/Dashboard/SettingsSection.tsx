import Link from 'next/link';
import { useState } from 'react';
import { CreditCard, FileText, HelpCircle, LogOut, Mail, Phone, UserRound } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cvPrimary, cvSecondary } from './cv-ui';

type SettingsSectionProps = {
  email: string;
  hasActiveSubscription: boolean;
  hasCanceledSubscription: boolean;
  hasAccess: boolean;
  canRenew: boolean;
  accessUntil: string | null;
  canceling: boolean;
  onCancelSubscription: () => void;
  onRenew: () => void;
  onSignOut: () => void;
};

const STATUS = {
  active: { label: 'Aktiv', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  canceled: { label: 'Gekündigt', className: 'bg-amber-50 text-amber-800 ring-amber-200' },
  access: { label: 'Zugang aktiv', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  none: { label: 'Kein Abo', className: 'bg-slate-100 text-slate-600 ring-slate-200' },
};

function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <h3 className="flex items-center gap-2 border-b border-slate-100 px-4 py-3.5 text-sm font-semibold text-slate-950 sm:px-5">
        <Icon className="h-4 w-4 text-[#204878]" aria-hidden="true" />{title}
      </h3>
      <div className="px-4 py-4 sm:px-5">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-3 first:pt-0 last:border-b-0 last:pb-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-slate-950">{children}</dd>
    </div>
  );
}

export function SettingsSection({
  email,
  hasActiveSubscription,
  hasCanceledSubscription,
  hasAccess,
  canRenew,
  accessUntil,
  canceling,
  onCancelSubscription,
  onRenew,
  onSignOut,
}: SettingsSectionProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const status = hasActiveSubscription
    ? STATUS.active
    : hasCanceledSubscription && hasAccess
      ? STATUS.canceled
      : hasAccess ? STATUS.access : STATUS.none;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Einstellungen</h2>
        <p className="mt-1 text-sm text-slate-600">Konto und Abo verwalten</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        <Card icon={CreditCard} title="Abo">
          <dl>
            <Row label="Paket">Self-Service</Row>
            <Row label="Status">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}>{status.label}</span>
            </Row>
            {hasActiveSubscription && <Row label="Preis">CHF 13.90 pro Monat</Row>}
            {hasAccess && accessUntil && (
              <Row label={hasActiveSubscription ? 'Nächste Abbuchung' : 'Zugang bis'}>{accessUntil}</Row>
            )}
          </dl>

          {!hasAccess && (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Mit dem Abo erstellen Sie Lebenslauf und Motivationsschreiben, verwalten Ihre Bewerbungen und nutzen die Lohnanalyse.
            </p>
          )}
          {hasActiveSubscription && (
            <p className="mt-4 text-sm leading-6 text-slate-600">Das Abo verlängert sich automatisch. Sie können es jederzeit auf das Ende der bezahlten Laufzeit kündigen.</p>
          )}
          {hasCanceledSubscription && hasAccess && (
            <p className="mt-4 text-sm leading-6 text-slate-600">Es werden keine weiteren Abbuchungen ausgelöst.</p>
          )}

          {(canRenew || hasActiveSubscription) && (
            <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              {canRenew && (
                <Button type="button" onClick={onRenew} className={`min-h-10 ${cvPrimary}`}>
                  {hasAccess ? 'Abo verlängern' : 'Abo aktivieren'}
                </Button>
              )}
              {hasActiveSubscription && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmCancel(true)}
                  disabled={canceling}
                  className="min-h-10 border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  {canceling ? 'Wird gekündigt …' : 'Abo kündigen'}
                </Button>
              )}
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card icon={UserRound} title="Konto">
            <p className="text-sm text-slate-500">Angemeldet als</p>
            <p className="mt-0.5 break-words text-sm font-medium text-slate-950">{email}</p>
            <Button type="button" onClick={onSignOut} className={`mt-4 min-h-10 w-full ${cvSecondary}`}>
              <LogOut className="h-4 w-4" aria-hidden="true" /> Abmelden
            </Button>
          </Card>

          <Card icon={HelpCircle} title="Hilfe">
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:info@cvolution.ch" className="inline-flex items-center gap-2 text-slate-700 hover:text-[#204878]">
                  <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" /> info@cvolution.ch
                </a>
              </li>
              <li>
                <a href="tel:+41764405151" className="inline-flex items-center gap-2 text-slate-700 hover:text-[#204878]">
                  <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" /> 076 440 51 51
                </a>
              </li>
              <li>
                <Link href="/agb" className="inline-flex items-center gap-2 text-slate-700 hover:text-[#204878]">
                  <FileText className="h-4 w-4 text-slate-400" aria-hidden="true" /> Allgemeine Geschäftsbedingungen
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent className="bg-white text-slate-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Abo wirklich kündigen?</AlertDialogTitle>
            <AlertDialogDescription>
              Ihr Zugang bleibt {accessUntil ? `bis ${accessUntil}` : 'bis zum Ende der bezahlten Laufzeit'} aktiv. Danach werden keine weiteren monatlichen Abbuchungen ausgelöst.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cvSecondary}>Abo behalten</AlertDialogCancel>
            <AlertDialogAction onClick={onCancelSubscription} className="bg-red-600 text-white hover:bg-red-700">Abo kündigen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
