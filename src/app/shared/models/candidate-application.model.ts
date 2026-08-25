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
  hiredDate?: string | null;
  candidateFirstName: string | null;
  candidateLastName: string | null;
  candidateEmail: string | null;
  candidatePhone: string | null;
  createdAt: string;
  interviewScheduled?: boolean | null;
  infoValidated?: boolean | null;
  studiesValidated?: boolean | null;
  documentsSaved?: boolean | null;
  questionnaireStatus?: string | null;
  questionnaireAutoScorePercent?: number | null;
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

/** POST /api/v1/candidate-applications/{id}/contact-questionnaire */
export interface ContactQuestionnaireResponse {
  inviteId: number;
  applicationId: number;
  questionnaireId: number;
  examId: number;
  attemptNo: number;
  status: string;
  expiresAt: string;
  urlConfirm: string;
  candidateEmail: string | null;
  message: string;
}

/** GET /api/v1/candidate-applications/{id}/questionnaire-evaluation */
export interface QuestionnaireEvaluationResponse {
  applicationId: number;
  inviteId: number;
  inviteStatus: string;
  evaluationStatus: string | null;
  attemptNo: number | null;
  answeredAt: string | null;
  autoScorePercent: number | null;
  autoPointsEarned: number | null;
  autoPointsMax: number | null;
  openPendingCount: number | null;
  candidate: { candidateId: number | null; name: string; email: string };
  position: { positionId: number | null; positionName: string };
  exam: { examId: number | null; name: string };
  answers: Array<{
    answerId: number;
    questionId: number;
    questionText: string;
    questionType: string;
    answerText: string;
    sortOrder: number | null;
    weightApplied: number | null;
    pointsEarned: number | null;
    correct: boolean | null;
    evaluationStatus: string | null;
  }>;
}

export interface UpdateCandidateApplicationRequest {
  status?: string | null;
  isSelected?: boolean | null;
  isInterested?: boolean | null;
  isHired?: boolean | null;
  hiredDate?: string | null;
  compatibilityPercent?: number | null;
}

export interface UpdateCandidateApplicationResponse {
  id: number;
  companyId: number;
  candidateId: number;
  positionId: number;
  status: string;
  isInterested: boolean | null;
  isSelected: boolean | null;
  isHired?: boolean | null;
  hiredDate?: string | null;
  compatibilityPercent: number | null;
  preselectionDate: string | null;
}
