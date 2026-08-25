import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import {
  DOCTEMPLATES_CANCEL,
  DOCTEMPLATES_SAVE,
  DOCTEMPLATES_SAVING,
  DOCTEMPLATES_TPL_DIALOG_EDIT,
  DOCTEMPLATES_TPL_DIALOG_NEW,
  DOCTEMPLATES_TPL_ERRORS_FILE_TYPE,
  DOCTEMPLATES_TPL_ERRORS_LOAD,
  DOCTEMPLATES_TPL_ERRORS_SAVE,
  DOCTEMPLATES_TPL_ERRORS_VALIDATE,
  DOCTEMPLATES_TPL_FIELD_ACTIVE,
  DOCTEMPLATES_TPL_FIELD_FILE,
  DOCTEMPLATES_TPL_FIELD_NAME,
  DOCTEMPLATES_TPL_FILE_CURRENT,
  DOCTEMPLATES_TPL_FILE_HINT,
  DOCTEMPLATES_TPL_INVALID_VARS,
  DOCTEMPLATES_TPL_VALIDATING,
  DOCTEMPLATES_TPL_VALID_VARS,
} from '../../../core/i18n/document-templates-labels';
import { DocumentTemplateApiService } from '../../../core/services/document-template-api.service';

export interface DocumentTemplateFormDialogData {
  templateId?: number;
}

@Component({
  selector: 'sh-document-template-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './document-template-form-dialog.component.html',
  styleUrl: './document-template-form-dialog.component.scss',
})
export class DocumentTemplateFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<DocumentTemplateFormDialogComponent, boolean>);
  readonly data = inject<DocumentTemplateFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(DocumentTemplateApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  loading = !!this.data.templateId;
  saving = false;
  validating = false;
  selectedFile: File | null = null;
  currentFileName: string | null = null;
  validCodes: string[] = [];
  invalidCodes: string[] = [];
  readonly editingId: number | null = this.data.templateId ?? null;

  readonly dialogNew = DOCTEMPLATES_TPL_DIALOG_NEW;
  readonly dialogEdit = DOCTEMPLATES_TPL_DIALOG_EDIT;
  readonly fieldName = DOCTEMPLATES_TPL_FIELD_NAME;
  readonly fieldFile = DOCTEMPLATES_TPL_FIELD_FILE;
  readonly fieldActive = DOCTEMPLATES_TPL_FIELD_ACTIVE;
  readonly fileHint = DOCTEMPLATES_TPL_FILE_HINT;
  readonly fileCurrent = DOCTEMPLATES_TPL_FILE_CURRENT;
  readonly validVarsLabel = DOCTEMPLATES_TPL_VALID_VARS;
  readonly invalidVarsLabel = DOCTEMPLATES_TPL_INVALID_VARS;
  readonly validatingLabel = DOCTEMPLATES_TPL_VALIDATING;
  readonly cancelLabel = DOCTEMPLATES_CANCEL;
  readonly savingLabel = DOCTEMPLATES_SAVING;
  readonly saveLabel = DOCTEMPLATES_SAVE;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    isActive: [true],
  });

  get title(): string {
    return this.editingId ? this.dialogEdit : this.dialogNew;
  }

  get canSave(): boolean {
    if (this.saving || this.loading || this.validating || this.form.invalid) {
      return false;
    }
    if (this.invalidCodes.length > 0) {
      return false;
    }
    if (!this.editingId && !this.selectedFile) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    if (!this.editingId) {
      return;
    }
    this.api.getById(this.editingId).subscribe({
      next: (template) => {
        this.form.patchValue({
          name: template.name,
          isActive: template.isActive,
        });
        this.currentFileName = template.fileName;
        this.validCodes = template.usedVariableCodes ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_TPL_ERRORS_LOAD });
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (!file) {
      return;
    }
    if (!file.name.toLowerCase().endsWith('.docx')) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, DOCTEMPLATES_TPL_ERRORS_FILE_TYPE);
      return;
    }
    this.selectedFile = file;
    this.validCodes = [];
    this.invalidCodes = [];
    this.validating = true;
    this.api.validate(file).subscribe({
      next: (result) => {
        this.validCodes = result.valid ?? [];
        this.invalidCodes = result.invalid ?? [];
        this.validating = false;
      },
      error: (err) => {
        this.validating = false;
        this.selectedFile = null;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_TPL_ERRORS_VALIDATE });
      },
    });
  }

  save(): void {
    if (!this.canSave) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const name = value.name.trim();
    this.saving = true;

    const request$ =
      !this.editingId && this.selectedFile
        ? this.api.create(name, this.selectedFile, value.isActive)
        : this.editingId && this.selectedFile
          ? this.api.updateWithFile(this.editingId, this.selectedFile, {
              name,
              isActive: value.isActive,
            })
          : this.editingId
            ? this.api.updateMetadata(this.editingId, { name, isActive: value.isActive })
            : null;

    if (!request$) {
      this.saving = false;
      return;
    }

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_TPL_ERRORS_SAVE });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
