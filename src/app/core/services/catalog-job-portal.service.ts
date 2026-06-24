import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogJobPortal,
  CreateJobPortalRequest,
  JobPortalListResponse,
  UpdateJobPortalRequest,
} from '../../shared/models/catalog-job-portal.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogJobPortalService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogJobPortal[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<JobPortalListResponse>(this.api.apiUrl('/api/v1/job-portals/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateJobPortalRequest): Observable<CatalogJobPortal> {
    return this.http.post<CatalogJobPortal>(this.api.apiUrl('/api/v1/job-portals'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateJobPortalRequest): Observable<CatalogJobPortal> {
    return this.http.put<CatalogJobPortal>(this.api.apiUrl(`/api/v1/job-portals/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
