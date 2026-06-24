import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogContractType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateContractTypeRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateContractTypeRequest = CreateContractTypeRequest;
export type ContractTypeListResponse = ApiPageResponse<CatalogContractType>;
