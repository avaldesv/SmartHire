import { NgTemplateOutlet } from '@angular/common';
import { Component, ViewEncapsulation, inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface NotificationFormDialogData {
  title: string;
  content: TemplateRef<unknown>;
}

/** Applied to MatDialog overlay pane — styles live in styles.scss (global). */
export const NOTIFICATION_FORM_DIALOG_PANEL_CLASS = 'sh-notification-form-dialog-panel';

@Component({
  selector: 'sh-notification-form-dialog-shell',
  standalone: true,
  imports: [MatDialogModule, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="sh-notification-dialog-header" mat-dialog-title>
      <span class="sh-notification-dialog-header__text">{{ data.title }}</span>
    </div>
    <mat-dialog-content class="sh-notification-dialog-body">
      <div class="sh-notification-dialog-gap" aria-hidden="true"></div>
      <ng-container *ngTemplateOutlet="data.content" />
    </mat-dialog-content>
  `,
  styles: [
    `
      sh-notification-form-dialog-shell {
        display: block;
      }

      sh-notification-form-dialog-shell .sh-notification-dialog-body .template-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 12px;
        align-items: start;
      }

      sh-notification-form-dialog-shell .sh-notification-dialog-body .template-form > .message-field,
      sh-notification-form-dialog-shell .sh-notification-dialog-body .template-form > .variables-panel,
      sh-notification-form-dialog-shell .sh-notification-dialog-body .template-form > .form-actions,
      sh-notification-form-dialog-shell .sh-notification-dialog-body .template-form > mat-checkbox {
        grid-column: 1 / -1;
      }

      sh-notification-form-dialog-shell .sh-notification-dialog-body .form-actions {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }

      @media (max-width: 700px) {
        sh-notification-form-dialog-shell .sh-notification-dialog-body .template-form {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class NotificationFormDialogShellComponent {
  readonly data = inject<NotificationFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<NotificationFormDialogShellComponent, boolean>);

  close(saved = false): void {
    this.dialogRef.close(saved);
  }
}
