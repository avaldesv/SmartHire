import { ApiPageResponse } from './catalog-position.model';

export interface CatalogLanguage {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateLanguageRequest {
  code: string;
  name: string;
  isActive?: boolean;
}

export type UpdateLanguageRequest = CreateLanguageRequest;
export type LanguageListResponse = ApiPageResponse<CatalogLanguage>;
