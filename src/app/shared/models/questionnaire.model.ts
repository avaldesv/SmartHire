import { ApiPageResponse } from './catalog-position.model';
import { Questionnaire } from './index';

export interface QuestionnaireFormApiItem {
  id: number;
  code: string | null;
  name: string;
  description: string | null;
  category: string | null;
  evaluationType: string;
  acceptancePercent: number;
  countryId: number | null;
  active: boolean;
  questionsCount: number;
}

export type QuestionnaireFormListResponse = ApiPageResponse<QuestionnaireFormApiItem>;

export interface QuestionnairePositionAssignmentApiItem {
  positionId: number;
  questionnaireFormId: number | null;
  evaluationType: string;
  acceptancePercent: number | null;
  questionnaireFormName: string | null;
  persisted: boolean;
}

export interface UpsertQuestionnairePositionAssignmentRequest {
  questionnaireFormId: number;
  evaluationType: string;
  acceptancePercent: number;
}

export function mapQuestionnaireFormToUi(item: QuestionnaireFormApiItem): Questionnaire {
  return {
    id: item.id,
    name: item.name,
    category: item.category ?? '—',
    questionsCount: item.questionsCount,
    acceptancePercent: item.acceptancePercent,
    type: mapEvaluationTypeToLabel(item.evaluationType),
    active: item.active,
  };
}

export function mapEvaluationTypeToLabel(evaluationType: string | null | undefined): string {
  const normalized = (evaluationType ?? '').trim().toUpperCase();
  if (normalized === 'WRITTEN' || normalized === 'ESCRITA') {
    return 'Escrita';
  }
  return evaluationType?.trim() || 'Escrita';
}

export function mapEvaluationTypeToApi(evaluationType: string | null | undefined): string {
  const normalized = (evaluationType ?? '').trim().toUpperCase();
  if (normalized === 'ESCRITA' || normalized === 'WRITTEN') {
    return 'WRITTEN';
  }
  return evaluationType?.trim() || 'WRITTEN';
}
