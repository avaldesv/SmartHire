import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogBenefit,
  CreateBenefitRequest,
  BenefitListResponse,
  UpdateBenefitRequest,
} from '../../shared/models/catalog-benefit.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogBenefitService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogBenefit[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<BenefitListResponse>(this.api.apiUrl('/api/v1/benefits/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateBenefitRequest): Observable<CatalogBenefit> {
    return this.http.post<CatalogBenefit>(this.api.apiUrl('/api/v1/benefits'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateBenefitRequest): Observable<CatalogBenefit> {
    return this.http.put<CatalogBenefit>(this.api.apiUrl(`/api/v1/benefits/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/benefits/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
