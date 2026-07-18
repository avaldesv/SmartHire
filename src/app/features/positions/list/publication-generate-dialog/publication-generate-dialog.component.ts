import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {
  PUBGEN_ACCEPT,
  PUBGEN_CANCEL,
  PUBGEN_CLOSE,
  PUBGEN_DOWNLOAD,
  PUBGEN_ERROR_GENERATE,
  PUBGEN_FIELD_EMAIL,
  PUBGEN_FIELD_FORMAT,
  PUBGEN_FIELD_PHONE,
  PUBGEN_FORMAT_JPG,
  PUBGEN_FORMAT_PDF,
  PUBGEN_PREVIEW_LOADING,
  PUBGEN_SNACK_CLOSE,
  PUBGEN_STEP1_TITLE,
  PUBGEN_STEP2_TITLE,
} from '../../../../core/i18n/publication-generate-labels';
import {
  PublicationDocumentFormat,
  PublicationGenerateApiService,
} from '../../../../core/services/publication-generate-api.service';

export interface PublicationGenerateDialogData {
  positionId: number;
  contactEmail: string;
  contactPhone: string;
}

@Component({
  selector: 'sh-publication-generate-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './publication-generate-dialog.component.html',
  styleUrl: './publication-generate-dialog.component.scss',
})
export class PublicationGenerateDialogComponent implements OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<PublicationGenerateDialogComponent>);
  readonly data = inject<PublicationGenerateDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(PublicationGenerateApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);

  readonly step1Title = PUBGEN_STEP1_TITLE;
  readonly step2Title = PUBGEN_STEP2_TITLE;
  readonly fieldEmail = PUBGEN_FIELD_EMAIL;
  readonly fieldPhone = PUBGEN_FIELD_PHONE;
  readonly fieldFormat = PUBGEN_FIELD_FORMAT;
  readonly cancelLabel = PUBGEN_CANCEL;
  readonly acceptLabel = PUBGEN_ACCEPT;
  readonly closeLabel = PUBGEN_CLOSE;
  readonly downloadLabel = PUBGEN_DOWNLOAD;
  readonly previewLoadingLabel = PUBGEN_PREVIEW_LOADING;

  readonly formatOptions: { value: PublicationDocumentFormat; label: string }[] = [
    { value: 'JPG', label: PUBGEN_FORMAT_JPG },
    { value: 'PDF', label: PUBGEN_FORMAT_PDF },
  ];

  step: 1 | 2 = 1;
  generating = false;
  previewImageSrc: string | null = null;
  previewPdfUrl: SafeResourceUrl | null = null;
  isPdf = false;

  private currentBlob: Blob | null = null;
  private objectUrl: string | null = null;
  private generateSub: Subscription | null = null;

  readonly configForm = this.fb.nonNullable.group({
    contactEmail: [this.data.contactEmail, [Validators.required, Validators.email]],
    contactPhone: [this.data.contactPhone, Validators.required],
  });

  readonly formatForm = this.fb.nonNullable.group({
    format: ['JPG' as PublicationDocumentFormat, Validators.required],
  });

  ngOnDestroy(): void {
    this.generateSub?.unsubscribe();
    this.revokeObjectUrl();
  }

  goToStep2(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    this.step = 2;
    this.generate();
  }

  onFormatChange(): void {
    this.generate();
  }

  download(): void {
    if (!this.currentBlob) {
      return;
    }
    const extension = this.formatForm.controls.format.value === 'PDF' ? 'pdf' : 'jpg';
    const url = URL.createObjectURL(this.currentBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `publicacion-${this.data.positionId}.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  close(): void {
    this.dialogRef.close();
  }

  private generate(): void {
    this.generateSub?.unsubscribe();
    this.generating = true;
    this.previewImageSrc = null;
    this.previewPdfUrl = null;
    const format = this.formatForm.controls.format.value;
    this.generateSub = this.api
      .generate(this.data.positionId, {
        format,
        contactEmail: this.configForm.controls.contactEmail.value,
        contactPhone: this.configForm.controls.contactPhone.value,
      })
      .subscribe({
        next: (blob) => {
          this.setPreview(blob, format);
          this.generating = false;
        },
        error: () => {
          this.generating = false;
          this.snack.open(PUBGEN_ERROR_GENERATE, PUBGEN_SNACK_CLOSE, { duration: 4000 });
        },
      });
  }

  private setPreview(blob: Blob, format: PublicationDocumentFormat): void {
    this.revokeObjectUrl();
    this.currentBlob = blob;
    this.objectUrl = URL.createObjectURL(blob);
    this.isPdf = format === 'PDF';
    if (this.isPdf) {
      this.previewPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
      this.previewImageSrc = null;
    } else {
      this.previewImageSrc = this.objectUrl;
      this.previewPdfUrl = null;
    }
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
