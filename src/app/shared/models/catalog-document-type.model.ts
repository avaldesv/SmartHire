import { ApiPageResponse } from './catalog-position.model';

export interface CatalogDocumentType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  documentType: string;
  validatesWithAi: boolean;
  isActive: boolean;
}

export interface CreateDocumentTypeRequest {
  countryId: number;
  code: string;
  name: string;
  documentType: string;
  validatesWithAi?: boolean;
  isActive?: boolean;
}

export type UpdateDocumentTypeRequest = CreateDocumentTypeRequest;
export type DocumentTypeListResponse = ApiPageResponse<CatalogDocumentType>;
