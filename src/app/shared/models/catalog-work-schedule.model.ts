import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogWorkSchedule {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateWorkScheduleRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateWorkScheduleRequest = Omit<CreateWorkScheduleRequest, 'scope'>;
export type WorkScheduleListResponse = ApiPageResponse<CatalogWorkSchedule>;
