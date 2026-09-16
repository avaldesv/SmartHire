import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCareer {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCareerRequest {
  countryId?: number | null;
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCareerRequest = CreateCareerRequest;
export type CareerListResponse = ApiPageResponse<CatalogCareer>;
