const REQUISITION_STEP_LABELS: Record<string, string> = {
  client: $localize`:@@requisition.step.client:Datos Cliente`,
  general: $localize`:@@requisition.step.general:Datos generales`,
  manpower: $localize`:@@requisition.step.manpower:Datos Manpower`,
  hiring: $localize`:@@requisition.step.hiring:Contratación`,
  languages: $localize`:@@requisition.step.languages:Idiomas`,
  address: $localize`:@@requisition.step.address:Dirección`,
  recruitment: $localize`:@@requisition.step.recruitment:Reclutamiento`,
  clientDescription: $localize`:@@requisition.step.clientDescription:Descripción del cliente`,
  extraBenefits: $localize`:@@requisition.step.extraBenefits:Beneficios adicionales`,
  preselection: $localize`:@@requisition.step.preselection:Preselección`,
  documents: $localize`:@@requisition.step.documents:Documentos`,
};

const REQUISITION_FIELD_LABELS: Record<string, string> = {
  brandId: $localize`:@@requisition.field.brandId:Marca`,
  countryId: $localize`:@@requisition.field.countryId:País`,
  requisitionTypeId: $localize`:@@requisition.field.requisitionTypeId:Tipo de requisición`,
  coverageTypeId: $localize`:@@requisition.field.coverageTypeId:Tipo de cobertura`,
  ot: $localize`:@@requisition.field.ot:Orden de trabajo (OT)`,
  orderId: $localize`:@@requisition.field.orderId:Id de Orden`,
  clientKey: $localize`:@@requisition.field.clientKey:Clave cliente`,
  legalName: $localize`:@@requisition.field.legalName:Razón social`,
  tradeName: $localize`:@@requisition.field.tradeName:Nombre comercial`,
  contactName: $localize`:@@requisition.field.contactName:Nombre de contacto`,
  contactPhone: $localize`:@@requisition.field.contactPhone:Teléfono de contacto`,
  contactEmail: $localize`:@@requisition.field.contactEmail:Correo de contacto`,
  clientContactPosition: $localize`:@@requisition.field.clientContactPosition:Puesto Cliente`,
  clientPositionKey: $localize`:@@requisition.field.clientPositionKey:Clave puesto cliente`,
  positionName: $localize`:@@requisition.field.positionName:Nombre del puesto`,
  serviceNumber: $localize`:@@requisition.field.serviceNumber:Número de servicio`,
  genderId: $localize`:@@requisition.field.genderId:Género`,
  maritalStatusId: $localize`:@@requisition.field.maritalStatusId:Estado civil`,
  careerId: $localize`:@@requisition.field.careerId:Carrera`,
  educationLevelId: $localize`:@@requisition.field.educationLevelId:Escolaridad`,
  experienceIn: $localize`:@@requisition.field.experienceIn:Experiencia en`,
  experienceLevelId: $localize`:@@requisition.field.experienceLevelId:Nivel de experiencia`,
  minAge: $localize`:@@requisition.field.minAge:Edad mínima`,
  maxAge: $localize`:@@requisition.field.maxAge:Edad máxima`,
  hasPeopleInCharge: $localize`:@@requisition.field.hasPeopleInCharge:Tiene personas a cargo`,
  peopleInChargeCount: $localize`:@@requisition.field.peopleInChargeCount:Total personas a cargo`,
  travelAvailability: $localize`:@@requisition.field.travelAvailability:Disponibilidad para viajar`,
  relocationAvailability: $localize`:@@requisition.field.relocationAvailability:Disponibilidad para reubicación`,
  requirementsMandatory: $localize`:@@requisition.field.requirementsMandatory:Requisitos obligatorios`,
  requirementsOptional: $localize`:@@requisition.field.requirementsOptional:Requisitos opcionales`,
  requirementsDesirable: $localize`:@@requisition.field.requirementsDesirable:Requisitos deseables`,
  contractTypeId: $localize`:@@requisition.field.contractTypeId:Tipo de contrato`,
  shiftId: $localize`:@@requisition.field.shiftId:Turno`,
  salary: $localize`:@@requisition.field.salary:Salario`,
  serviceFee: $localize`:@@requisition.field.serviceFee:FEE de servicio`,
  currencyId: $localize`:@@requisition.field.currencyId:Moneda`,
  hasAdvancePayment: $localize`:@@requisition.field.hasAdvancePayment:¿Lleva anticipo?`,
  workdayStartTime: $localize`:@@requisition.field.workdayStartTime:Hora inicio jornada`,
  workdayEndTime: $localize`:@@requisition.field.workdayEndTime:Hora fin jornada`,
  lunchStartTime: $localize`:@@requisition.field.lunchStartTime:Hora inicio comida`,
  lunchEndTime: $localize`:@@requisition.field.lunchEndTime:Hora fin comida`,
  rotatingShifts: $localize`:@@requisition.field.rotatingShifts:Turnos rotativos`,
  commitmentDate: $localize`:@@requisition.field.commitmentDate:Fecha compromiso`,
  hiringDate: $localize`:@@requisition.field.hiringDate:Fecha de contratación`,
  hiringRequirements: $localize`:@@requisition.field.hiringRequirements:Requisitos de contratación`,
  tools: $localize`:@@requisition.field.tools:Herramientas`,
  recruiterGroupId: $localize`:@@requisition.field.recruiterGroupId:Grupo reclutador`,
  careResponsibleUserId: $localize`:@@requisition.field.careResponsibleUserId:Responsable CARE`,
  careResponsibleAts: $localize`:@@requisition.field.careResponsibleAts:ATS responsable CARE`,
  disabilityTypeId: $localize`:@@requisition.field.disabilityTypeId:Tipo de discapacidad`,
  disabilityTypeIds: $localize`:@@requisition.field.disabilityTypeIds:Tipo de discapacidad`,
  hasLinkage: $localize`:@@requisition.field.hasLinkage:Vinculación`,
  seniorCitizen: $localize`:@@requisition.field.seniorCitizen:Adulto mayor`,
  languages: $localize`:@@requisition.field.languages:Idiomas`,
  addressLine: $localize`:@@requisition.field.addressLine:Dirección`,
  stateId: $localize`:@@requisition.field.stateId:Entidad federativa`,
  municipalityId: $localize`:@@requisition.field.municipalityId:Municipio`,
  neighborhoodId: $localize`:@@requisition.field.neighborhoodId:Colonia`,
  subregion: $localize`:@@requisition.field.subregion:Subregión`,
  postalCode: $localize`:@@requisition.field.postalCode:Código postal`,
  city: $localize`:@@requisition.field.city:Ciudad`,
  recruiterEmail: $localize`:@@requisition.field.recruiterEmail:Correo del reclutador`,
  generalCategoryId: $localize`:@@requisition.field.generalCategoryId:Categoría general`,
  jobDescription: $localize`:@@requisition.field.jobDescription:Descripción del puesto`,
  workplaceId: $localize`:@@requisition.field.workplaceId:Modalidad de trabajo`,
  responsibilityLevelId: $localize`:@@requisition.field.responsibilityLevelId:Nivel de responsabilidad`,
  publishSalaryMin: $localize`:@@requisition.field.publishSalaryMin:Salario mínimo publicado`,
  publishSalaryMax: $localize`:@@requisition.field.publishSalaryMax:Salario máximo publicado`,
  hasCommission: $localize`:@@requisition.field.hasCommission:Comisión`,
  hideSalary: $localize`:@@requisition.field.hideSalary:Ocultar salario`,
  publishedOnPortal: $localize`:@@requisition.field.publishedOnPortal:Publicar en portal candidatos`,
  jobPortalId: $localize`:@@requisition.field.jobPortalId:Portal de empleo`,
  includeSoftSkills: $localize`:@@requisition.field.includeSoftSkills:Incluir habilidades blandas`,
  includeExtraBenefits: $localize`:@@requisition.field.includeExtraBenefits:Incluir beneficios adicionales`,
  includeProfessionalDevelopment: $localize`:@@requisition.field.includeProfessionalDevelopment:Incluir desarrollo profesional`,
  includeKeywords: $localize`:@@requisition.field.includeKeywords:Incluir palabras clave`,
  clientExpansionDescription: $localize`:@@requisition.field.clientExpansionDescription:Descripción expansión cliente`,
  extraBenefitsText: $localize`:@@requisition.field.extraBenefitsText:Texto beneficios adicionales`,
  questionnaire: $localize`:@@requisition.field.questionnaire:Cuestionario`,
  documentRequirements: $localize`:@@requisition.field.documentRequirements:Documentos requeridos`,
};

