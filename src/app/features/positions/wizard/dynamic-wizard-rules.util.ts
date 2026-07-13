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
  const rules = parseFieldRules(field.rulesJson);
  if (!rules?.visibleWhen) {
    return true;
  }
  return evaluateFieldCondition(rules.visibleWhen, formValues);
}

export function isFieldRequired(
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown>,
): boolean {
  if (!isFieldVisible(field, formValues)) {
    return false;
  }
  if (field.isRequired) {
    return true;
  }
  const rules = parseFieldRules(field.rulesJson);
  if (!rules?.requiredWhen) {
    return false;
  }
  return evaluateFieldCondition(rules.requiredWhen, formValues);
}

export function isPeopleInChargeRuleField(fieldKey: string): boolean {
  return fieldKey === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY || fieldKey === PEOPLE_IN_CHARGE_FIELD_KEY;
}
