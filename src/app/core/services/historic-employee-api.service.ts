import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiClientService } from './api-client.service';
import { LocaleService, X_LANGUAGE_HEADER } from './locale.service';
import { TenantContextService } from './tenant-context.service';
import {
  HistoricEmployee,
  HistoricEmployeeImportResponse,
  HistoricEmployeeListResponse,
  HistoricEmployeePostulateResponse,
  HistoricEmployeePreviewResponse,
  HistoricEmployeeValidRow,
} from '../../shared/models/historic-employee.model';

@Injectable({ providedIn: 'root' })
export class HistoricEmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);
  private readonly localeService = inject(LocaleService);
  private readonly tenantContext = inject(TenantContextService);

  list(
    page: number,
    size: number,
    search: string | null,
    sourceKind: string | null,
    educationLevelId: number | null,
  ): Observable<{ items: HistoricEmployee[]; total: number }> {
    const body = {
      search: search?.trim() || null,
      isActive: true,
      sourceKind,
      educationLevelId,
      filters: [],
      ordersBy: ['id:asc'] as string[],
    };
    return this.http
      .post<HistoricEmployeeListResponse>(this.api.apiUrl('/api/v1/historic-employees/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  preview(file: File): Observable<HistoricEmployeePreviewResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<HistoricEmployeePreviewResponse>(
      this.api.apiUrl('/api/v1/historic-employees/import/preview'),
      formData,
      { headers: this.buildFileHeaders() },
    );
  }

  importRows(rows: HistoricEmployeeValidRow[]): Observable<HistoricEmployeeImportResponse> {
    return this.http.post<HistoricEmployeeImportResponse>(
      this.api.apiUrl('/api/v1/historic-employees/import'),
      { rows },
      { headers: this.api.buildHeaders() },
    );
  }

  postulate(
    positionId: number,
    historicEmployeeIds: number[],
    notifyEmail: boolean,
    notifyWhatsApp: boolean,
  ): Observable<HistoricEmployeePostulateResponse> {
    return this.http.post<HistoricEmployeePostulateResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/historic-employees/postulate`),
      { historicEmployeeIds, notifyEmail, notifyWhatsApp },
      { headers: this.api.buildHeaders() },
    );
  }

  private buildFileHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('sh_token') ?? '';
    return new HttpHeaders({
      applicationId: environment.applicationId,
      companyId: String(this.tenantContext.getCompanyId()),
      [X_LANGUAGE_HEADER]: this.localeService.getLanguageHeader(),
      authorization: token ? `Bearer ${token}` : '',
    });
  }
}
