import { effect, inject } from '@angular/core';
import { TenantContextService } from '../../../core/services/tenant-context.service';

/**
 * Reloads the active report when SuperAdmin (or any user) changes tenant in the shell.
 * Call from the component constructor; invoke the returned function at the end of ngOnInit
 * so the first paint does not double-load.
 */
export function armReportTenantReload(reload: () => void): () => void {
  const tenantContext = inject(TenantContextService);
  let ready = false;
  effect(() => {
    tenantContext.activeCompanyId();
    if (!ready) {
      return;
    }
    reload();
  });
  return () => {
    ready = true;
  };
}
