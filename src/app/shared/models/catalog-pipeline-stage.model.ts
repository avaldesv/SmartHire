import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface CatalogPipelineStage {
  id: number;
  countryId: number | null;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  colorHex: string;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreatePipelineStageRequest {
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  colorHex?: string | null;
  isActive?: boolean;
  scope?: TenantDataScope;
}

export type UpdatePipelineStageRequest = Omit<CreatePipelineStageRequest, 'scope'>;

export interface ReorderPipelineStageItem {
  id: number;
  sortOrder: number;
}

export type PipelineStageListResponse = ApiPageResponse<CatalogPipelineStage>;
