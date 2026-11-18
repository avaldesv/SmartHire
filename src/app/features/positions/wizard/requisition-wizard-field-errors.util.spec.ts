import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { resolveRequisitionWizardFieldError } from './requisition-wizard-field-errors.util';
import {
  REQUISITION_WIZARD_FIELD_REQUIRED,
  REQUISITION_WIZARD_POSITIVE_INTEGER_MIN,
} from '../../../core/i18n/requisition-wizard-labels';
import { integerValidator } from './requisition-integer.util';

describe('resolveRequisitionWizardFieldError', () => {
  it('returns required message when positionsCount is empty', () => {
    const control = new FormControl(null, [Validators.required, Validators.min(1), integerValidator()]);
    control.markAsTouched();
    control.updateValueAndValidity();
    expect(resolveRequisitionWizardFieldError(control.errors, 'positionsCount')).toBe(
      REQUISITION_WIZARD_FIELD_REQUIRED,
    );
  });

  it('returns min message when positionsCount is below 1', () => {
    const control = new FormControl(0, [Validators.required, Validators.min(1), integerValidator()]);
    control.markAsTouched();
    control.updateValueAndValidity();
    expect(resolveRequisitionWizardFieldError(control.errors, 'positionsCount')).toBe(
      REQUISITION_WIZARD_POSITIVE_INTEGER_MIN,
    );
  });
});