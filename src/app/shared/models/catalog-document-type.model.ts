import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogDocumentType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  documentType: string;
  validatesWithAi: boolean;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateDocumentTypeRequest {
  countryId?: number | null;
  code: string;
  name: string;
  documentType: string;
  validatesWithAi?: boolean;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateDocumentTypeRequest = CreateDocumentTypeRequest;
export type DocumentTypeListResponse = ApiPageResponse<CatalogDocumentType>;
