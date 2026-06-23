import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionService);
  const router = inject(Router);
  const required = route.data['authorities'] as string[] | undefined;
  if (!required?.length || permissions.hasAny(required)) {
    return true;
  }
  return router.createUrlTree(['/unauthorized']);
};
