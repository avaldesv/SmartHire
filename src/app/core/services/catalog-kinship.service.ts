import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogKinship,
  CreateKinshipRequest,
  KinshipListResponse,
  UpdateKinshipRequest,
} from '../../shared/models/catalog-kinship.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogKinshipService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 20): Observable<{ items: CatalogKinship[]; total: number }> {
    const body = { isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<KinshipListResponse>(this.api.apiUrl('/api/v1/kinships/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateKinshipRequest): Observable<CatalogKinship> {
    return this.http.post<CatalogKinship>(this.api.apiUrl('/api/v1/kinships'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateKinshipRequest): Observable<CatalogKinship> {
    return this.http.put<CatalogKinship>(this.api.apiUrl(`/api/v1/kinships/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/kinships/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
