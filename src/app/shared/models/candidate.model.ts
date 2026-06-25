import { ApiPageResponse } from './catalog-position.model';

export interface CandidateListItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string;
  state: string;
  city: string | null;
  source: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CandidateDetail {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  curp: string | null;
  rfc: string | null;
  nss: string | null;
  genderId: number | null;
  countryId: number | null;
  stateId: number | null;
  country: string;
  state: string;
  city: string | null;
  desiredSalary: number | null;
  source: string | null;
  experienceYears: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  curp?: string | null;
  rfc?: string | null;
  nss?: string | null;
  genderId?: number | null;
  countryId?: number | null;
  stateId?: number | null;
  city?: string | null;
  desiredSalary?: number | null;
  source?: string | null;
  experienceYears?: number | null;
}

export interface CreateCandidateResponse {
  id: number;
  companyId: number;
}

export type UpdateCandidateRequest = CreateCandidateRequest & { isActive: boolean };
export type UpdateCandidateResponse = CreateCandidateResponse;

export type CandidateListResponse = ApiPageResponse<CandidateListItem>;

export interface CandidateCvDownloadUrlResponse {
  candidateId: number;
  fileName: string;
  contentType: string;
  downloadUrl: string;
}
