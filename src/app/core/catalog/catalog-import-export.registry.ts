import { CatalogPanelKey } from '../../features/settings/catalogs/catalog-admin.registry';

export interface CatalogCsvPanelConfig {
  catalogKey: string;
  label: string;
  usesCountryFilter: boolean;
}

/** Catalog admin panels with CSV import/export backend support (excludes company). */
export const CATALOG_CSV_PANELS: Partial<Record<CatalogPanelKey, CatalogCsvPanelConfig>> = {
  gender: { catalogKey: 'genders', label: 'Género', usesCountryFilter: true },
  career: { catalogKey: 'careers', label: 'Carrera', usesCountryFilter: true },
  currency: { catalogKey: 'currencies', label: 'Moneda', usesCountryFilter: true },
  shift: { catalogKey: 'shifts', label: 'Turno', usesCountryFilter: true },
  benefit: { catalogKey: 'benefits', label: 'Prestación', usesCountryFilter: true },
  contractType: { catalogKey: 'contract-types', label: 'Tipo contratación', usesCountryFilter: true },
  educationLevel: { catalogKey: 'education-levels', label: 'Escolaridad', usesCountryFilter: true },
  languageLevel: { catalogKey: 'language-levels', label: 'Nivel de idioma', usesCountryFilter: true },
  coverageType: { catalogKey: 'coverage-types', label: 'Tipo cubrimiento', usesCountryFilter: true },
  coverageCategory: { catalogKey: 'coverage-categories', label: 'C Categoría cubrimiento', usesCountryFilter: true },
  characteristic: { catalogKey: 'characteristics', label: 'Características', usesCountryFilter: true },
  category: { catalogKey: 'categories', label: 'Categoría', usesCountryFilter: true },
  maritalStatus: { catalogKey: 'marital-statuses', label: 'Estado civil', usesCountryFilter: true },
  experienceLevel: { catalogKey: 'experience-levels', label: 'Experiencia', usesCountryFilter: true },
  tool: { catalogKey: 'tools', label: 'Herramienta', usesCountryFilter: true },
  workSchedule: { catalogKey: 'work-schedules', label: 'Horario de trabajo', usesCountryFilter: true },
  workplace: { catalogKey: 'workplaces', label: 'Lugar de trabajo', usesCountryFilter: true },
  requirement: { catalogKey: 'requirements', label: 'Requisitos', usesCountryFilter: true },
  responsibilityLevel: { catalogKey: 'responsibility-levels', label: 'Nivel de responsabilidad', usesCountryFilter: true },
  disabilityType: { catalogKey: 'disability-types', label: 'Tipo de discapacidad', usesCountryFilter: true },
  businessUnit: { catalogKey: 'business-units', label: 'Unidades de negocio', usesCountryFilter: true },
  positionType: { catalogKey: 'position-types', label: 'Puesto', usesCountryFilter: true },
  brand: { catalogKey: 'brands', label: 'Marca', usesCountryFilter: true },
  requisitionType: { catalogKey: 'requisition-types', label: 'Tipo requisición', usesCountryFilter: true },
  jobPortal: { catalogKey: 'job-portals', label: 'Portales de publicación', usesCountryFilter: true },
};

export function supportsCatalogCsvImportExport(panelKey: CatalogPanelKey): boolean {
  return panelKey in CATALOG_CSV_PANELS;
}

export function getCatalogCsvPanelConfig(panelKey: CatalogPanelKey): CatalogCsvPanelConfig | null {
  return CATALOG_CSV_PANELS[panelKey] ?? null;
}

/** @deprecated use getCatalogCsvPanelConfig */
export const CATALOG_CSV_API_KEYS: Partial<Record<CatalogPanelKey, string>> = Object.fromEntries(
  Object.entries(CATALOG_CSV_PANELS).map(([key, cfg]) => [key, cfg.catalogKey]),
) as Partial<Record<CatalogPanelKey, string>>;

export function resolveCatalogCsvApiKey(panelKey: CatalogPanelKey): string | null {
  return CATALOG_CSV_PANELS[panelKey]?.catalogKey ?? null;
}
