import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { de } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { applicationDateFromIso, applicationDateToIso, formatApplicationDate, parseApplicationDateInput } from '@/lib/application-dates';

type Props = {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled: boolean;
};

export function ApplicationDateInput({ id, label, value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = applicationDateFromIso(value);
  const invalid = Boolean(value && !selected);

  useEffect(() => {
    inputRef.current?.setCustomValidity(invalid ? 'Bitte geben Sie ein gültiges Datum als TT.MM.JJJJ ein.' : '');
  }, [invalid]);

  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);

  return (
    <div className="relative">
      <Input
        ref={inputRef} id={id} type="text" inputMode="numeric" autoComplete="off"
        value={formatApplicationDate(value)} placeholder="TT.MM.JJJJ" maxLength={10}
        aria-invalid={invalid || undefined} aria-describedby={`${id}-format`} disabled={disabled}
        onChange={(event) => onChange(event.target.value ? parseApplicationDateInput(event.target.value) || event.target.value : null)}
        className="bg-white pr-11 text-slate-950"
      />
      <span id={`${id}-format`} className="sr-only">Datum im Format TT.MM.JJJJ, zum Beispiel 17.11.2026.</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label={`Kalender: ${label}`} disabled={disabled} className="absolute right-1 top-1 h-8 w-8 text-slate-600 hover:bg-slate-100">
            <CalendarDays className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-label={`Datum auswählen: ${label}`} align="start" className="z-[10000] w-auto border-slate-200 bg-white p-3 text-slate-950" onCloseAutoFocus={(event) => { event.preventDefault(); inputRef.current?.focus(); }}>
          <DayPicker
            mode="single" locale={de} selected={selected} defaultMonth={selected} autoFocus
            style={{ '--rdp-accent-color': '#204878', '--rdp-accent-background-color': '#EEF4FA' } as React.CSSProperties}
            onSelect={(date) => { onChange(date ? applicationDateToIso(date) : null); setOpen(false); }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
