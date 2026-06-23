import { ApiPageResponse } from './catalog-position.model';

export interface NotificationTemplateItem {
  id: number;
  action: string;
  channels: string[];
  templateId: string;
  message: string;
  active: boolean;
}

export type NotificationTemplateListResponse = ApiPageResponse<NotificationTemplateItem>;

export interface CreateNotificationTemplateRequest {
  action: string;
  channels: string[];
  templateId?: string;
  message: string;
  isActive: boolean;
}

export type UpdateNotificationTemplateRequest = CreateNotificationTemplateRequest;
