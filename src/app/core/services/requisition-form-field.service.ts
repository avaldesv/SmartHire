import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ListRequisitionFormFieldDefsRequest,
  RequisitionFormFieldDef,
  RequisitionFormFieldDefListResponse,
} from '../../shared/models/requisition-form.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class RequisitionFormFieldService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  list(page = 0, size = 500, request: ListRequisitionFormFieldDefsRequest = {}): Observable<RequisitionFormFieldDef[]> {
    const body: ListRequisitionFormFieldDefsRequest = {
      isActive: true,
      isBuiltin: null,
      search: null,
      filters: [],
      ordersBy: ['fieldKey:asc'],
      ...request,
    };
    return this.http
      .post<RequisitionFormFieldDefListResponse>(this.api.apiUrl('/api/v1/requisition-form/fields/list'), body, {
        headers: this.api.buildHeaders(page, size),
      })
      .pipe(map((res) => res.data ?? []));
  }

  getById(id: number): Observable<RequisitionFormFieldDef> {
    return this.http.get<RequisitionFormFieldDef>(this.api.apiUrl(`/api/v1/requisition-form/fields/${id}`), {
      headers: this.api.buildHeaders(),
    });
  }
}
