import { REQUISITION_FORM_DEFAULT_STEP_KEYS } from '../models/requisition-form.model';

/** Ordered field keys per legacy wizard tab (admin catalog tree). */
export const REQUISITION_FIELDS_BY_STEP: Record<(typeof REQUISITION_FORM_DEFAULT_STEP_KEYS)[number], readonly string[]> = {
  client: [
    'countryId',
    'coverageTypeId',
    'clientId',
    'ot',
    'clientKey',
    'legalName',
    'tradeName',
    'contactName',
    'contactPhone',
    'contactEmail',
    'clientContactPosition',
    'clientPositionKey',
  ],
  general: [
    'positionName',
    'serviceNumber',
    'genderId',
    'maritalStatusId',
    'careerId',
    'educationLevelId',
    'experienceIn',
    'experienceLevelId',
    'minAge',
    'maxAge',
    'hasPeopleInCharge',
    'peopleInChargeCount',
    'travelAvailability',
    'relocationAvailability',
    'jobDescription',
    'requirementsMandatory',
    'requirementsOptional',
    'requirementsDesirable',
  ],
  manpower: [
    'requisitionTypeId',
    'orderId',
    'serviceFee',
    'currencyId',
    'hasAdvancePayment',
  ],
  hiring: [
    'contractTypeId',
    'benefitId',
    'workdayStartTime',
    'workdayEndTime',
    'shiftId',
    'salary',
    'lunchStartTime',
    'lunchEndTime',
    'rotatingShifts',
    'commitmentDate',
    'hiringDate',
    'workDays',
    'hiringRequirements',
    'tools',
    'positionsCount',
    'recruiterGroupId',
    'careResponsibleUserId',
    'careResponsibleAts',
  ],
  languages: ['languages', 'disabilityTypeIds', 'disabilityTypeId', 'hasLinkage', 'seniorCitizen'],
  address: ['addressLine', 'stateId', 'municipalityId', 'neighborhoodId', 'postalCode', 'city', 'subregion'],
  recruitment: [
    'recruiterEmail',
    'generalCategoryId',
    'workplaceId',
    'responsibilityLevelId',
    'publishSalaryMin',
    'publishSalaryMax',
    'hasCommission',
    'hideSalary',
    'publishedOnPortal',
    'jobPortalId',
    'includeSoftSkills',
    'includeExtraBenefits',
    'includeProfessionalDevelopment',
    'includeKeywords',
  ],
  clientDescription: ['clientExpansionDescription'],
  extraBenefits: ['extraBenefitsText'],
  preselection: ['questionnaire'],
  documents: [
    'documentRequirements',
    'documentValidateAiName',
    'documentValidateAiValidity',
    'documentValidityMonths',
    'documentIsRequired',
  ],
};

const FIELD_TO_STEP = new Map<string, string>();
for (const stepKey of REQUISITION_FORM_DEFAULT_STEP_KEYS) {
  for (const fieldKey of REQUISITION_FIELDS_BY_STEP[stepKey]) {
    FIELD_TO_STEP.set(fieldKey, stepKey);
  }
}

export function stepKeyForField(fieldKey: string): string {
  return FIELD_TO_STEP.get(fieldKey) ?? 'general';
}

export function stepLabelI18nKey(stepKey: string): string {
  return `requisition.step.${stepKey}`;
}

export function orderedFieldKeysForStep(stepKey: string): readonly string[] {
  return REQUISITION_FIELDS_BY_STEP[stepKey as keyof typeof REQUISITION_FIELDS_BY_STEP] ?? [];
}
