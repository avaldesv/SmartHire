import { ApiPageResponse } from './catalog-position.model';
import { TenantDataScope } from './tenant-data-scope.model';

export interface AiPromptItem {
  id: number;
  clave: string;
  promptText: string;
  description: string | null;
  isActive: boolean;
  companyId: number | null;
}

export type AiPromptListResponse = ApiPageResponse<AiPromptItem>;

export interface CreateAiPromptRequest {
  clave: string;
  promptText: string;
  description?: string;
  isActive: boolean;
  scope?: TenantDataScope;
}

export interface UpdateAiPromptRequest {
  promptText: string;
  description?: string;
  isActive: boolean;
}
