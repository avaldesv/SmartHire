import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  PUBGEN_CLOSE,
  PUBGEN_CONTACT_SECTION,
  PUBGEN_DIALOG_TITLE,
  PUBGEN_DOWNLOAD,
  PUBGEN_ERROR_GENERATE,
  PUBGEN_FIELD_EMAIL,
  PUBGEN_FIELD_FORMAT,
  PUBGEN_FIELD_PHONE,
  PUBGEN_FIELD_SHARE_EMAIL,
  PUBGEN_FIELD_SHARE_PHONE,
  PUBGEN_FIELD_SHARE_PREFIX,
  PUBGEN_FORMAT_JPG,
  PUBGEN_FORMAT_PDF,
  PUBGEN_PREVIEW_LOADING,
  PUBGEN_SEND_EMAIL,
  PUBGEN_SHARE_ERROR,
  PUBGEN_SHARE_JPG_HINT,
  PUBGEN_SHARE_LOADING,
  PUBGEN_SHARE_SECTION,
  PUBGEN_SHARE_SUCCESS,
  PUBGEN_SHARE_WHATSAPP,
  PUBGEN_EMAIL_ERROR,
  PUBGEN_EMAIL_LOADING,
  PUBGEN_EMAIL_SUCCESS,
  PUBGEN_SNACK_CLOSE,
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
    MatTooltipModule,
  ],
  templateUrl: './publication-generate-dialog.component.html',
  styleUrl: './publication-generate-dialog.component.scss',
})
export class PublicationGenerateDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<PublicationGenerateDialogComponent>);
  readonly data = inject<PublicationGenerateDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(PublicationGenerateApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);

  readonly dialogTitle = PUBGEN_DIALOG_TITLE;
  readonly contactSectionLabel = PUBGEN_CONTACT_SECTION;
  readonly fieldEmail = PUBGEN_FIELD_EMAIL;
  readonly fieldPhone = PUBGEN_FIELD_PHONE;
  readonly fieldFormat = PUBGEN_FIELD_FORMAT;
  readonly closeLabel = PUBGEN_CLOSE;
  readonly downloadLabel = PUBGEN_DOWNLOAD;
  readonly previewLoadingLabel = PUBGEN_PREVIEW_LOADING;
  readonly shareSectionLabel = PUBGEN_SHARE_SECTION;
  readonly fieldSharePrefix = PUBGEN_FIELD_SHARE_PREFIX;
  readonly fieldSharePhone = PUBGEN_FIELD_SHARE_PHONE;
  readonly fieldShareEmail = PUBGEN_FIELD_SHARE_EMAIL;
  readonly shareWhatsAppLabel = PUBGEN_SHARE_WHATSAPP;
  readonly sendEmailLabel = PUBGEN_SEND_EMAIL;
  readonly shareJpgHint = PUBGEN_SHARE_JPG_HINT;
  readonly shareLoadingLabel = PUBGEN_SHARE_LOADING;
  readonly emailLoadingLabel = PUBGEN_EMAIL_LOADING;

  readonly formatOptions: { value: PublicationDocumentFormat; label: string }[] = [
    { value: 'JPG', label: PUBGEN_FORMAT_JPG },
    { value: 'PDF', label: PUBGEN_FORMAT_PDF },
  ];

  generating = false;
  sharing = false;
  sendingEmail = false;
  previewImageSrc: string | null = null;
  previewPdfUrl: SafeResourceUrl | null = null;
  isPdf = false;

  private currentBlob: Blob | null = null;
  private objectUrl: string | null = null;
  private generateSub: Subscription | null = null;
  private shareSub: Subscription | null = null;
  private emailSub: Subscription | null = null;
  private contactSub: Subscription | null = null;

  readonly configForm = this.fb.nonNullable.group({
    contactEmail: [this.data.contactEmail, [Validators.required, Validators.email]],
    contactPhone: [this.data.contactPhone, Validators.required],
  });

  readonly formatForm = this.fb.nonNullable.group({
    format: ['JPG' as PublicationDocumentFormat, Validators.required],
  });

  readonly shareForm = this.fb.nonNullable.group({
    countryPrefix: [''],
    phoneNumber: [''],
    email: ['', [Validators.email]],
  });

  ngOnInit(): void {
    this.contactSub = this.configForm.controls.contactPhone.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (this.configForm.valid) {
          this.generate();
        }
      });

    if (this.configForm.valid) {
      this.generate();
    } else {
      this.configForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.generateSub?.unsubscribe();
    this.shareSub?.unsubscribe();
    this.emailSub?.unsubscribe();
    this.contactSub?.unsubscribe();
    this.revokeObjectUrl();
  }

  get canShareWhatsApp(): boolean {
    const phone = this.buildSharePhone();
    return (
      !!phone &&
      this.formatForm.controls.format.value === 'JPG' &&
      !this.generating &&
      !this.sharing &&
      !this.sendingEmail &&
      !!this.previewImageSrc
    );
  }

  get canSendEmail(): boolean {
    const email = (this.shareForm.controls.email.value ?? '').trim();
    return (
      !!email &&
      this.shareForm.controls.email.valid &&
      !this.generating &&
      !this.sharing &&
      !this.sendingEmail &&
      (!!this.previewImageSrc || !!this.previewPdfUrl)
    );
  }

  onFormatChange(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
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

  shareWhatsApp(): void {
    if (!this.canShareWhatsApp) {
      if (this.formatForm.controls.format.value !== 'JPG') {
        this.snack.open(PUBGEN_SHARE_JPG_HINT, PUBGEN_SNACK_CLOSE, { duration: 4000 });
      }
      return;
    }
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    const phone = this.buildSharePhone();
    if (!phone) {
      return;
    }
    this.sharing = true;
    this.shareSub?.unsubscribe();
    this.shareSub = this.api
      .shareWhatsApp(this.data.positionId, {
        phone,
        contactEmail: this.configForm.controls.contactEmail.value,
        contactPhone: this.configForm.controls.contactPhone.value,
        descripcion: `publicacion-${this.data.positionId}.jpg`,
      })
      .subscribe({
        next: () => {
          this.sharing = false;
          this.snack.open(PUBGEN_SHARE_SUCCESS, PUBGEN_SNACK_CLOSE, { duration: 3000 });
        },
        error: () => {
          this.sharing = false;
          this.snack.open(PUBGEN_SHARE_ERROR, PUBGEN_SNACK_CLOSE, { duration: 4000 });
        },
      });
  }

  sendEmail(): void {
    if (!this.canSendEmail) {
      this.shareForm.controls.email.markAsTouched();
      return;
    }
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    const toEmail = this.shareForm.controls.email.value.trim();
    this.sendingEmail = true;
    this.emailSub?.unsubscribe();
    this.emailSub = this.api
      .sendEmail(this.data.positionId, {
        toEmail,
        format: this.formatForm.controls.format.value,
        contactEmail: this.configForm.controls.contactEmail.value,
        contactPhone: this.configForm.controls.contactPhone.value,
        subject: `Publicación posición ${this.data.positionId}`,
      })
      .subscribe({
        next: () => {
          this.sendingEmail = false;
          this.snack.open(PUBGEN_EMAIL_SUCCESS, PUBGEN_SNACK_CLOSE, { duration: 3000 });
        },
        error: () => {
          this.sendingEmail = false;
          this.snack.open(PUBGEN_EMAIL_ERROR, PUBGEN_SNACK_CLOSE, { duration: 4000 });
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  private buildSharePhone(): string {
    const prefix = (this.shareForm.controls.countryPrefix.value ?? '').replace(/\D+/g, '');
    const number = (this.shareForm.controls.phoneNumber.value ?? '').replace(/\D+/g, '');
    const combined = `${prefix}${number}`;
    return combined.length >= 8 ? combined : '';
  }

  private generate(): void {
    if (this.configForm.invalid) {
      return;
    }
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
