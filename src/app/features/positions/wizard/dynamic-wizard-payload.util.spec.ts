import { buildDynamicCreatePayload } from './dynamic-wizard-payload.util';
import { ResolvedRequisitionFormConfig } from '../../../shared/models/requisition-wizard.model';
import { CLIENT_CATALOG_READ_ONLY_WHEN } from '../../../shared/constants/requisition-client-catalog-fill';

describe('buildDynamicCreatePayload client catalog fields', () => {
  const config: ResolvedRequisitionFormConfig = {
    configId: 1,
    version: 1,
    steps: [
      {
        stepKey: 'client',
        labelI18nKey: 'step.client',
        orderIndex: 1,
        fields: [
          {
            fieldKey: 'clientId',
            uiType: 'client-search',
            labelI18nKey: 'requisition.field.clientId',
            isRequired: true,
            isVisible: true,
            readOnly: false,
            dataSourceKey: 'clients',
            rulesJson: null,
          },
          {
            fieldKey: 'legalName',
            uiType: 'text',
            labelI18nKey: 'requisition.field.legalName',
            isRequired: true,
            isVisible: true,
            readOnly: true,
            dataSourceKey: null,
            rulesJson: JSON.stringify(CLIENT_CATALOG_READ_ONLY_WHEN),
          },
        ],
      },
    ],
  };

  it('includes read-only legalName filled from client catalog on create', () => {
    const payload = buildDynamicCreatePayload(
      {
        clientId: 10,
        legalName: 'Acme SA de CV',
      },
      config,
      false,
    );

    expect(payload.legalName).toBe('Acme SA de CV');
    expect(payload.clientId).toBe(10);
  });
});
