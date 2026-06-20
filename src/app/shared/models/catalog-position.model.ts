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

export interface CatalogLanguageLevel {
  id: number;
  countryId: number;
  code: string;
  name: string;
  appliesToCareer?: boolean;
  isActive: boolean;
}

export interface CatalogDocumentType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  documentType?: string;
  validatesWithAi?: boolean;
  isActive: boolean;
}

export interface CatalogEducationLevel {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  requiresCareer?: boolean;
  isActive: boolean;
}

export interface CatalogContractType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CatalogRequisitionType {
  id: number;
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}
