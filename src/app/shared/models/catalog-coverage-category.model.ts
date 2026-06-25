import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCoverageCategory {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCoverageCategoryRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCoverageCategoryRequest = Omit<CreateCoverageCategoryRequest, 'scope'>;
export type CoverageCategoryListResponse = ApiPageResponse<CatalogCoverageCategory>;