const REQUISITION_I18N_BY_KEY: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(REQUISITION_STEP_LABELS).map(([stepKey, label]) => [`requisition.step.${stepKey}`, label]),
  ),
  ...Object.fromEntries(
    Object.entries(REQUISITION_FIELD_LABELS).map(([fieldKey, label]) => [`requisition.field.${fieldKey}`, label]),
  ),
};

function normalizeRequisitionI18nKey(keyOrSuffix: string, prefix: 'requisition.step.' | 'requisition.field.'): string {
  if (keyOrSuffix.startsWith(prefix)) {
    return keyOrSuffix;
  }
  return `${prefix}${keyOrSuffix}`;
}

export function resolveRequisitionWizardLabel(i18nKey: string): string {
  return REQUISITION_I18N_BY_KEY[i18nKey] ?? i18nKey;
}

export function resolveRequisitionStepLabel(stepKeyOrI18nKey: string, labelI18nKey?: string): string {
  if (labelI18nKey) {
    const fromI18n = REQUISITION_I18N_BY_KEY[labelI18nKey];
    if (fromI18n) {
      return fromI18n;
    }
  }
  const key = normalizeRequisitionI18nKey(stepKeyOrI18nKey, 'requisition.step.');
  return REQUISITION_I18N_BY_KEY[key] ?? stepKeyOrI18nKey;
}

