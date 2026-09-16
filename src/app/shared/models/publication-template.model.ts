import { ApiPageResponse } from './catalog-position.model';

export interface PublicationTemplateItem {
  id: number;
  companyId: number | null;
  brandId: number | null;
  locale: string;
  name: string;
  htmlBody: string;
  isDefault: boolean;
  isActive: boolean;
}

export type PublicationTemplateListResponse = ApiPageResponse<PublicationTemplateItem>;

export interface CreatePublicationTemplateRequest {
  brandId?: number;
  locale: string;
  name: string;
  htmlBody: string;
  isDefault?: boolean;
}

export interface UpdatePublicationTemplateRequest {
  brandId?: number;
  locale: string;
  name: string;
  htmlBody: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface PreviewPublicationTemplateRequest {
  templateId?: number;
  htmlBody?: string;
  positionId?: number;
  locale?: string;
  variables?: Record<string, string>;
}

export interface PreviewPublicationTemplateResponse {
  html: string;
}
