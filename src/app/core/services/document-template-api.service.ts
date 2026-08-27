import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DocumentTemplateItem,
  DocumentTemplateListResponse,
  DownloadDocumentTemplateResponse,
  UpdateDocumentTemplateMetadataRequest,
  ValidateDocumentTemplateResponse,
} from '../../shared/models/document-template.model';
import { ApiClientService } from './api-client.service';
import { LocaleService, X_LANGUAGE_HEADER } from './locale.service';
import { TenantContextService } from './tenant-context.service';

@Injectable({ providedIn: 'root' })
export class DocumentTemplateApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);
  private readonly localeService = inject(LocaleService);
  private readonly tenantContext = inject(TenantContextService);

  list(
    page = 0,
    size = 10,
    options?: { isActive?: boolean | null },
  ): Observable<{ items: DocumentTemplateItem[]; total: number }> {
    const body = {
      name: null,
      isActive: options?.isActive ?? null,
      filters: [] as unknown[],
      ordersBy: ['name:asc'] as string[],
    };
    return this.http
      .post<DocumentTemplateListResponse>(this.api.apiUrl('/api/v1/document-templates/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }

  generate(templateId: number, applicationId: number): Observable<Blob> {
    return this.http.post(
      this.api.apiUrl(`/api/v1/document-templates/${templateId}/generate`),
      { applicationId },
      {
        headers: this.api.buildHeaders(0, 1),
        responseType: 'blob',
      },
    );
  }

  getById(id: number): Observable<DocumentTemplateItem> {
    return this.http.get<DocumentTemplateItem>(this.api.apiUrl(`/api/v1/document-templates/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  validate(file: File): Observable<ValidateDocumentTemplateResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ValidateDocumentTemplateResponse>(
      this.api.apiUrl('/api/v1/document-templates/validate'),
      formData,
      { headers: this.buildFileHeaders() },
    );
  }

  create(name: string, file: File, isActive?: boolean): Observable<DocumentTemplateItem> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    if (isActive != null) {
      formData.append('isActive', String(isActive));
    }
    return this.http.post<DocumentTemplateItem>(this.api.apiUrl('/api/v1/document-templates'), formData, {
      headers: this.buildFileHeaders(),
    });
  }

  updateMetadata(id: number, request: UpdateDocumentTemplateMetadataRequest): Observable<DocumentTemplateItem> {
    return this.http.put<DocumentTemplateItem>(this.api.apiUrl(`/api/v1/document-templates/${id}`), request, {
      headers: this.api.buildHeaders(),
    });
  }

  updateWithFile(
    id: number,
    file: File,
    options?: { name?: string; isActive?: boolean },
  ): Observable<DocumentTemplateItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (options?.name != null) {
      formData.append('name', options.name);
    }
    if (options?.isActive != null) {
      formData.append('isActive', String(options.isActive));
    }
    return this.http.put<DocumentTemplateItem>(this.api.apiUrl(`/api/v1/document-templates/${id}`), formData, {
      headers: this.buildFileHeaders(),
    });
  }

  download(id: number): Observable<DownloadDocumentTemplateResponse> {
    return this.http.get<DownloadDocumentTemplateResponse>(
      this.api.apiUrl(`/api/v1/document-templates/${id}/download`),
      { headers: this.api.buildHeaders() },
    );
  }

  /** Same-origin proxy of the S3 object for in-app preview (avoids CORS on signed URLs). */
  fetchFileContent(id: number): Observable<ArrayBuffer> {
    return this.http.get(this.api.apiUrl(`/api/v1/document-templates/${id}/file`), {
      headers: this.api.buildHeaders(),
      responseType: 'arraybuffer',
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.api.apiUrl(`/api/v1/document-templates/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }

  /** Multipart headers without Content-Type so the browser sets the boundary. */
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
