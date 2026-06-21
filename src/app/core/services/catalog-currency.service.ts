import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCurrency,
  CreateCurrencyRequest,
  CurrencyListResponse,
  UpdateCurrencyRequest,
} from '../../shared/models/catalog-currency.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCurrencyService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogCurrency[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CurrencyListResponse>(this.api.apiUrl('/api/v1/currencies/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCurrencyRequest): Observable<CatalogCurrency> {
    return this.http.post<CatalogCurrency>(this.api.apiUrl('/api/v1/currencies'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCurrencyRequest): Observable<CatalogCurrency> {
    return this.http.put<CatalogCurrency>(this.api.apiUrl(`/api/v1/currencies/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
