import { ApiPageResponse } from './catalog-position.model';

export interface SecurityUserRole {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface SecurityUser {
  id: number;
  username: string;
  email: string;
  name: string;
  lastName: string;
  phone?: string;
  photo?: string;
  companyId: number;
  isActive: boolean;
  roles: SecurityUserRole[];
}

export interface CreateSecurityUserRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone?: string;
  companyId: number;
  isActive?: boolean;
  roleIds?: number[];
}

export interface UpdateSecurityUserRequest {
  email: string;
  name: string;
  lastName: string;
  phone?: string;
  isActive?: boolean;
  roleIds?: number[];
}

export type SecurityUserListResponse = ApiPageResponse<SecurityUser>;
