import { MatDialogConfig } from '@angular/material/dialog';

/** Applied to MatDialog overlay pane — header/body styles live in styles.scss. */
export const CATALOG_FORM_DIALOG_PANEL_CLASS = 'sh-catalog-form-dialog-panel';

/** Default MatDialog options aligned with catalog create/edit modals. */
export function catalogDialogConfig(
  width: string,
  extra: MatDialogConfig = {},
): MatDialogConfig {
  return {
    width,
    maxWidth: '95vw',
    autoFocus: 'first-tabbable',
    panelClass: CATALOG_FORM_DIALOG_PANEL_CLASS,
    ...extra,
  };
}
