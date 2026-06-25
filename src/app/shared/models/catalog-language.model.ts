import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogLanguage {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateLanguageRequest {
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateLanguageRequest = CreateLanguageRequest;
export type LanguageListResponse = ApiPageResponse<CatalogLanguage>;
