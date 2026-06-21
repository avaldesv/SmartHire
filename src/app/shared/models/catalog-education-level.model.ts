import { ApiPageResponse } from './catalog-position.model';

export interface CatalogEducationLevel {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  requiresCareer: boolean;
  isActive: boolean;
}

export interface CreateEducationLevelRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  requiresCareer?: boolean;
  isActive?: boolean;
}

export type UpdateEducationLevelRequest = CreateEducationLevelRequest;
export type EducationLevelListResponse = ApiPageResponse<CatalogEducationLevel>;
