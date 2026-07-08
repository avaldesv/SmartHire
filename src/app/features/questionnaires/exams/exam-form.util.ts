import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxAttemptsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    if (raw === '' || raw == null) {
      return null;
    }
    const value = Number(raw);
    if (Number.isNaN(value) || value < 1) {
      return { maxAttemptsInvalid: true };
    }
    return null;
  };
}

export function toIsoDateTime(localValue: string): string | null {
  if (!localValue?.trim()) {
    return null;
  }
  const date = new Date(localValue);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function toDateTimeLocalValue(isoValue: string | null | undefined): string {
  if (!isoValue) {
    return '';
  }
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
