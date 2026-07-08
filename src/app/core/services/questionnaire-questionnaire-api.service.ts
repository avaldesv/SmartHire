import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  QuestionnaireItem,
  QuestionnaireQuestionLinkItem,
  QuestionnaireV2ListResponse,
  TenantDataScope,
} from '../../shared/models/questionnaire-v2.model';
import { ApiClientService } from './api-client.service';

export interface QuestionnaireListRequest {
  knowledgeCategoryId?: number | null;
  status?: string | null;
  name?: string | null;
  isActive?: boolean | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface UpsertQuestionnaireRequest {
  knowledgeCategoryId?: number | null;
  name: string;
  description?: string | null;
  status?: string | null;
  isActive: boolean;
  scope?: TenantDataScope;
}

export interface ReplaceQuestionnaireQuestionsRequest {
  questions: Array<{
    questionId: number;
    sortOrder?: number | null;
    weightOverride?: number | null;
  }>;
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireQuestionnaireApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    request: QuestionnaireListRequest = {},
    page = 0,
    size = 20,
  ): Observable<{ items: QuestionnaireItem[]; total: number }> {
    const body = {
      knowledgeCategoryId: request.knowledgeCategoryId ?? null,
      status: request.status ?? null,
      name: request.name ?? null,
      isActive: request.isActive ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? ['name:asc'],
    };
    return this.http
      .post<QuestionnaireV2ListResponse<QuestionnaireItem>>(
        this.api.apiUrl('/api/v1/questionnaire-questionnaires/list'),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: UpsertQuestionnaireRequest): Observable<QuestionnaireItem> {
    return this.http.post<QuestionnaireItem>(this.api.apiUrl('/api/v1/questionnaire-questionnaires'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: Omit<UpsertQuestionnaireRequest, 'scope'>): Observable<QuestionnaireItem> {
    return this.http.put<QuestionnaireItem>(this.api.apiUrl(`/api/v1/questionnaire-questionnaires/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/questionnaire-questionnaires/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  listQuestions(id: number): Observable<QuestionnaireQuestionLinkItem[]> {
    return this.http.get<QuestionnaireQuestionLinkItem[]>(
      this.api.apiUrl(`/api/v1/questionnaire-questionnaires/${id}/questions`),
      { headers: this.api.buildHeaders() },
    );
  }

  replaceQuestions(
    id: number,
    request: ReplaceQuestionnaireQuestionsRequest,
  ): Observable<{ questionnaireId: number; questions: QuestionnaireQuestionLinkItem[] }> {
    return this.http.put<{ questionnaireId: number; questions: QuestionnaireQuestionLinkItem[] }>(
      this.api.apiUrl(`/api/v1/questionnaire-questionnaires/${id}/questions`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  publish(id: number): Observable<QuestionnaireItem> {
    return this.http.put<QuestionnaireItem>(this.api.apiUrl(`/api/v1/questionnaire-questionnaires/${id}/publish`), null, {
      headers: this.api.buildHeaders(),
    });
  }

  archive(id: number): Observable<QuestionnaireItem> {
    return this.http.put<QuestionnaireItem>(this.api.apiUrl(`/api/v1/questionnaire-questionnaires/${id}/archive`), null, {
      headers: this.api.buildHeaders(),
    });
  }

  duplicate(id: number): Observable<QuestionnaireItem> {
    return this.http.post<QuestionnaireItem>(this.api.apiUrl(`/api/v1/questionnaire-questionnaires/${id}/duplicate`), null, {
      headers: this.api.buildHeaders(),
    });
  }
}
