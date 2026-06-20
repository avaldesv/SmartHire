import { ApiPageResponse } from './catalog-position.model';

export interface CatalogGender {
  id: number;
  countryId: number;
  code: string;
  name: string;
  value?: string;
  isActive: boolean;
}

export interface CreateGenderRequest {
  countryId: number;
  code: string;
  name: string;
  value?: string;
  isActive?: boolean;
}

export type UpdateGenderRequest = CreateGenderRequest;

export type GenderListResponse = ApiPageResponse<CatalogGender>;
