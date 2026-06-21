import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ApiPageResponse,
  CatalogCountry,
  CatalogListRequest,
  CatalogMunicipality,
  CatalogNeighborhood,
  CatalogState,
  CreateCountryRequest,
  CreateStateRequest,
  UpdateCountryRequest,
  UpdateStateRequest,
} from '../../shared/models/catalog-geography.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogGeographyService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  listCountries(page = 0, size = 200): Observable<CatalogCountry[]> {
    const body: CatalogListRequest = { isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogCountry>>(this.api.apiUrl('/api/v1/countries/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listCountriesPage(page = 0, size = 20): Observable<{ items: CatalogCountry[]; total: number }> {
    const body: CatalogListRequest = { isActive: null, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogCountry>>(this.api.apiUrl('/api/v1/countries/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  createCountry(request: CreateCountryRequest): Observable<CatalogCountry> {
    return this.http.post<CatalogCountry>(this.api.apiUrl('/api/v1/countries'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  updateCountry(id: number, request: UpdateCountryRequest): Observable<CatalogCountry> {
    return this.http.put<CatalogCountry>(this.api.apiUrl(`/api/v1/countries/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  listStatesPage(countryId: number, page = 0, size = 20): Observable<{ items: CatalogState[]; total: number }> {
    const body: CatalogListRequest = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogState>>(this.api.apiUrl('/api/v1/states/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  createState(request: CreateStateRequest): Observable<CatalogState> {
    return this.http.post<CatalogState>(this.api.apiUrl('/api/v1/states'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  updateState(id: number, request: UpdateStateRequest): Observable<CatalogState> {
    return this.http.put<CatalogState>(this.api.apiUrl(`/api/v1/states/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  listStates(countryId: number, page = 0, size = 500): Observable<CatalogState[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogState>>(this.api.apiUrl('/api/v1/states/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listMunicipalities(stateId: number, page = 0, size = 500): Observable<CatalogMunicipality[]> {
    const body: CatalogListRequest = { stateId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogMunicipality>>(this.api.apiUrl('/api/v1/municipalities/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listNeighborhoodsByPostalCode(postalCode: string, page = 0, size = 200): Observable<CatalogNeighborhood[]> {
    const body: CatalogListRequest = { postalCode, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogNeighborhood>>(this.api.apiUrl('/api/v1/neighborhoods/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }
}
