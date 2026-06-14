import { Injectable, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AuthUser } from '../../shared/models';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AuthUser | null>(null);

  login(email: string): Observable<AuthUser> {
    const user = { ...MOCK_USER, email: email || MOCK_USER.email };
    this.currentUser.set(user);
    sessionStorage.setItem('sh_token', 'mock-jwt-token');
    sessionStorage.setItem('sh_user', JSON.stringify(user));
    return of(user).pipe(delay(400));
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
