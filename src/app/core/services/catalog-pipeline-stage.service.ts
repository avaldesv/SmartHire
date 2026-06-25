import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogPipelineStage,
  PipelineStageListResponse,
} from '../../shared/models/catalog-pipeline-stage.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogPipelineStageService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number | null = null, page = 0, size = 50): Observable<{ items: CatalogPipelineStage[]; total: number }> {
    const body = {
      countryId,
      isActive: true,
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
}
