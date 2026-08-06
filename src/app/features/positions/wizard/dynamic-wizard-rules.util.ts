import {
  PEOPLE_IN_CHARGE_COUNT_FIELD_KEY,
  PEOPLE_IN_CHARGE_FIELD_KEY,
  RequisitionFormFieldRuleCondition,
  RequisitionFormFieldRules,
} from '../../../shared/models/requisition-form.model';
import { ResolvedRequisitionFormField } from '../../../shared/models/requisition-wizard.model';

export function parseFieldRules(rulesJson?: string | null): RequisitionFormFieldRules | null {
  if (!rulesJson?.trim()) {
    return null;
  }
  try {
    return JSON.parse(rulesJson) as RequisitionFormFieldRules;
  } catch {
    return null;
  }
}

export function evaluateFieldCondition(
  condition: RequisitionFormFieldRuleCondition | undefined,
  formValues: Record<string, unknown>,
): boolean {
  if (!condition) {
    return true;
  }
  const raw = formValues[condition.fieldKey];
  const boolValue = typeof raw === 'boolean' ? raw : !!raw;
  return boolValue === condition.equals;
}

export function isFieldVisible(
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown>,
): boolean {
  if (!field.isVisible) {
    return false;
  }
  if (field.fieldKey === 'brandId') {
    return false;
  }
  const rules = parseFieldRules(field.rulesJson);
  const visibleWhen =
    rules?.visibleWhen ??
    (field.fieldKey === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY
      ? { fieldKey: PEOPLE_IN_CHARGE_FIELD_KEY, equals: true }
      : undefined);
  if (!visibleWhen) {
    return true;
  }
  return evaluateFieldCondition(visibleWhen, formValues);
}

export function isFieldRequired(
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown>,
): boolean {
  if (!isFieldVisible(field, formValues)) {
    return false;
  }
  if (isFieldReadOnly(field)) {
    return false;
  }
  if (field.isRequired) {
    return true;
  }
  const rules = parseFieldRules(field.rulesJson);
  const requiredWhen =
    rules?.requiredWhen ??
    (field.fieldKey === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY
      ? { fieldKey: PEOPLE_IN_CHARGE_FIELD_KEY, equals: true }
      : undefined);
  if (!requiredWhen) {
    return false;
  }
  return evaluateFieldCondition(requiredWhen, formValues);
}

export function isFieldReadOnly(field: ResolvedRequisitionFormField): boolean {
  if (field.readOnly) {
    return true;
  }
  const rules = parseFieldRules(field.rulesJson);
  return !!rules?.readOnly;
}

export function fieldValueFrom(field: ResolvedRequisitionFormField): string | null {
  const rules = parseFieldRules(field.rulesJson);
  const source = rules?.valueFrom?.trim();
  return source ? source : null;
}

export function isPeopleInChargeRuleField(fieldKey: string): boolean {
  return fieldKey === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY || fieldKey === PEOPLE_IN_CHARGE_FIELD_KEY;
}
