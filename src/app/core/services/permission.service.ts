import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppPermissions } from '../auth/app-permissions';

const SETTINGS_PREFIX = 'SETTINGS_';

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
    if (user.roles.includes('GLOBAL_ADMIN')) {
      if (normalized.startsWith(SETTINGS_PREFIX)) {
        return true;
      }
      return user.authorities.includes(normalized);
    }
    return user.authorities.includes(normalized);
  }

  isGlobalAdmin(): boolean {
    return this.auth.currentUser()?.globalAdmin === true;
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

  canAccessSettings(): boolean {
    return this.hasAny([
      AppPermissions.SETTINGS_USERS_READ,
      AppPermissions.SETTINGS_GROUPS_READ,
      AppPermissions.SETTINGS_CATALOGS_READ,
      AppPermissions.SETTINGS_NOTIFICATIONS_READ,
      AppPermissions.SETTINGS_SYSTEM_READ,
    ]);
  }
}
