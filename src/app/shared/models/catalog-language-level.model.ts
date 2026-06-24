import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogLanguageLevel {
  id: number;
  countryId: number;
  code: string;
  name: string;
  appliesToCareer: boolean;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateLanguageLevelRequest {
  countryId: number;
  code: string;
  name: string;
  appliesToCareer?: boolean;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateLanguageLevelRequest = CreateLanguageLevelRequest;
export type LanguageLevelListResponse = ApiPageResponse<CatalogLanguageLevel>;
