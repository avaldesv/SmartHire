import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogEducationLevel {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  requiresCareer: boolean;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateEducationLevelRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  requiresCareer?: boolean;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateEducationLevelRequest = CreateEducationLevelRequest;
export type EducationLevelListResponse = ApiPageResponse<CatalogEducationLevel>;
