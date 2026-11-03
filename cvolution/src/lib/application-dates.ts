export function applicationDateToIso(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function applicationDateFromIso(value: string | null): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number(value.slice(0, 4)) < 1) return undefined;
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) && applicationDateToIso(date) === value ? date : undefined;
}

export function formatApplicationDate(value: string | null): string {
  return value && applicationDateFromIso(value) ? `${value.slice(8, 10)}.${value.slice(5, 7)}.${value.slice(0, 4)}` : value || '';
}

export function parseApplicationDateInput(value: string): string | null {
  const match = value.trim().replace(/^(\d{2})(\d{2})(\d{4})$/, '$1.$2.$3').match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  return applicationDateFromIso(iso) ? iso : null;
}
