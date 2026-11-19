import { ResolvedRequisitionFormConfig, ResolvedRequisitionFormField } from '../../../shared/models/requisition-wizard.model';
import { applyBuiltinFieldPresentation } from './requisition-form-presentation.util';

function field(fieldKey: string, uiType = 'text'): ResolvedRequisitionFormField {
  return {
    fieldKey,
    uiType,
    dataSourceKey: null,
    labelI18nKey: `requisition.field.${fieldKey}`,
    isVisible: true,
    isRequired: false,
  };
}

function manpowerConfig(fields: ResolvedRequisitionFormField[]): ResolvedRequisitionFormConfig {
  return {
    configId: 1,
    version: 1,
    steps: [
      {
        stepKey: 'manpower',
        labelI18nKey: 'requisition.step.manpower',
        orderIndex: 3,
        fields,
      },
    ],
  };
}

describe('applyBuiltinFieldPresentation (manpower order)', () => {
  it('preserves Config field order and does not force budgetType after requisitionTypeId', () => {
    const config = manpowerConfig([
      field('serviceFee', 'number'),
      field('currencyId', 'select'),
      field('hasAdvancePayment', 'checkbox'),
      field('requisitionTypeId', 'select'),
      field('budgetType', 'select'),
      field('orderId', 'text'),
    ]);

    const result = applyBuiltinFieldPresentation(config);
    const keys = result.steps[0].fields.map((f) => f.fieldKey);

    expect(keys).toEqual([
      'serviceFee',
      'currencyId',
      'hasAdvancePayment',
      'requisitionTypeId',
      'budgetType',
      'orderId',
    ]);
  });

  it('appends budgetType at the end when missing from manpower', () => {
    const config = manpowerConfig([
      field('serviceFee', 'number'),
      field('requisitionTypeId', 'select'),
      field('currencyId', 'select'),
    ]);

    const result = applyBuiltinFieldPresentation(config);
    const keys = result.steps[0].fields.map((f) => f.fieldKey);

    expect(keys).toEqual(['serviceFee', 'requisitionTypeId', 'currencyId', 'budgetType']);
  });
});
