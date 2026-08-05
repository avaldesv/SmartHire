import { ApiPageResponse } from './catalog-position.model';

export interface NotificationTemplateItem {
  id: number;
  action: string;
  channels: string[];
  templateId: string;
  message: string;
  emailSubject?: string;
  inboxTitle?: string;
  active: boolean;
}

export type NotificationTemplateListResponse = ApiPageResponse<NotificationTemplateItem>;

export interface CreateNotificationTemplateRequest {
  action: string;
  channels: string[];
  templateId?: string;
  message: string;
  emailSubject?: string;
  inboxTitle?: string;
  isActive: boolean;
}

export type UpdateNotificationTemplateRequest = CreateNotificationTemplateRequest;

export interface NotificationActionItem {
  id: number;
  code: string;
  module: string;
  description: string;
  variablesSchema: string[];
  defaultChannels: string[];
  active: boolean;
}

export type NotificationActionListResponse = ApiPageResponse<NotificationActionItem>;

export interface PreviewNotificationTemplateRequest {
  action: string;
  message?: string;
  emailSubject?: string;
  inboxTitle?: string;
  templateId?: string;
  samplePayload?: Record<string, unknown>;
}

export interface PreviewNotificationTemplateResponse {
  emailSubject: string;
  inboxTitle: string;
  body: string;
  externalTemplateId?: string;
  usedFallback: boolean;
}

export interface NotificationLogItem {
  id: number;
  outboxId?: number;
  action: string;
  channel: string;
  recipient: string;
  status: string;
  externalMessageId?: string;
  errorMessage?: string;
  renderedPreview?: string;
  createAt?: string;
}

export type NotificationLogListResponse = ApiPageResponse<NotificationLogItem>;

export interface ListNotificationLogsRequest {
  action?: string;
  channel?: string;
  filters?: string[];
  ordersBy?: string[];
}

export interface NotificationCoverageItem {
  actionCode: string;
  module: string;
  description: string;
  actionActive: boolean;
  hasActiveTemplate: boolean;
  templateId?: number | null;
  templateChannels: string[];
}

export interface NotificationCoverageResponse {
  totalActions: number;
  coveredActions: number;
  missingActions: number;
  items: NotificationCoverageItem[];
  pagination?: { page: number; pageSize: number; total: number };
}

export interface ListNotificationCoverageRequest {
  module?: string | null;
  actionCode?: string | null;
  hasActiveTemplate?: boolean | null;
  ordersBy?: string[];
}

export interface ListNotificationTemplatesRequest {
  action?: string | null;
  isActive?: boolean | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface NotificationOutboxItem {
  id: number;
  actionCode: string;
  status: string;
  attempts?: number;
  nextRetryAt?: string;
  lastError?: string;
  createAt?: string;
  processedAt?: string;
}

export type NotificationOutboxListResponse = ApiPageResponse<NotificationOutboxItem>;

export interface ListNotificationOutboxRequest {
  status?: string;
  actionCode?: string | null;
}

export interface RetryNotificationOutboxResponse {
  id: number;
  status: string;
  attempts?: number;
  nextRetryAt?: string;
}
