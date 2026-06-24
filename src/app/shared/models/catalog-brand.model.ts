import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogBrand {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateBrandRequest {
  countryId: number;
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateBrandRequest = CreateBrandRequest;
export type BrandListResponse = ApiPageResponse<CatalogBrand>;
