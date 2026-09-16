import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  BeneficiaryType,
  CandidateBeneficiary,
  CandidateBeneficiaryListResponse,
  CandidateBeneficiaryPayload,
} from '../../shared/models/candidate-beneficiary.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CandidateBeneficiaryApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    candidateId: number,
    page = 0,
    size = 20,
    beneficiaryType?: BeneficiaryType | null,
    isActive?: boolean | null,
  ): Observable<{ items: CandidateBeneficiary[]; total: number }> {
    const body = {
      beneficiaryType: beneficiaryType ?? null,
      isActive: isActive ?? null,
      filters: [],
      ordersBy: ['createAt:desc'] as string[],
    };
    return this.http
      .post<CandidateBeneficiaryListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/beneficiaries/list`),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(candidateId: number, beneficiaryId: number): Observable<CandidateBeneficiary> {
    return this.http.get<CandidateBeneficiary>(
      this.api.apiUrl(`/api/v1/candidates/${candidateId}/beneficiaries/${beneficiaryId}`),
      { headers: this.api.buildHeaders() },
    );
  }

  create(candidateId: number, request: CandidateBeneficiaryPayload): Observable<CandidateBeneficiary> {
    return this.http.post<CandidateBeneficiary>(
      this.api.apiUrl(`/api/v1/candidates/${candidateId}/beneficiaries`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  update(
    candidateId: number,
    beneficiaryId: number,
    request: CandidateBeneficiaryPayload,
  ): Observable<CandidateBeneficiary> {
    return this.http.put<CandidateBeneficiary>(
      this.api.apiUrl(`/api/v1/candidates/${candidateId}/beneficiaries/${beneficiaryId}`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
