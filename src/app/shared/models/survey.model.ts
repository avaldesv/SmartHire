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
}

export interface SendPositionSurveyResponse {
  sent: number;
  skipped: number;
  errors: SendPositionSurveyErrorItem[];
}
