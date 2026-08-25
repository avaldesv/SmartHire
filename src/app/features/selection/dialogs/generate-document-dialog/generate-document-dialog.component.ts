import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  DOCTEMPLATES_CANCEL,
  DOCTEMPLATES_GENERATE_CONFIRM,
  DOCTEMPLATES_GENERATE_EMPTY,
  DOCTEMPLATES_GENERATE_ERRORS_GENERATE,
  DOCTEMPLATES_GENERATE_ERRORS_LIST,
  DOCTEMPLATES_GENERATE_GENERATING,
  DOCTEMPLATES_GENERATE_SELECT,
  DOCTEMPLATES_GENERATE_SUCCESS,
  DOCTEMPLATES_GENERATE_TITLE,
} from '../../../../core/i18n/document-templates-labels';
import { DocumentTemplateApiService } from '../../../../core/services/document-template-api.service';
import { downloadBlob } from '../../../../core/services/catalog-import-export.service';
import { DocumentTemplateItem } from '../../../../shared/models/document-template.model';

export interface GenerateDocumentDialogData {
  applicationId: number;
  candidateName?: string;
}

@Component({
  selector: 'sh-generate-document-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './generate-document-dialog.component.html',
  styleUrl: './generate-document-dialog.component.scss',
})
export class GenerateDocumentDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<GenerateDocumentDialogComponent, boolean>);
  readonly data = inject<GenerateDocumentDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly templateApi = inject(DocumentTemplateApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = DOCTEMPLATES_GENERATE_TITLE;
  readonly selectLabel = DOCTEMPLATES_GENERATE_SELECT;
  readonly confirmLabel = DOCTEMPLATES_GENERATE_CONFIRM;
  readonly generatingLabel = DOCTEMPLATES_GENERATE_GENERATING;
  readonly cancelLabel = DOCTEMPLATES_CANCEL;
  readonly emptyLabel = DOCTEMPLATES_GENERATE_EMPTY;
  readonly listErrorLabel = DOCTEMPLATES_GENERATE_ERRORS_LIST;

  templates: DocumentTemplateItem[] = [];
  loading = true;
  generating = false;
  loadError = false;

  readonly form = this.fb.nonNullable.group({
    templateId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.templateApi.list(0, 100, { isActive: true }).subscribe({
      next: (res) => {
        this.templates = res.items;
        this.loading = false;
        if (this.templates.length === 1) {
          this.form.controls.templateId.setValue(this.templates[0].id);
        }
      },
      error: (err) => {
        this.loading = false;
        this.loadError = true;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_GENERATE_ERRORS_LIST });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    if (this.form.invalid || this.generating) {
      this.form.markAllAsTouched();
      return;
    }
    const templateId = this.form.controls.templateId.value;
    if (templateId == null) {
      return;
    }
    const selected = this.templates.find((t) => t.id === templateId);
    const baseName = selected?.name?.trim() || selected?.fileName?.replace(/\.docx$/i, '') || 'documento';
    const filename = `${this.sanitizeFilename(baseName)}.docx`;

    this.generating = true;
    this.templateApi.generate(templateId, this.data.applicationId).subscribe({
      next: (blob) => {
        downloadBlob(blob, filename);
        this.generating = false;
        this.feedback.showSuccess(DOCTEMPLATES_GENERATE_SUCCESS);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.generating = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_GENERATE_ERRORS_GENERATE });
      },
    });
  }

  private sanitizeFilename(name: string): string {
    return name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim() || 'documento';
  }
}
