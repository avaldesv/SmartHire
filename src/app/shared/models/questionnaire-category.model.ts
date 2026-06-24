import { ApiPageResponse } from './catalog-position.model';

export interface QuestionnaireCategory {
  id: number;
  countryId?: number | null;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  companyId?: number | null;
}

export interface CreateQuestionnaireCategoryRequest {
  countryId: number;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateQuestionnaireCategoryRequest = CreateQuestionnaireCategoryRequest;
export type QuestionnaireCategoryListResponse = ApiPageResponse<QuestionnaireCategory>;
