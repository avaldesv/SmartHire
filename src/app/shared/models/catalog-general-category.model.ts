import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogGeneralCategory {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateGeneralCategoryRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateGeneralCategoryRequest = Omit<CreateGeneralCategoryRequest, 'scope'>;
export type GeneralCategoryListResponse = ApiPageResponse<CatalogGeneralCategory>;
