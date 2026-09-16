import { MatDialogConfig } from '@angular/material/dialog';
import { CATALOG_TALL_DIALOG_PANEL_CLASS } from '../../../core/dialog/catalog-dialog.constants';

export const JOB_PORTAL_CREDENTIALS_DIALOG_PANEL_CLASS = 'sh-job-portal-credentials-dialog-panel';

export function jobPortalCredentialsDialogConfig(extra: MatDialogConfig = {}): MatDialogConfig {
  return {
    width: '920px',
    maxWidth: '96vw',
    maxHeight: '92vh',
    autoFocus: 'first-tabbable',
    panelClass: [JOB_PORTAL_CREDENTIALS_DIALOG_PANEL_CLASS, CATALOG_TALL_DIALOG_PANEL_CLASS],
    ...extra,
  };
}
