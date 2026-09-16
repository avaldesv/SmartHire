import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface DocumentTypeExtensionItem {
  id: number;
  code: string;
  name: string;
}

export interface DocumentTypeProcessingServiceItem {
  id: number;
  code: string;
  name: string;
  isDefault?: boolean;
}

export interface CatalogDocumentType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  documentType: string;
  validatesWithAi: boolean;
  allowedExtensionIds?: number[];
  allowedExtensions?: DocumentTypeExtensionItem[];
  processingServices?: DocumentTypeProcessingServiceItem[];
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateDocumentTypeRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  documentType: string;
  validatesWithAi?: boolean;
  allowedExtensionIds?: number[];
  processingServiceIds?: number[];
  defaultProcessingServiceId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateDocumentTypeRequest = CreateDocumentTypeRequest;
export type DocumentTypeListResponse = ApiPageResponse<CatalogDocumentType>;
