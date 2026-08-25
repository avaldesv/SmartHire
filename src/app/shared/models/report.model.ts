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

/** Filters for requisitions-in-process — tenant (Marca) from companyId header. */
export interface RequisitionsInProcessFilterRequest {
  countryId?: number | null;
}

export interface RequisitionsInProcessYearResponse {
  year: number;
  requisitions: number;
  positions: number;
  applicants: number;
  hired: number;
  uncovered: number;
}

export interface RequisitionsInProcessClientResponse {
  clientName: string;
  inProcessCount: number;
}

export interface RequisitionsInProcessClientsPage {
  data: RequisitionsInProcessClientResponse[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface RequisitionsInProcessResponse {
  onTimeCount: number;
  expiredCount: number;
  years: RequisitionsInProcessYearResponse[];
  clients: RequisitionsInProcessClientsPage;
}

/** Filters for requisitions-by-source — tenant (Marca) from companyId header. */
export interface RequisitionsBySourceFilterRequest {
  startDate?: string | null;
  endDate?: string | null;
  countryId?: number | null;
  assignedUserId?: number | null;
  clientKey?: string | null;
  recruiterGroupId?: number | null;
  workplaceId?: number | null;
}

export interface RequisitionsBySourceRowResponse {
  source: string;
  positions: number;
  applicants: number;
  hired: number;
  hiredPercent: number | null;
  notHired: number;
  notHiredPercent: number | null;
  sourceCoveragePercent: number | null;
  avgHiringDays: number | null;
}

export interface RequisitionsBySourceResponse {
  rows: RequisitionsBySourceRowResponse[];
  total: RequisitionsBySourceRowResponse;
}

/** Filters for process-funnel — tenant from companyId header; brandId always null from portal. */
export interface ProcessFunnelFilterRequest {
  startDate?: string | null;
  endDate?: string | null;
  countryId?: number | null;
  brandId?: number | null;
  positionId?: number | null;
  status?: string | null;
  assignedUserId?: number | null;
  clientKey?: string | null;
  recruiterGroupId?: number | null;
  workplaceId?: number | null;
  recruitmentType?: string | null;
}

export interface ProcessFunnelStageCounts {
  applicants: number;
  selected: number;
  interviewed: number;
  evaluated: number;
  prehired: number;
  hired: number;
}

export interface ProcessFunnelRowResponse extends ProcessFunnelStageCounts {
  brandId: number | null;
  brandName: string;
  positionId: number;
  requisitionLabel: string;
}

export interface ProcessFunnelBrandResponse extends ProcessFunnelStageCounts {
  brandId: number | null;
  brandName: string;
}

export interface ProcessFunnelResponse {
  rows: ProcessFunnelRowResponse[];
  totalByStage: ProcessFunnelStageCounts;
  byBrand: ProcessFunnelBrandResponse[];
}

/** Filters for consolidado — no Marca UI; tenant from companyId header. */
export interface ConsolidadoFilterRequest {
  countryId?: number | null;
  recruitmentType?: string | null;
  workplaceId?: number | null;
  recruiterGroupId?: number | null;
  assignedUserId?: number | null;
  year?: number | null;
  month?: number | null;
  startDay?: number | null;
  endDay?: number | null;
  positionId?: number | null;
  clientKey?: string | null;
  /** NONE | GROUP | CLIENT | RECRUITER */
  dimension?: string | null;
}

export interface ConsolidadoKpisResponse {
  totalRequisitions: number;
  recruiters: number;
  requisitionsPerRecruiter: number | null;
}

export interface ConsolidadoStatusRowResponse {
  statusCode: string;
  status: string;
  defined: boolean;
  total: number | null;
  values: Array<number | null>;
}

export interface ConsolidadoDimensionRowResponse {
  key: string;
  label: string;
  totalRequisitions: number;
  values: number[];
}

export interface ConsolidadoResponse {
  kpis: ConsolidadoKpisResponse;
  days: number[];
  statusTotals: ConsolidadoStatusRowResponse[];
  matrix: ConsolidadoStatusRowResponse[];
  dimension: string;
  dimensionRows: ConsolidadoDimensionRowResponse[];
}

/** Recruiter performance (Desempeño) — MMR metrics by assignedUserId for year+month. */
export interface RecruiterPerformanceFilterRequest {
  year: number;
  month: number;
  countryId?: number | null;
  recruitmentType?: string | null;
  workplaceId?: number | null;
  recruiterGroupId?: number | null;
  positionId?: number | null;
  clientKey?: string | null;
  assignedUserId?: number | null;
}

export interface RecruiterPerformanceRowResponse {
  recruiterUserId: number | null;
  recruiterName: string;
  openingOrders: number;
  tempJobOrders: number;
  ordersCancellations: number;
  associateStarts: number;
  ordersMonthEnd: number;
  orderFillRate: number | null;
  orderCancellationRate: number | null;
}

export interface RecruiterPerformanceResponse {
  kpis: ReportKpisResponse;
  rows: RecruiterPerformanceRowResponse[];
  total: RecruiterPerformanceRowResponse;
}
