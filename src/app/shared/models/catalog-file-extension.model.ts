import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogFileExtension {
  id: number;
  countryId: number | null;
  code: string;
  name: string;
  mimeType?: string;
  description?: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateFileExtensionRequest {
  countryId?: number | null;
  code: string;
  name: string;
  mimeType?: string;
  description?: string;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdateFileExtensionRequest = CreateFileExtensionRequest;
export type FileExtensionListResponse = ApiPageResponse<CatalogFileExtension>;
