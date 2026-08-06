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
        isVisible: saved?.isVisible ?? false,
        isRequired: saved?.isRequired ?? false,
        overridesJson: saved?.overridesJson ?? null,
        rulesJson: saved?.rulesJson ?? null,
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
      isVisible: saved?.isVisible ?? false,
      isRequired: saved?.isRequired ?? false,
      overridesJson: saved?.overridesJson ?? null,
      rulesJson: saved?.rulesJson ?? null,
      viewRolesJson: saved?.viewRolesJson ?? null,
      editRolesJson: saved?.editRolesJson ?? null,
    });
  }

  return { steps, fields };
}
