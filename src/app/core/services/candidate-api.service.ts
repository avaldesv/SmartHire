import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';
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
import { downloadBlob } from './catalog-import-export.service';
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

  /** Resolves signed URL from API and saves using the original document file name. */
  downloadCv(candidateId: number): Observable<CandidateCvDownloadUrlResponse> {
    return this.getCvDownloadUrl(candidateId).pipe(
      switchMap((res) =>
        from(
          fetch(res.downloadUrl).then(async (response) => {
            if (!response.ok) {
              throw new Error(`CV download failed (${response.status})`);
            }
            const blob = await response.blob();
            downloadBlob(blob, res.fileName);
            return res;
          }),
        ),
      ),
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
