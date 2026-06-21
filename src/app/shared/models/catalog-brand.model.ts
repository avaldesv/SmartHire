import { ApiPageResponse } from './catalog-position.model';

export interface CatalogBrand {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateBrandRequest {
  countryId: number;
  code: string;
  name: string;
  isActive?: boolean;
}

export type UpdateBrandRequest = CreateBrandRequest;
export type BrandListResponse = ApiPageResponse<CatalogBrand>;
