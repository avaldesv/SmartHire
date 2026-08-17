import { ApiPageResponse } from './catalog-position.model';

export interface CatalogPositionStatus {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  type: string;
  sortOrder: number;
  colorHex?: string | null;
  isActive: boolean;
}

export interface CreatePositionStatusRequest {
  code: string;
  name: string;
  description?: string | null;
  type: string;
  sortOrder?: number;
  colorHex?: string | null;
  isActive?: boolean;
}

export type UpdatePositionStatusRequest = CreatePositionStatusRequest;
export type PositionStatusListResponse = ApiPageResponse<CatalogPositionStatus>;
