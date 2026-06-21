import { ApiPageResponse } from './catalog-position.model';

export interface CatalogContractType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateContractTypeRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateContractTypeRequest = CreateContractTypeRequest;
export type ContractTypeListResponse = ApiPageResponse<CatalogContractType>;
