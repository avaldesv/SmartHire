import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ListSurveysRequest,
  SendPositionSurveyRequest,
  SendPositionSurveyResponse,
  SurveyDetail,
  SurveyListItem,
  SurveyListResponse,
  UpsertSurveyRequest,
} from '../../shared/models/survey.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class SurveyApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    request: ListSurveysRequest = {},
    page = 0,
    size = 20,
  ): Observable<{ items: SurveyListItem[]; total: number }> {
    const body = {
      isActive: request.isActive ?? null,
      search: request.search ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? ['name:asc'],
    };
    return this.http
      .post<SurveyListResponse>(this.api.apiUrl('/api/v1/surveys/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<SurveyDetail> {
    return this.http.get<SurveyDetail>(this.api.apiUrl(`/api/v1/surveys/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: UpsertSurveyRequest): Observable<SurveyDetail> {
    return this.http.post<SurveyDetail>(this.api.apiUrl('/api/v1/surveys'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpsertSurveyRequest): Observable<SurveyDetail> {
    return this.http.put<SurveyDetail>(this.api.apiUrl(`/api/v1/surveys/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/surveys/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  sendToPosition(
    positionId: number,
    request: SendPositionSurveyRequest,
  ): Observable<SendPositionSurveyResponse> {
    return this.http.post<SendPositionSurveyResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/surveys/send`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
