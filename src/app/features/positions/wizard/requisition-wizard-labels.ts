const STEP_LABELS: Record<string, string> = {
  client: 'Datos Cliente',
  general: 'Generales',
  manpower: 'Manpower',
  hiring: 'Contratación',
  languages: 'Idiomas',
  address: 'Dirección',
  recruitment: 'Reclutamiento',
  clientDescription: 'Descripción cliente',
  extraBenefits: 'Beneficios extra',
  preselection: 'Preselección',
  documents: 'Documentos',
  requirements: 'Requerimientos',
};

const FIELD_LABELS: Record<string, string> = {
  countryId: 'País cliente',
  requisitionTypeId: 'Tipo reclutamiento',
  coverageTypeId: 'Categoría cobertura',
  ot: 'OT',
  clientKey: 'Clave cliente',
  legalName: 'Razón social',
  contactName: 'Contacto',
  clientPosition: 'Puesto contacto',
  clientContactPosition: 'Puesto contacto',
  generalNotes: 'Notas generales',
  contractTypeId: 'Tipo contrato',
  shiftId: 'Turno',
  salary: 'Salario',
  workDays: 'Días laborales',
  positionsCount: '# Posiciones',
  headcount: 'Headcount',
  startDate: 'Fecha inicio',
  hiringContractTypeId: 'Modalidad',
  benefitId: 'Prestaciones',
  probationDays: 'Días prueba',
  primaryLanguageId: 'Idioma principal',
  secondaryLanguageId: 'Idioma secundario',
  languageLevelId: 'Nivel requerido',
  languages: 'Idiomas',
  address: 'Dirección',
  addressLine: 'Dirección',
  stateId: 'Estado',
  municipalityId: 'Municipio',
  postalCode: 'Código postal',
  neighborhoodId: 'Colonia',
  city: 'Ciudad',
  requirements: 'Requerimientos',
  educationLevelId: 'Escolaridad',
  experienceYears: 'Años experiencia',
  hasPeopleInCharge: 'Tiene personas a cargo',
  peopleInChargeCount: 'Cantidad personas a cargo',
  documentTypeIds: 'Tipos de documento',
  documentRequirements: 'Documentos requeridos',
  questionnaire: 'Cuestionario',
};

export function resolveWizardStepLabel(stepKey: string, labelI18nKey?: string): string {
  void labelI18nKey;
  return STEP_LABELS[stepKey] ?? stepKey;
}

export function resolveWizardFieldLabel(fieldKey: string, labelI18nKey?: string): string {
  void labelI18nKey;
  return FIELD_LABELS[fieldKey] ?? fieldKey;
}
