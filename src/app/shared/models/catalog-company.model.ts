import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCompany {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateCompanyRequest {
  code: string;
  name: string;
  isActive?: boolean;
}

export type UpdateCompanyRequest = CreateCompanyRequest;
export type CompanyListResponse = ApiPageResponse<CatalogCompany>;
