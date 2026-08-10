import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CandidateDocumentListItem,
  CandidateDocumentListResponse,
  UpdateApplicationDocumentValidationRequest,
  UpdateApplicationDocumentValidationResponse,
} from '../../shared/models/candidate-document.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CandidateDocumentApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    candidateId: number,
    page = 0,
    size = 20,
    documentTypeId: number | null = null,
  ): Observable<{ items: CandidateDocumentListItem[]; total: number }> {
    return this.http
      .post<CandidateDocumentListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/documents/list`),
        { documentTypeId, filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  listForApplication(
    applicationId: number,
    page = 0,
    size = 20,
    documentTypeId: number | null = null,
  ): Observable<{ items: CandidateDocumentListItem[]; total: number }> {
    return this.http
      .post<CandidateDocumentListResponse>(
        this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/documents/list`),
        { documentTypeId, filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  updateValidation(
    applicationId: number,
    documentId: number,
    body: UpdateApplicationDocumentValidationRequest,
  ): Observable<UpdateApplicationDocumentValidationResponse> {
    return this.http.put<UpdateApplicationDocumentValidationResponse>(
      this.api.apiUrl(
        `/api/v1/candidate-applications/${applicationId}/documents/${documentId}/validation`,
      ),
      body,
      { headers: this.api.buildHeaders() },
    );
  }
}
