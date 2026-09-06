const CATEGORY_LABELS: Record<string, string> = {
  generales: $localize`:@@catalogs.category.generales:Generales`,
  cuestionario: $localize`:@@catalogs.category.cuestionario:Cuestionario`,
  notificaciones: $localize`:@@catalogs.category.notificaciones:Notificaciones`,
  empresas: $localize`:@@catalogs.category.empresas:Empresas`,
  portal: $localize`:@@catalogs.category.portal:Portal`,
  datosMp: $localize`:@@catalogs.category.datosMp:Datos MP`,
  smarthireOps: $localize`:@@catalogs.category.smarthireOps:SmartHire / Operación`,
};

const ENTRY_LABELS: Record<string, string> = {
  gender: $localize`:@@catalogs.entry.gender:Género`,
  career: $localize`:@@catalogs.entry.career:Carrera`,
  currency: $localize`:@@catalogs.entry.currency:Moneda`,
  language: $localize`:@@catalogs.entry.language:Idioma`,
  shift: $localize`:@@catalogs.entry.shift:Turno`,
  benefit: $localize`:@@catalogs.entry.benefit:Prestación`,
  contractType: $localize`:@@catalogs.entry.contractType:Tipo contratación`,
  educationLevel: $localize`:@@catalogs.entry.educationLevel:Escolaridad`,
  languageLevel: $localize`:@@catalogs.entry.languageLevel:Nivel de idioma`,
  country: $localize`:@@catalogs.entry.country:País`,
  state: $localize`:@@catalogs.entry.state:Entidad federativa`,
  municipality: $localize`:@@catalogs.entry.municipality:Delegación municipio`,
  client: $localize`:@@catalogs.entry.client:Cliente`,
  coverageCategory: $localize`:@@catalogs.entry.coverageCategory:C Categoría cubrimiento`,
  characteristic: $localize`:@@catalogs.entry.characteristic:Características`,
  category: $localize`:@@catalogs.entry.category:Categoría`,
  maritalStatus: $localize`:@@catalogs.entry.maritalStatus:Estado civil`,
  experienceLevel: $localize`:@@catalogs.entry.experienceLevel:Experiencia`,
  tool: $localize`:@@catalogs.entry.tool:Herramienta`,
  workSchedule: $localize`:@@catalogs.entry.workSchedule:Horario de trabajo`,
  workplace: $localize`:@@catalogs.entry.workplace:Lugar de trabajo`,
  requirement: $localize`:@@catalogs.entry.requirement:Requisitos`,
  responsibilityLevel: $localize`:@@catalogs.entry.responsibilityLevel:Nivel de responsabilidad`,
  disabilityType: $localize`:@@catalogs.entry.disabilityType:Tipo de discapacidad`,
  businessUnit: $localize`:@@catalogs.entry.businessUnit:Unidades de negocio`,
  positionType: $localize`:@@catalogs.entry.positionType:Puesto`,
  recruiterGroup: $localize`:@@catalogs.entry.recruiterGroup:Grupo reclutadores`,
  questionnaireCategory: $localize`:@@catalogs.entry.questionnaireCategory:Categoría cuestionario`,
  questionnaireQuestion: $localize`:@@catalogs.entry.questionnaireQuestion:Pregunta`,
  messages: $localize`:@@catalogs.entry.messages:Plantillas`,
  notificationLogs: $localize`:@@catalogs.entry.notificationLogs:Log de envíos`,
  notificationCoverage: $localize`:@@catalogs.entry.notificationCoverage:Cobertura`,
  notificationFailed: $localize`:@@catalogs.entry.notificationFailed:Fallidos`,
  company: $localize`:@@catalogs.entry.company:Empresas`,
  companyArea: $localize`:@@catalogs.entry.companyArea:Áreas`,
  companyDepartment: $localize`:@@catalogs.entry.companyDepartment:Departamentos`,
  branch: $localize`:@@catalogs.entry.branch:Sucursales`,
  jobPortal: $localize`:@@catalogs.entry.jobPortal:Portales de publicación`,
  mpCountry: $localize`:@@catalogs.entry.mpCountry:País`,
  mpCoverageType: $localize`:@@catalogs.entry.mpCoverageType:Tipo cubrimiento`,
  kinship: $localize`:@@catalogs.entry.kinship:Parentesco`,
  cancellationType: $localize`:@@catalogs.entry.cancellationType:Tipo de cancelación`,
  cancellationReason: $localize`:@@catalogs.entry.cancellationReason:Motivos de cancelación`,
  positionStatus: $localize`:@@catalogs.entry.positionStatus:Estatus de posición`,
  brand: $localize`:@@catalogs.entry.brand:Marca`,
  documentType: $localize`:@@catalogs.entry.documentType:Tipo documento`,
  fileExtension: $localize`:@@catalogs.entry.fileExtension:Extensión de archivo`,
  requisitionType: $localize`:@@catalogs.entry.requisitionType:Tipo requisición`,
  neighborhood: $localize`:@@catalogs.entry.neighborhood:Colonia`,
};

