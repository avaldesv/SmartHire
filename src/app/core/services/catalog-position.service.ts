import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ApiPageResponse,
  CatalogBenefit,
  CatalogBrand,
  CatalogContractType,
  CatalogCoverageType,
  CatalogDocumentType,
  CatalogEducationLevel,
  CatalogLanguage,
  CatalogLanguageLevel,
  CatalogListRequest,
  CatalogShift,
} from '../../shared/models/catalog-position.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogPositionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  listBrands(countryId: number, page = 0, size = 200): Observable<CatalogBrand[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogBrand>>(this.api.apiUrl('/api/v1/brands/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listCoverageTypes(countryId: number, page = 0, size = 200): Observable<CatalogCoverageType[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogCoverageType>>(this.api.apiUrl('/api/v1/coverage-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listShifts(countryId: number, page = 0, size = 200): Observable<CatalogShift[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogShift>>(this.api.apiUrl('/api/v1/shifts/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listBenefits(countryId: number, page = 0, size = 200): Observable<CatalogBenefit[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogBenefit>>(this.api.apiUrl('/api/v1/benefits/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listLanguages(page = 0, size = 200): Observable<CatalogLanguage[]> {
    const body: CatalogListRequest = { isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogLanguage>>(this.api.apiUrl('/api/v1/languages/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listLanguageLevels(countryId: number, page = 0, size = 200): Observable<CatalogLanguageLevel[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogLanguageLevel>>(this.api.apiUrl('/api/v1/language-levels/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listDocumentTypes(countryId: number, page = 0, size = 200): Observable<CatalogDocumentType[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogDocumentType>>(this.api.apiUrl('/api/v1/document-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listEducationLevels(countryId: number, page = 0, size = 200): Observable<CatalogEducationLevel[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogEducationLevel>>(this.api.apiUrl('/api/v1/education-levels/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  listContractTypes(countryId: number, page = 0, size = 200): Observable<CatalogContractType[]> {
    const body: CatalogListRequest = { countryId, isActive: true, filters: [], ordersBy: ['name:asc'] };
    return this.http
      .post<ApiPageResponse<CatalogContractType>>(this.api.apiUrl('/api/v1/contract-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }
}
