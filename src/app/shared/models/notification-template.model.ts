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
