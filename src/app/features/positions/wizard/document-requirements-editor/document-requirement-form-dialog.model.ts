export interface DocumentRequirementFormDialogData {
  documentTypeName: string;
  documentTypeId: number;
  validateAiName: boolean;
  validateAiValidity: boolean;
  validityMonths: number | null;
  isRequired: boolean;
  showValidateAiName: boolean;
  showValidateAiValidity: boolean;
  showValidityMonths: boolean;
  showMandatory: boolean;
  validateAiNameReadOnly: boolean;
  validateAiValidityReadOnly: boolean;
  validityMonthsReadOnly: boolean;
  mandatoryReadOnly: boolean;
}

export interface DocumentRequirementFormDialogResult {
  documentTypeId: number;
  validateAiName: boolean;
  validateAiValidity: boolean;
  validityMonths: number | null;
  isRequired: boolean;
}
