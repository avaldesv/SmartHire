import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  POSITIONS_REASON_DIALOG_CANCEL,
  POSITIONS_REASON_DIALOG_CONFIRM,
  POSITIONS_REASON_DIALOG_LABEL,
  POSITIONS_REASON_DIALOG_REQUIRED,
  POSITIONS_REASON_DIALOG_TITLE,
} from '../../../core/i18n/positions-labels';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';

export interface PositionReasonDialogData {
  title?: string;
  label?: string;
  required?: boolean;
  initialReason?: string;
}

@Component({
  selector: 'sh-position-reason-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  template: `
    <sh-modal-form [title]="title">
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ label }}</mat-label>
          <textarea matInput rows="4" formControlName="reason"></textarea>
          @if (form.controls.reason.hasError('required')) {
            <mat-error>{{ requiredMsg }}</mat-error>
          }
        </mat-form-field>
      </form>
      <div shModalActions>
        <button mat-button type="button" (click)="dialogRef.close(null)">{{ cancelLabel }}</button>
        <button mat-flat-button color="primary" type="button" [disabled]="form.invalid" (click)="confirm()">
          {{ confirmLabel }}
        </button>
      </div>
    </sh-modal-form>
  `,
  styles: `
    .full-width {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
  `,
})
export class PositionReasonDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PositionReasonDialogComponent, string | null>);
  private readonly data = inject<PositionReasonDialogData>(MAT_DIALOG_DATA, { optional: true });
  private readonly fb = inject(FormBuilder);

  readonly title = this.data?.title ?? POSITIONS_REASON_DIALOG_TITLE;
  readonly label = this.data?.label ?? POSITIONS_REASON_DIALOG_LABEL;
  readonly requiredMsg = POSITIONS_REASON_DIALOG_REQUIRED;
  readonly confirmLabel = POSITIONS_REASON_DIALOG_CONFIRM;
  readonly cancelLabel = POSITIONS_REASON_DIALOG_CANCEL;

  readonly form = this.fb.nonNullable.group({
    reason: [
      this.data?.initialReason ?? '',
      this.data?.required === false ? [] : [Validators.required],
    ],
  });

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.controls.reason.value.trim());
  }
}