export function getCatalogCategoryLabel(id: string): string {
  return CATEGORY_LABELS[id] ?? id;
}

export function getCatalogEntryLabel(id: string): string {
  return ENTRY_LABELS[id] ?? id;
}

export const CATALOGS_PAGE_TITLE = $localize`:@@catalogs.pageTitle:Catálogos`;
export const CATALOGS_SELECTOR_LABEL = $localize`:@@catalogs.selectorLabel:Catálogos`;

export const CATALOGS_YES = $localize`:@@common.yes:Sí`;
export const CATALOGS_NO = $localize`:@@common.no:No`;
export const CATALOGS_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const CATALOGS_SAVE = $localize`:@@catalogs.common.save:Guardar`;
export const CATALOGS_VALUE = $localize`:@@catalogs.field.value:Valor`;

export const CATALOG_COLUMN_TRADE_NAME = $localize`:@@catalogs.column.tradeName:Nombre comercial`;
export const CATALOG_COLUMN_TAX_ID = $localize`:@@catalogs.column.taxId:RFC`;
export const CATALOG_COLUMN_SYMBOL = $localize`:@@catalogs.column.symbol:Símbolo`;
export const CATALOG_COLUMN_DENOMINATION = $localize`:@@catalogs.column.denomination:Denominación`;
export const CATALOG_COLUMN_TYPE = $localize`:@@catalogs.column.type:Tipo`;
export const CATALOG_COLUMN_AI = $localize`:@@catalogs.column.ai:IA`;
export const CATALOG_COLUMN_REQUIRES_CAREER = $localize`:@@catalogs.column.requiresCareer:Requiere carrera`;
export const CATALOG_COLUMN_APPLIES_TO_CAREER = $localize`:@@catalogs.column.appliesToCareer:Aplica a carrera`;
export const CATALOG_COLUMN_CATEGORY = $localize`:@@catalogs.column.category:Categoría`;
export const CATALOG_COLUMN_QUESTION = $localize`:@@catalogs.column.question:Pregunta`;
export const CATALOG_COLUMN_CORE_ATS = $localize`:@@catalogs.column.coreAts:Core ATS`;
export const CATALOG_COLUMN_CORE_APPIAN = $localize`:@@catalogs.column.coreAppian:Core Appian`;
export const CATALOG_COLUMN_POSTAL_CODE = $localize`:@@catalogs.column.postalCode:CP`;
export const CATALOG_COLUMN_LEGAL_NAME = $localize`:@@catalogs.column.legalName:Razón social`;
export const CATALOG_COLUMN_COMPANY_AREA = $localize`:@@catalogs.column.companyArea:Empresa / área`;
export const CATALOG_COLUMN_CONTACT = $localize`:@@catalogs.column.contact:Contacto`;
export const CATALOG_COLUMN_DEFAULT_PORTAL_LANGUAGE = $localize`:@@catalogs.column.defaultPortalLanguage:Idioma portal`;
export const CATALOG_COLUMN_POSITION = $localize`:@@catalogs.column.position:Puesto`;
export const CATALOG_COLUMN_PHONE = $localize`:@@catalogs.column.phone:Teléfono`;
export const CATALOG_COLUMN_EMAIL = $localize`:@@catalogs.column.email:Correo`;
export const CATALOG_COLUMN_SORT_ORDER = $localize`:@@catalogs.column.sortOrder:Orden`;
export const CATALOG_COLUMN_CANCELLATION_TYPE = $localize`:@@catalogs.column.cancellationType:Tipo de cancelación`;

