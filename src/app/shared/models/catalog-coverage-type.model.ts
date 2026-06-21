import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCoverageType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateCoverageTypeRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateCoverageTypeRequest = CreateCoverageTypeRequest;
export type CoverageTypeListResponse = ApiPageResponse<CatalogCoverageType>;
