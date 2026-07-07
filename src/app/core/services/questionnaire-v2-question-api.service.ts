import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  QuestionItem,
  QuestionOptionItem,
  QuestionnaireV2ListResponse,
  TenantDataScope,
} from '../../shared/models/questionnaire-v2.model';
import { ApiClientService } from './api-client.service';

export interface QuestionListRequest {
  knowledgeCategoryId?: number | null;
  type?: string | null;
  status?: string | null;
  text?: string | null;
  isActive?: boolean | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface UpsertQuestionRequest {
  knowledgeCategoryId: number;
  text: string;
  type: string;
  explanation?: string | null;
  correctAnswerText?: string | null;
  difficulty?: number | null;
  status?: string | null;
  isActive: boolean;
  scope?: TenantDataScope;
  options?: QuestionOptionItem[];
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireV2QuestionApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(request: QuestionListRequest = {}, page = 0, size = 20): Observable<{ items: QuestionItem[]; total: number }> {
    const body = {
      knowledgeCategoryId: request.knowledgeCategoryId ?? null,
      type: request.type ?? null,
      status: request.status ?? null,
      text: request.text ?? null,
      isActive: request.isActive ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? [],
    };
    return this.http
      .post<QuestionnaireV2ListResponse<QuestionItem>>(this.api.apiUrl('/api/v1/questionnaire-questions/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: UpsertQuestionRequest): Observable<QuestionItem> {
    return this.http.post<QuestionItem>(this.api.apiUrl('/api/v1/questionnaire-questions'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: Omit<UpsertQuestionRequest, 'scope'>): Observable<QuestionItem> {
    return this.http.put<QuestionItem>(this.api.apiUrl(`/api/v1/questionnaire-questions/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/questionnaire-questions/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  replaceTags(id: number, tagIds: number[]): Observable<{ questionId: number; tagIds: number[] }> {
    return this.http.put<{ questionId: number; tagIds: number[] }>(
      this.api.apiUrl(`/api/v1/questionnaire-questions/${id}/tags`),
      { tagIds },
      { headers: this.api.buildHeaders() },
    );
  }
}
