import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogBranch,
  CreateBranchRequest,
  BranchListResponse,
  UpdateBranchRequest,
} from '../../shared/models/catalog-branch.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogBranchService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogBranch[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<BranchListResponse>(this.api.apiUrl('/api/v1/branches/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateBranchRequest): Observable<CatalogBranch> {
    return this.http.post<CatalogBranch>(this.api.apiUrl('/api/v1/branches'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateBranchRequest): Observable<CatalogBranch> {
    return this.http.put<CatalogBranch>(this.api.apiUrl(`/api/v1/branches/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
