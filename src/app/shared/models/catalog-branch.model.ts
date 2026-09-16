import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogBranch {
  id: number;
  catalogCompanyId?: number | null;
  countryId?: number | null;
  code?: string | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateBranchRequest {
  catalogCompanyId?: number | null;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateBranchRequest = Omit<CreateBranchRequest, 'scope'>;
export type BranchListResponse = ApiPageResponse<CatalogBranch>;
