import { ApiPageResponse } from './catalog-position.model';

export type QuestionnaireV2ListResponse<T> = ApiPageResponse<T>;

export interface KnowledgeCategoryItem {
  id: number;
  companyId: number | null;
  parentId: number | null;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface TagItem {
  id: number;
  companyId: number | null;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface QuestionOptionItem {
  id?: number;
  optionText: string;
  correct?: boolean;
  sortOrder?: number;
}

export interface QuestionItem {
  id: number;
  companyId: number | null;
  knowledgeCategoryId: number;
  text: string;
  type: string;
  status: string;
  difficulty?: number;
  locked?: boolean;
  isActive: boolean;
  options?: QuestionOptionItem[];
  tagIds?: number[];
}

export interface QuestionnaireItem {
  id: number;
  companyId: number | null;
  knowledgeCategoryId: number | null;
  name: string;
  description?: string | null;
  status: string;
  isActive: boolean;
}

export interface QuestionnaireQuestionLinkItem {
  questionId: number;
  text?: string | null;
  type?: string | null;
  knowledgeCategoryId?: number | null;
  sortOrder?: number | null;
  weightOverride?: number | null;
}

export interface ExamItem {
  id: number;
  companyId: number;
  questionnaireId: number;
  name: string;
  description?: string | null;
  numberOfQuestions: number;
  defaultWeight?: number | null;
  defaultTimeLimitSeconds?: number | null;
  generationConfig?: string | null;
  randomSeed?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  totalTimeMinutes?: number | null;
  acceptancePercent?: number | null;
  maxAttempts?: number | null;
  retryDelayDays?: number | null;
  status: string;
  isActive: boolean;
}

export type TenantDataScope = 'TENANT' | 'GLOBAL';
