import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateQuestionnaireQuestionRequest,
  QuestionnaireQuestion,
  QuestionnaireQuestionListResponse,
  UpdateQuestionnaireQuestionRequest,
} from '../../shared/models/questionnaire-question.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class QuestionnaireQuestionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    countryId: number,
    page = 0,
    size = 20,
  ): Observable<{ items: QuestionnaireQuestion[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['questionText:asc'] as string[] };
    return this.http
      .post<QuestionnaireQuestionListResponse>(
        this.api.apiUrl('/api/v1/questionnaire-questions/list'),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateQuestionnaireQuestionRequest): Observable<QuestionnaireQuestion> {
    return this.http.post<QuestionnaireQuestion>(
      this.api.apiUrl('/api/v1/questionnaire-questions'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  update(id: number, request: UpdateQuestionnaireQuestionRequest): Observable<QuestionnaireQuestion> {
    return this.http.put<QuestionnaireQuestion>(
      this.api.apiUrl(`/api/v1/questionnaire-questions/${id}`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/questionnaire-questions/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
