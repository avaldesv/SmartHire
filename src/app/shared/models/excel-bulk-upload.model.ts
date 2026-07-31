export interface ExcelBulkRowError {
  field: string | null;
  code: string | null;
  message: string | null;
}

export interface ExcelBulkPreviewRow {
  rowNumber: number;
  firstName: string | null;
  lastName: string | null;
  maternalLastName: string | null;
  email: string | null;
  dialCode: string | null;
  phone: string | null;
  genderCode: string | null;
}

export interface ExcelBulkInvalidRow extends ExcelBulkPreviewRow {
  errors: ExcelBulkRowError[];
}

export interface ExcelBulkPreviewResponse {
  positionId: number;
  fileName: string | null;
  totalRows: number;
  validCount: number;
  invalidCount: number;
  validRows: ExcelBulkPreviewRow[];
  invalidRows: ExcelBulkInvalidRow[];
}

export interface ExcelBulkCreateRequest {
  notifyEmail: boolean;
  notifyWhatsapp: boolean;
  rows: ExcelBulkPreviewRow[];
}

export interface ExcelBulkCreateResponse {
  jobId: number;
  positionId: number;
  status: string;
  totalCount: number;
  notifyEmail: boolean;
  notifyWhatsapp: boolean;
  accepted: { itemId: number; rowNumber: number; email: string | null }[];
}

export interface ExcelBulkStatusResponse {
  jobId: number;
  positionId: number;
  status: string;
  notifyEmail: boolean;
  notifyWhatsapp: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  processingCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  successes: ExcelBulkSuccessItem[];
  failures: ExcelBulkFailedItem[];
}

export interface ExcelBulkSuccessItem {
  itemId: number;
  rowNumber: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  maternalLastName: string | null;
  outcome: string | null;
  reportLabel: string | null;
  candidateId: number | null;
  emailSent: boolean | null;
  whatsappSent: boolean | null;
  whatsappSkipReason: string | null;
}

export interface ExcelBulkFailedItem {
  itemId: number;
  rowNumber: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  reportLabel: string | null;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface ExcelBulkNotificationPayload {
  jobId: number;
  positionId: number;
  successCount?: number;
  failedCount?: number;
}
