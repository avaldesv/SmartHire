export interface QuestionnaireQuestion {
  id: number;
  categoryId: number;
  categoryName?: string | null;
  questionType?: string | null;
  questionText: string;
  description?: string | null;
  active: boolean;
}

export interface QuestionnaireQuestionListResponse {
  data: QuestionnaireQuestion[];
  pagination?: { page: number; pageSize: number; total: number };
}

export interface CreateQuestionnaireQuestionRequest {
  categoryId: number;
  questionType?: string | null;
  questionText: string;
  description?: string | null;
  isActive: boolean;
}

export type UpdateQuestionnaireQuestionRequest = CreateQuestionnaireQuestionRequest;
