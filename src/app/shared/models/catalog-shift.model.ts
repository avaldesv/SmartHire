import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogShift {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateShiftRequest {
  countryId: number;
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateShiftRequest = CreateShiftRequest;
export type ShiftListResponse = ApiPageResponse<CatalogShift>;
