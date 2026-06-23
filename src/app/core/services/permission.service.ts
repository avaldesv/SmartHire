import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  hasAuthority(authority: string): boolean {
    const normalized = authority.toUpperCase();
    const user = this.auth.currentUser();
    if (!user) {
      return false;
    }
    if (user.roles.includes('ADMIN')) {
      return true;
    }
    return user.authorities.includes(normalized);
  }

  hasAny(authorities: readonly string[]): boolean {
    return authorities.some((authority) => this.hasAuthority(authority));
  }

  hasAnyPermission(authorities: readonly string[]): boolean {
    return this.hasAny(authorities);
  }

  hasAll(authorities: readonly string[]): boolean {
    return authorities.every((authority) => this.hasAuthority(authority));
  }
}
