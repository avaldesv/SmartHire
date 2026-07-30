import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppPermissions } from '../auth/app-permissions';

const SETTINGS_PREFIX = 'SETTINGS_';
const CANDIDATE_ACCOUNT_PREFIX = 'CANDIDATE_ACCOUNT_';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  hasAuthority(authority: string): boolean {
    const normalized = authority.toUpperCase();
    const user = this.auth.currentUser();
    if (!user) {
      return false;
    }
    // Align with backend SecurityAuthorities ADMIN_OR_CANDIDATE_ACCOUNT_*:
    // hasRole('GLOBAL_ADMIN') or hasRole('ADMIN') or hasAuthority(...)
    if (
      normalized.startsWith(CANDIDATE_ACCOUNT_PREFIX) &&
      (user.roles.includes('GLOBAL_ADMIN') || user.roles.includes('ADMIN'))
    ) {
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
      AppPermissions.SETTINGS_PROMPTS_READ,
      AppPermissions.SETTINGS_PUBLICATION_READ,
      AppPermissions.SETTINGS_SYSTEM_READ,
      AppPermissions.REQUISITION_FORM_CONFIG_READ,
    ]);
  }
}
