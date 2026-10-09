import { ApiPageResponse } from './catalog-position.model';

export type RequisitionFormConfigStatus = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';

export interface RequisitionFormFieldDef {
  id: number;
  fieldKey: string;
  labelI18nKey: string;
  helpI18nKey?: string | null;
  uiType: string;
  dataSourceKey?: string | null;
  storageType: string;
  columnName?: string | null;
  validatorsJson?: string | null;
  isBuiltin: boolean;
  isActive: boolean;
  companyId?: number;
}

export interface RequisitionFormStepConfig {
  stepKey: string;
  labelI18nKey: string;
  orderIndex: number;
  isVisible: boolean;
  viewRolesJson?: string | null;
  editRolesJson?: string | null;
}

export interface RequisitionFormFieldConfig {
  stepKey: string;
  fieldDefId: number;
  orderIndex: number;
  isVisible: boolean;
  isRequired: boolean;
  overridesJson?: string | null;
  rulesJson?: string | null;
  viewRolesJson?: string | null;
  editRolesJson?: string | null;
}

export interface RequisitionFormFieldRuleCondition {
  fieldKey: string;
  equals?: boolean | number | string;
  equalsCode?: string;
}

export interface RequisitionFormFieldReadOnlyWhen {
  fieldKey: string;
  hasValue: boolean;
}

export interface RequisitionFormCatalogFillMapping {
  fieldKey: string;
  from: string;
}

export interface RequisitionFormFieldRules {
  visibleWhen?: RequisitionFormFieldRuleCondition;
  requiredWhen?: RequisitionFormFieldRuleCondition;
  /** When true, the control is disabled in the wizard. */
  readOnly?: boolean;
  /** Copies value from another field key (e.g. orderId mirrors ot). */
  valueFrom?: string;
  /** When the referenced field has a value, this field is read-only in the wizard. */
  readOnlyWhen?: RequisitionFormFieldReadOnlyWhen;
  /** On this source field, copy catalog properties into target fields. */
  fillFromCatalog?: {
    dataSourceKey: string;
    mappings: RequisitionFormCatalogFillMapping[];
  };
}

export interface RequisitionFormConfigSummary {
  id: number;
  name: string;
  countryId: number;
  coverageTypeId: number;
  version: number;
  status: RequisitionFormConfigStatus;
  publishedAt?: string | null;
  companyId: number;
}

export interface RequisitionFormConfigDetail extends RequisitionFormConfigSummary {
  steps: RequisitionFormStepConfig[];
  fields: RequisitionFormFieldConfig[];
}

export interface ListRequisitionFormFieldDefsRequest {
  isActive?: boolean | null;
  isBuiltin?: boolean | null;
  search?: string | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface ListRequisitionFormConfigsRequest {
  countryId?: number | null;
  coverageTypeId?: number | null;
  status?: string | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface CreateRequisitionFormConfigRequest {
  countryId: number;
  coverageTypeId: number;
  name: string;
}

export interface UpdateRequisitionFormConfigRequest {
  name: string;
  steps: RequisitionFormStepConfig[];
  fields: RequisitionFormFieldConfig[];
}

export type RequisitionFormFieldDefListResponse = ApiPageResponse<RequisitionFormFieldDef>;
export type RequisitionFormConfigListResponse = ApiPageResponse<RequisitionFormConfigSummary>;

export const REQUISITION_FORM_DEFAULT_STEP_KEYS = [
  'client',
  'general',
  'manpower',
  'hiring',
  'languages',
  'address',
  'recruitment',
  'clientDescription',
  'extraBenefits',
  'preselection',
  'whatsappSurvey',
  'evaluatestJob',
  'documents',
] as const;

export const PEOPLE_IN_CHARGE_FIELD_KEY = 'hasPeopleInCharge';
export const PEOPLE_IN_CHARGE_COUNT_FIELD_KEY = 'peopleInChargeCount';

export const EXAM_MODALITY_ID_FIELD_KEY = 'examModalityId';
export const AI_INTERVIEW_PROFILE_FIELD_KEYS = [
  'aiInterviewRole',
  'aiInterviewDescription',
  'aiInterviewVoice',
  'aiInterviewProfileImage',
] as const;

export function isAiInterviewProfileFieldKey(fieldKey: string): boolean {
  return (AI_INTERVIEW_PROFILE_FIELD_KEYS as readonly string[]).includes(fieldKey);
}

export function isAiInterviewModalityRuleCondition(
  condition: RequisitionFormFieldRuleCondition | undefined,
): boolean {
  return (
    condition?.fieldKey === EXAM_MODALITY_ID_FIELD_KEY &&
    condition.equalsCode === 'AI_INTERVIEW'
  );
}
