import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser } from '../../shared/models';
import { ApiClientService } from './api-client.service';

const MOCK_USER: AuthUser = {
  id: '1',
  email: 'gquintana@empresa.com',
  firstName: 'Gerardo',
  lastName: 'Quintana',
  initials: 'GQ',
  role: 'RECRUITER',
  branch: 'CDMX Centro',
  permissions: ['home:read', 'positions:write', 'candidates:write', 'reports:read', 'settings:admin'],
};

interface LoginApiResponse {
  accessToken: string;
  expiresIn?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  readonly currentUser = signal<AuthUser | null>(null);

  login(username: string, password: string): Observable<AuthUser> {
    return this.http
      .post<LoginApiResponse>(
        this.api.apiUrl('/api/v1/auth/login'),
        { companyId: environment.companyId, username, password },
        { headers: this.api.buildHeaders() },
      )
      .pipe(
        tap((res) => {
          const user = { ...MOCK_USER, email: username.includes('@') ? username : `${username}@empresa.com` };
          this.currentUser.set(user);
          sessionStorage.setItem('sh_token', res.accessToken);
          sessionStorage.setItem('sh_user', JSON.stringify(user));
        }),
        map((res) => {
          const user = { ...MOCK_USER, email: username.includes('@') ? username : `${username}@empresa.com` };
          return user;
        }),
      );
  }

  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem('sh_token');
    sessionStorage.removeItem('sh_user');
  }

  restoreSession(): boolean {
    const raw = sessionStorage.getItem('sh_user');
    if (raw) {
      this.currentUser.set(JSON.parse(raw));
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('sh_token');
  }
}
