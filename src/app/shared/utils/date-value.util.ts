/** Date helpers for Material datepicker ↔ API payloads (YYYY-MM-DD). */

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})/;
const DMY_RE = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/;

function localDate(year: number, month: number, day: number): Date | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

function expandTwoDigitYear(year: number): number {
  if (year >= 100) {
    return year;
  }
  return year >= 70 ? 1900 + year : 2000 + year;
}

/** Parse Date, YYYY-MM-DD, dd/mm/yyyy, or d/m/yy as a local calendar date. */
export function parseDateInput(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return localDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const iso = ISO_RE.exec(trimmed);
  if (iso) {
    return localDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  }

  const dmy = DMY_RE.exec(trimmed);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = expandTwoDigitYear(Number(dmy[3]));
    return localDate(year, month, day);
  }

  return null;
}

/** Format → "YYYY-MM-DD" for API. */
export function formatDateToIso(value: unknown): string | null {
  const date = parseDateInput(value);
  if (!date) {
    return null;
  }
  const y = String(date.getFullYear());
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format → "dd/MM/yyyy" for UI. */
export function formatDateToDdMmYyyy(value: unknown): string | null {
  const iso = formatDateToIso(value);
  if (!iso) {
    return null;
  }
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}
