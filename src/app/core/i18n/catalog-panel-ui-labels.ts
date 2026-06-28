export interface CatalogPanelUiLabels {
  newButton: string;
  editTitle: string;
  newTitle: string;
}

const PANEL_UI: Record<string, CatalogPanelUiLabels> = {
  gender: {
    newButton: $localize`:@@catalogs.gender.newButton:Nuevo género`,
    editTitle: $localize`:@@catalogs.gender.editTitle:Editar género`,
    newTitle: $localize`:@@catalogs.gender.newTitle:Nuevo género`,
  },
  kinship: {
    newButton: $localize`:@@catalogs.kinship.newButton:Nuevo parentesco`,
    editTitle: $localize`:@@catalogs.kinship.editTitle:Editar parentesco`,
    newTitle: $localize`:@@catalogs.kinship.newTitle:Nuevo parentesco`,
  },
  company: {
    newButton: $localize`:@@catalogs.company.newButton:Nueva empresa`,
    editTitle: $localize`:@@catalogs.company.editTitle:Editar empresa`,
    newTitle: $localize`:@@catalogs.company.newTitle:Nueva empresa`,
  },
  currency: {
    newButton: $localize`:@@catalogs.currency.newButton:Nueva moneda`,
    editTitle: $localize`:@@catalogs.currency.editTitle:Editar moneda`,
    newTitle: $localize`:@@catalogs.currency.newTitle:Nueva moneda`,
  },
  career: {
    newButton: $localize`:@@catalogs.career.newButton:Nueva carrera`,
    editTitle: $localize`:@@catalogs.career.editTitle:Editar carrera`,
    newTitle: $localize`:@@catalogs.career.newTitle:Nueva carrera`,
  },
  language: {
    newButton: $localize`:@@catalogs.language.newButton:Nuevo idioma`,
    editTitle: $localize`:@@catalogs.language.editTitle:Editar idioma`,
    newTitle: $localize`:@@catalogs.language.newTitle:Nuevo idioma`,
  },
  shift: {
    newButton: $localize`:@@catalogs.shift.newButton:Nuevo turno`,
    editTitle: $localize`:@@catalogs.shift.editTitle:Editar turno`,
    newTitle: $localize`:@@catalogs.shift.newTitle:Nuevo turno`,
  },
  benefit: {
    newButton: $localize`:@@catalogs.benefit.newButton:Nueva prestación`,
    editTitle: $localize`:@@catalogs.benefit.editTitle:Editar prestación`,
    newTitle: $localize`:@@catalogs.benefit.newTitle:Nueva prestación`,
  },
  documentType: {
    newButton: $localize`:@@catalogs.documentType.newButton:Nuevo tipo`,
    editTitle: $localize`:@@catalogs.documentType.editTitle:Editar tipo de documento`,
    newTitle: $localize`:@@catalogs.documentType.newTitle:Nuevo tipo de documento`,
  },
  brand: {
    newButton: $localize`:@@catalogs.brand.newButton:Nueva marca`,
    editTitle: $localize`:@@catalogs.brand.editTitle:Editar marca`,
    newTitle: $localize`:@@catalogs.brand.newTitle:Nueva marca`,
  },
  contractType: {
    newButton: $localize`:@@catalogs.contractType.newButton:Nuevo tipo de contrato`,
    editTitle: $localize`:@@catalogs.contractType.editTitle:Editar tipo de contrato`,
    newTitle: $localize`:@@catalogs.contractType.newTitle:Nuevo tipo de contrato`,
  },
  coverageType: {
    newButton: $localize`:@@catalogs.coverageType.newButton:Nuevo tipo de cobertura`,
    editTitle: $localize`:@@catalogs.coverageType.editTitle:Editar tipo de cobertura`,
    newTitle: $localize`:@@catalogs.coverageType.newTitle:Nuevo tipo de cobertura`,
  },
  educationLevel: {
    newButton: $localize`:@@catalogs.educationLevel.newButton:Nuevo nivel de educación`,
    editTitle: $localize`:@@catalogs.educationLevel.editTitle:Editar nivel de educación`,
    newTitle: $localize`:@@catalogs.educationLevel.newTitle:Nuevo nivel de educación`,
  },
  languageLevel: {
    newButton: $localize`:@@catalogs.languageLevel.newButton:Nuevo nivel de idioma`,
    editTitle: $localize`:@@catalogs.languageLevel.editTitle:Editar nivel de idioma`,
    newTitle: $localize`:@@catalogs.languageLevel.newTitle:Nuevo nivel de idioma`,
  },
  requisitionType: {
    newButton: $localize`:@@catalogs.requisitionType.newButton:Nuevo tipo de requisición`,
    editTitle: $localize`:@@catalogs.requisitionType.editTitle:Editar tipo de requisición`,
    newTitle: $localize`:@@catalogs.requisitionType.newTitle:Nuevo tipo de requisición`,
  },
  companyArea: {
    newButton: $localize`:@@catalogs.companyArea.newButton:Nuevo áreas`,
    editTitle: $localize`:@@catalogs.companyArea.editTitle:Editar áreas`,
    newTitle: $localize`:@@catalogs.companyArea.newTitle:Nuevo áreas`,
  },
  companyDepartment: {
    newButton: $localize`:@@catalogs.companyDepartment.newButton:Nuevo departamentos`,
    editTitle: $localize`:@@catalogs.companyDepartment.editTitle:Editar departamentos`,
    newTitle: $localize`:@@catalogs.companyDepartment.newTitle:Nuevo departamentos`,
  },
  branch: {
    newButton: $localize`:@@catalogs.branch.newButton:Nueva sucursales`,
    editTitle: $localize`:@@catalogs.branch.editTitle:Editar sucursales`,
    newTitle: $localize`:@@catalogs.branch.newTitle:Nueva sucursales`,
  },
  questionnaireCategory: {
    newButton: $localize`:@@catalogs.questionnaireCategory.newButton:Nueva categoría`,
    editTitle: $localize`:@@catalogs.questionnaireCategory.editTitle:Editar categoría`,
    newTitle: $localize`:@@catalogs.questionnaireCategory.newTitle:Nueva categoría`,
  },
  questionnaireQuestion: {
    newButton: $localize`:@@catalogs.questionnaireQuestion.newButton:Nueva pregunta`,
    editTitle: $localize`:@@catalogs.questionnaireQuestion.editTitle:Editar pregunta`,
    newTitle: $localize`:@@catalogs.questionnaireQuestion.newTitle:Nueva pregunta`,
  },
  recruiterGroup: {
    newButton: $localize`:@@catalogs.recruiterGroup.newButton:Nuevo grupo`,
    editTitle: $localize`:@@catalogs.recruiterGroup.editTitle:Editar grupo`,
    newTitle: $localize`:@@catalogs.recruiterGroup.newTitle:Nuevo grupo`,
  },
  jobPortal: {
    newButton: $localize`:@@catalogs.jobPortal.newButton:Nuevo portal`,
    editTitle: $localize`:@@catalogs.jobPortal.editTitle:Editar portal`,
    newTitle: $localize`:@@catalogs.jobPortal.newTitle:Nuevo portal`,
  },
  country: {
    newButton: $localize`:@@catalogs.country.newButton:Nuevo país`,
    editTitle: $localize`:@@catalogs.country.editTitle:Editar país`,
    newTitle: $localize`:@@catalogs.country.newTitle:Nuevo país`,
  },
  state: {
    newButton: $localize`:@@catalogs.state.newButton:Nueva entidad`,
    editTitle: $localize`:@@catalogs.state.editTitle:Editar entidad`,
    newTitle: $localize`:@@catalogs.state.newTitle:Nueva entidad federativa`,
  },
  municipality: {
    newButton: $localize`:@@catalogs.municipality.newButton:Nuevo municipio`,
    editTitle: $localize`:@@catalogs.municipality.editTitle:Editar municipio`,
    newTitle: $localize`:@@catalogs.municipality.newTitle:Nuevo municipio`,
  },
  neighborhood: {
    newButton: $localize`:@@catalogs.neighborhood.newButton:Nueva colonia`,
    editTitle: $localize`:@@catalogs.neighborhood.editTitle:Editar colonia`,
    newTitle: $localize`:@@catalogs.neighborhood.newTitle:Nueva colonia`,
  },
  coverageCategory: {
    newButton: $localize`:@@catalogs.coverageCategory.newButton:Nuevo c categoría cubrimiento`,
    editTitle: $localize`:@@catalogs.coverageCategory.editTitle:Editar c categoría cubrimiento`,
    newTitle: $localize`:@@catalogs.coverageCategory.newTitle:Nuevo c categoría cubrimiento`,
  },
  characteristic: {
    newButton: $localize`:@@catalogs.characteristic.newButton:Nuevo características`,
    editTitle: $localize`:@@catalogs.characteristic.editTitle:Editar características`,
    newTitle: $localize`:@@catalogs.characteristic.newTitle:Nuevo características`,
  },
  category: {
    newButton: $localize`:@@catalogs.category.newButton:Nuevo categoría`,
    editTitle: $localize`:@@catalogs.category.editTitle:Editar categoría`,
    newTitle: $localize`:@@catalogs.category.newTitle:Nuevo categoría`,
  },
  maritalStatus: {
    newButton: $localize`:@@catalogs.maritalStatus.newButton:Nuevo estado civil`,
    editTitle: $localize`:@@catalogs.maritalStatus.editTitle:Editar estado civil`,
    newTitle: $localize`:@@catalogs.maritalStatus.newTitle:Nuevo estado civil`,
  },
  experienceLevel: {
    newButton: $localize`:@@catalogs.experienceLevel.newButton:Nuevo experiencia`,
    editTitle: $localize`:@@catalogs.experienceLevel.editTitle:Editar experiencia`,
    newTitle: $localize`:@@catalogs.experienceLevel.newTitle:Nuevo experiencia`,
  },
  tool: {
    newButton: $localize`:@@catalogs.tool.newButton:Nuevo herramienta`,
    editTitle: $localize`:@@catalogs.tool.editTitle:Editar herramienta`,
    newTitle: $localize`:@@catalogs.tool.newTitle:Nuevo herramienta`,
  },
  workSchedule: {
    newButton: $localize`:@@catalogs.workSchedule.newButton:Nuevo horario trabajo`,
    editTitle: $localize`:@@catalogs.workSchedule.editTitle:Editar horario trabajo`,
    newTitle: $localize`:@@catalogs.workSchedule.newTitle:Nuevo horario trabajo`,
  },
  workplace: {
    newButton: $localize`:@@catalogs.workplace.newButton:Nuevo lugar trabajo`,
    editTitle: $localize`:@@catalogs.workplace.editTitle:Editar lugar trabajo`,
    newTitle: $localize`:@@catalogs.workplace.newTitle:Nuevo lugar trabajo`,
  },
  requirement: {
    newButton: $localize`:@@catalogs.requirement.newButton:Nuevo requisitos`,
    editTitle: $localize`:@@catalogs.requirement.editTitle:Editar requisitos`,
    newTitle: $localize`:@@catalogs.requirement.newTitle:Nuevo requisitos`,
  },
  responsibilityLevel: {
    newButton: $localize`:@@catalogs.responsibilityLevel.newButton:Nuevo responsabilidad`,
    editTitle: $localize`:@@catalogs.responsibilityLevel.editTitle:Editar responsabilidad`,
    newTitle: $localize`:@@catalogs.responsibilityLevel.newTitle:Nuevo responsabilidad`,
  },
  disabilityType: {
    newButton: $localize`:@@catalogs.disabilityType.newButton:Nuevo tipo discapacidad`,
    editTitle: $localize`:@@catalogs.disabilityType.editTitle:Editar tipo discapacidad`,
    newTitle: $localize`:@@catalogs.disabilityType.newTitle:Nuevo tipo discapacidad`,
  },
  businessUnit: {
    newButton: $localize`:@@catalogs.businessUnit.newButton:Nuevo unidad de negocio`,
    editTitle: $localize`:@@catalogs.businessUnit.editTitle:Editar unidad de negocio`,
    newTitle: $localize`:@@catalogs.businessUnit.newTitle:Nuevo unidad de negocio`,
  },
  positionType: {
    newButton: $localize`:@@catalogs.positionType.newButton:Nuevo puesto`,
    editTitle: $localize`:@@catalogs.positionType.editTitle:Editar puesto`,
    newTitle: $localize`:@@catalogs.positionType.newTitle:Nuevo puesto`,
  },
  client: {
    newButton: $localize`:@@catalogs.client.newButton:Nuevo cliente`,
    editTitle: $localize`:@@catalogs.client.editTitle:Editar cliente`,
    newTitle: $localize`:@@catalogs.client.newTitle:Nuevo cliente`,
  },
};

export function catalogPanelUi(panelKey: string): CatalogPanelUiLabels {
  return PANEL_UI[panelKey];
}
