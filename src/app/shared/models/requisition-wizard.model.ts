export interface ResolvedRequisitionFormField {
  fieldKey: string;
  uiType: string;
  dataSourceKey?: string | null;
  labelI18nKey: string;
  isVisible: boolean;
  isRequired: boolean;
  rulesJson?: string | null;
  readOnly?: boolean;
}

export interface ResolvedRequisitionFormStep {
  stepKey: string;
  labelI18nKey: string;
  orderIndex: number;
  fields: ResolvedRequisitionFormField[];
}

export interface ResolvedRequisitionFormConfig {
  configId: number;
  version: number;
  steps: ResolvedRequisitionFormStep[];
}

export interface WizardFieldOption {
  id: number;
  label: string;
}

export interface WizardLanguageRow {
  languageId: number | null;
  languageLevelId: number | null;
}

export interface WizardDocumentRequirementRow {
  documentTypeId: number;
  isRequired: boolean;
  selected?: boolean;
  validateAiName: boolean;
  validateAiValidity: boolean;
  validityMonths: number | null;
}

export interface WizardQuestionnaireValue {
  examId: number | null;
  questionnaireId?: number | null;
  evaluationType?: string | null;
  acceptancePercentage?: number | null;
}
