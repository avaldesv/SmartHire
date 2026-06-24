import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCompany {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  tradeName?: string | null;
  taxId?: string | null;
  countryId?: number | null;
  street?: string | null;
  neighborhood?: string | null;
  municipality?: string | null;
  stateName?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  r3Interface?: boolean;
  wsSignature?: boolean;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCompanyRequest {
  code: string;
  name: string;
  description?: string;
  tradeName?: string;
  taxId?: string;
  countryId?: number | null;
  street?: string;
  neighborhood?: string;
  municipality?: string;
  stateName?: string;
  logoUrl?: string;
  bannerUrl?: string;
  r3Interface?: boolean;
  wsSignature?: boolean;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCompanyRequest = Omit<CreateCompanyRequest, 'scope'>;
export type CompanyListResponse = ApiPageResponse<CatalogCompany>;
