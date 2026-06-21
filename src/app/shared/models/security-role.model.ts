import { ApiPageResponse } from './catalog-position.model';

export interface SecurityRole {
  id: number;
  companyId: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export type SecurityRoleListResponse = ApiPageResponse<SecurityRole>;
