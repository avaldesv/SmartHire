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
  | 'clientCompany'
  | 'kinship'
  | 'brand'
  | 'documentType'
  | 'requisitionType'
  | 'mpCountry'
  | 'mpCoverageType';

export interface CatalogRegistryEntry {
  id: string;
  label: string;
  panelKey?: CatalogPanelKey;
  implemented: boolean;
}

export interface CatalogCategoryDefinition {
  id: CatalogCategoryId;
  label: string;
  catalogs: CatalogRegistryEntry[];
}

export const CATALOG_CATEGORIES: CatalogCategoryDefinition[] = [
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
      { id: 'coverageType', label: 'Tipo cubrimiento', panelKey: 'coverageType', implemented: true },
      { id: 'educationLevel', label: 'Escolaridad', panelKey: 'educationLevel', implemented: true },
      { id: 'languageLevel', label: 'Nivel de idioma', panelKey: 'languageLevel', implemented: true },
      { id: 'country', label: 'País', panelKey: 'country', implemented: true },
      { id: 'state', label: 'Entidad federativa', panelKey: 'state', implemented: true },
      { id: 'municipality', label: 'Delegación municipio', panelKey: 'municipality', implemented: true },
      { id: 'neighborhood', label: 'Colonia', panelKey: 'neighborhood', implemented: true },
    ],
  },
  {
    id: 'cuestionario',
    label: 'Cuestionario',
    catalogs: [
      { id: 'questionnaireCategory', label: 'Categoría cuestionario', implemented: false },
      { id: 'questionnaireQuestion', label: 'Pregunta', implemented: false },
    ],
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    catalogs: [{ id: 'messages', label: 'Mensajes', implemented: false }],
  },
  {
    id: 'empresas',
    label: 'Empresas',
    catalogs: [
      { id: 'company', label: 'Empresas', panelKey: 'company', implemented: true },
      { id: 'clientCompany', label: 'Empresas cliente', panelKey: 'clientCompany', implemented: true },
    ],
  },
  {
    id: 'portal',
    label: 'Portal',
    catalogs: [{ id: 'jobPortal', label: 'Portales de publicación', implemented: false }],
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
    ],
  },
];

export function getCategoryById(id: CatalogCategoryId): CatalogCategoryDefinition {
  return CATALOG_CATEGORIES.find((c) => c.id === id) ?? CATALOG_CATEGORIES[0];
}
