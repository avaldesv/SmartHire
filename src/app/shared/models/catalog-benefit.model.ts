import { ApiPageResponse } from './catalog-position.model';

export interface CatalogBenefit {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateBenefitRequest {
  countryId: number;
  code: string;
  name: string;
  isActive?: boolean;
}

export type UpdateBenefitRequest = CreateBenefitRequest;
export type BenefitListResponse = ApiPageResponse<CatalogBenefit>;
