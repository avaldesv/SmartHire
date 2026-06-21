import { ApiPageResponse } from './catalog-position.model';

export interface CatalogShift {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateShiftRequest {
  countryId: number;
  code: string;
  name: string;
  isActive?: boolean;
}

export type UpdateShiftRequest = CreateShiftRequest;
export type ShiftListResponse = ApiPageResponse<CatalogShift>;
