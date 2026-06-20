import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePositionRequest, CreatePositionResponse } from '../../shared/models/position.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  create(request: CreatePositionRequest): Observable<CreatePositionResponse> {
    return this.http.post<CreatePositionResponse>(this.api.apiUrl('/api/v1/positions'), request, {
      headers: this.api.buildHeaders(),
    });
  }
}
