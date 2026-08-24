import { MatDialogConfig } from '@angular/material/dialog';
import { CATALOG_TALL_DIALOG_PANEL_CLASS } from '../../../core/dialog/catalog-dialog.constants';

export const INTERVIEW_CALENDAR_DIALOG_PANEL_CLASS = 'sh-interview-calendar-dialog-panel';

export function interviewCalendarDialogConfig(extra: MatDialogConfig = {}): MatDialogConfig {
  return {
    width: '980px',
    maxWidth: '96vw',
    maxHeight: '92vh',
    autoFocus: 'first-tabbable',
    panelClass: [INTERVIEW_CALENDAR_DIALOG_PANEL_CLASS, CATALOG_TALL_DIALOG_PANEL_CLASS],
    ...extra,
  };
}
