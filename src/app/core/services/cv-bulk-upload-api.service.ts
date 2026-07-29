import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiClientService } from './api-client.service';
import { LocaleService, X_LANGUAGE_HEADER } from './locale.service';
import { TenantContextService } from './tenant-context.service';
import {
  CvBulkUploadCreateResponse,
  CvBulkUploadStatusResponse,
} from '../../shared/models/cv-bulk-upload.model';

@Injectable({ providedIn: 'root' })
export class CvBulkUploadApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);
  private readonly localeService = inject(LocaleService);
  private readonly tenantContext = inject(TenantContextService);

  uploadChunk(
    positionId: number,
    files: File[],
    options: { jobId?: number | null; notifyEmail: boolean; notifyWhatsapp: boolean },
  ): Observable<CvBulkUploadCreateResponse> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    formData.append('notifyEmail', String(options.notifyEmail));
    formData.append('notifyWhatsapp', String(options.notifyWhatsapp));
    if (options.jobId != null) {
      formData.append('jobId', String(options.jobId));
    }
    return this.http.post<CvBulkUploadCreateResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/cv-bulk-uploads`),
      formData,
      { headers: this.buildFileHeaders() },
    );
  }

  getStatus(positionId: number, jobId: number): Observable<CvBulkUploadStatusResponse> {
    return this.http.get<CvBulkUploadStatusResponse>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/cv-bulk-uploads/${jobId}`),
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
