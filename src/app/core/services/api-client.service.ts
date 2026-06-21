import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  buildHeaders(page = 0, size = 100): HttpHeaders {
    const token = sessionStorage.getItem('sh_token') ?? '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      applicationId: environment.applicationId,
      companyId: String(environment.companyId),
      language: environment.language,
      page: String(page),
      size: String(size),
      authorization: token ? `Bearer ${token}` : '',
    });
  }

  apiUrl(path: string): string {
    return `${environment.apiBaseUrl}${path}`;
  }
}
