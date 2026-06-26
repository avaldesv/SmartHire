import { ApiPageResponse } from './catalog-position.model';

export interface CatalogCompany {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  tradeName?: string | null;
  taxId?: string | null;
  countryId: number;
  billingMessage?: string | null;
  atsCode?: number | null;
  noPurchaseOrder?: boolean;
  legacyId?: number | null;
  street?: string | null;
  neighborhood?: string | null;
  municipality?: string | null;
  stateName?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  r3Interface?: boolean;
  wsSignature?: boolean;
  isActive: boolean;
}

export interface CreateCompanyRequest {
  code: string;
  name: string;
  description?: string;
  tradeName?: string;
  taxId?: string;
  countryId: number;
  billingMessage?: string;
  atsCode?: number | null;
  noPurchaseOrder?: boolean;
  street?: string;
  neighborhood?: string;
  municipality?: string;
  stateName?: string;
  logoUrl?: string;
  bannerUrl?: string;
  r3Interface?: boolean;
  wsSignature?: boolean;
  isActive?: boolean;
}

export type UpdateCompanyRequest = CreateCompanyRequest;
export type CompanyListResponse = ApiPageResponse<CatalogCompany>;
