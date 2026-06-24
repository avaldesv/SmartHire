import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogGender {
  id: number;
  countryId: number;
  code: string;
  name: string;
  value?: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateGenderRequest {
  countryId: number;
  code: string;
  name: string;
  value?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateGenderRequest = CreateGenderRequest;

export type GenderListResponse = ApiPageResponse<CatalogGender>;
