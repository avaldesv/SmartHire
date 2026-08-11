/** Shared report filter body — tenant (Marca) comes from companyId header. */
export interface ReportFilterRequest {
  countryId?: number | null;
  recruitmentType?: string | null;
  requisitionTypeId?: number | null;
  workplaceId?: number | null;
  recruiterGroupId?: number | null;
  year: number;
  positionId?: number | null;
  clientKey?: string | null;
  assignedUserId?: number | null;
}

export interface ReportKpisResponse {
  currentMonth: number | null;
  priorMonth: number | null;
  ytd: number | null;
}

export interface ReportRowResponse {
  code: string;
  label: string;
  /** values[0]=ENE … values[11]=DIC (null = empty cell). */
  values: Array<number | null>;
}

export interface ReportGroupResponse {
  code: string;
  label: string;
  highlight: boolean;
  rows: ReportRowResponse[];
}

export interface ReportMatrixResponse {
  kpis: ReportKpisResponse;
  groups: ReportGroupResponse[];
}

/** Filters for status-by-requisition — tenant (Marca) from companyId header. */
export interface StatusByRequisitionFilterRequest {
  startDate?: string | null;
  endDate?: string | null;
  countryId?: number | null;
  positionId?: number | null;
  status?: string | null;
  assignedUserId?: number | null;
  clientKey?: string | null;
  recruiterGroupId?: number | null;
  workplaceId?: number | null;
  recruitmentType?: string | null;
}

export interface StatusByRequisitionRowResponse {
  statusCode: string;
  status: string;
  requisitions: number;
  positionsCount: number;
  applicants: number;
  preselected: number;
  selected: number;
  evaluated: number;
  interviewed: number;
  prehired: number;
  hired: number;
  uncovered: number;
  compliancePercent: number | null;
  digitalDocs: number;
}

export interface StatusByRequisitionResponse {
  rows: StatusByRequisitionRowResponse[];
}
