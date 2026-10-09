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
  code?: string;
}

export interface WizardAiInterviewProfileImageValue {
  storageKey: string;
  extension: string;
  previewUrl?: string | null;
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
  isActive: boolean;
}

export interface WizardQuestionnaireValue {
  examId: number | null;
  questionnaireId?: number | null;
  evaluationType?: string | null;
  acceptancePercentage?: number | null;
  examModalityId?: number | null;
  aiInterviewRole?: string | null;
  aiInterviewDescription?: string | null;
  aiInterviewVoice?: string | null;
  aiProfileImageStorageKey?: string | null;
  aiProfileImageExtension?: string | null;
}
