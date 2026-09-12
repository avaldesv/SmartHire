export interface HistoricEmployee {
  id: number;
  companyId: number;
  countryId: number | null;
  countryName: string | null;
  firstName: string;
  lastNames: string;
  paternalLastName: string;
  maternalLastName: string | null;
  email: string;
  phone: string | null;
  mobilePhone: string | null;
  genderId: number | null;
  employmentRecordStatus: string;
  jobTitle: string | null;
  birthDate: string | null;
  salary: number | null;
  educationLevelId: number | null;
  educationLevelName: string | null;
  recruitmentSource: string | null;
  originSystem: string | null;
  sourceKind: string;
  isActive: boolean;
}

export interface HistoricEmployeeListResponse {
  data: HistoricEmployee[];
  pagination: { total: number; page?: number; pageSize?: number };
}

export interface HistoricEmployeePreviewResponse {
  validCount: number;
  invalidCount: number;
  validRows: HistoricEmployeeValidRow[];
  invalidRows: { rowNumber: number; email: string | null; errors: { code: string; message: string }[] }[];
}

export interface HistoricEmployeeValidRow {
  rowNumber: number;
  countryName: string | null;
  firstName: string;
  paternalLastName: string;
  maternalLastName: string | null;
  email: string;
  phone: string | null;
  mobilePhone: string | null;
  genderCode: string | null;
  employmentStatusLabel: string | null;
  jobTitle: string | null;
  birthDateRaw: string | null;
  salaryRaw: string | null;
  educationLevelName: string | null;
  recruitmentSource: string | null;
  originSystem: string | null;
  sourceKind: string | null;
}

export interface HistoricEmployeeImportResponse {
  created: number;
  updated: number;
  skippedProtected: number;
}

export interface HistoricEmployeePostulateResponse {
  postulated: number;
  alreadyLinked: number;
  rejected: number;
}
