import { ResolvedRequisitionFormConfig } from '../../../shared/models/requisition-wizard.model';

function field(
  fieldKey: string,
  uiType: string,
  labelI18nKey: string,
  dataSourceKey?: string | null,
  isRequired = true,
  rulesJson?: string | null,
): ResolvedRequisitionFormConfig['steps'][number]['fields'][number] {
  return {
    fieldKey,
    uiType,
    dataSourceKey: dataSourceKey ?? null,
    labelI18nKey,
    isVisible: true,
    isRequired,
    rulesJson: rulesJson ?? null,
  };
}

/** Mirrors the legacy 8-step static wizard for fallback parity. */
export const DEFAULT_REQUISITION_WIZARD_SCHEMA: ResolvedRequisitionFormConfig = {
  configId: 0,
  version: 0,
  steps: [
    {
      stepKey: 'client',
      labelI18nKey: 'requisition.step.client',
      orderIndex: 1,
      fields: [
        field('countryId', 'select', 'requisition.field.countryId', 'countries'),
        field('requisitionTypeId', 'select', 'requisition.field.requisitionTypeId', 'requisition-types'),
        field('coverageTypeId', 'select', 'requisition.field.coverageTypeId', 'coverage-types'),
        field('ot', 'text', 'requisition.field.ot'),
        field('clientKey', 'text', 'requisition.field.clientKey'),
        field('legalName', 'text', 'requisition.field.legalName'),
        field('contactName', 'text', 'requisition.field.contactName'),
        field('clientPosition', 'text', 'requisition.field.clientContactPosition'),
      ],
    },
    {
      stepKey: 'general',
      labelI18nKey: 'requisition.step.general',
      orderIndex: 2,
      fields: [
        field('generalNotes', 'textarea', 'requisition.field.generalNotes', null, false),
        field('contractTypeId', 'select', 'requisition.field.contractTypeId', 'contract-types'),
        field('shiftId', 'select', 'requisition.field.shiftId', 'shifts'),
        field('salary', 'number', 'requisition.field.salary'),
        field('workDays', 'text', 'requisition.field.workDays'),
      ],
    },
    {
      stepKey: 'manpower',
      labelI18nKey: 'requisition.step.manpower',
      orderIndex: 3,
      fields: [
        field('positionsCount', 'number', 'requisition.field.positionsCount'),
        field('headcount', 'number', 'requisition.field.headcount'),
        field('startDate', 'date', 'requisition.field.startDate'),
      ],
    },
    {
      stepKey: 'hiring',
      labelI18nKey: 'requisition.step.hiring',
      orderIndex: 4,
      fields: [
        field('hiringContractTypeId', 'select', 'requisition.field.hiringContractTypeId', 'contract-types'),
        field('benefitId', 'select', 'requisition.field.benefitId', 'benefits'),
        field('probationDays', 'number', 'requisition.field.probationDays'),
      ],
    },
    {
      stepKey: 'languages',
      labelI18nKey: 'requisition.step.languages',
      orderIndex: 5,
      fields: [
        field('primaryLanguageId', 'select', 'requisition.field.primaryLanguageId', 'languages'),
        field('secondaryLanguageId', 'select', 'requisition.field.secondaryLanguageId', 'languages', false),
        field('languageLevelId', 'select', 'requisition.field.languageLevelId', 'language-levels'),
      ],
    },
    {
      stepKey: 'address',
      labelI18nKey: 'requisition.step.address',
      orderIndex: 6,
      fields: [
        field('address', 'text', 'requisition.field.addressLine'),
        field('stateId', 'select', 'requisition.field.stateId', 'states'),
        field('municipalityId', 'select', 'requisition.field.municipalityId', 'municipalities'),
        field('postalCode', 'text', 'requisition.field.postalCode'),
        field('neighborhoodId', 'select', 'requisition.field.neighborhoodId', 'neighborhoods'),
        field('city', 'text', 'requisition.field.city'),
      ],
    },
    {
      stepKey: 'requirements',
      labelI18nKey: 'requisition.step.requirements',
      orderIndex: 7,
      fields: [
        field('requirements', 'textarea', 'requisition.field.requirements'),
        field('educationLevelId', 'select', 'requisition.field.educationLevelId', 'education-levels'),
        field('experienceYears', 'number', 'requisition.field.experienceYears'),
        field('hasPeopleInCharge', 'checkbox', 'requisition.field.hasPeopleInCharge', null, false),
        field(
          'peopleInChargeCount',
          'number',
          'requisition.field.peopleInChargeCount',
          null,
          false,
          JSON.stringify({
            visibleWhen: { fieldKey: 'hasPeopleInCharge', equals: true },
            requiredWhen: { fieldKey: 'hasPeopleInCharge', equals: true },
          }),
        ),
      ],
    },
    {
      stepKey: 'documents',
      labelI18nKey: 'requisition.step.documents',
      orderIndex: 8,
      fields: [field('documentTypeIds', 'document-grid', 'requisition.field.documentRequirements', 'document-types', false)],
    },
  ],
};
