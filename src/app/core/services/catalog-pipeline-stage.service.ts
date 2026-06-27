import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogPipelineStage,
  CreatePipelineStageRequest,
  PipelineStageListResponse,
  ReorderPipelineStageItem,
  UpdatePipelineStageRequest,
} from '../../shared/models/catalog-pipeline-stage.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogPipelineStageService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number | null = null, page = 0, size = 100): Observable<{ items: CatalogPipelineStage[]; total: number }> {
    const body = {
      countryId,
      isActive: null,
      filters: [],
      ordersBy: ['sortOrder:asc'] as string[],
    };
    return this.http
      .post<PipelineStageListResponse>(this.api.apiUrl('/api/v1/pipeline-stages/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<CatalogPipelineStage> {
    return this.http.get<CatalogPipelineStage>(this.api.apiUrl(`/api/v1/pipeline-stages/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreatePipelineStageRequest): Observable<CatalogPipelineStage> {
    return this.http.post<CatalogPipelineStage>(this.api.apiUrl('/api/v1/pipeline-stages'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdatePipelineStageRequest): Observable<CatalogPipelineStage> {
    return this.http.put<CatalogPipelineStage>(this.api.apiUrl(`/api/v1/pipeline-stages/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/pipeline-stages/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  reorder(stages: ReorderPipelineStageItem[]): Observable<void> {
    return this.http.put<void>(this.api.apiUrl('/api/v1/pipeline-stages/reorder'), { stages }, {
      headers: this.api.buildHeaders(),
    });
  }
}
