import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogClient {
  id: number;
  countryId?: number | null;
  code: string;
  companyArea?: string | null;
  contactName?: string | null;
  contactPosition?: string | null;
  phone?: string | null;
  email?: string | null;
  tradeName?: string | null;
  legalName?: string | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateClientRequest {
  countryId?: number | null;
  code: string;
  companyArea?: string;
  contactName?: string;
  contactPosition?: string;
  phone?: string;
  email?: string;
  tradeName?: string;
  legalName?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateClientRequest = Omit<CreateClientRequest, 'scope'>;
export type ClientListResponse = ApiPageResponse<CatalogClient>;
