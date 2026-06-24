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
  CreateMunicipalityRequest,
  CreateNeighborhoodRequest,
  CreateStateRequest,
  UpdateCountryRequest,
  UpdateMunicipalityRequest,
  UpdateNeighborhoodRequest,
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

  listMunicipalitiesPage(stateId: number, page = 0, size = 20): Observable<{ items: CatalogMunicipality[]; total: number }> {
    const body: CatalogListRequest = { stateId, isActive: null, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogMunicipality>>(this.api.apiUrl('/api/v1/municipalities/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  createMunicipality(request: CreateMunicipalityRequest): Observable<CatalogMunicipality> {
    return this.http.post<CatalogMunicipality>(this.api.apiUrl('/api/v1/municipalities'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  updateMunicipality(id: number, request: UpdateMunicipalityRequest): Observable<CatalogMunicipality> {
    return this.http.put<CatalogMunicipality>(this.api.apiUrl(`/api/v1/municipalities/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  listNeighborhoodsPage(municipalityId: number, page = 0, size = 20): Observable<{ items: CatalogNeighborhood[]; total: number }> {
    const body: CatalogListRequest = { municipalityId, isActive: null, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogNeighborhood>>(this.api.apiUrl('/api/v1/neighborhoods/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  createNeighborhood(request: CreateNeighborhoodRequest): Observable<CatalogNeighborhood> {
    return this.http.post<CatalogNeighborhood>(this.api.apiUrl('/api/v1/neighborhoods'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  updateNeighborhood(id: number, request: UpdateNeighborhoodRequest): Observable<CatalogNeighborhood> {
    return this.http.put<CatalogNeighborhood>(this.api.apiUrl(`/api/v1/neighborhoods/${id}`), request, {
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

  deleteCountry(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/countries/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  deleteState(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/states/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  deleteMunicipality(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/municipalities/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  deleteNeighborhood(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/neighborhoods/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
