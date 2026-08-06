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
  equals: boolean;
}

export interface RequisitionFormFieldRules {
  visibleWhen?: RequisitionFormFieldRuleCondition;
  requiredWhen?: RequisitionFormFieldRuleCondition;
  /** When true, the control is disabled in the wizard. */
  readOnly?: boolean;
  /** Copies value from another field key (e.g. orderId mirrors ot). */
  valueFrom?: string;
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
  'documents',
] as const;

export const PEOPLE_IN_CHARGE_FIELD_KEY = 'hasPeopleInCharge';
export const PEOPLE_IN_CHARGE_COUNT_FIELD_KEY = 'peopleInChargeCount';
