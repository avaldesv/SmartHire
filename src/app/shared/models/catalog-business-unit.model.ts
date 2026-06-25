import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogBusinessUnit {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateBusinessUnitRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateBusinessUnitRequest = Omit<CreateBusinessUnitRequest, 'scope'>;
export type BusinessUnitListResponse = ApiPageResponse<CatalogBusinessUnit>;
