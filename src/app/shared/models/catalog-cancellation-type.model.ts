import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCancellationType {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateCancellationTypeRequest {
  code: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateCancellationTypeRequest = CreateCancellationTypeRequest;
export type CancellationTypeListResponse = ApiPageResponse<CatalogCancellationType>;
