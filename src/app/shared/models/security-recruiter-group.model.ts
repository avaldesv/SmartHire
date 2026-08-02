import { TenantDataScope } from './tenant-data-scope.model';
import { ApiPageResponse } from './catalog-position.model';

export interface RecruiterGroupUserSummary {
  id: number;
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface SecurityRecruiterGroup {
  id: number;
  countryId?: number | null;
  code: string;
  description: string;
  legacyManpowerId: number;
  coreAts?: string | null;
  coreAppian: string;
  isActive: boolean;
  companyId?: number | null;
  responsibleManager?: RecruiterGroupUserSummary | null;
  recruiters?: RecruiterGroupUserSummary[];
  recruitersCount?: number;
}

export interface CreateRecruiterGroupRequest {
  countryId?: number | null;
  code: string;
  description: string;
  legacyManpowerId: number;
  coreAts?: string;
  coreAppian: string;
  isActive?: boolean;
  scope?: TenantDataScope;
  responsibleManagerUserId: number;
  recruiterUserIds?: number[];
}

export type UpdateRecruiterGroupRequest = Omit<CreateRecruiterGroupRequest, 'scope'>;
export type RecruiterGroupListResponse = ApiPageResponse<SecurityRecruiterGroup>;
