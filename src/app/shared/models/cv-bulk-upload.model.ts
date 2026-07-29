export interface CvBulkUploadCreateResponse {
  jobId: number;
  positionId: number;
  status: string;
  acceptedCount: number;
  totalCount: number;
  notifyEmail: boolean;
  notifyWhatsapp: boolean;
  items: { itemId: number; fileName: string; stagingKey: string; sizeBytes: number }[];
}

export interface CvBulkUploadStatusResponse {
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
  successes: CvBulkSuccessItem[];
  failures: CvBulkFailedItem[];
}

export interface CvBulkSuccessItem {
  itemId: number;
  fileName: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  outcome: string | null;
  reportLabel: string | null;
  candidateId: number | null;
  emailSent: boolean | null;
  whatsappSent: boolean | null;
  whatsappSkipReason: string | null;
}

export interface CvBulkFailedItem {
  itemId: number;
  fileName: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  reportLabel: string | null;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface CvBulkNotificationPayload {
  jobId: number;
  positionId: number;
  successCount?: number;
  failedCount?: number;
}
