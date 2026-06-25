import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogGender,
  CreateGenderRequest,
  GenderListResponse,
  UpdateGenderRequest,
} from '../../shared/models/catalog-gender.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogGenderService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogGender[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<GenderListResponse>(this.api.apiUrl('/api/v1/genders/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  getById(id: number): Observable<CatalogGender> {
    return this.http.get<CatalogGender>(this.api.apiUrl(`/api/v1/genders/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  create(request: CreateGenderRequest): Observable<CatalogGender> {
    return this.http.post<CatalogGender>(this.api.apiUrl('/api/v1/genders'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateGenderRequest): Observable<CatalogGender> {
    return this.http.put<CatalogGender>(this.api.apiUrl(`/api/v1/genders/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/genders/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

}
