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
  messages: $localize`:@@catalogs.entry.messages:Mensajes`,
  company: $localize`:@@catalogs.entry.company:Empresas`,
  companyArea: $localize`:@@catalogs.entry.companyArea:Áreas`,
  companyDepartment: $localize`:@@catalogs.entry.companyDepartment:Departamentos`,
  branch: $localize`:@@catalogs.entry.branch:Sucursales`,
  jobPortal: $localize`:@@catalogs.entry.jobPortal:Portales de publicación`,
  mpCountry: $localize`:@@catalogs.entry.mpCountry:País`,
  mpCoverageType: $localize`:@@catalogs.entry.mpCoverageType:Tipo cubrimiento`,
  kinship: $localize`:@@catalogs.entry.kinship:Parentesco`,
  brand: $localize`:@@catalogs.entry.brand:Marca`,
  documentType: $localize`:@@catalogs.entry.documentType:Tipo documento`,
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
