/** HH:mm (24h) helpers for Material timepicker ↔ API payloads. */

const TIME_RE = /^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]?))?$/;

export const REQUISITION_TIME_DEFAULTS: Record<string, string> = {
  workdayStartTime: '08:00',
  workdayEndTime: '17:00',
  lunchStartTime: '13:00',
  lunchEndTime: '14:00',
};

/** Parse "HH:mm", "H:mm", or "H:mm AM/PM" into a Date (date part fixed). */
export function parseTimeToDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(2000, 0, 1, value.getHours(), value.getMinutes(), 0, 0);
  }
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const match = TIME_RE.exec(trimmed);
  if (match) {
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridian = match[3]?.toUpperCase();
    if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) {
      return null;
    }
    if (meridian) {
      const isPm = meridian.startsWith('P');
      if (hours === 12) {
        hours = isPm ? 12 : 0;
      } else if (isPm) {
        hours += 12;
      }
    }
    if (hours > 23) {
      return null;
    }
    return new Date(2000, 0, 1, hours, minutes, 0, 0);
  }

  // Fallback: "14:00:00" or ISO-ish
  const parts = trimmed.split(':');
  if (parts.length >= 2) {
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return new Date(2000, 0, 1, hours, minutes, 0, 0);
    }
  }
  return null;
}

/** Format Date → "HH:mm" 24h for API. */
export function formatDateToHhMm(value: unknown): string | null {
  const date = parseTimeToDate(value);
  if (!date) {
    return null;
  }
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function defaultTimeDateForField(fieldKey: string): Date {
  const hhmm = REQUISITION_TIME_DEFAULTS[fieldKey] ?? '08:00';
  return parseTimeToDate(hhmm)!;
}
