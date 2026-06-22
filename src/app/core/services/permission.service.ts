import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  /** User has at least one of the required permission strings. Empty list = allowed. */
  hasAnyPermission(required: readonly string[]): boolean {
    if (required.length === 0) {
      return true;
    }
    const user = this.auth.currentUser();
    if (!user?.permissions?.length) {
      return false;
    }
    return required.some((p) => user.permissions.includes(p));
  }
}
