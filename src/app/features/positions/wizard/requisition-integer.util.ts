import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Integer fields that must be whole numbers ≥ 1 when set. */
export const REQUISITION_POSITIVE_INTEGER_FIELD_KEYS = new Set(['positionsCount']);

export function isRequisitionPositiveIntegerField(fieldKey: string): boolean {
  return REQUISITION_POSITIVE_INTEGER_FIELD_KEYS.has(fieldKey);
}

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = typeof value === 'number' ? value : Number(String(value).trim());
    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      return { integer: true };
    }
    return null;
  };
}

export function toPositiveIntegerOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) {
    return null;
  }
  return Math.trunc(num);
}
