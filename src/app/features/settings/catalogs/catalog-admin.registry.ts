import { getCatalogCategoryLabel, getCatalogEntryLabel } from '../../../core/i18n/catalog-i18n-labels';

export type CatalogCategoryId =
  | 'generales'
  | 'cuestionario'
  | 'notificaciones'
  | 'empresas'
  | 'portal'
  | 'datosMp'
  | 'smarthireOps';

/** Maps to an implemented admin panel in catalogs-admin. */
export type CatalogPanelKey =
  | 'gender'
  | 'career'
  | 'currency'
  | 'language'
  | 'shift'
  | 'benefit'
  | 'contractType'
  | 'coverageType'
  | 'educationLevel'
  | 'languageLevel'
  | 'country'
  | 'state'
  | 'municipality'
  | 'neighborhood'
  | 'company'
  | 'client'
  | 'kinship'
  | 'brand'
  | 'documentType'
  | 'requisitionType'
  | 'mpCountry'
  | 'mpCoverageType'
  | 'coverageCategory'
  | 'characteristic'
  | 'category'
  | 'maritalStatus'
  | 'experienceLevel'
  | 'tool'
  | 'workSchedule'
  | 'workplace'
  | 'requirement'
  | 'responsibilityLevel'
  | 'disabilityType'
  | 'businessUnit'
  | 'positionType'
  | 'companyArea'
  | 'companyDepartment'
  | 'branch'
  | 'questionnaireCategory'
  | 'questionnaireQuestion'
  | 'messages'
  | 'jobPortal'
  | 'recruiterGroup';

export interface CatalogRegistryEntry {
  id: string;
  label: string;
  panelKey?: CatalogPanelKey;
  implemented: boolean;
  /** When true, only GLOBAL_ADMIN users see this entry in the catalog selector. */
  globalAdminOnly?: boolean;
}

export interface CatalogCategoryDefinition {
  id: CatalogCategoryId;
  label: string;
  catalogs: CatalogRegistryEntry[];
}

function sortCatalogsByLabel(catalogs: CatalogRegistryEntry[]): CatalogRegistryEntry[] {
  return [...catalogs].sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
}

function localizeCategory(category: CatalogCategoryDefinition): CatalogCategoryDefinition {
  return {
    ...category,
    label: getCatalogCategoryLabel(category.id),
    catalogs: sortCatalogsByLabel(
      category.catalogs.map((entry) => ({
        ...entry,
        label: getCatalogEntryLabel(entry.id),
      })),
    ),
  };
}

