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
  infoValidated?: boolean | null;
  studiesValidated?: boolean | null;
  documentsSaved?: boolean | null;
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

export interface ValidateCandidateApplicationFlagsResponse {
  id: number;
  candidateId: number;
  positionId: number;
  infoValidated: boolean;
  studiesValidated: boolean;
  documentsSaved: boolean;
}

export interface SendCandidateToSmartResponse {
  applicationId: number;
  candidateId: number;
  positionId: number;
  status: string;
  externalReference: string;
  message: string;
  processedAt: string;
}

export interface GenerateContractResponse {
  applicationId: number;
  candidateId: number;
  positionId: number;
  status: string;
  contractReference: string;
  message: string;
  processedAt: string;
}

export interface PatchCandidateApplicationRequest {
  compatibilityPercent?: number | null;
  interviewScheduled?: boolean | null;
}

export interface PatchCandidateApplicationResponse {
  id: number;
  candidateId: number;
  positionId: number;
  compatibilityPercent: number | null;
  interviewScheduled: boolean;
  interviewId: string | null;
}

export interface SendQuestionnaireInviteRequest {
  questionnaireId?: number | null;
}

export interface SendQuestionnaireInviteResponse {
  applicationId: number;
  candidateId: number;
  positionId: number;
  questionnaireId: number | null;
  status: string;
  invitationLink: string;
  candidateEmail: string | null;
  message: string;
  sentAt: string;
}
