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
}

export type UpdateClientCompanyRequest = CreateClientCompanyRequest;
export type ClientCompanyListResponse = ApiPageResponse<CatalogClientCompany>;
