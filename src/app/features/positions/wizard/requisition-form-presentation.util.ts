import { ResolvedRequisitionFormConfig } from '../../../shared/models/requisition-wizard.model';
import { DEFAULT_REQUISITION_WIZARD_SCHEMA } from './default-requisition-wizard-schema.constant';

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

/** Align resolved config with built-in field definitions (code is source of truth). */
export function applyBuiltinFieldPresentation(
  config: ResolvedRequisitionFormConfig,
): ResolvedRequisitionFormConfig {
  return {
    ...config,
    steps: config.steps.map((step) => ({
      ...step,
      fields: step.fields.map((field) => {
        const builtin = BUILTIN_FIELD_PRESENTATION.get(field.fieldKey);
        if (!builtin) {
          return field;
        }
        return {
          ...field,
          uiType: builtin.uiType,
          dataSourceKey: builtin.dataSourceKey,
        };
      }),
    })),
  };
}
