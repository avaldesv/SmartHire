import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  QuestionnaireFormApiItem,
  QuestionnaireFormListResponse,
  QuestionnairePositionAssignmentApiItem,
  UpsertQuestionnairePositionAssignmentRequest,
  mapQuestionnaireFormToUi,
} from '../../shared/models/questionnaire.model';
import { Questionnaire } from '../../shared/models';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class QuestionnaireApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  listForms(page = 0, size = 50, isActive: boolean | null = true): Observable<{ items: Questionnaire[]; total: number }> {
    const body = { category: null, isActive, filters: [], ordersBy: [] as string[] };
    return this.http
      .post<QuestionnaireFormListResponse>(this.api.apiUrl('/api/v1/questionnaire-forms/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: (res.data ?? []).map(mapQuestionnaireFormToUi),
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getFormById(id: number): Observable<QuestionnaireFormApiItem> {
    return this.http.get<QuestionnaireFormApiItem>(this.api.apiUrl(`/api/v1/questionnaire-forms/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  getPositionAssignment(positionId: number): Observable<QuestionnairePositionAssignmentApiItem> {
    return this.http.get<QuestionnairePositionAssignmentApiItem>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/questionnaire-assignment`),
      { headers: this.api.buildHeaders() },
    );
  }

  upsertPositionAssignment(
    positionId: number,
    request: UpsertQuestionnairePositionAssignmentRequest,
  ): Observable<QuestionnairePositionAssignmentApiItem> {
    return this.http.put<QuestionnairePositionAssignmentApiItem>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/questionnaire-assignment`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
