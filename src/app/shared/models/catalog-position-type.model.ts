import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogPositionType {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreatePositionTypeRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdatePositionTypeRequest = Omit<CreatePositionTypeRequest, 'scope'>;
export type PositionTypeListResponse = ApiPageResponse<CatalogPositionType>;
