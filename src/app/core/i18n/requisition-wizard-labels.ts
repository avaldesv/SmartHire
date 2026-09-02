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
  requirements: $localize`:@@requisition.step.requirements:Requerimientos`,
};

const REQUISITION_FIELD_LABELS: Record<string, string> = {
  brandId: $localize`:@@requisition.field.brandId:Marca`,
  countryId: $localize`:@@requisition.field.countryId:País`,
  requisitionTypeId: $localize`:@@requisition.field.requisitionTypeId:Tipo de requisición`,
  coverageTypeId: $localize`:@@requisition.field.coverageTypeId:Tipo de cobertura`,
  clientId: $localize`:@@requisition.field.clientId:Cliente`,
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
  workDays: $localize`:@@requisition.field.workDays:Días de trabajo`,
  positionsCount: $localize`:@@requisition.field.positionsCount:Número de posiciones`,
  benefitId: $localize`:@@requisition.field.benefitId:Prestaciones`,
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
  exam: $localize`:@@requisition.field.exam:Examen`,
  documentRequirements: $localize`:@@requisition.field.documentRequirements:Documentos requeridos`,
  primaryLanguageId: $localize`:@@requisition.field.primaryLanguageId:Idioma principal`,
  secondaryLanguageId: $localize`:@@requisition.field.secondaryLanguageId:Idioma secundario`,
  languageLevelId: $localize`:@@requisition.field.languageLevelId:Nivel requerido`,
  requirements: $localize`:@@requisition.field.requirements:Requerimientos`,
  experienceYears: $localize`:@@requisition.field.experienceYears:Años experiencia`,
  generalNotes: $localize`:@@requisition.field.generalNotes:Notas generales`,
  headcount: $localize`:@@requisition.field.headcount:Headcount`,
  startDate: $localize`:@@requisition.field.startDate:Fecha inicio`,
  probationDays: $localize`:@@requisition.field.probationDays:Días prueba`,
  clientPosition: $localize`:@@requisition.field.clientPosition:Puesto Cliente`,
  address: $localize`:@@requisition.field.address:Dirección`,
  hiringContractTypeId: $localize`:@@requisition.field.hiringContractTypeId:Modalidad`,
  documentTypeIds: $localize`:@@requisition.field.documentTypeIds:Documentos`,
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
export const REQUISITION_SCOPE_COVERAGE_REQUIRED = $localize`:@@requisition.wizard.scopeCoverageRequired:Seleccione un tipo de cobertura`;
export const REQUISITION_SCOPE_LOADING = $localize`:@@requisition.wizard.scopeLoading:Cargando...`;

export const REQUISITION_WIZARD_LOAD_COUNTRIES_ERROR = $localize`:@@requisition.wizard.errors.loadCountries:No se pudieron cargar los países`;
export const REQUISITION_WIZARD_LOAD_LANGUAGES_ERROR = $localize`:@@requisition.wizard.errors.loadLanguages:No se pudieron cargar los idiomas`;
export const REQUISITION_WIZARD_LOAD_STATES_ERROR = $localize`:@@requisition.wizard.errors.loadStates:No se pudieron cargar los estados`;
export const REQUISITION_WIZARD_LOAD_MUNICIPALITIES_ERROR = $localize`:@@requisition.wizard.errors.loadMunicipalities:No se pudieron cargar los municipios`;
export const REQUISITION_WIZARD_LOAD_NEIGHBORHOODS_ERROR = $localize`:@@requisition.wizard.errors.loadNeighborhoods:No se pudieron cargar las colonias`;
export const REQUISITION_WIZARD_NO_NEIGHBORHOODS = $localize`:@@requisition.wizard.info.noNeighborhoods:Sin colonias para ese código postal`;
export const REQUISITION_WIZARD_LOAD_POSITION_ERROR = $localize`:@@requisition.wizard.errors.loadPosition:No se pudo cargar la requisición`;
export const REQUISITION_WIZARD_LOAD_CATALOGS_ERROR = $localize`:@@requisition.wizard.errors.loadCatalogs:Error al cargar catálogos de la requisición`;
export const REQUISITION_WIZARD_VALIDATION_REQUIRED = $localize`:@@requisition.wizard.errors.validationRequired:Complete los campos obligatorios`;
export const REQUISITION_WIZARD_SAVE_SUCCESS_CREATE = $localize`:@@requisition.wizard.success.create:Requisición creada correctamente`;
export const REQUISITION_WIZARD_SAVE_SUCCESS_UPDATE = $localize`:@@requisition.wizard.success.update:Requisición actualizada correctamente`;
export const REQUISITION_WIZARD_SAVE_ERROR_CREATE = $localize`:@@requisition.wizard.errors.create:No se pudo crear la requisición`;
export const REQUISITION_WIZARD_SAVE_ERROR_UPDATE = $localize`:@@requisition.wizard.errors.update:No se pudo actualizar la requisición`;
export const REQUISITION_WIZARD_JSON_EXPORTED = $localize`:@@requisition.wizard.info.jsonExported:JSON exportado a consola`;
export const REQUISITION_WIZARD_ATS_SIMULATED = $localize`:@@requisition.wizard.info.atsSimulated:Enviado a ATS (simulado)`;
export const REQUISITION_SCOPE_LOAD_COUNTRIES_ERROR = REQUISITION_WIZARD_LOAD_COUNTRIES_ERROR;
export const REQUISITION_SCOPE_LOAD_COVERAGE_ERROR = $localize`:@@requisition.wizard.errors.loadCoverage:No se pudieron cargar los tipos de cobertura`;

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

export const REQUISITION_WIZARD_NONE = $localize`:@@requisition.wizard.none:Ninguno`;
export const REQUISITION_WIZARD_LANGUAGE = $localize`:@@requisition.wizard.language:Idioma`;
export const REQUISITION_WIZARD_LANGUAGE_LEVEL = $localize`:@@requisition.wizard.languageLevel:Nivel`;
export const REQUISITION_WIZARD_ADD_LANGUAGE = $localize`:@@requisition.wizard.addLanguage:Agregar idioma`;
export const REQUISITION_WIZARD_LOADING_DOCUMENTS = $localize`:@@requisition.wizard.loadingDocuments:Cargando tipos de documento...`;
export const REQUISITION_WIZARD_NO_DOCUMENTS = $localize`:@@requisition.wizard.noDocuments:Sin tipos de documento para el país seleccionado.`;
export const REQUISITION_WIZARD_EVALUATION_TYPE = $localize`:@@requisition.wizard.evaluationType:Tipo evaluación`;
export const REQUISITION_WIZARD_EVAL_PERCENTAGE = $localize`:@@requisition.wizard.evalPercentage:Porcentaje`;
export const REQUISITION_WIZARD_EVAL_SCORE = $localize`:@@requisition.wizard.evalScore:Puntaje`;
export const REQUISITION_WIZARD_ACCEPTANCE_PERCENT = $localize`:@@requisition.wizard.acceptancePercent:% aceptación`;
export const REQUISITION_WIZARD_SELECT_COUNTRY_HINT = $localize`:@@requisition.wizard.selectCountryHint:Seleccione el país del cliente en el paso anterior para cargar la geografía.`;
export const REQUISITION_WIZARD_SELECT_COUNTRY_DOCUMENTS_HINT = $localize`:@@requisition.wizard.selectCountryDocumentsHint:Seleccione el país del cliente para cargar tipos de documento.`;

export const REQUISITION_DOCS_WIZARD_SUBTITLE = $localize`:@@requisition.documents.wizard.subtitle:Configure los documentos que el candidato debe entregar`;
export const REQUISITION_DOCS_WIZARD_TYPE = $localize`:@@requisition.documents.wizard.type:Tipo de documento`;
export const REQUISITION_DOCS_WIZARD_VALIDATE_AI = $localize`:@@requisition.documents.wizard.validateAi:Validar con IA`;
export const REQUISITION_DOCS_WIZARD_VALIDATE_NAME = $localize`:@@requisition.documents.wizard.validateName:Nombre`;
export const REQUISITION_DOCS_WIZARD_VALIDATE_VALIDITY = $localize`:@@requisition.documents.wizard.validateValidity:Vigencia`;
export const REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS = $localize`:@@requisition.documents.wizard.validityMonths:Tiempo de validez (meses)`;
export const REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_PLACEHOLDER = $localize`:@@requisition.documents.wizard.validityMonthsPlaceholder:Número de meses`;
export const REQUISITION_DOCS_WIZARD_MANDATORY = $localize`:@@requisition.documents.wizard.mandatory:Obligatorio`;
export const REQUISITION_DOCS_WIZARD_YES = $localize`:@@common.yes:Sí`;
export const REQUISITION_DOCS_WIZARD_NO = $localize`:@@common.no:No`;
export const REQUISITION_DOCS_WIZARD_ADD = $localize`:@@requisition.documents.wizard.add:Agregar documento`;
export const REQUISITION_DOCS_WIZARD_UPDATE = $localize`:@@requisition.documents.wizard.update:Actualizar documento`;
export const REQUISITION_DOCS_WIZARD_CONFIGURED_TITLE = $localize`:@@requisition.documents.wizard.configuredTitle:Documentos configurados`;
export const REQUISITION_DOCS_WIZARD_COL_TYPE = $localize`:@@requisition.documents.wizard.colType:Tipo`;
export const REQUISITION_DOCS_WIZARD_COL_AI = $localize`:@@requisition.documents.wizard.colAi:Validar IA`;
export const REQUISITION_DOCS_WIZARD_COL_MONTHS = $localize`:@@requisition.documents.wizard.colMonths:Vigencia (meses)`;
export const REQUISITION_DOCS_WIZARD_COL_MANDATORY = $localize`:@@requisition.documents.wizard.colMandatory:Obligatorio`;
export const REQUISITION_DOCS_WIZARD_COL_ACTIONS = $localize`:@@requisition.documents.wizard.colActions:Acciones`;
export const REQUISITION_DOCS_WIZARD_EMPTY = $localize`:@@requisition.documents.wizard.empty:No hay documentos configurados. Agregue al menos uno.`;
export const REQUISITION_DOCS_WIZARD_DUPLICATE_TYPE = $localize`:@@requisition.documents.wizard.duplicateType:Este tipo de documento ya está en la lista`;
export const REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_REQUIRED = $localize`:@@requisition.documents.wizard.validityMonthsRequired:Indique el tiempo de validez en meses`;
export const REQUISITION_DOCS_WIZARD_EDIT = $localize`:@@requisition.documents.wizard.edit:Editar`;
export const REQUISITION_DOCS_WIZARD_DELETE = $localize`:@@requisition.documents.wizard.delete:Eliminar`;
export const REQUISITION_DOCS_WIZARD_AI_NONE = $localize`:@@common.emDash:—`;

export function requisitionDocumentsWizardAiSummary(
  validateAiName: boolean,
  validateAiValidity: boolean,
): string {
  const parts: string[] = [];
  if (validateAiName) {
    parts.push(REQUISITION_DOCS_WIZARD_VALIDATE_NAME);
  }
  if (validateAiValidity) {
    parts.push(REQUISITION_DOCS_WIZARD_VALIDATE_VALIDITY);
  }
  return parts.length ? parts.join(', ') : REQUISITION_DOCS_WIZARD_AI_NONE;
}
export const REQUISITION_WIZARD_OPEN_TIME_PICKER = $localize`:@@requisition.wizard.openTimePicker:Abrir selector de hora`;
export const REQUISITION_WIZARD_CLIENT_SEARCH_PLACEHOLDER = $localize`:@@requisition.wizard.clientSearchPlaceholder:Buscar por nombre, email, código o nombre comercial`;
export const REQUISITION_WIZARD_CLIENT_SEARCH_NO_COUNTRY = $localize`:@@requisition.wizard.clientSearchNoCountry:Seleccione un país para buscar clientes`;
export const REQUISITION_WIZARD_CLIENT_SEARCH_NO_RESULTS = $localize`:@@requisition.wizard.clientSearchNoResults:Sin coincidencias`;
export const REQUISITION_WIZARD_CLIENT_SEARCH_CLEAR = $localize`:@@requisition.wizard.clientSearchClear:Quitar cliente`;
export const REQUISITION_LEGACY_CLIENT_COUNTRY = $localize`:@@requisition.legacy.clientCountry:País cliente`;
export const REQUISITION_LEGACY_RECRUITMENT_TYPE = $localize`:@@requisition.legacy.recruitmentType:Tipo reclutamiento`;
export const REQUISITION_LEGACY_COVERAGE_CATEGORY = $localize`:@@requisition.legacy.coverageCategory:Categoría cobertura`;
export const REQUISITION_LEGACY_CONTACT = $localize`:@@requisition.legacy.contact:Contacto`;
export const REQUISITION_LEGACY_GENERALS_STEP = $localize`:@@requisition.legacy.generalsStep:Generales`;
export const REQUISITION_LEGACY_WORK_DAYS = $localize`:@@requisition.legacy.workDays:Días laborales`;
export const REQUISITION_LEGACY_POSITIONS_COUNT = $localize`:@@requisition.legacy.positionsCount:# Posiciones`;
export const REQUISITION_LEGACY_STATE = $localize`:@@requisition.legacy.state:Estado`;

const WEEKDAY_LABELS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;

/** Localized weekday options for multiselect UI. */
export function getWeekdayOptions(): { id: number; label: string }[] {
  return [
    { id: 1, label: $localize`:@@requisition.weekday.monday:Lunes` },
    { id: 2, label: $localize`:@@requisition.weekday.tuesday:Martes` },
    { id: 3, label: $localize`:@@requisition.weekday.wednesday:Miércoles` },
    { id: 4, label: $localize`:@@requisition.weekday.thursday:Jueves` },
    { id: 5, label: $localize`:@@requisition.weekday.friday:Viernes` },
    { id: 6, label: $localize`:@@requisition.weekday.saturday:Sábado` },
    { id: 7, label: $localize`:@@requisition.weekday.sunday:Domingo` },
  ];
}

/** Spanish canonical labels stored in DB for workDays. */
export function getWeekdayLabelEs(id: number): string | undefined {
  return WEEKDAY_LABELS_ES[id - 1];
}
