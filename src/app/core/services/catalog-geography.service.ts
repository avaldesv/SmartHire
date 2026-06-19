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
