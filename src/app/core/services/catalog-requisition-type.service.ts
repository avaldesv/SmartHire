import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogRequisitionType,
  CreateRequisitionTypeRequest,
  RequisitionTypeListResponse,
  UpdateRequisitionTypeRequest,
} from '../../shared/models/catalog-requisition-type.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogRequisitionTypeService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogRequisitionType[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<RequisitionTypeListResponse>(this.api.apiUrl('/api/v1/requisition-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateRequisitionTypeRequest): Observable<CatalogRequisitionType> {
    return this.http.post<CatalogRequisitionType>(this.api.apiUrl('/api/v1/requisition-types'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateRequisitionTypeRequest): Observable<CatalogRequisitionType> {
    return this.http.put<CatalogRequisitionType>(this.api.apiUrl(`/api/v1/requisition-types/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/requisition-types/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
