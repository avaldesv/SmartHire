import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CreateQuestionnaireCategoryRequest,
  QuestionnaireCategory,
  QuestionnaireCategoryListResponse,
  UpdateQuestionnaireCategoryRequest,
} from '../../shared/models/questionnaire-category.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class QuestionnaireCategoryService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: QuestionnaireCategory[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<QuestionnaireCategoryListResponse>(
        this.api.apiUrl('/api/v1/questionnaire-categories/list'),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateQuestionnaireCategoryRequest): Observable<QuestionnaireCategory> {
    return this.http.post<QuestionnaireCategory>(
      this.api.apiUrl('/api/v1/questionnaire-categories'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  update(id: number, request: UpdateQuestionnaireCategoryRequest): Observable<QuestionnaireCategory> {
    return this.http.put<QuestionnaireCategory>(
      this.api.apiUrl(`/api/v1/questionnaire-categories/${id}`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/questionnaire-categories/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
