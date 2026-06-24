import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogJobPortal {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateJobPortalRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateJobPortalRequest = Omit<CreateJobPortalRequest, 'scope'>;
export type JobPortalListResponse = ApiPageResponse<CatalogJobPortal>;
