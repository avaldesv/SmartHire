import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogWorkplace {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateWorkplaceRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateWorkplaceRequest = Omit<CreateWorkplaceRequest, 'scope'>;
export type WorkplaceListResponse = ApiPageResponse<CatalogWorkplace>;
