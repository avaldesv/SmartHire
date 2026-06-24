import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogDisabilityType {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateDisabilityTypeRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateDisabilityTypeRequest = Omit<CreateDisabilityTypeRequest, 'scope'>;
export type DisabilityTypeListResponse = ApiPageResponse<CatalogDisabilityType>;
