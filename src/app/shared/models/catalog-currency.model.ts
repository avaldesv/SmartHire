import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCurrency {
  id: number;
  countryId: number;
  code: string;
  name: string;
  symbol?: string;
  denomination?: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateCurrencyRequest {
  countryId: number;
  code: string;
  name: string;
  symbol?: string;
  denomination?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCurrencyRequest = CreateCurrencyRequest;
export type CurrencyListResponse = ApiPageResponse<CatalogCurrency>;
