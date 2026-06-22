import { ApiPageResponse } from './catalog-position.model';

export interface CandidateApplicationListItem {
  id: number;
  candidateId: number;
  positionId: number;
  status: string;
  source: string | null;
  compatibilityPercent: number | null;
  isInterested: boolean | null;
  isSelected: boolean | null;
  isHired: boolean | null;
  candidateFirstName: string | null;
  candidateLastName: string | null;
  candidateEmail: string | null;
  candidatePhone: string | null;
  createdAt: string;
  interviewScheduled?: boolean | null;
}

export interface ListCandidateApplicationsRequest {
  positionId?: number | null;
  candidateId?: number | null;
  status?: string | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface CreateCandidateApplicationRequest {
  candidateId: number;
  positionId: number;
  source?: string | null;
  status?: string | null;
  compatibilityPercent?: number | null;
}

export interface CreateCandidateApplicationResponse {
  id: number;
  companyId: number;
  candidateId: number;
  positionId: number;
  status: string;
}

export type CandidateApplicationListResponse = ApiPageResponse<CandidateApplicationListItem>;

export interface BulkCandidateApplicationsRequest {
  positionId: number;
  applicationIds: number[];
}

export interface ReleaseAllCandidateApplicationsRequest {
  positionId: number;
}

export interface BulkCandidateApplicationsResponse {
  positionId: number;
  updatedCount: number;
}
