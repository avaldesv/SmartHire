import { CatalogPanelKey } from '../../features/settings/catalogs/catalog-admin.registry';

export const CATALOG_CSV_API_KEYS: Partial<Record<CatalogPanelKey, string>> = {
  gender: 'genders',
  shift: 'shifts',
  currency: 'currencies',
  benefit: 'benefits',
  contractType: 'contract-types',
};

export function resolveCatalogCsvApiKey(panelKey: CatalogPanelKey): string | null {
  return CATALOG_CSV_API_KEYS[panelKey] ?? null;
}

export function supportsCatalogCsvImportExport(panelKey: CatalogPanelKey): boolean {
  return panelKey in CATALOG_CSV_API_KEYS;
}
