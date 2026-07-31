import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiClientService } from './api-client.service';
import { LocaleService, X_LANGUAGE_HEADER } from './locale.service';
import { TenantContextService } from './tenant-context.service';
import {
  ExcelBulkCreateRequest,
  ExcelBulkCreateResponse,
  ExcelBulkPreviewResponse,
  ExcelBulkStatusResponse,
} from '../../shared/models/excel-bulk-upload.model';

@Injectable({ providedIn: 'root' })
export class ExcelBulkUploadApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);
  private readonly localeService = inject(LocaleService);
  private readonly tenantContext = inject(TenantContextService);

  preview(positionId: number, file: File): Observable<ExcelBulkPreviewResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ExcelBulkPreviewResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/excel-bulk-uploads/preview`),
      formData,
      { headers: this.buildFileHeaders() },
    );
  }

  confirm(positionId: number, request: ExcelBulkCreateRequest): Observable<ExcelBulkCreateResponse> {
    return this.http.post<ExcelBulkCreateResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/excel-bulk-uploads`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  getStatus(positionId: number, jobId: number): Observable<ExcelBulkStatusResponse> {
    return this.http.get<ExcelBulkStatusResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/excel-bulk-uploads/${jobId}`),
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
