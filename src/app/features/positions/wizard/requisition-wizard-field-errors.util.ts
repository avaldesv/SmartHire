import { ValidationErrors } from '@angular/forms';
import {
  REQUISITION_WIZARD_FIELD_REQUIRED,
  REQUISITION_WIZARD_POSITIVE_INTEGER_MIN,
} from '../../../core/i18n/requisition-wizard-labels';
import { isRequisitionPositiveIntegerField } from './requisition-integer.util';

/** First validation message to show under a dynamic wizard control. */
export function resolveRequisitionWizardFieldError(
  errors: ValidationErrors | null,
  fieldKey: string,
): string | null {
  if (!errors) {
    return null;
  }
  if (isRequisitionPositiveIntegerField(fieldKey)) {
    if (errors['required']) {
      return REQUISITION_WIZARD_FIELD_REQUIRED;
    }
    if (errors['min'] || errors['integer']) {
      return REQUISITION_WIZARD_POSITIVE_INTEGER_MIN;
    }
  }
  if (errors['required']) {
    return REQUISITION_WIZARD_FIELD_REQUIRED;
  }
  return REQUISITION_WIZARD_FIELD_REQUIRED;
}