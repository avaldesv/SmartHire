import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCareer {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateCareerRequest {
  countryId: number;
  code: string;
  name: string;
  isActive?: boolean;
}

export type UpdateCareerRequest = CreateCareerRequest;
export type CareerListResponse = ApiPageResponse<CatalogCareer>;
