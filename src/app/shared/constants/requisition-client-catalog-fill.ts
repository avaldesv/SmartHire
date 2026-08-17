import { RequisitionFormFieldRules } from '../models/requisition-form.model';

export const CLIENT_ID_FIELD_KEY = 'clientId';

export const CLIENT_CATALOG_FILL_TARGET_KEYS = [
  'clientKey',
  'legalName',
  'tradeName',
  'contactName',
  'contactPhone',
  'contactEmail',
  'clientContactPosition',
  'clientPosition',
] as const;

export const CLIENT_CATALOG_FILL_RULES: RequisitionFormFieldRules = {
  fillFromCatalog: {
    dataSourceKey: 'clients',
    mappings: [
      { fieldKey: 'clientKey', from: 'code' },
      { fieldKey: 'legalName', from: 'legalName' },
      { fieldKey: 'tradeName', from: 'tradeName' },
      { fieldKey: 'contactName', from: 'contactName' },
      { fieldKey: 'contactPhone', from: 'phone' },
      { fieldKey: 'contactEmail', from: 'email' },
      { fieldKey: 'clientContactPosition', from: 'contactPosition' },
      { fieldKey: 'clientPosition', from: 'contactPosition' },
    ],
  },
};

export const CLIENT_CATALOG_READ_ONLY_WHEN: RequisitionFormFieldRules = {
  readOnlyWhen: { fieldKey: CLIENT_ID_FIELD_KEY, hasValue: true },
};

export function isClientCatalogFillTarget(fieldKey: string): boolean {
  return (CLIENT_CATALOG_FILL_TARGET_KEYS as readonly string[]).includes(fieldKey);
}

export function catalogClientOptionLabel(client: {
  code?: string | null;
  tradeName?: string | null;
  legalName?: string | null;
  companyArea?: string | null;
  id: number;
}): string {
  const name =
    client.tradeName?.trim() || client.legalName?.trim() || client.companyArea?.trim() || '';
  const code = client.code?.trim() || '';
  if (code && name) {
    return `${code} — ${name}`;
  }
  return name || code || String(client.id);
}
