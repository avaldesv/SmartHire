import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCancellationReason {
  id: number;
  cancellationTypeId: number;
  code: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateCancellationReasonRequest {
  cancellationTypeId: number;
  code: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateCancellationReasonRequest = CreateCancellationReasonRequest;
export type CancellationReasonListResponse = ApiPageResponse<CatalogCancellationReason>;
