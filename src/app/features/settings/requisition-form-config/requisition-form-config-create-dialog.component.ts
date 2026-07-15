import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  REQ_FORM_CONFIG_CANCEL,
  REQ_FORM_CONFIG_CREATE_CONFIRM,
  REQ_FORM_CONFIG_CREATE_DIALOG_TITLE,
  REQ_FORM_CONFIG_FIELD_COUNTRY,
  REQ_FORM_CONFIG_FIELD_COVERAGE,
  REQ_FORM_CONFIG_FIELD_NAME,
  REQ_FORM_CONFIG_NAME_REQUIRED,
  REQ_FORM_CONFIG_SCOPE_HINT,
  REQ_FORM_CONFIG_SCOPE_LABEL,
} from '../../../core/i18n/requisition-form-config-labels';

export interface RequisitionFormConfigCreateDialogData {
  countryId: number;
  coverageTypeId: number;
  countryName: string;
  coverageTypeName: string;
}

export interface RequisitionFormConfigCreateDialogResult {
  name: string;
}

@Component({
  selector: 'sh-requisition-form-config-create-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './requisition-form-config-create-dialog.component.html',
  styleUrl: './requisition-form-config-create-dialog.component.scss',
})
export class RequisitionFormConfigCreateDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<RequisitionFormConfigCreateDialogComponent, RequisitionFormConfigCreateDialogResult | null>,
  );
  private readonly fb = inject(FormBuilder);
  readonly data = inject<RequisitionFormConfigCreateDialogData>(MAT_DIALOG_DATA);

  readonly title = REQ_FORM_CONFIG_CREATE_DIALOG_TITLE;
  readonly fieldName = REQ_FORM_CONFIG_FIELD_NAME;
  readonly nameRequired = REQ_FORM_CONFIG_NAME_REQUIRED;
  readonly cancelLabel = REQ_FORM_CONFIG_CANCEL;
  readonly confirmLabel = REQ_FORM_CONFIG_CREATE_CONFIRM;
  readonly scopeLabel = REQ_FORM_CONFIG_SCOPE_LABEL;
  readonly scopeHint = REQ_FORM_CONFIG_SCOPE_HINT;
  readonly fieldCountry = REQ_FORM_CONFIG_FIELD_COUNTRY;
  readonly fieldCoverage = REQ_FORM_CONFIG_FIELD_COVERAGE;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
  });

  cancel(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close({ name: this.form.controls.name.value.trim() });
  }
}
