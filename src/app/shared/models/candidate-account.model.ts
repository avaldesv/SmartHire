import { ApiPageResponse } from './catalog-position.model';

export interface CandidateAccountItem {
  id: number;
  companyId: number;
  candidateId: number;
  email: string;
  candidateFirstName?: string | null;
  candidateLastName?: string | null;
  mustChangePassword: boolean;
  registerStatusId: number;
  lastLoginAt?: string | null;
  isActive: boolean;
  createAt?: string | null;
  updateAt?: string | null;
}

export type CandidateAccountListResponse = ApiPageResponse<CandidateAccountItem>;

export interface ListCandidateAccountsRequest {
  email?: string | null;
  isActive?: boolean | null;
  registerStatusId?: number | null;
  ordersBy?: string[];
}

export interface CreateCandidateAccountRequest {
  email: string;
  sendRegisterEmail?: boolean;
}

export interface UpdateCandidateAccountRequest {
  email?: string;
  mustChangePassword?: boolean;
  registerStatusId?: number;
}

export interface UpdateCandidateAccountActiveRequest {
  isActive: boolean;
}

export interface HardDeleteCandidateAccountRequest {
  confirmEmail: string;
}
