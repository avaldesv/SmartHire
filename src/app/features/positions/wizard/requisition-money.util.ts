import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Money columns persisted as DECIMAL(14,2) on position. */
export const REQUISITION_MONEY_FIELD_KEYS = new Set([
  'salary',
  'serviceFee',
  'publishSalaryMin',
  'publishSalaryMax',
]);

export function isRequisitionMoneyField(fieldKey: string): boolean {
  return REQUISITION_MONEY_FIELD_KEYS.has(fieldKey);
}

/** Reject values with more than 2 fractional digits (aligns with BD scale=2). */
export function maxTwoDecimalsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = typeof value === 'number' ? value : Number(String(value).trim().replace(',', '.'));
    if (!Number.isFinite(num)) {
      return { maxTwoDecimals: true };
    }
    const scaled = num * 100;
    if (Math.abs(scaled - Math.round(scaled)) > 1e-6) {
      return { maxTwoDecimals: true };
    }
    return null;
  };
}

export function roundMoneyToTwoDecimals(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = typeof value === 'number' ? value : Number(String(value).trim().replace(',', '.'));
  if (!Number.isFinite(num)) {
    return null;
  }
  return Math.round(num * 100) / 100;
}

/** Native-like spinner step for money inputs (keeps scale=2). */
export const MONEY_STEP = 0.01;

/** Step money by ±delta and return display string with two decimals (clamped to min). */
export function stepMoneyValue(value: unknown, delta: number, min = 0): string {
  const current = roundMoneyToTwoDecimals(value) ?? 0;
  const next = roundMoneyToTwoDecimals(current + delta) ?? 0;
  return Math.max(min, next).toFixed(2);
}

/** Display value always with two fractional digits (e.g. 15000 → "15000.00"). */
export function formatMoneyDisplay(value: unknown): string {
  const rounded = roundMoneyToTwoDecimals(value);
  return rounded == null ? '' : rounded.toFixed(2);
}

/**
 * Keep only digits and a single decimal separator while typing.
 * Strips letters, signs (`-`), and other symbols so they never appear in the input.
 * Allows a trailing separator (e.g. `12.`) while the user is still typing.
 */
export function sanitizeNonNegativeMoneyInput(raw: string): string {
  const normalized = raw.replace(/,/g, '.');
  let out = '';
  let seenDot = false;
  for (const ch of normalized) {
    if (ch >= '0' && ch <= '9') {
      out += ch;
      continue;
    }
    if (ch === '.' && !seenDot) {
      out += '.';
      seenDot = true;
    }
  }
  if (seenDot) {
    const [intPart, fracPart = ''] = out.split('.');
    out = `${intPart}.${fracPart.slice(0, 2)}`;
  }
  return out;
}
