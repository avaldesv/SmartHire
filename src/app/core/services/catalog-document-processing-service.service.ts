import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CatalogDocumentProcessingService,
  DocumentProcessingServiceListResponse,
} from '../../shared/models/catalog-document-processing-service.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CatalogDocumentProcessingServiceService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(
    countryId: number | null,
    page = 0,
    size = 200,
  ): Observable<{ items: CatalogDocumentProcessingService[]; total: number }> {
    const body = {
      countryId,
      isActive: true,
      isIa: null,
      filters: [],
      ordersBy: ['name:asc'] as string[],
    };
    return this.http
      .post<DocumentProcessingServiceListResponse>(
        this.api.apiUrl('/api/v1/document-processing-services/list'),
        body,
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(
        map((res) => ({
          items: res.data ?? [],
          total: res.pagination?.total ?? 0,
        })),
      );
  }
}
