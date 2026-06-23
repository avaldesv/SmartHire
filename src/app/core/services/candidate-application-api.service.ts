import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  BulkCandidateApplicationsRequest,
  BulkCandidateApplicationsResponse,
  CandidateApplicationListItem,
  CandidateApplicationListResponse,
  CreateCandidateApplicationRequest,
  CreateCandidateApplicationResponse,
  ListCandidateApplicationsRequest,
  ReleaseAllCandidateApplicationsRequest,
  ValidateCandidateApplicationFlagsResponse,
} from '../../shared/models/candidate-application.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CandidateApplicationApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    request: ListCandidateApplicationsRequest = {},
  ): Observable<{ items: CandidateApplicationListItem[]; total: number }> {
    const body: ListCandidateApplicationsRequest = {
      positionId: request.positionId ?? null,
      candidateId: request.candidateId ?? null,
      status: request.status?.trim() || null,
      filters: request.filters ?? [],
      ordersBy: request.ordersBy ?? ['createAt:desc'],
    };
    return this.http
      .post<CandidateApplicationListResponse>(this.api.apiUrl('/api/v1/candidate-applications/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateCandidateApplicationRequest): Observable<CreateCandidateApplicationResponse> {
    return this.http.post<CreateCandidateApplicationResponse>(
      this.api.apiUrl('/api/v1/candidate-applications'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  select(request: BulkCandidateApplicationsRequest): Observable<BulkCandidateApplicationsResponse> {
    return this.http.post<BulkCandidateApplicationsResponse>(
      this.api.apiUrl('/api/v1/candidate-applications/select'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  deselect(request: BulkCandidateApplicationsRequest): Observable<BulkCandidateApplicationsResponse> {
    return this.http.post<BulkCandidateApplicationsResponse>(
      this.api.apiUrl('/api/v1/candidate-applications/deselect'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  releaseAll(request: ReleaseAllCandidateApplicationsRequest): Observable<BulkCandidateApplicationsResponse> {
    return this.http.post<BulkCandidateApplicationsResponse>(
      this.api.apiUrl('/api/v1/candidate-applications/release-all'),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  validateInfo(applicationId: number): Observable<ValidateCandidateApplicationFlagsResponse> {
    return this.http.post<ValidateCandidateApplicationFlagsResponse>(
      this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/validate-info`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }

  validateStudies(applicationId: number): Observable<ValidateCandidateApplicationFlagsResponse> {
    return this.http.post<ValidateCandidateApplicationFlagsResponse>(
      this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/validate-studies`),
      {},
      { headers: this.api.buildHeaders() },
    );
  }
}
