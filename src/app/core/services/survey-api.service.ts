import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ListSurveySessionsRequest,
  ListSurveysRequest,
  SendPositionSurveyRequest,
  SendPositionSurveyResponse,
  SurveyDetail,
  SurveyListItem,
  SurveyListResponse,
  SurveySessionDetail,
  SurveySessionListItem,
  SurveySessionListResponse,
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

  listSessions(
    request: ListSurveySessionsRequest = {},
    page = 0,
    size = 20,
  ): Observable<{ items: SurveySessionListItem[]; total: number }> {
    return this.http
      .post<SurveySessionListResponse>(
        this.api.apiUrl('/api/v1/surveys/sessions/list'),
        this.toSessionsBody(request),
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => this.mapSessionsPage(res)));
  }

  getSession(id: number): Observable<SurveySessionDetail> {
    return this.http.get<SurveySessionDetail>(this.api.apiUrl(`/api/v1/surveys/sessions/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  listPositionSessions(
    positionId: number,
    request: ListSurveySessionsRequest = {},
    page = 0,
    size = 20,
  ): Observable<{ items: SurveySessionListItem[]; total: number }> {
    return this.http
      .post<SurveySessionListResponse>(
        this.api.apiUrl(`/api/v1/positions/${positionId}/surveys/sessions/list`),
        this.toSessionsBody(request),
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => this.mapSessionsPage(res)));
  }

  getPositionSession(positionId: number, id: number): Observable<SurveySessionDetail> {
    return this.http.get<SurveySessionDetail>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/surveys/sessions/${id}`),
      { headers: this.api.buildHeaders() },
    );
  }

  private toSessionsBody(request: ListSurveySessionsRequest) {
    return {
      surveyId: request.surveyId ?? null,
      isSurveyCompleted: request.isSurveyCompleted ?? null,
      phone: request.phone ?? null,
      candidateId: request.candidateId ?? null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? ['createAt:desc'],
    };
  }

  private mapSessionsPage(res: SurveySessionListResponse): {
    items: SurveySessionListItem[];
    total: number;
  } {
    return {
      items: res.data ?? [],
      total: res.pagination?.total ?? 0,
    };
  }
}
