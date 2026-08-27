import { ApiPageResponse } from './catalog-position.model';

export type DocumentTemplateFieldOrigin =
  | 'CANDIDATE'
  | 'POSITION'
  | 'RECRUITER'
  | 'APPLICATION'
  | 'COMPANY';

export type DocumentTemplateValueKind = 'COLUMN' | 'VIRTUAL';

export interface DocumentTemplateVariableItem {
  id: number;
  companyId: number | null;
  sourceKey: string | null;
  origin: DocumentTemplateFieldOrigin | null;
  code: string;
  label: string;
  description: string | null;
  isActive: boolean;
  inUse: boolean;
  usedInTemplateNames: string[];
}

export type DocumentTemplateVariableListResponse = ApiPageResponse<DocumentTemplateVariableItem>;

export interface CreateDocumentTemplateVariableRequest {
  sourceKey: string;
  label?: string | null;
  description?: string | null;
  isActive?: boolean | null;
}

export interface UpdateDocumentTemplateVariableRequest {
  label: string;
  description?: string | null;
  isActive: boolean;
}

export interface DocumentTemplateAvailableField {
  sourceKey: string;
  origin: DocumentTemplateFieldOrigin;
  suggestedCode: string;
  label: string;
  description: string | null;
  valueKind: DocumentTemplateValueKind;
}

export interface DocumentTemplateAvailableFieldsResponse {
  origins: { origin: DocumentTemplateFieldOrigin }[];
  fields: DocumentTemplateAvailableField[];
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
