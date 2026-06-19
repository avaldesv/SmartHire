export interface CatalogListRequest {
  isActive?: boolean;
  filters?: string[];
  ordersBy?: string[];
  countryId?: number;
  stateId?: number;
  postalCode?: string;
  municipalityId?: number;
}

export interface ApiPageResponse<T> {
  data: T[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface CatalogCountry {
  id: number;
  code: string;
  secondaryCode?: string;
  name: string;
  isActive: boolean;
}

export interface CatalogState {
  id: number;
  countryId: number;
  code: string;
  name: string;
  shortDescription?: string;
  isActive: boolean;
}

export interface CatalogMunicipality {
  id: number;
  stateId: number;
  legacyDelMunId: number;
  code?: string;
  name: string;
  isActive: boolean;
}

export interface CatalogNeighborhood {
  id: number;
  municipalityId: number;
  name: string;
  postalCode: string;
  isActive: boolean;
}

export interface CatalogOption {
  id: number;
  label: string;
}
