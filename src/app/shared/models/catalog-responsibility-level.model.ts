import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogResponsibilityLevel {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  legacyManpowerId?: number | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateResponsibilityLevelRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  legacyManpowerId?: number | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateResponsibilityLevelRequest = Omit<CreateResponsibilityLevelRequest, 'scope'>;
export type ResponsibilityLevelListResponse = ApiPageResponse<CatalogResponsibilityLevel>;
