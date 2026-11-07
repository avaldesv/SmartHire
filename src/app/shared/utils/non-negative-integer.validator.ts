import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Accepts empty values and whole numbers greater than or equal to zero. */
export function nonNegativeIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    if (raw === null || raw === undefined || raw === '') {
      return null;
    }
    const value = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      return { nonNegativeInteger: true };
    }
    return null;
  };
}
