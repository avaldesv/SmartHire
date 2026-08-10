import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CANDIDATE_DOCS_INVALIDATE_CANCEL,
  CANDIDATE_DOCS_INVALIDATE_CONFIRM,
  CANDIDATE_DOCS_INVALIDATE_REASON,
  CANDIDATE_DOCS_INVALIDATE_TITLE,
} from '../../../../core/i18n/candidate-documents-dialog-labels';

export interface InvalidateDocumentDialogData {
  fileName?: string | null;
}

export interface InvalidateDocumentDialogResult {
  rejectionReason: string;
}

@Component({
  selector: 'sh-invalidate-document-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ title }}</span>
    </div>
    <mat-dialog-content class="sh-catalog-dialog-body">
      <div class="sh-catalog-dialog-gap" aria-hidden="true"></div>
      @if (data.fileName) {
        <p class="file-name">{{ data.fileName }}</p>
      }
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ reasonLabel }}</mat-label>
          <textarea matInput rows="4" formControlName="rejectionReason"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close(null)">{{ cancelLabel }}</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="form.invalid"
        (click)="confirm()"
      >
        {{ confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
    }
    .file-name {
      margin: 0 0 12px;
      color: rgba(0, 0, 0, 0.7);
      word-break: break-word;
    }
  `,
})
export class InvalidateDocumentDialogComponent {
  readonly dialogRef = inject(MatDialogRef<InvalidateDocumentDialogComponent>);
  readonly data = inject<InvalidateDocumentDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly title = CANDIDATE_DOCS_INVALIDATE_TITLE;
  readonly reasonLabel = CANDIDATE_DOCS_INVALIDATE_REASON;
  readonly confirmLabel = CANDIDATE_DOCS_INVALIDATE_CONFIRM;
  readonly cancelLabel = CANDIDATE_DOCS_INVALIDATE_CANCEL;

  readonly form = this.fb.group({
    rejectionReason: ['', [Validators.required, Validators.maxLength(512)]],
  });

  confirm(): void {
    if (this.form.invalid) {
      return;
    }
    const rejectionReason = this.form.controls.rejectionReason.value?.trim() ?? '';
    if (!rejectionReason) {
      return;
    }
    this.dialogRef.close({ rejectionReason } satisfies InvalidateDocumentDialogResult);
  }
}
