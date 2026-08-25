import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
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
  DOCTEMPLATES_TPL_FIELD_NAME,
  DOCTEMPLATES_TPL_FILE_CURRENT,
  DOCTEMPLATES_TPL_FILE_HINT,
  DOCTEMPLATES_TPL_INVALID_VARS,
  DOCTEMPLATES_TPL_PICK_FILE,
  DOCTEMPLATES_TPL_PREVIEW_EMPTY,
  DOCTEMPLATES_TPL_PREVIEW_ERROR,
  DOCTEMPLATES_TPL_PREVIEW_LOADING,
  DOCTEMPLATES_TPL_PREVIEW_TITLE,
  DOCTEMPLATES_TPL_PREVIEW_ZOOM_IN,
  DOCTEMPLATES_TPL_PREVIEW_ZOOM_OUT,
  DOCTEMPLATES_TPL_PREVIEW_ZOOM_RESET,
  DOCTEMPLATES_TPL_PREVIEW_ZOOM_TOOLBAR,
  DOCTEMPLATES_TPL_VALIDATING,
  DOCTEMPLATES_TPL_VALID_VARS,
} from '../../../core/i18n/document-templates-labels';
import { DocumentTemplateApiService } from '../../../core/services/document-template-api.service';
import { DocumentTemplateDocxPreviewService } from '../../../core/services/document-template-docx-preview.service';

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
export class DocumentTemplateFormDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<DocumentTemplateFormDialogComponent, boolean>);
  readonly data = inject<DocumentTemplateFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(DocumentTemplateApiService);
  private readonly previewService = inject(DocumentTemplateDocxPreviewService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('previewHost')
  set previewHostRef(ref: ElementRef<HTMLElement> | undefined) {
    this.previewHost = ref;
    if (ref && this.pendingPreviewBuffer) {
      void this.flushPreview();
    }
  }
  private previewHost?: ElementRef<HTMLElement>;

  loading = !!this.data.templateId;
  saving = false;
  validating = false;
  previewLoading = false;
  previewReady = false;
  previewError = false;
  previewZoom = 0.55;
  readonly minPreviewZoom = 0.25;
  readonly maxPreviewZoom = 1.5;
  readonly previewZoomStep = 0.1;
  selectedFile: File | null = null;
  currentFileName: string | null = null;
  validCodes: string[] = [];
  invalidCodes: string[] = [];
  readonly editingId: number | null = this.data.templateId ?? null;

  private pendingPreviewBuffer: ArrayBuffer | null = null;
  private previewRequestId = 0;

  readonly dialogNew = DOCTEMPLATES_TPL_DIALOG_NEW;
  readonly dialogEdit = DOCTEMPLATES_TPL_DIALOG_EDIT;
  readonly fieldName = DOCTEMPLATES_TPL_FIELD_NAME;
  readonly pickFileLabel = DOCTEMPLATES_TPL_PICK_FILE;
  readonly fieldActive = DOCTEMPLATES_TPL_FIELD_ACTIVE;
  readonly fileHint = DOCTEMPLATES_TPL_FILE_HINT;
  readonly fileCurrent = DOCTEMPLATES_TPL_FILE_CURRENT;
  readonly validVarsLabel = DOCTEMPLATES_TPL_VALID_VARS;
  readonly invalidVarsLabel = DOCTEMPLATES_TPL_INVALID_VARS;
  readonly validatingLabel = DOCTEMPLATES_TPL_VALIDATING;
  readonly previewTitle = DOCTEMPLATES_TPL_PREVIEW_TITLE;
  readonly previewEmptyLabel = DOCTEMPLATES_TPL_PREVIEW_EMPTY;
  readonly previewLoadingLabel = DOCTEMPLATES_TPL_PREVIEW_LOADING;
  readonly previewErrorLabel = DOCTEMPLATES_TPL_PREVIEW_ERROR;
  readonly previewZoomLabel = DOCTEMPLATES_TPL_PREVIEW_ZOOM_TOOLBAR;
  readonly previewZoomInLabel = DOCTEMPLATES_TPL_PREVIEW_ZOOM_IN;
  readonly previewZoomOutLabel = DOCTEMPLATES_TPL_PREVIEW_ZOOM_OUT;
  readonly previewZoomResetLabel = DOCTEMPLATES_TPL_PREVIEW_ZOOM_RESET;
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

  get previewZoomPercent(): number {
    return Math.round(this.previewZoom * 100);
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
        this.loadExistingPreview(this.editingId!);
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_TPL_ERRORS_LOAD });
      },
    });
  }

  ngAfterViewInit(): void {
    void this.flushPreview();
  }

  ngOnDestroy(): void {
    this.previewRequestId++;
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
    void this.queuePreview(file);
    this.api.validate(file).subscribe({
      next: (result) => {
        this.validCodes = result.valid ?? [];
        this.invalidCodes = result.invalid ?? [];
        this.validating = false;
      },
      error: (err) => {
        this.validating = false;
        this.selectedFile = null;
        this.clearPreview();
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

  zoomIn(): void {
    this.previewZoom = Math.min(
      this.maxPreviewZoom,
      Number((this.previewZoom + this.previewZoomStep).toFixed(2)),
    );
  }

  zoomOut(): void {
    this.previewZoom = Math.max(
      this.minPreviewZoom,
      Number((this.previewZoom - this.previewZoomStep).toFixed(2)),
    );
  }

  resetPreviewZoom(): void {
    this.previewZoom = 0.55;
  }

  private loadExistingPreview(templateId: number): void {
    this.api.download(templateId).subscribe({
      next: ({ downloadUrl }) => {
        if (!downloadUrl) {
          return;
        }
        void fetch(downloadUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('download failed');
            }
            return response.arrayBuffer();
          })
          .then((buffer) => this.queuePreview(buffer))
          .catch(() => {
            this.previewError = true;
            this.previewReady = false;
            this.cdr.markForCheck();
          });
      },
    });
  }

  private async queuePreview(source: ArrayBuffer | File | Blob): Promise<void> {
    const buffer =
      source instanceof ArrayBuffer ? source : await (source as Blob).arrayBuffer();
    this.pendingPreviewBuffer = buffer;
    this.previewError = false;
    this.previewLoading = true;
    this.previewReady = true;
    this.previewZoom = 0.55;
    this.cdr.detectChanges();
    await this.flushPreview();
  }

  private async flushPreview(): Promise<void> {
    const buffer = this.pendingPreviewBuffer;
    const host = this.previewHost?.nativeElement;
    if (!buffer || !host) {
      return;
    }

    const requestId = ++this.previewRequestId;
    this.previewLoading = true;
    this.previewError = false;

    try {
      await this.previewService.render(buffer, host);
      if (requestId !== this.previewRequestId) {
        return;
      }
      this.previewReady = true;
      this.pendingPreviewBuffer = null;
    } catch {
      if (requestId !== this.previewRequestId) {
        return;
      }
      this.previewReady = false;
      this.previewError = true;
      this.pendingPreviewBuffer = null;
    } finally {
      if (requestId === this.previewRequestId) {
        this.previewLoading = false;
        this.cdr.markForCheck();
      }
    }
  }

  private clearPreview(): void {
    this.previewRequestId++;
    this.pendingPreviewBuffer = null;
    this.previewReady = false;
    this.previewError = false;
    this.previewLoading = false;
    this.previewHost?.nativeElement.replaceChildren();
  }
}
