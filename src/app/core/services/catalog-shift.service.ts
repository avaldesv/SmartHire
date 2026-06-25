import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogShift,
  CreateShiftRequest,
  ShiftListResponse,
  UpdateShiftRequest,
} from '../../shared/models/catalog-shift.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogShiftService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogShift[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<ShiftListResponse>(this.api.apiUrl('/api/v1/shifts/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateShiftRequest): Observable<CatalogShift> {
    return this.http.post<CatalogShift>(this.api.apiUrl('/api/v1/shifts'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateShiftRequest): Observable<CatalogShift> {
    return this.http.put<CatalogShift>(this.api.apiUrl(`/api/v1/shifts/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/shifts/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
