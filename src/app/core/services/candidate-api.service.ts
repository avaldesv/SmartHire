import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import {
  CandidateDetail,
  CandidateCvDownloadUrlResponse,
  CandidateListItem,
  CandidateListResponse,
  CreateCandidateRequest,
  CreateCandidateResponse,
  UpdateCandidateRequest,
  UpdateCandidateResponse,
} from '../../shared/models/candidate.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CandidateApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    page = 0,
    size = 20,
    search?: string,
    isActive?: boolean | null,
  ): Observable<{ items: CandidateListItem[]; total: number }> {
    const term = search?.trim();
    const body = {
      search: term || null,
      isActive: isActive ?? null,
      filters: [],
      ordersBy: ['createAt:desc'] as string[],
    };
    return this.http
      .post<CandidateListResponse>(this.api.apiUrl('/api/v1/candidates/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: (res.data ?? []).map((item) => ({
            ...item,
            phone: item.phone ?? '—',
            city: item.city ?? '—',
            source: item.source ?? '—',
          })),
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<CandidateDetail> {
    return this.http.get<CandidateDetail>(this.api.apiUrl(`/api/v1/candidates/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  getCvDownloadUrl(candidateId: number): Observable<CandidateCvDownloadUrlResponse> {
    return this.http.get<CandidateCvDownloadUrlResponse>(
      this.api.apiUrl(`/api/v1/candidates/${candidateId}/cv/download-url`),
      { headers: this.api.buildHeaders() },
    );
  }

  /**
   * Opens the S3 signed URL in a new tab (no CORS fetch). The API embeds
   * Content-Disposition so the browser saves with the original file name.
   */
  downloadCv(candidateId: number): Observable<CandidateCvDownloadUrlResponse> {
    return this.getCvDownloadUrl(candidateId).pipe(
      tap((res) => {
        if (!res.downloadUrl) {
          throw new Error('CV download URL missing');
        }
        window.open(res.downloadUrl, '_blank', 'noopener,noreferrer');
      }),
    );
  }

  create(request: CreateCandidateRequest): Observable<CreateCandidateResponse> {
    return this.http.post<CreateCandidateResponse>(this.api.apiUrl('/api/v1/candidates'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCandidateRequest): Observable<UpdateCandidateResponse> {
    return this.http.put<UpdateCandidateResponse>(this.api.apiUrl(`/api/v1/candidates/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
