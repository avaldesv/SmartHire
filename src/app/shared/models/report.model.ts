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
