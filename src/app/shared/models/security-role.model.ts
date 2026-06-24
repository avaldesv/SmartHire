import { ApiPageResponse } from './catalog-position.model';
import { SecurityModulePermission } from './security-module-permission.model';
import { TenantDataScope } from './tenant-data-scope.model';

export interface SecurityRolePermission {
  id: number;
  roleId: number;
  modulePermission?: SecurityModulePermission;
}

export interface SecurityRole {
  id: number;
  companyId: number | null;
  name: string;
  description?: string;
  isActive: boolean;
  permissions?: SecurityRolePermission[];
}

export interface CreateSecurityRoleRequest {
  name: string;
  description?: string;
  isActive: boolean;
  scope?: TenantDataScope;
  modulePermissionIds?: number[];
}

export interface UpdateSecurityRoleRequest {
  name: string;
  description?: string;
  isActive: boolean;
  modulePermissionIds?: number[];
}

export type SecurityRoleListResponse = ApiPageResponse<SecurityRole>;
