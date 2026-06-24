import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogBenefit {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateBenefitRequest {
  countryId: number;
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateBenefitRequest = CreateBenefitRequest;
export type BenefitListResponse = ApiPageResponse<CatalogBenefit>;
