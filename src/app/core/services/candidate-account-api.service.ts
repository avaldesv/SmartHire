import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CandidateAccountItem,
  CandidateAccountListResponse,
  CreateCandidateAccountRequest,
  HardDeleteCandidateAccountRequest,
  ListCandidateAccountsRequest,
  UpdateCandidateAccountActiveRequest,
  UpdateCandidateAccountRequest,
} from '../../shared/models/candidate-account.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CandidateAccountApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 10,
    filters: ListCandidateAccountsRequest = {},
  ): Observable<{ items: CandidateAccountItem[]; total: number }> {
    const body: ListCandidateAccountsRequest = {
      email: filters.email ?? null,
      isActive: filters.isActive ?? null,
      registerStatusId: filters.registerStatusId ?? null,
      ordersBy: filters.ordersBy ?? ['createAt:desc'],
    };
    return this.http
      .post<CandidateAccountListResponse>(this.api.apiUrl('/api/v1/candidate-accounts/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateCandidateAccountRequest): Observable<CandidateAccountItem> {
    return this.http.post<CandidateAccountItem>(this.api.apiUrl('/api/v1/candidate-accounts'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCandidateAccountRequest): Observable<CandidateAccountItem> {
    return this.http.put<CandidateAccountItem>(this.api.apiUrl(`/api/v1/candidate-accounts/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  updateActive(id: number, request: UpdateCandidateAccountActiveRequest): Observable<CandidateAccountItem> {
    return this.http.patch<CandidateAccountItem>(
      this.api.apiUrl(`/api/v1/candidate-accounts/${id}/active`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  softDelete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/candidate-accounts/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  hardDelete(id: number, request: HardDeleteCandidateAccountRequest): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/candidate-accounts/${id}/hard`), {
      headers: this.api.buildHeaders(),
      body: request,
    });
  }
}
