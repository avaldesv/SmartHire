import { ApiPageResponse } from './catalog-position.model';

export interface SecurityUserRole {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface SecurityUserProfile {
  countryId?: number | null;
  phoneCountryCode?: string | null;
  supervisorId?: number | null;
  supervisorLabel?: string | null;
  branchId?: number | null;
  companyAreaId?: number | null;
  companyDepartmentId?: number | null;
  address?: string | null;
  legacyR3Username?: string | null;
  legacyAppianProfile?: string | null;
  manpowerPosition?: string | null;
  clientCompanyIds?: number[];
}

export interface SecurityUser extends SecurityUserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  lastName: string;
  phone?: string;
  photo?: string;
  companyId: number;
  isActive: boolean;
  globalAdmin?: boolean;
  roles: SecurityUserRole[];
}

export interface CreateSecurityUserRequest extends SecurityUserProfile {
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

export interface UpdateSecurityUserRequest extends SecurityUserProfile {
  email: string;
  name: string;
  lastName: string;
  phone?: string;
  isActive?: boolean;
  roleIds?: number[];
}

export type SecurityUserListResponse = ApiPageResponse<SecurityUser>;

export interface SupervisorOption {
  id: number;
  label: string;
}
