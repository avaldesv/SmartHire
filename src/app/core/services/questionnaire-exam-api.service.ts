import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ExamItem, QuestionnaireV2ListResponse } from '../../shared/models/questionnaire-v2.model';
import { ApiClientService } from './api-client.service';

export interface ExamListRequest {
  questionnaireId?: number | null;
  status?: string | null;
  name?: string | null;
  isActive?: boolean | null;
  filters?: string[];
  ordersBy?: string[];
}

export interface UpsertExamRequest {
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
  status?: string | null;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class QuestionnaireExamApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(request: ExamListRequest = {}, page = 0, size = 20): Observable<{ items: ExamItem[]; total: number }> {
    const body = {
      questionnaireId: request.questionnaireId ?? null,
      status: request.status ?? null,
      name: request.name ?? null,
      isActive: request.isActive ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? ['name:asc'],
    };
    return this.http
      .post<QuestionnaireV2ListResponse<ExamItem>>(this.api.apiUrl('/api/v1/questionnaire-exams/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  getById(id: number): Observable<ExamItem> {
    return this.http.get<ExamItem>(this.api.apiUrl(`/api/v1/questionnaire-exams/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: UpsertExamRequest): Observable<ExamItem> {
    return this.http.post<ExamItem>(this.api.apiUrl('/api/v1/questionnaire-exams'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpsertExamRequest): Observable<ExamItem> {
    return this.http.put<ExamItem>(this.api.apiUrl(`/api/v1/questionnaire-exams/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/questionnaire-exams/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
