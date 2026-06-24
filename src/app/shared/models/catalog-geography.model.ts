import { TenantDataScope } from './tenant-data-scope.model';

export interface CatalogListRequest {
  isActive?: boolean | null;
  filters?: string[];
  ordersBy?: string[];
  countryId?: number;
  stateId?: number;
  postalCode?: string;
  municipalityId?: number;
  companyId?: number | null;
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
  companyId?: number | null;
}

export interface CreateCountryRequest {
  code: string;
  secondaryCode?: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateCountryRequest = CreateCountryRequest;

export interface CatalogState {
  id: number;
  countryId: number;
  code: string;
  name: string;
  shortDescription?: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateStateRequest {
  countryId: number;
  code: string;
  name: string;
  shortDescription?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateStateRequest = CreateStateRequest;

export interface CreateMunicipalityRequest {
  stateId: number;
  code: string;
  name: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateMunicipalityRequest = CreateMunicipalityRequest;

export interface CreateNeighborhoodRequest {
  municipalityId: number;
  name: string;
  postalCode: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateNeighborhoodRequest = CreateNeighborhoodRequest;

export interface CatalogMunicipality {
  id: number;
  stateId: number;
  legacyDelMunId: number;
  code?: string;
  name: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CatalogNeighborhood {
  id: number;
  municipalityId: number;
  name: string;
  postalCode: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CatalogOption {
  id: number;
  label: string;
}
