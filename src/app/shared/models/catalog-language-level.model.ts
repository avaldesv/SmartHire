import { ApiPageResponse } from './catalog-position.model';

export interface CatalogLanguageLevel {
  id: number;
  countryId: number;
  code: string;
  name: string;
  appliesToCareer: boolean;
  isActive: boolean;
}

export interface CreateLanguageLevelRequest {
  countryId: number;
  code: string;
  name: string;
  appliesToCareer?: boolean;
  isActive?: boolean;
}

export type UpdateLanguageLevelRequest = CreateLanguageLevelRequest;
export type LanguageLevelListResponse = ApiPageResponse<CatalogLanguageLevel>;
