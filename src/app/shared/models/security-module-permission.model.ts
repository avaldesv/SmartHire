import { ApiPageResponse } from './catalog-position.model';

export interface SecurityModulePermission {
  id: number;
  companyId?: number;
  authority: string;
  name: string;
  description?: string;
  module?: string;
  moduleName?: string;
  isActive: boolean;
}

export type SecurityModulePermissionListResponse = ApiPageResponse<SecurityModulePermission>;
