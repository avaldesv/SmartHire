export interface ApplicationNotificationItem {
  id: number;
  applicationId: number | null;
  actionCode: string;
  channel: string;
  recipient: string;
  status: string;
  errorMessage: string | null;
  renderedPreview: string | null;
  createAt: string | null;
}

export interface ApplicationNotificationListResponse {
  data?: ApplicationNotificationItem[];
  pagination?: { page?: number; size?: number; total?: number };
}
