import { ApiPageResponse } from './catalog-position.model';

export interface DocumentTemplateVariableItem {
  id: number;
  companyId: number | null;
  code: string;
  label: string;
  description: string | null;
  isActive: boolean;
}

export type DocumentTemplateVariableListResponse = ApiPageResponse<DocumentTemplateVariableItem>;

export interface CreateDocumentTemplateVariableRequest {
  code: string;
  label: string;
  description?: string | null;
  isActive?: boolean | null;
}

export interface UpdateDocumentTemplateVariableRequest {
  label: string;
  description?: string | null;
  isActive: boolean;
}

export interface DocumentTemplateItem {
  id: number;
  companyId: number | null;
  name: string;
  storageUid: string;
  s3Key: string;
  fileName: string;
  contentType: string;
  usedVariableCodes: string[];
  isActive: boolean;
}

export type DocumentTemplateListResponse = ApiPageResponse<DocumentTemplateItem>;

export interface UpdateDocumentTemplateMetadataRequest {
  name?: string | null;
  isActive?: boolean | null;
}

export interface ValidateDocumentTemplateResponse {
  valid: string[];
  invalid: string[];
}

export interface DownloadDocumentTemplateResponse {
  downloadUrl: string;
}
