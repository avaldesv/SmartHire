import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogKinship {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateKinshipRequest {
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateKinshipRequest = CreateKinshipRequest;
export type KinshipListResponse = ApiPageResponse<CatalogKinship>;
