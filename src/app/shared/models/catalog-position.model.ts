export interface CatalogListRequest {
  isActive?: boolean;
  filters?: string[];
  ordersBy?: string[];
  countryId?: number;
}

export interface ApiPageResponse<T> {
  data: T[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface CatalogBrand {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CatalogCoverageType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CatalogShift {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CatalogBenefit {
  id: number;
  countryId: number;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CatalogLanguage {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}