export const CATALOG_FIELD_DEFAULT_PORTAL_LANGUAGE = $localize`:@@catalogs.field.defaultPortalLanguage:Idioma default del portal`;
export const CATALOG_FIELD_BILLING_MESSAGE = $localize`:@@catalogs.field.billingMessage:Mensaje facturación`;
export const CATALOG_FIELD_ATS_CODE = $localize`:@@catalogs.field.atsCode:Código ATS`;
export const CATALOG_FIELD_STREET = $localize`:@@catalogs.field.street:Calle`;
export const CATALOG_FIELD_NEIGHBORHOOD = $localize`:@@catalogs.field.neighborhood:Colonia`;
export const CATALOG_FIELD_MUNICIPALITY = $localize`:@@catalogs.field.municipality:Municipio`;
export const CATALOG_FIELD_STATE = $localize`:@@catalogs.field.state:Estado`;
export const CATALOG_FIELD_LOGO_URL = $localize`:@@catalogs.field.logoUrl:URL logo`;
export const CATALOG_FIELD_BANNER_URL = $localize`:@@catalogs.field.bannerUrl:URL banner`;
export const CATALOG_FIELD_PORTAL_SLUG = $localize`:@@catalogs.field.portalSlug:Slug del portal`;
export const CATALOG_FIELD_PORTAL_SLUG_ERROR = $localize`:@@catalogs.field.portalSlugError:Use minúsculas, números y guiones (ej. manpower-mexico)`;
export const CATALOG_FIELD_PORTAL_PRIMARY_COLOR = $localize`:@@catalogs.field.portalPrimaryColor:Color primario`;
export const CATALOG_FIELD_PORTAL_ACCENT_COLOR = $localize`:@@catalogs.field.portalAccentColor:Color de acento`;
export const CATALOG_FIELD_PORTAL_BRANDING = $localize`:@@catalogs.field.portalBranding:Portal candidato`;
export const CATALOG_COLUMN_PORTAL_SLUG = $localize`:@@catalogs.column.portalSlug:Slug portal`;
export const CATALOG_FIELD_NO_PURCHASE_ORDER = $localize`:@@catalogs.field.noPurchaseOrder:Sin orden de compra`;
export const CATALOG_FIELD_R3_INTERFACE = $localize`:@@catalogs.field.r3Interface:Interfaz R3`;
export const CATALOG_FIELD_WS_SIGNATURE = $localize`:@@catalogs.field.wsSignature:Firma WS`;
export const CATALOG_FIELD_DOCUMENT_TYPE = $localize`:@@catalogs.field.documentType:Tipo documento`;
export const CATALOG_FIELD_COMPANY = $localize`:@@catalogs.field.company:Empresa`;
export const CATALOG_FIELD_COMPANY_OPTIONAL = $localize`:@@catalogs.field.companyOptional:Empresa (opcional)`;
export const CATALOG_FIELD_SHORT_DESCRIPTION = $localize`:@@catalogs.field.shortDescription:Descripción corta`;
export const CATALOG_FIELD_FEDERAL_STATE = $localize`:@@catalogs.field.federalState:Entidad federativa`;
export const CATALOG_FIELD_POSTAL_CODE = $localize`:@@catalogs.field.postalCode:Código postal`;
export const CATALOG_FIELD_MANPOWER_ID = $localize`:@@catalogs.field.manpowerIdLabel:ID Manpower`;
export const CATALOG_FIELD_VALIDATES_AI = $localize`:@@catalogs.field.validatesWithAi:Valida con IA`;
export const CATALOG_FIELD_SORT_ORDER = $localize`:@@catalogs.field.sortOrder:Orden`;
export const CATALOG_FIELD_CANCELLATION_TYPE = $localize`:@@catalogs.field.cancellationType:Tipo de cancelación`;
export const CATALOG_FIELD_ALL_CANCELLATION_TYPES = $localize`:@@catalogs.field.allCancellationTypes:Todos los tipos`;

export function catalogPortalSlugHint(slug: string): string {
  const value = slug?.trim() || 'empresa';
  return $localize`:@@catalogs.field.portalSlugHint:URL pública: /${value}:slug:/vacancies`;
}
