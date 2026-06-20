import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCurrency {
  id: number;
  countryId: number;
  code: string;
  name: string;
  symbol?: string;
  denomination?: string;
  isActive: boolean;
}

export interface CreateCurrencyRequest {
  countryId: number;
  code: string;
  name: string;
  symbol?: string;
  denomination?: string;
  isActive?: boolean;
}

export type UpdateCurrencyRequest = CreateCurrencyRequest;
export type CurrencyListResponse = ApiPageResponse<CatalogCurrency>;
