import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  DOCTEMPLATES_CANCEL,
  DOCTEMPLATES_SAVE,
  DOCTEMPLATES_SAVING,
  DOCTEMPLATES_VAR_CODE_HINT,
  DOCTEMPLATES_VAR_DIALOG_EDIT,
  DOCTEMPLATES_VAR_DIALOG_NEW,
  DOCTEMPLATES_VAR_ERRORS_FIELDS,
  DOCTEMPLATES_VAR_ERRORS_SAVE,
  DOCTEMPLATES_VAR_FIELD_ACTIVE,
  DOCTEMPLATES_VAR_FIELD_CODE,
  DOCTEMPLATES_VAR_FIELD_DESCRIPTION,
  DOCTEMPLATES_VAR_FIELD_LABEL,
  DOCTEMPLATES_VAR_FIELD_ORIGIN,
  DOCTEMPLATES_VAR_FIELD_SOURCE,
  DOCTEMPLATES_VAR_NO_FIELDS,
  DOCTEMPLATES_VAR_ORIGIN_APPLICATION,
  DOCTEMPLATES_VAR_ORIGIN_CANDIDATE,
  DOCTEMPLATES_VAR_ORIGIN_COMPANY,
  DOCTEMPLATES_VAR_ORIGIN_POSITION,
  DOCTEMPLATES_VAR_ORIGIN_RECRUITER,
} from '../../../core/i18n/document-templates-labels';
import { DocumentTemplateVariableApiService } from '../../../core/services/document-template-variable-api.service';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';
import {
  DocumentTemplateAvailableField,
  DocumentTemplateFieldOrigin,
  DocumentTemplateVariableItem,
} from '../../../shared/models/document-template.model';

export interface DocumentTemplateVariableFormDialogData {
  variable?: DocumentTemplateVariableItem;
}

@Component({
  selector: 'sh-document-template-variable-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    ShModalFormComponent,
    ShModalActionsDirective,
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
  loadingFields = false;
  availableFields: DocumentTemplateAvailableField[] = [];
  readonly editingId: number | null = this.data.variable?.id ?? null;

  readonly dialogNew = DOCTEMPLATES_VAR_DIALOG_NEW;
  readonly dialogEdit = DOCTEMPLATES_VAR_DIALOG_EDIT;
  readonly fieldOrigin = DOCTEMPLATES_VAR_FIELD_ORIGIN;
  readonly fieldSource = DOCTEMPLATES_VAR_FIELD_SOURCE;
  readonly fieldCode = DOCTEMPLATES_VAR_FIELD_CODE;
  readonly fieldLabel = DOCTEMPLATES_VAR_FIELD_LABEL;
  readonly fieldDescription = DOCTEMPLATES_VAR_FIELD_DESCRIPTION;
  readonly fieldActive = DOCTEMPLATES_VAR_FIELD_ACTIVE;
  readonly codeHint = DOCTEMPLATES_VAR_CODE_HINT;
  readonly noFields = DOCTEMPLATES_VAR_NO_FIELDS;
  readonly cancelLabel = DOCTEMPLATES_CANCEL;
  readonly savingLabel = DOCTEMPLATES_SAVING;
  readonly saveLabel = DOCTEMPLATES_SAVE;

  readonly originOptions: { value: DocumentTemplateFieldOrigin; label: string }[] = [
    { value: 'CANDIDATE', label: DOCTEMPLATES_VAR_ORIGIN_CANDIDATE },
    { value: 'POSITION', label: DOCTEMPLATES_VAR_ORIGIN_POSITION },
    { value: 'RECRUITER', label: DOCTEMPLATES_VAR_ORIGIN_RECRUITER },
    { value: 'APPLICATION', label: DOCTEMPLATES_VAR_ORIGIN_APPLICATION },
    { value: 'COMPANY', label: DOCTEMPLATES_VAR_ORIGIN_COMPANY },
  ];

  readonly form = this.fb.nonNullable.group({
    origin: ['' as DocumentTemplateFieldOrigin | ''],
    sourceKey: [''],
    code: [''],
    label: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.maxLength(500)],
    isActive: [true],
  });

  get title(): string {
    return this.editingId ? this.dialogEdit : this.dialogNew;
  }

  get fieldsForOrigin(): DocumentTemplateAvailableField[] {
    const origin = this.form.controls.origin.value;
    if (!origin) {
      return [];
    }
    return this.availableFields.filter((field) => field.origin === origin);
  }

  ngOnInit(): void {
    const variable = this.data.variable;
    if (variable) {
      this.form.patchValue({
        origin: variable.origin ?? '',
        sourceKey: variable.sourceKey ?? '',
        code: variable.code,
        label: variable.label,
        description: variable.description ?? '',
        isActive: variable.isActive,
      });
      this.form.controls.origin.disable({ emitEvent: false });
      this.form.controls.sourceKey.disable({ emitEvent: false });
      this.form.controls.code.disable({ emitEvent: false });
      return;
    }

    this.form.controls.origin.addValidators(Validators.required);
    this.form.controls.sourceKey.addValidators(Validators.required);
    this.form.controls.code.disable({ emitEvent: false });
    this.loadingFields = true;
    this.api.availableFields().subscribe({
      next: (res) => {
        this.availableFields = res.fields ?? [];
        this.loadingFields = false;
      },
      error: (err) => {
        this.loadingFields = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_VAR_ERRORS_FIELDS });
      },
    });
  }

  onOriginChange(): void {
    this.form.patchValue({ sourceKey: '', code: '', label: '', description: '' });
  }

  onSourceKeyChange(): void {
    const field = this.fieldsForOrigin.find((item) => item.sourceKey === this.form.controls.sourceKey.value);
    if (!field) {
      return;
    }
    this.form.patchValue({
      code: field.suggestedCode,
      label: field.label,
      description: field.description ?? '',
    });
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
          sourceKey: value.sourceKey,
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