const CATALOG_CATEGORIES_RAW: CatalogCategoryDefinition[] = [
  {
    id: 'generales',
    label: 'Generales',
    catalogs: [
      { id: 'gender', label: 'Género', panelKey: 'gender', implemented: true },
      { id: 'career', label: 'Carrera', panelKey: 'career', implemented: true },
      { id: 'currency', label: 'Moneda', panelKey: 'currency', implemented: true },
      { id: 'language', label: 'Idioma', panelKey: 'language', implemented: true },
      { id: 'shift', label: 'Turno', panelKey: 'shift', implemented: true },
      { id: 'benefit', label: 'Prestación', panelKey: 'benefit', implemented: true },
      { id: 'contractType', label: 'Tipo contratación', panelKey: 'contractType', implemented: true },
      { id: 'educationLevel', label: 'Escolaridad', panelKey: 'educationLevel', implemented: true },
      { id: 'languageLevel', label: 'Nivel de idioma', panelKey: 'languageLevel', implemented: true },
      { id: 'country', label: 'País', panelKey: 'country', implemented: true },
      { id: 'state', label: 'Entidad federativa', panelKey: 'state', implemented: true },
      { id: 'municipality', label: 'Delegación municipio', panelKey: 'municipality', implemented: true },
      { id: 'client', label: 'Cliente', panelKey: 'client', implemented: true },
      { id: 'coverageCategory', label: 'C Categoría cubrimiento', panelKey: 'coverageCategory', implemented: true },
      { id: 'characteristic', label: 'Características', panelKey: 'characteristic', implemented: true },
      { id: 'category', label: 'Categoría', panelKey: 'category', implemented: true },
      { id: 'maritalStatus', label: 'Estado civil', panelKey: 'maritalStatus', implemented: true },
      { id: 'experienceLevel', label: 'Experiencia', panelKey: 'experienceLevel', implemented: true },
      { id: 'tool', label: 'Herramienta', panelKey: 'tool', implemented: true },
      { id: 'workSchedule', label: 'Horario de trabajo', panelKey: 'workSchedule', implemented: true },
      { id: 'workplace', label: 'Lugar de trabajo', panelKey: 'workplace', implemented: true },
      { id: 'requirement', label: 'Requisitos', panelKey: 'requirement', implemented: true },
      { id: 'responsibilityLevel', label: 'Nivel de responsabilidad', panelKey: 'responsibilityLevel', implemented: true },
      { id: 'disabilityType', label: 'Tipo de discapacidad', panelKey: 'disabilityType', implemented: true },
      { id: 'businessUnit', label: 'Unidades de negocio', panelKey: 'businessUnit', implemented: true },
      { id: 'positionType', label: 'Puesto', panelKey: 'positionType', implemented: true },
      { id: 'recruiterGroup', label: 'Grupo reclutadores', panelKey: 'recruiterGroup', implemented: true },
    ],
  },
  {
    id: 'cuestionario',
    label: 'Cuestionario',
    catalogs: [
      { id: 'questionnaireCategory', label: 'Categoría cuestionario', panelKey: 'questionnaireCategory', implemented: true },
      { id: 'questionnaireQuestion', label: 'Pregunta', panelKey: 'questionnaireQuestion', implemented: true },
    ],
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    catalogs: [{ id: 'messages', label: 'Mensajes', panelKey: 'messages', implemented: true }],
  },
  {
    id: 'empresas',
    label: 'Empresas',
    catalogs: [
      {
        id: 'company',
        label: 'Empresas',
        panelKey: 'company',
        implemented: true,
        globalAdminOnly: true,
      },
      { id: 'companyArea', label: 'Áreas', panelKey: 'companyArea', implemented: true },
      { id: 'companyDepartment', label: 'Departamentos', panelKey: 'companyDepartment', implemented: true },
      { id: 'branch', label: 'Sucursales', panelKey: 'branch', implemented: true },
    ],
  },
  {
    id: 'portal',
    label: 'Portal',
    catalogs: [{ id: 'jobPortal', label: 'Portales de publicación', panelKey: 'jobPortal', implemented: true }],
  },
  {
    id: 'datosMp',
    label: 'Datos MP',
    catalogs: [
      { id: 'mpCountry', label: 'País', panelKey: 'country', implemented: true },
      { id: 'mpCoverageType', label: 'Tipo cubrimiento', panelKey: 'coverageType', implemented: true },
    ],
  },
  {
    id: 'smarthireOps',
    label: 'SmartHire / Operación',
    catalogs: [
      { id: 'kinship', label: 'Parentesco', panelKey: 'kinship', implemented: true },
      { id: 'brand', label: 'Marca', panelKey: 'brand', implemented: true },
      { id: 'documentType', label: 'Tipo documento', panelKey: 'documentType', implemented: true },
      { id: 'requisitionType', label: 'Tipo requisición', panelKey: 'requisitionType', implemented: true },
      { id: 'neighborhood', label: 'Colonia', panelKey: 'neighborhood', implemented: true },
    ],
  },
];

export const CATALOG_CATEGORIES: CatalogCategoryDefinition[] = CATALOG_CATEGORIES_RAW.map(localizeCategory);

export function getCategoryById(id: CatalogCategoryId): CatalogCategoryDefinition {
  const raw = CATALOG_CATEGORIES_RAW.find((c) => c.id === id) ?? CATALOG_CATEGORIES_RAW[0];
  return localizeCategory(raw);
}

export function isCatalogEntryVisible(entry: CatalogRegistryEntry, isGlobalAdmin: boolean): boolean {
  if (entry.globalAdminOnly && !isGlobalAdmin) {
    return false;
  }
  return true;
}

export function resolveVisibleCategories(isGlobalAdmin: boolean): CatalogCategoryDefinition[] {
  return CATALOG_CATEGORIES.map((category) => ({
    ...category,
    catalogs: category.catalogs.filter((entry) => isCatalogEntryVisible(entry, isGlobalAdmin)),
  })).filter((category) => category.catalogs.length > 0);
}

const CATEGORY_DEFAULT_CATALOG: Partial<Record<CatalogCategoryId, string>> = {
  empresas: 'companyArea',
  smarthireOps: 'kinship',
};

export function resolveDefaultCatalogId(category: CatalogCategoryDefinition, isGlobalAdmin: boolean): string {
  const preferredId = CATEGORY_DEFAULT_CATALOG[category.id];
  const visible = category.catalogs.filter((entry) => isCatalogEntryVisible(entry, isGlobalAdmin));
  if (preferredId && visible.some((entry) => entry.id === preferredId)) {
    return preferredId;
  }
  const preferred = visible.find((entry) => entry.implemented) ?? visible[0];
  return preferred?.id ?? category.catalogs[0]?.id ?? '';
}

export function ensureValidCatalogSelection(
  categoryId: CatalogCategoryId,
  catalogId: string,
  isGlobalAdmin: boolean,
): string {
  const category = getCategoryById(categoryId);
  const visible = category.catalogs.filter((entry) => isCatalogEntryVisible(entry, isGlobalAdmin));
  if (visible.some((entry) => entry.id === catalogId)) {
    return catalogId;
  }
  return resolveDefaultCatalogId(category, isGlobalAdmin);
}
