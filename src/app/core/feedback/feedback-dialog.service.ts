import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  FEEDBACK_GENERIC_INFO_TITLE,
  FEEDBACK_GENERIC_SUCCESS_TITLE,
  FEEDBACK_GENERIC_WARNING_TITLE,
} from '../i18n/feedback-labels';
import {
  ApiErrorResolveOptions,
  ApiErrorResolverService,
} from '../services/api-error-resolver.service';
import { FeedbackDialogComponent } from './feedback-dialog.component';
import { ConfirmOptions, FeedbackDialogData, FeedbackType } from './feedback.types';

@Injectable({ providedIn: 'root' })
export class FeedbackDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly apiErrors = inject(ApiErrorResolverService);

  showApiError(error: unknown, options: ApiErrorResolveOptions = {}): void {
    const resolved = this.apiErrors.resolve(error, options);
    this.open({
      type: resolved.severity,
      title: resolved.title,
      message: resolved.message,
    });
  }

  showError(title: string, message: string): void {
    this.open({ type: 'error', title, message });
  }

  showWarning(title: string, message: string): void {
    this.open({ type: 'warning', title, message });
  }

  showInfo(title: string, message: string): void {
    this.open({
      type: 'info',
      title: title || FEEDBACK_GENERIC_INFO_TITLE,
      message,
    });
  }

  showSuccess(title: string, message?: string): void {
    this.open({
      type: 'success',
      title: title || FEEDBACK_GENERIC_SUCCESS_TITLE,
      message: message ?? title,
    });
  }

  confirm(options: ConfirmOptions): Observable<boolean> {
    return this.dialog
      .open(FeedbackDialogComponent, {
        ...this.dialogConfig('confirm'),
        disableClose: true,
        data: {
          type: 'confirm',
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel,
          cancelLabel: options.cancelLabel,
          confirmWarn: options.confirmWarn,
          iconType: options.iconType,
        } satisfies FeedbackDialogData,
      })
      .afterClosed();
  }

  private open(data: FeedbackDialogData): void {
    this.dialog.open(FeedbackDialogComponent, {
      ...this.dialogConfig(data.type),
      data,
    });
  }

  private dialogConfig(type: FeedbackType) {
    return {
      width: '420px',
      maxWidth: '92vw',
      autoFocus: 'first-tabbable',
      panelClass: ['sh-feedback-dialog-panel', `sh-feedback-dialog-panel--${type}`],
    };
  }
}
