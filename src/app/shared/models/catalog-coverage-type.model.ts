import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCoverageType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCoverageTypeRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCoverageTypeRequest = CreateCoverageTypeRequest;
export type CoverageTypeListResponse = ApiPageResponse<CatalogCoverageType>;
