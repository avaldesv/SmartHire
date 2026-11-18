import { ResolvedRequisitionFormConfig, ResolvedRequisitionFormField } from '../../../shared/models/requisition-wizard.model';
import {
  CLIENT_CATALOG_FILL_RULES,
  CLIENT_CATALOG_READ_ONLY_WHEN,
  CLIENT_ID_FIELD_KEY,
  isClientCatalogFillTarget,
} from '../../../shared/constants/requisition-client-catalog-fill';
import { DEFAULT_REQUISITION_WIZARD_SCHEMA } from './default-requisition-wizard-schema.constant';
import { parseFieldRules } from './dynamic-wizard-rules.util';

const BUILTIN_FIELD_PRESENTATION = new Map<
  string,
  { uiType: string; dataSourceKey: string | null }
>();

for (const step of DEFAULT_REQUISITION_WIZARD_SCHEMA.steps) {
  for (const field of step.fields) {
    BUILTIN_FIELD_PRESENTATION.set(field.fieldKey, {
      uiType: field.uiType,
      dataSourceKey: field.dataSourceKey ?? null,
    });
  }
}

const DEFAULT_CLIENT_ID_FIELD = DEFAULT_REQUISITION_WIZARD_SCHEMA.steps
  .find((step) => step.stepKey === 'client')
  ?.fields.find((field) => field.fieldKey === CLIENT_ID_FIELD_KEY);

const BUDGET_TYPE_FIELD_KEY = 'budgetType';
const REQUISITION_TYPE_FIELD_KEY = 'requisitionTypeId';

const DEFAULT_BUDGET_TYPE_FIELD = DEFAULT_REQUISITION_WIZARD_SCHEMA.steps
  .find((step) => step.stepKey === 'manpower')
  ?.fields.find((field) => field.fieldKey === BUDGET_TYPE_FIELD_KEY);

/** Align resolved config with built-in field definitions (code is source of truth). */
export function applyBuiltinFieldPresentation(
  config: ResolvedRequisitionFormConfig,
): ResolvedRequisitionFormConfig {
  return {
    ...config,
    steps: config.steps.map((step) => {
      const aligned = step.fields.map((field) =>
        mergeClientCatalogRules(alignBuiltinPresentation(field)),
      );
      if (step.stepKey === 'client') {
        return { ...step, fields: placeClientIdAfterCoverage(aligned) };
      }
      if (step.stepKey === 'manpower') {
        return { ...step, fields: placeBudgetTypeAfterRequisitionType(aligned) };
      }
      return { ...step, fields: aligned };
    }),
  };
}

function placeBudgetTypeAfterRequisitionType(
  fields: ResolvedRequisitionFormField[],
): ResolvedRequisitionFormField[] {
  const withoutBudget = fields.filter((field) => field.fieldKey !== BUDGET_TYPE_FIELD_KEY);
  const existing = fields.find((field) => field.fieldKey === BUDGET_TYPE_FIELD_KEY);
  const budgetField =
    existing ?? (DEFAULT_BUDGET_TYPE_FIELD ? alignBuiltinPresentation({ ...DEFAULT_BUDGET_TYPE_FIELD }) : null);
  if (!budgetField) {
    return fields;
  }
  const typeIdx = withoutBudget.findIndex((field) => field.fieldKey === REQUISITION_TYPE_FIELD_KEY);
  if (typeIdx < 0) {
    return [...withoutBudget, budgetField];
  }
  const nextKey = withoutBudget[typeIdx + 1]?.fieldKey;
  if (nextKey === BUDGET_TYPE_FIELD_KEY) {
    return fields;
  }
  return [
    ...withoutBudget.slice(0, typeIdx + 1),
    budgetField,
    ...withoutBudget.slice(typeIdx + 1),
  ];
}

function placeClientIdAfterCoverage(
  fields: ResolvedRequisitionFormField[],
): ResolvedRequisitionFormField[] {
  const withoutClient = fields.filter((field) => field.fieldKey !== CLIENT_ID_FIELD_KEY);
  const existing = fields.find((field) => field.fieldKey === CLIENT_ID_FIELD_KEY);
  const clientField = existing
    ?? (DEFAULT_CLIENT_ID_FIELD ? alignBuiltinPresentation({ ...DEFAULT_CLIENT_ID_FIELD }) : null);
  if (!clientField) {
    return fields;
  }
  const coverageIdx = withoutClient.findIndex((field) => field.fieldKey === 'coverageTypeId');
  if (coverageIdx < 0) {
    const countryIdx = withoutClient.findIndex((field) => field.fieldKey === 'countryId');
    if (countryIdx < 0) {
      return [clientField, ...withoutClient];
    }
    return [
      ...withoutClient.slice(0, countryIdx + 1),
      clientField,
      ...withoutClient.slice(countryIdx + 1),
    ];
  }
  return [
    ...withoutClient.slice(0, coverageIdx + 1),
    clientField,
    ...withoutClient.slice(coverageIdx + 1),
  ];
}

function alignBuiltinPresentation(field: ResolvedRequisitionFormField): ResolvedRequisitionFormField {
  const builtin = BUILTIN_FIELD_PRESENTATION.get(field.fieldKey);
  if (!builtin) {
    return field;
  }
  return {
    ...field,
    uiType: builtin.uiType,
    dataSourceKey: builtin.dataSourceKey,
  };
}

function mergeClientCatalogRules(field: ResolvedRequisitionFormField): ResolvedRequisitionFormField {
  const rules = { ...(parseFieldRules(field.rulesJson) ?? {}) };
  let changed = false;
  if (field.fieldKey === CLIENT_ID_FIELD_KEY && !rules.fillFromCatalog) {
    rules.fillFromCatalog = CLIENT_CATALOG_FILL_RULES.fillFromCatalog;
    changed = true;
  }
  if (
    (isClientCatalogFillTarget(field.fieldKey) || field.fieldKey === 'ot') &&
    !rules.readOnlyWhen
  ) {
    rules.readOnlyWhen = CLIENT_CATALOG_READ_ONLY_WHEN.readOnlyWhen;
    changed = true;
  }
  if (!changed) {
    return field;
  }
  return { ...field, rulesJson: JSON.stringify(rules) };
}
