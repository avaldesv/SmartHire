import { ApiPageResponse } from './catalog-position.model';

export interface SecurityModulePermission {
  id: number;
  companyId: number;
  authority: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export type SecurityModulePermissionListResponse = ApiPageResponse<SecurityModulePermission>;
