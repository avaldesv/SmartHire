export interface ApplicationAuditLogItem {
  id: number;
  applicationId: number;
  action: string;
  actionType: string | null;
  message: string;
  performedBy: string | null;
  commitment: string | null;
  createdAt: string;
}

export interface ApplicationAuditLogListResponse {
  data: ApplicationAuditLogItem[];
  pagination: { total: number; page: number; size: number };
}

export interface CreateApplicationAuditLogRequest {
  message: string;
  action?: string | null;
  actionType?: string | null;
  commitment?: string | null;
}

export interface CreateApplicationAuditLogResponse {
  id: number;
  applicationId: number;
  action: string;
  actionType: string | null;
  message: string;
  performedBy: string | null;
  commitment: string | null;
  createdAt: string;
}
