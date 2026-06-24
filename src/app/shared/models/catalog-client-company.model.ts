import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogClientCompany {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  tradeName?: string;
  taxId?: string;
  r3Interface: boolean;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateClientCompanyRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  tradeName?: string;
  taxId?: string;
  r3Interface?: boolean;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateClientCompanyRequest = CreateClientCompanyRequest;
export type ClientCompanyListResponse = ApiPageResponse<CatalogClientCompany>;
