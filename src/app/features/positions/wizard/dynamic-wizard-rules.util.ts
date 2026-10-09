import {
  EXAM_MODALITY_ID_FIELD_KEY,
  PEOPLE_IN_CHARGE_COUNT_FIELD_KEY,
  PEOPLE_IN_CHARGE_FIELD_KEY,
  RequisitionFormFieldRuleCondition,
  RequisitionFormFieldRules,
} from '../../../shared/models/requisition-form.model';
import {
  ResolvedRequisitionFormField,
  ResolvedRequisitionFormConfig,
  WizardFieldOption,
} from '../../../shared/models/requisition-wizard.model';

export interface FieldRulesContext {
  modalityCodeById?: Map<number, string>;
}

let cachedModalityCodeById = new Map<number, string>();

export function updateExamModalityCodeByIdFromOptions(options: WizardFieldOption[]): void {
  const next = new Map(cachedModalityCodeById);
  for (const opt of options) {
    const code = opt.code?.trim();
    if (code) {
      next.set(opt.id, code);
    }
  }
  cachedModalityCodeById = next;
}

export function buildModalityCodeByIdFromOptions(options: WizardFieldOption[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const opt of options) {
    const code = opt.code?.trim();
    if (code) {
      map.set(opt.id, code);
    }
  }
  return map;
}

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
  context: FieldRulesContext = {},
): boolean {
  if (!condition) {
    return true;
  }
  const raw = formValues[condition.fieldKey];

  if (condition.equalsCode?.trim()) {
    const expected = condition.equalsCode.trim();
    if (condition.fieldKey === EXAM_MODALITY_ID_FIELD_KEY) {
      const modalityId = typeof raw === 'number' ? raw : Number(raw);
      if (raw == null || raw === '' || Number.isNaN(modalityId)) {
        return false;
      }
      const code =
        context.modalityCodeById?.get(modalityId) ?? cachedModalityCodeById.get(modalityId) ?? null;
      return code === expected;
    }
    return String(raw ?? '') === expected;
  }

  if (typeof condition.equals === 'boolean') {
    const boolValue = typeof raw === 'boolean' ? raw : !!raw;
    return boolValue === condition.equals;
  }

  if (typeof condition.equals === 'number') {
    const num = typeof raw === 'number' ? raw : Number(raw);
    return !Number.isNaN(num) && num === condition.equals;
  }

  if (condition.equals !== undefined) {
    return String(raw ?? '') === String(condition.equals);
  }

  return true;
}

export function isFieldVisible(
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown>,
  context: FieldRulesContext = {},
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
  return evaluateFieldCondition(visibleWhen, formValues, context);
}

export function isFieldRequired(
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown>,
  context: FieldRulesContext = {},
): boolean {
  if (!isFieldVisible(field, formValues, context)) {
    return false;
  }
  if (isFieldReadOnly(field, formValues, context)) {
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
  return evaluateFieldCondition(requiredWhen, formValues, context);
}

export function isFieldReadOnly(
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown> = {},
  _context: FieldRulesContext = {},
): boolean {
  if (field.readOnly) {
    return true;
  }
  const rules = parseFieldRules(field.rulesJson);
  if (rules?.readOnly) {
    return true;
  }
  const readOnlyWhen = rules?.readOnlyWhen;
  if (readOnlyWhen?.hasValue && readOnlyWhen.fieldKey) {
    return hasFilledValue(formValues[readOnlyWhen.fieldKey]);
  }
  return false;
}

function hasFilledValue(raw: unknown): boolean {
  if (raw == null || raw === '') {
    return false;
  }
  if (typeof raw === 'number') {
    return !Number.isNaN(raw);
  }
  return true;
}

export function findResolvedField(
  config: ResolvedRequisitionFormConfig,
  fieldKey: string,
): ResolvedRequisitionFormField | undefined {
  for (const step of config.steps) {
    const field = step.fields.find((item) => item.fieldKey === fieldKey);
    if (field) {
      return field;
    }
  }
  return undefined;
}

export function fieldValueFrom(field: ResolvedRequisitionFormField): string | null {
  const rules = parseFieldRules(field.rulesJson);
  const source = rules?.valueFrom?.trim();
  return source ? source : null;
}

export function fieldFillFromCatalog(
  field: ResolvedRequisitionFormField,
): NonNullable<RequisitionFormFieldRules['fillFromCatalog']> | null {
  const rules = parseFieldRules(field.rulesJson);
  return rules?.fillFromCatalog?.mappings?.length ? rules.fillFromCatalog : null;
}

export function isPeopleInChargeRuleField(fieldKey: string): boolean {
  return fieldKey === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY || fieldKey === PEOPLE_IN_CHARGE_FIELD_KEY;
}
