import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { msalScopes } from '../auth/msal.config';
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
  private readonly msal = inject(MsalService, { optional: true });

  readonly currentUser = signal<AuthUser | null>(null);

  isSsoEnabled(): boolean {
    const azure = environment.azure;
    return !!azure?.enabled && !!azure.clientId && !!azure.tenantId;
  }

  login(username: string, password: string): Observable<AuthUser> {
    return this.http
      .post<LoginApiResponse>(
        this.api.apiUrl('/api/v1/auth/login'),
        { companyId: environment.companyId, username, password },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      )
      .pipe(
        tap((res) => this.persistSession(username, res.accessToken)),
        map(() => this.buildUserFromUsername(username)),
      );
  }

  exchangeSsoToken(azureAccessToken: string): Observable<AuthUser> {
    return this.http
      .post<LoginApiResponse>(
        this.api.apiUrl('/api/v1/auth/sso/exchange'),
        { companyId: environment.companyId },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${azureAccessToken}`,
          }),
        },
      )
      .pipe(
        tap((res) => {
          const email = this.resolveSsoEmail();
          this.persistSession(email, res.accessToken);
        }),
        map(() => this.buildUserFromUsername(this.resolveSsoEmail())),
      );
  }

  ssoLogin(): void {
    if (!this.isSsoEnabled() || !this.msal) {
      return;
    }
    this.msal.loginRedirect({ scopes: msalScopes });
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

  private persistSession(usernameOrEmail: string, accessToken: string): void {
    const user = this.buildUserFromUsername(usernameOrEmail);
    this.currentUser.set(user);
    sessionStorage.setItem('sh_token', accessToken);
    sessionStorage.setItem('sh_user', JSON.stringify(user));
  }

  private buildUserFromUsername(usernameOrEmail: string): AuthUser {
    const email = usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@empresa.com`;
    return { ...MOCK_USER, email };
  }

  private resolveSsoEmail(): string {
    const account = this.msal?.instance.getAllAccounts()[0];
    const claimEmail = account?.username ?? account?.idTokenClaims?.['preferred_username'];
    if (typeof claimEmail === 'string' && claimEmail.includes('@')) {
      return claimEmail;
    }
    return MOCK_USER.email;
  }
}
