import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogCompanyDepartment,
  CreateCompanyDepartmentRequest,
  CompanyDepartmentListResponse,
  UpdateCompanyDepartmentRequest,
} from '../../shared/models/catalog-company-department.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogCompanyDepartmentService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(catalogCompanyId: number, page = 0, size = 20): Observable<{ items: CatalogCompanyDepartment[]; total: number }> {
    const body = { catalogCompanyId, isActive: null, filters: [], ordersBy: ['name:asc'] as string[] };
    return this.http
      .post<CompanyDepartmentListResponse>(this.api.apiUrl('/api/v1/company-departments/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  create(request: CreateCompanyDepartmentRequest): Observable<CatalogCompanyDepartment> {
    return this.http.post<CatalogCompanyDepartment>(this.api.apiUrl('/api/v1/company-departments'), request, {
      headers: this.api.buildHeaders(),
    });
  }

  update(id: number, request: UpdateCompanyDepartmentRequest): Observable<CatalogCompanyDepartment> {
    return this.http.put<CatalogCompanyDepartment>(this.api.apiUrl(`/api/v1/company-departments/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
