import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCompanyArea {
  id: number;
  catalogCompanyId?: number | null;
  countryId?: number | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCompanyAreaRequest {
  catalogCompanyId: number;
  countryId?: number | null;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCompanyAreaRequest = Omit<CreateCompanyAreaRequest, 'scope'>;
export type CompanyAreaListResponse = ApiPageResponse<CatalogCompanyArea>;
