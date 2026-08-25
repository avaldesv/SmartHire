import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  DOCTEMPLATES_CANCEL,
  DOCTEMPLATES_SAVE,
  DOCTEMPLATES_SAVING,
  DOCTEMPLATES_VAR_CODE_HINT,
  DOCTEMPLATES_VAR_DIALOG_EDIT,
  DOCTEMPLATES_VAR_DIALOG_NEW,
  DOCTEMPLATES_VAR_ERRORS_SAVE,
  DOCTEMPLATES_VAR_FIELD_ACTIVE,
  DOCTEMPLATES_VAR_FIELD_CODE,
  DOCTEMPLATES_VAR_FIELD_DESCRIPTION,
  DOCTEMPLATES_VAR_FIELD_LABEL,
} from '../../../core/i18n/document-templates-labels';
import { DocumentTemplateVariableApiService } from '../../../core/services/document-template-variable-api.service';
import { DocumentTemplateVariableItem } from '../../../shared/models/document-template.model';

export interface DocumentTemplateVariableFormDialogData {
  variable?: DocumentTemplateVariableItem;
}

const CODE_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;

@Component({
  selector: 'sh-document-template-variable-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './document-template-variable-form-dialog.component.html',
  styleUrl: './document-template-variable-form-dialog.component.scss',
})
export class DocumentTemplateVariableFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<DocumentTemplateVariableFormDialogComponent, boolean>);
  readonly data = inject<DocumentTemplateVariableFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(DocumentTemplateVariableApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  saving = false;
  readonly editingId: number | null = this.data.variable?.id ?? null;

  readonly dialogNew = DOCTEMPLATES_VAR_DIALOG_NEW;
  readonly dialogEdit = DOCTEMPLATES_VAR_DIALOG_EDIT;
  readonly fieldCode = DOCTEMPLATES_VAR_FIELD_CODE;
  readonly fieldLabel = DOCTEMPLATES_VAR_FIELD_LABEL;
  readonly fieldDescription = DOCTEMPLATES_VAR_FIELD_DESCRIPTION;
  readonly fieldActive = DOCTEMPLATES_VAR_FIELD_ACTIVE;
  readonly codeHint = DOCTEMPLATES_VAR_CODE_HINT;
  readonly cancelLabel = DOCTEMPLATES_CANCEL;
  readonly savingLabel = DOCTEMPLATES_SAVING;
  readonly saveLabel = DOCTEMPLATES_SAVE;

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(128), Validators.pattern(CODE_PATTERN)]],
    label: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.maxLength(500)],
    isActive: [true],
  });

  get title(): string {
    return this.editingId ? this.dialogEdit : this.dialogNew;
  }

  ngOnInit(): void {
    const variable = this.data.variable;
    if (!variable) {
      return;
    }
    this.form.patchValue({
      code: variable.code,
      label: variable.label,
      description: variable.description ?? '',
      isActive: variable.isActive,
    });
    this.form.controls.code.disable({ emitEvent: false });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saving = true;

    const request$ = this.editingId
      ? this.api.update(this.editingId, {
          label: value.label.trim(),
          description: value.description.trim() || null,
          isActive: value.isActive,
        })
      : this.api.create({
          code: value.code.trim(),
          label: value.label.trim(),
          description: value.description.trim() || null,
          isActive: value.isActive,
        });

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_VAR_ERRORS_SAVE });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
