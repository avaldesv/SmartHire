import { ApiPageResponse } from './catalog-position.model';

export const SURVEY_ANSWER_TYPES = ['TEXT', 'NUMBER', 'DATE', 'IMAGE', 'FILE'] as const;

export type SurveyAnswerType = (typeof SURVEY_ANSWER_TYPES)[number];

export interface SurveyQuestionItem {
  id?: number;
  sortOrder: number;
  questionText: string;
  answerType: SurveyAnswerType | string;
  isRequired: boolean;
}

export interface SurveyListItem {
  id: number;
  name: string;
  descriptionText?: string | null;
  isActive: boolean;
  companyId?: number | null;
  questionCount?: number | null;
}

export interface SurveyDetail {
  id: number;
  name: string;
  descriptionText?: string | null;
  isActive: boolean;
  companyId?: number | null;
  questions: SurveyQuestionItem[];
}

export type SurveyListResponse = ApiPageResponse<SurveyListItem>;

export interface ListSurveysRequest {
  isActive?: boolean | null;
  search?: string | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface UpsertSurveyRequest {
  name: string;
  descriptionText?: string | null;
  isActive?: boolean | null;
  questions: Array<{
    sortOrder?: number | null;
    questionText: string;
    answerType: string;
    isRequired: boolean;
  }>;
}

export interface SendPositionSurveyRequest {
  candidateIds: number[];
}

export interface SendPositionSurveyErrorItem {
  candidateId: number;
  code: string;
  message: string;
  surveyId?: number | null;
  surveyName?: string | null;
  sessionId?: number | null;
}

export interface SendPositionSurveyResponse {
  sent: number;
  skipped: number;
  errors: SendPositionSurveyErrorItem[];
}

export interface SurveySessionListItem {
  id: number;
  companyId?: number | null;
  candidateId: number;
  candidateFirstName?: string | null;
  candidateLastName?: string | null;
  positionId?: number | null;
  positionName?: string | null;
  surveyId: number;
  surveyName?: string | null;
  candidatePhoneNumber?: string | null;
  totalQuestions?: number | null;
  totalQuestionsSend?: number | null;
  totalQuestionAnswers?: number | null;
  isSurveyCompleted?: boolean | null;
  isActive?: boolean | null;
  createAt?: string | null;
}

export interface SurveySessionAnswer {
  questionIndex?: number | null;
  questionId?: number | null;
  questionText: string;
  answerType?: string | null;
  isRequired?: boolean | null;
  answer?: string | null;
  /** Display alias for questionIndex when present. */
  sortOrder?: number | null;
}

export interface SurveySessionDetail extends SurveySessionListItem {
  updateAt?: string | null;
  answers: SurveySessionAnswer[];
}

export type SurveySessionListResponse = ApiPageResponse<SurveySessionListItem>;

export interface ListSurveySessionsRequest {
  surveyId?: number | null;
  isSurveyCompleted?: boolean | null;
  phone?: string | null;
  candidateId?: number | null;
  ordersBy?: string[];
  filters?: string[];
}

export interface SurveySessionsSummaryTotals {
  sessionsSent: number;
  sessionsCompleted: number;
  sessionsInProgress: number;
  completionRate: number;
}

export interface SurveySessionSurveySummaryItem {
  surveyId: number;
  surveyName?: string | null;
  sessionsSent: number;
  sessionsCompleted: number;
  sessionsInProgress: number;
  completionRate: number;
  lastSentAt?: string | null;
}

export interface SurveySessionsSummaryResponse {
  totals: SurveySessionsSummaryTotals;
  bySurvey: SurveySessionSurveySummaryItem[];
}
