import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  PUBTEMPLATES_CANCEL,
  PUBTEMPLATES_DIALOG_EDIT,
  PUBTEMPLATES_DIALOG_NEW,
  PUBTEMPLATES_ERRORS_LOAD,
  PUBTEMPLATES_ERRORS_PREVIEW,
  PUBTEMPLATES_ERRORS_SAVE,
  PUBTEMPLATES_FIELD_ACTIVE,
  PUBTEMPLATES_FIELD_DEFAULT,
  PUBTEMPLATES_FIELD_HTML_BODY,
  PUBTEMPLATES_FIELD_LOCALE,
  PUBTEMPLATES_FIELD_NAME,
  PUBTEMPLATES_LOCALE_EN,
  PUBTEMPLATES_LOCALE_ES,
  PUBTEMPLATES_LOCALE_PT,
  PUBTEMPLATES_PREVIEW_BUTTON,
  PUBTEMPLATES_PREVIEW_EMPTY,
  PUBTEMPLATES_PREVIEW_TITLE,
  PUBTEMPLATES_SAVE,
  PUBTEMPLATES_SAVING,
  PUBTEMPLATES_SNACK_CLOSE,
} from '../../../core/i18n/publication-templates-labels';
import { PublicationTemplateApiService } from '../../../core/services/publication-template-api.service';
import { PublicationTemplateItem } from '../../../shared/models/publication-template.model';

export interface PublicationTemplateFormDialogData {
  templateId?: number;
}

@Component({
  selector: 'sh-publication-template-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './publication-template-form-dialog.component.html',
  styleUrl: './publication-template-form-dialog.component.scss',
})
export class PublicationTemplateFormDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<PublicationTemplateFormDialogComponent, boolean>);
  readonly data = inject<PublicationTemplateFormDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(PublicationTemplateApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);

  readonly localeOptions = [
    { value: 'es', label: PUBTEMPLATES_LOCALE_ES },
    { value: 'en', label: PUBTEMPLATES_LOCALE_EN },
    { value: 'pt', label: PUBTEMPLATES_LOCALE_PT },
  ];

  loading = true;
  saving = false;
  previewing = false;
  previewHtml: SafeHtml | null = null;
  editingId: number | null = this.data.templateId ?? null;

  readonly dialogNew = PUBTEMPLATES_DIALOG_NEW;
  readonly dialogEdit = PUBTEMPLATES_DIALOG_EDIT;
  readonly fieldName = PUBTEMPLATES_FIELD_NAME;
  readonly fieldLocale = PUBTEMPLATES_FIELD_LOCALE;
  readonly fieldHtmlBody = PUBTEMPLATES_FIELD_HTML_BODY;
  readonly fieldDefault = PUBTEMPLATES_FIELD_DEFAULT;
  readonly fieldActive = PUBTEMPLATES_FIELD_ACTIVE;
  readonly previewButtonLabel = PUBTEMPLATES_PREVIEW_BUTTON;
  readonly previewTitle = PUBTEMPLATES_PREVIEW_TITLE;
  readonly previewEmptyLabel = PUBTEMPLATES_PREVIEW_EMPTY;
  readonly cancelLabel = PUBTEMPLATES_CANCEL;
  readonly savingLabel = PUBTEMPLATES_SAVING;
  readonly saveLabel = PUBTEMPLATES_SAVE;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    locale: ['es', Validators.required],
    htmlBody: ['', Validators.required],
    isDefault: [false],
    isActive: [true],
  });

  get title(): string {
    return this.editingId ? this.dialogEdit : this.dialogNew;
  }

  ngOnInit(): void {
    if (!this.editingId) {
      this.loading = false;
      return;
    }
    this.api.getById(this.editingId).subscribe({
      next: (template) => {
        this.patchForm(template);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(PUBTEMPLATES_ERRORS_LOAD, PUBTEMPLATES_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  private patchForm(template: PublicationTemplateItem): void {
    this.form.patchValue({
      name: template.name,
      locale: template.locale,
      htmlBody: template.htmlBody,
      isDefault: template.isDefault,
      isActive: template.isActive,
    });
  }

  preview(): void {
    const htmlBody = this.form.controls.htmlBody.value?.trim();
    if (!htmlBody) {
      return;
    }
    this.previewing = true;
    this.api
      .preview({
        htmlBody,
        locale: this.form.controls.locale.value,
      })
      .subscribe({
        next: ({ html }) => {
          this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(html ?? '');
          this.previewing = false;
        },
        error: () => {
          this.previewing = false;
          this.snack.open(PUBTEMPLATES_ERRORS_PREVIEW, PUBTEMPLATES_SNACK_CLOSE, { duration: 3500 });
        },
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
          locale: value.locale.trim(),
          name: value.name.trim(),
          htmlBody: value.htmlBody,
          isDefault: value.isDefault,
          isActive: value.isActive,
        })
      : this.api.create({
          locale: value.locale.trim(),
          name: value.name.trim(),
          htmlBody: value.htmlBody,
          isDefault: value.isDefault,
        });

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving = false;
        this.snack.open(PUBTEMPLATES_ERRORS_SAVE, PUBTEMPLATES_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
