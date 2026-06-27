import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { TenantContextService } from './tenant-context.service';
import { environment } from '../../../environments/environment';

export interface CatalogCsvStructureValidationResponse {
  structureValid: boolean;
  delimiter: string;
  expectedColumns: string[];
  actualColumns: string[];
  totalRows: number;
  structureErrors: string[];
}

export interface CatalogCsvImportResponse {
  created: number;
  updated: number;
  failed: number;
  errorReportCsvBase64: string | null;
}

@Injectable({ providedIn: 'root' })
export class CatalogImportExportService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);
  private readonly tenantContext = inject(TenantContextService);

  downloadTemplate(catalogKey: string): Observable<Blob> {
    return this.http.get(this.api.apiUrl(`/api/v1/catalogs/${catalogKey}/export/template`), {
      headers: this.buildFileHeaders(),
      responseType: 'blob',
    });
  }

  exportCatalog(catalogKey: string, countryId?: number | null): Observable<Blob> {
    const query = countryId != null ? `?countryId=${countryId}` : '';
    return this.http.get(this.api.apiUrl(`/api/v1/catalogs/${catalogKey}/export${query}`), {
      headers: this.buildFileHeaders(),
      responseType: 'blob',
    });
  }

  validateImport(catalogKey: string, file: File): Observable<CatalogCsvStructureValidationResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CatalogCsvStructureValidationResponse>(
      this.api.apiUrl(`/api/v1/catalogs/${catalogKey}/import/validate`),
      formData,
      { headers: this.buildFileHeaders() },
    );
  }

  importCatalog(catalogKey: string, file: File): Observable<CatalogCsvImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CatalogCsvImportResponse>(
      this.api.apiUrl(`/api/v1/catalogs/${catalogKey}/import`),
      formData,
      { headers: this.buildFileHeaders() },
    );
  }

  private buildFileHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('sh_token') ?? '';
    return new HttpHeaders({
      applicationId: environment.applicationId,
      companyId: String(this.tenantContext.getCompanyId()),
      language: environment.language,
      authorization: token ? `Bearer ${token}` : '',
    });
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadBase64Csv(base64: string, filename: string): void {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  downloadBlob(new Blob([bytes], { type: 'text/csv;charset=utf-8' }), filename);
}
