import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogRequisitionType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateRequisitionTypeRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateRequisitionTypeRequest = CreateRequisitionTypeRequest;
export type RequisitionTypeListResponse = ApiPageResponse<CatalogRequisitionType>;
