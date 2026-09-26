import { MatDialogConfig } from '@angular/material/dialog';

/** Applied to MatDialog overlay pane — header/body styles live in styles.scss. */
export const CATALOG_FORM_DIALOG_PANEL_CLASS = 'sh-catalog-form-dialog-panel';

/** Taller catalog dialogs (grids, maps, long forms). */
export const CATALOG_TALL_DIALOG_PANEL_CLASS = 'sh-catalog-tall-dialog-panel';

/** Wide split layout for survey create/edit (option D). */
export const SURVEY_FORM_DIALOG_PANEL_CLASS = 'sh-survey-form-dialog-panel';

/** Default MatDialog options aligned with catalog create/edit modals. */
export function catalogDialogConfig(
  width: string,
  extra: MatDialogConfig = {},
): MatDialogConfig {
  return {
    width,
    maxWidth: '95vw',
    maxHeight: '92vh',
    autoFocus: 'first-tabbable',
    panelClass: CATALOG_FORM_DIALOG_PANEL_CLASS,
    ...extra,
  };
}

/** Catalog dialog that uses most of the viewport height. */
export function catalogTallDialogConfig(
  width: string,
  extra: MatDialogConfig = {},
): MatDialogConfig {
  return catalogDialogConfig(width, {
    panelClass: [CATALOG_FORM_DIALOG_PANEL_CLASS, CATALOG_TALL_DIALOG_PANEL_CLASS],
    ...extra,
  });
}

/** Survey create/edit — wide two-column layout. */
export function surveyFormDialogConfig(extra: MatDialogConfig = {}): MatDialogConfig {
  return catalogDialogConfig('1120px', {
    panelClass: [
      CATALOG_FORM_DIALOG_PANEL_CLASS,
      CATALOG_TALL_DIALOG_PANEL_CLASS,
      SURVEY_FORM_DIALOG_PANEL_CLASS,
    ],
    minWidth: '960px',
    ...extra,
  });
}