export function resolveRequisitionFieldLabel(fieldKey: string, labelI18nKey?: string): string {
  if (labelI18nKey) {
    const fromI18n = REQUISITION_I18N_BY_KEY[labelI18nKey];
    if (fromI18n) {
      return fromI18n;
    }
  }
  const key = normalizeRequisitionI18nKey(fieldKey, 'requisition.field.');
  return REQUISITION_I18N_BY_KEY[key] ?? fieldKey;
}

/** Compact labels for horizontal mat-stepper (11 tabs). */
const REQUISITION_STEP_STEPPER_LABELS: Record<string, string> = {
  client: $localize`:@@requisition.step.client.stepper:Datos cliente`,
  general: $localize`:@@requisition.step.general.stepper:Datos generales`,
  manpower: $localize`:@@requisition.step.manpower.stepper:Datos Manpower`,
  hiring: $localize`:@@requisition.step.hiring.stepper:Contratación`,
  languages: $localize`:@@requisition.step.languages.stepper:Idiomas`,
  address: $localize`:@@requisition.step.address.stepper:Dirección`,
  recruitment: $localize`:@@requisition.step.recruitment.stepper:Reclutamiento`,
  clientDescription: $localize`:@@requisition.step.clientDescription.stepper:Desc. cliente`,
  extraBenefits: $localize`:@@requisition.step.extraBenefits.stepper:Beneficios`,
  preselection: $localize`:@@requisition.step.preselection.stepper:Preselección`,
  documents: $localize`:@@requisition.step.documents.stepper:Documentos`,
  requirements: $localize`:@@requisition.step.requirements.stepper:Requisitos`,
};

export function resolveRequisitionStepStepperLabel(stepKeyOrI18nKey: string, labelI18nKey?: string): string {
  const stepKey = (labelI18nKey || stepKeyOrI18nKey).replace(/^requisition\.step\./, '');
  return REQUISITION_STEP_STEPPER_LABELS[stepKey] ?? resolveRequisitionStepLabel(stepKeyOrI18nKey, labelI18nKey);
}

export const REQUISITION_STEP_LABEL_KEY_PLACEHOLDER = 'requisition.step.general';

export const REQUISITION_WIZARD_NEW_TITLE = $localize`:@@requisition.wizard.newTitle:Nueva requisición`;
export const REQUISITION_WIZARD_EDIT_TITLE = $localize`:@@requisition.wizard.editTitle:Editar requisición`;
export const REQUISITION_WIZARD_CONTINUE = $localize`:@@requisition.wizard.continue:Continuar`;
export const REQUISITION_WIZARD_PREVIOUS = $localize`:@@requisition.wizard.previous:Anterior`;
export const REQUISITION_WIZARD_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const REQUISITION_WIZARD_SAVE = $localize`:@@requisition.wizard.save:Guardar`;
export const REQUISITION_WIZARD_CREATE = $localize`:@@requisition.wizard.create:Crear`;
export const REQUISITION_WIZARD_SAVING = $localize`:@@requisition.wizard.saving:Guardando...`;
export const REQUISITION_WIZARD_CREATING = $localize`:@@requisition.wizard.creating:Creando...`;
export const REQUISITION_WIZARD_LOADING = $localize`:@@requisition.wizard.loading:Cargando formulario de requisición…`;
export const REQUISITION_WIZARD_PROGRESS_ARIA = $localize`:@@requisition.wizard.progressAria:Pasos del wizard`;
export const REQUISITION_SCOPE_HINT = $localize`:@@requisition.wizard.scopeHint:Selecciona el país y el tipo de cobertura para cargar el formulario correspondiente.`;
export const REQUISITION_SCOPE_COUNTRY = $localize`:@@requisition.wizard.scopeCountry:País`;
export const REQUISITION_SCOPE_COVERAGE = $localize`:@@requisition.wizard.scopeCoverage:Tipo de cobertura`;
export const REQUISITION_SCOPE_LOADING = $localize`:@@requisition.wizard.scopeLoading:Cargando...`;

export function requisitionWizardCreateSubtitle(steps: number): string {
  return $localize`:@@requisition.wizard.createSubtitle:Asistente de creación en ${steps}:steps: pasos`;
}

export function requisitionWizardEditSubtitle(steps: number): string {
  return $localize`:@@requisition.wizard.editSubtitle:Asistente en ${steps}:steps: pasos`;
}

export function requisitionWizardStepOf(current: number, total: number): string {
  return $localize`:@@requisition.wizard.stepOf:Paso ${current}:current: de ${total}:total:`;
}

export function requisitionWizardStepAria(
  current: number,
  total: number,
  title: string,
  state: 'done' | 'current' | 'pending',
): string {
  if (state === 'done') {
    return $localize`:@@requisition.wizard.stepAriaDone:Paso ${current}:current: de ${total}:total:: ${title}:title: (completado)`;
  }
  if (state === 'current') {
    return $localize`:@@requisition.wizard.stepAriaCurrent:Paso ${current}:current: de ${total}:total:: ${title}:title: (actual)`;
  }
  return $localize`:@@requisition.wizard.stepAria:Paso ${current}:current: de ${total}:total:: ${title}:title:`;
}
