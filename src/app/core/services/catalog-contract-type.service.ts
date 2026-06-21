import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogContractType,
  ContractTypeListResponse,
  CreateContractTypeRequest,
  UpdateContractTypeRequest,
} from '../../shared/models/catalog-contract-type.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogContractTypeService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(countryId: number, page = 0, size = 20): Observable<{ items: CatalogContractType[]; total: number }> {
    const body = { countryId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<ContractTypeListResponse>(this.api.apiUrl('/api/v1/contract-types/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  create(request: CreateContractTypeRequest): Observable<CatalogContractType> {
    return this.http.post<CatalogContractType>(this.api.apiUrl('/api/v1/contract-types'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateContractTypeRequest): Observable<CatalogContractType> {
    return this.http.put<CatalogContractType>(this.api.apiUrl(`/api/v1/contract-types/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
