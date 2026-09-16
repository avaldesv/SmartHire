import {
  REQUISITION_FORM_DEFAULT_STEP_KEYS,
  RequisitionFormFieldConfig,
  RequisitionFormFieldDef,
  RequisitionFormStepConfig,
} from '../models/requisition-form.model';
import {
  orderedFieldKeysForStep,
  stepLabelI18nKey,
} from '../constants/requisition-form-field-step-map';
import {
  CLIENT_CATALOG_FILL_RULES,
  CLIENT_CATALOG_READ_ONLY_WHEN,
  CLIENT_ID_FIELD_KEY,
  isClientCatalogFillTarget,
} from '../constants/requisition-client-catalog-fill';

const DOCUMENT_CONFIG_FIELD_KEYS = new Set([
  'documentValidateAiName',
  'documentValidateAiValidity',
  'documentValidityMonths',
  'documentIsRequired',
]);

function defaultFieldVisible(fieldKey: string): boolean {
  return fieldKey === CLIENT_ID_FIELD_KEY || DOCUMENT_CONFIG_FIELD_KEYS.has(fieldKey);
}

export interface RequisitionFormCatalogState {
  steps: RequisitionFormStepConfig[];
  fields: RequisitionFormFieldConfig[];
}

export function buildFullCatalogState(
  fieldDefs: RequisitionFormFieldDef[],
  savedSteps: RequisitionFormStepConfig[] = [],
  savedFields: RequisitionFormFieldConfig[] = [],
): RequisitionFormCatalogState {
  const savedStepByKey = new Map(savedSteps.map((step) => [step.stepKey, step]));
  const savedFieldByDefId = new Map(savedFields.map((field) => [field.fieldDefId, field]));

  const steps: RequisitionFormStepConfig[] = REQUISITION_FORM_DEFAULT_STEP_KEYS.map((stepKey, index) => {
    const saved = savedStepByKey.get(stepKey);
    return {
      stepKey,
      labelI18nKey: stepLabelI18nKey(stepKey),
      orderIndex: saved?.orderIndex ?? index + 1,
      isVisible: saved?.isVisible ?? true,
      viewRolesJson: saved?.viewRolesJson ?? null,
      editRolesJson: saved?.editRolesJson ?? null,
    };
  }).sort((a, b) => a.orderIndex - b.orderIndex);

  const defsByKey = new Map(fieldDefs.filter((d) => d.isActive).map((d) => [d.fieldKey, d]));
  const fields: RequisitionFormFieldConfig[] = [];

  for (const stepKey of REQUISITION_FORM_DEFAULT_STEP_KEYS) {
    const orderedKeys = orderedFieldKeysForStep(stepKey);
    let orderIndex = 0;
    for (const fieldKey of orderedKeys) {
      const def = defsByKey.get(fieldKey);
      if (!def) {
        continue;
      }
      orderIndex += 1;
      const saved = savedFieldByDefId.get(def.id);
      fields.push({
        stepKey,
        fieldDefId: def.id,
        orderIndex: saved?.orderIndex ?? orderIndex,
        isVisible: saved?.isVisible ?? defaultFieldVisible(fieldKey),
        isRequired: saved?.isRequired ?? fieldKey === CLIENT_ID_FIELD_KEY,
        overridesJson: saved?.overridesJson ?? null,
        rulesJson: saved?.rulesJson ?? defaultRulesJsonForField(fieldKey),
        viewRolesJson: saved?.viewRolesJson ?? null,
        editRolesJson: saved?.editRolesJson ?? null,
      });
      defsByKey.delete(fieldKey);
    }
  }

  // Unmapped or custom field defs appended to general
  let generalOrder = fields.filter((f) => f.stepKey === 'general').length;
  for (const def of defsByKey.values()) {
    generalOrder += 1;
    const saved = savedFieldByDefId.get(def.id);
    fields.push({
      stepKey: saved?.stepKey ?? 'general',
      fieldDefId: def.id,
      orderIndex: saved?.orderIndex ?? generalOrder,
      isVisible: saved?.isVisible ?? defaultFieldVisible(def.fieldKey),
      isRequired: saved?.isRequired ?? def.fieldKey === CLIENT_ID_FIELD_KEY,
      overridesJson: saved?.overridesJson ?? null,
      rulesJson: saved?.rulesJson ?? defaultRulesJsonForField(def.fieldKey),
      viewRolesJson: saved?.viewRolesJson ?? null,
      editRolesJson: saved?.editRolesJson ?? null,
    });
  }

  return placeClientIdAfterCoverageType({ steps, fields }, fieldDefs);
}

function placeClientIdAfterCoverageType(
  state: RequisitionFormCatalogState,
  fieldDefs: RequisitionFormFieldDef[],
): RequisitionFormCatalogState {
  const keyByDefId = new Map(fieldDefs.map((def) => [def.id, def.fieldKey]));
  const clientFields = state.fields
    .filter((field) => field.stepKey === 'client')
    .sort((a, b) => a.orderIndex - b.orderIndex);
  const clientIdField = clientFields.find((field) => keyByDefId.get(field.fieldDefId) === CLIENT_ID_FIELD_KEY);
  if (!clientIdField) {
    return state;
  }
  const coverageInFull = clientFields.findIndex(
    (field) => keyByDefId.get(field.fieldDefId) === 'coverageTypeId',
  );
  const clientIdx = clientFields.findIndex((field) => field === clientIdField);
  if (coverageInFull >= 0 && clientIdx > coverageInFull) {
    return state;
  }
  const withoutClient = clientFields.filter((field) => field !== clientIdField);
  const coverageIdx = withoutClient.findIndex(
    (field) => keyByDefId.get(field.fieldDefId) === 'coverageTypeId',
  );
  const placed =
    coverageIdx >= 0
      ? [...withoutClient.slice(0, coverageIdx + 1), clientIdField, ...withoutClient.slice(coverageIdx + 1)]
      : [...withoutClient, clientIdField];
  const reindexed = placed.map((field, index) => ({ ...field, orderIndex: index + 1 }));
  return {
    steps: state.steps,
    fields: [...state.fields.filter((field) => field.stepKey !== 'client'), ...reindexed],
  };
}

function defaultRulesJsonForField(fieldKey: string): string | null {
  if (fieldKey === CLIENT_ID_FIELD_KEY) {
    return JSON.stringify(CLIENT_CATALOG_FILL_RULES);
  }
  if (isClientCatalogFillTarget(fieldKey)) {
    return JSON.stringify(CLIENT_CATALOG_READ_ONLY_WHEN);
  }
  return null;
}
