import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCharacteristic,
  CreateCharacteristicRequest,
  CharacteristicListResponse,
  UpdateCharacteristicRequest,
} from '../../shared/models/catalog-characteristic.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCharacteristicService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogCharacteristic[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CharacteristicListResponse>(this.api.apiUrl('/api/v1/characteristics/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCharacteristicRequest): Observable<CatalogCharacteristic> {
    return this.http.post<CatalogCharacteristic>(this.api.apiUrl('/api/v1/characteristics'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCharacteristicRequest): Observable<CatalogCharacteristic> {
    return this.http.put<CatalogCharacteristic>(this.api.apiUrl(`/api/v1/characteristics/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
