import { NgTemplateOutlet } from '@angular/common';
import { Component, ViewEncapsulation, inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';

export interface NotificationFormDialogData {
  title: string;
  content: TemplateRef<unknown>;
}

/** Prefer catalog form panel; keep alias for existing open() calls. */
export const NOTIFICATION_FORM_DIALOG_PANEL_CLASS = 'sh-catalog-form-dialog-panel';

@Component({
  selector: 'sh-notification-form-dialog-shell',
  standalone: true,
  imports: [NgTemplateOutlet, ShModalFormComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <sh-modal-form [title]="data.title">
      <ng-container *ngTemplateOutlet="data.content" />
    </sh-modal-form>
  `,
  styles: [
    `
      sh-notification-form-dialog-shell {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        height: 100%;
      }

      sh-notification-form-dialog-shell .sh-catalog-dialog-body .template-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 12px;
        align-items: start;
      }

      sh-notification-form-dialog-shell .sh-catalog-dialog-body .template-form > .message-field,
      sh-notification-form-dialog-shell .sh-catalog-dialog-body .template-form > .variables-panel,
      sh-notification-form-dialog-shell .sh-catalog-dialog-body .template-form > mat-checkbox {
        grid-column: 1 / -1;
      }

      @media (max-width: 700px) {
        sh-notification-form-dialog-shell .sh-catalog-dialog-body .template-form {
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
