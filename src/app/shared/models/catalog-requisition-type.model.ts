import { ApiPageResponse } from './catalog-position.model';

export interface CatalogRequisitionType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateRequisitionTypeRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateRequisitionTypeRequest = CreateRequisitionTypeRequest;
export type RequisitionTypeListResponse = ApiPageResponse<CatalogRequisitionType>;
