import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCompany {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCompanyRequest {
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCompanyRequest = CreateCompanyRequest;
export type CompanyListResponse = ApiPageResponse<CatalogCompany>;
