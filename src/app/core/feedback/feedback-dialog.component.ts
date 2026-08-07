import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  FEEDBACK_CANCEL,
  FEEDBACK_CONFIRM,
  FEEDBACK_CONTINUE,
  FEEDBACK_UNDERSTOOD,
} from '../i18n/feedback-labels';
import { FeedbackDialogData, FeedbackType } from './feedback.types';

@Component({
  selector: 'sh-feedback-dialog',
  standalone: true,
  imports: [NgClass, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './feedback-dialog.component.html',
  styleUrl: './feedback-dialog.component.scss',
})
export class FeedbackDialogComponent {
  readonly data = inject<FeedbackDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<FeedbackDialogComponent, boolean>);

  readonly understoodLabel = FEEDBACK_UNDERSTOOD;
  readonly continueLabel = FEEDBACK_CONTINUE;
  readonly cancelLabel = this.data.cancelLabel ?? FEEDBACK_CANCEL;
  readonly confirmLabel = this.data.confirmLabel ?? FEEDBACK_CONFIRM;

  get icon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'confirm':
        return 'help_outline';
      case 'error':
      default:
        return 'error_outline';
    }
  }

  get primaryLabel(): string {
    return this.data.type === 'success' ? this.continueLabel : this.understoodLabel;
  }

  get typeClass(): string {
    return `sh-feedback-dialog--${this.data.type as FeedbackType}`;
  }

  close(confirmed = false): void {
    this.dialogRef.close(confirmed);
  }
}
