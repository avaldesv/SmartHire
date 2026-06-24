import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCompanyDepartment {
  id: number;
  catalogCompanyId?: number | null;
  countryId?: number | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCompanyDepartmentRequest {
  catalogCompanyId: number;
  countryId?: number | null;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCompanyDepartmentRequest = Omit<CreateCompanyDepartmentRequest, 'scope'>;
export type CompanyDepartmentListResponse = ApiPageResponse<CatalogCompanyDepartment>;
