import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_INFO_TITLE } from '../../../../core/i18n/feedback-labels';
import {
  PUBGEN_CLOSE,
  PUBGEN_CONTACT_SECTION,
  PUBGEN_DIALOG_TITLE,
  PUBGEN_DIAL_CODES_ERROR,
  PUBGEN_DOWNLOAD,
  PUBGEN_ERROR_GENERATE,
  PUBGEN_FIELD_EMAIL,
  PUBGEN_FIELD_FORMAT,
  PUBGEN_FIELD_LOCALE,
  PUBGEN_FIELD_PHONE,
  PUBGEN_FIELD_SHARE_EMAIL,
  PUBGEN_FIELD_SHARE_PHONE,
  PUBGEN_FIELD_SHARE_PREFIX,
  PUBGEN_FORMAT_JPG,
  PUBGEN_FORMAT_PDF,
  PUBGEN_LOCALE_EN,
  PUBGEN_LOCALE_ES,
  PUBGEN_LOCALE_PT,
  PUBGEN_PREVIEW_EMPTY,
  PUBGEN_PREVIEW_LOADING,
  PUBGEN_PREVIEW_PDF_ARIA,
  PUBGEN_PREVIEW_TITLE,
  PUBGEN_SEND_EMAIL,
  PUBGEN_SHARE_ERROR,
  PUBGEN_SHARE_JPG_HINT,
  PUBGEN_SHARE_LOADING,
  PUBGEN_SHARE_SECTION,
  PUBGEN_WHATSAPP_SECTION,
  PUBGEN_EMAIL_SECTION,
  PUBGEN_SHARE_SUCCESS,
  PUBGEN_SHARE_WHATSAPP,
  PUBGEN_EMAIL_ERROR,
  PUBGEN_EMAIL_LOADING,
  PUBGEN_EMAIL_SUCCESS,
  PUBGEN_TEMPLATES_CHECK_ERROR,
} from '../../../../core/i18n/publication-generate-labels';
import {
  PublicationDocumentFormat,
  PublicationGenerateApiService,
} from '../../../../core/services/publication-generate-api.service';
import { PublicationTemplateApiService } from '../../../../core/services/publication-template-api.service';
import {
  CountryDialCodeOption,
  ReferenceDataService,
} from '../../../../core/services/reference-data.service';
import { PublicationNoTemplateDialogComponent } from '../publication-no-template-dialog.component';

export interface PublicationGenerateDialogData {
  positionId: number;
  contactEmail: string;
  contactPhone: string;
}

const LOCALE_OPTIONS = [
  { value: 'es', label: PUBGEN_LOCALE_ES },
  { value: 'en', label: PUBGEN_LOCALE_EN },
  { value: 'pt', label: PUBGEN_LOCALE_PT },
] as const;

const DEFAULT_DIAL_CODE = '+52';

/** Temporary share default while Resend only delivers to the Resend account mailbox. */
const DEV_DEFAULT_SHARE_EMAIL = 'smarthirebtech@gmail.com';

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
  private readonly templateApi = inject(PublicationTemplateApiService);
  private readonly referenceData = inject(ReferenceDataService);
  private readonly dialog = inject(MatDialog);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);
  private readonly sanitizer = inject(DomSanitizer);

  readonly dialogTitle = PUBGEN_DIALOG_TITLE;
  readonly contactSectionLabel = PUBGEN_CONTACT_SECTION;
  readonly fieldEmail = PUBGEN_FIELD_EMAIL;
  readonly fieldPhone = PUBGEN_FIELD_PHONE;
  readonly fieldLocale = PUBGEN_FIELD_LOCALE;
  readonly fieldFormat = PUBGEN_FIELD_FORMAT;
  readonly closeLabel = PUBGEN_CLOSE;
  readonly downloadLabel = PUBGEN_DOWNLOAD;
  readonly previewTitle = PUBGEN_PREVIEW_TITLE;
  readonly previewPdfAria = PUBGEN_PREVIEW_PDF_ARIA;
  readonly previewEmptyLabel = PUBGEN_PREVIEW_EMPTY;
  readonly previewLoadingLabel = PUBGEN_PREVIEW_LOADING;
  readonly shareSectionLabel = PUBGEN_SHARE_SECTION;
  readonly whatsappSectionLabel = PUBGEN_WHATSAPP_SECTION;
  readonly emailSectionLabel = PUBGEN_EMAIL_SECTION;
  readonly fieldSharePrefix = PUBGEN_FIELD_SHARE_PREFIX;
  readonly fieldSharePhone = PUBGEN_FIELD_SHARE_PHONE;
  readonly fieldShareEmail = PUBGEN_FIELD_SHARE_EMAIL;
  readonly shareWhatsAppLabel = PUBGEN_SHARE_WHATSAPP;
  readonly sendEmailLabel = PUBGEN_SEND_EMAIL;
  readonly shareJpgHint = PUBGEN_SHARE_JPG_HINT;
  readonly shareLoadingLabel = PUBGEN_SHARE_LOADING;
  readonly emailLoadingLabel = PUBGEN_EMAIL_LOADING;

  readonly localeOptions = [...LOCALE_OPTIONS];
  readonly formatOptions: { value: PublicationDocumentFormat; label: string }[] = [
    { value: 'JPG', label: PUBGEN_FORMAT_JPG },
    { value: 'PDF', label: PUBGEN_FORMAT_PDF },
  ];

  dialCodeOptions: CountryDialCodeOption[] = [];
  generating = false;
  sharing = false;
  sendingEmail = false;
  previewImageSrc: string | null = null;
  previewPdfUrl: SafeResourceUrl | null = null;
  isPdf = false;

  private templateLocales = new Set<string>();
  private currentBlob: Blob | null = null;
  private objectUrl: string | null = null;
  private generateSub: Subscription | null = null;
  private shareSub: Subscription | null = null;
  private emailSub: Subscription | null = null;
  private contactSub: Subscription | null = null;
  private localeSub: Subscription | null = null;

  readonly configForm = this.fb.nonNullable.group({
    contactEmail: [this.data.contactEmail, [Validators.required, Validators.email]],
    contactPhone: [this.data.contactPhone, Validators.required],
    locale: ['es', Validators.required],
  });

  readonly formatForm = this.fb.nonNullable.group({
    format: ['JPG' as PublicationDocumentFormat, Validators.required],
  });

  readonly shareForm = this.fb.nonNullable.group({
    countryPrefix: [DEFAULT_DIAL_CODE, Validators.required],
    phoneNumber: [''],
    email: [DEV_DEFAULT_SHARE_EMAIL, [Validators.email]],
  });

  ngOnInit(): void {
    this.loadDialCodes();
    this.contactSub = this.configForm.controls.contactPhone.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        if (this.configForm.valid) {
          this.tryGenerate(false);
        }
      });
    this.localeSub = this.configForm.controls.locale.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        if (this.configForm.valid) {
          this.tryGenerate(true);
        }
      });

    this.templateApi.list(0, 100).subscribe({
      next: ({ items }) => {
        this.templateLocales = new Set(
          items.filter((item) => item.isActive).map((item) => item.locale.trim().toLowerCase()),
        );
        if (this.configForm.valid) {
          this.tryGenerate(true);
        } else {
          this.configForm.markAllAsTouched();
        }
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: PUBGEN_TEMPLATES_CHECK_ERROR });
      },
    });
  }

  ngOnDestroy(): void {
    this.generateSub?.unsubscribe();
    this.shareSub?.unsubscribe();
    this.emailSub?.unsubscribe();
    this.contactSub?.unsubscribe();
    this.localeSub?.unsubscribe();
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

  dialCodeLabel(option: CountryDialCodeOption): string {
    return `${option.dialCode} — ${option.countryName}`;
  }

  onFormatChange(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    this.tryGenerate(false);
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
        this.feedback.showInfo(FEEDBACK_GENERIC_INFO_TITLE, PUBGEN_SHARE_JPG_HINT);
      }
      return;
    }
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    if (!this.ensureTemplateForSelectedLocale(true)) {
      return;
    }
    const phone = this.buildSharePhone();
    if (!phone) {
      return;
    }
    this.sharing = true;
    this.shareSub?.unsubscribe();
    this.shareSub = this.api
      .shareWhatsApp(
        this.data.positionId,
        {
          phone,
          contactEmail: this.configForm.controls.contactEmail.value,
          contactPhone: this.configForm.controls.contactPhone.value,
          descripcion: `publicacion-${this.data.positionId}.jpg`,
        },
        this.selectedLocale(),
      )
      .subscribe({
        next: () => {
          this.sharing = false;
          this.feedback.showSuccess(PUBGEN_SHARE_SUCCESS);
        },
        error: (err) => {
          this.sharing = false;
          this.feedback.showApiError(err, { fallbackMessage: PUBGEN_SHARE_ERROR });
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
    if (!this.ensureTemplateForSelectedLocale(true)) {
      return;
    }
    const toEmail = this.shareForm.controls.email.value.trim();
    this.sendingEmail = true;
    this.emailSub?.unsubscribe();
    this.emailSub = this.api
      .sendEmail(
        this.data.positionId,
        {
          toEmail,
          format: this.formatForm.controls.format.value,
          contactEmail: this.configForm.controls.contactEmail.value,
          contactPhone: this.configForm.controls.contactPhone.value,
          subject: `Publicación posición ${this.data.positionId}`,
        },
        this.selectedLocale(),
      )
      .subscribe({
        next: () => {
          this.sendingEmail = false;
          this.feedback.showSuccess(PUBGEN_EMAIL_SUCCESS);
        },
        error: (err) => {
          this.sendingEmail = false;
          this.feedback.showApiError(err, { fallbackMessage: PUBGEN_EMAIL_ERROR });
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  /**
   * WhatsApp RPA expects digits only (no "+"). UI keeps "+52" for consistency with other forms.
   */
  private buildSharePhone(): string {
    const prefix = (this.shareForm.controls.countryPrefix.value ?? '').replace(/\D+/g, '');
    const number = (this.shareForm.controls.phoneNumber.value ?? '').replace(/\D+/g, '');
    const combined = `${prefix}${number}`;
    return combined.length >= 8 ? combined : '';
  }

  private selectedLocale(): string {
    return (this.configForm.controls.locale.value ?? 'es').trim().toLowerCase();
  }

  private tryGenerate(promptIfMissing: boolean): void {
    if (this.configForm.invalid) {
      return;
    }
    if (!this.ensureTemplateForSelectedLocale(promptIfMissing)) {
      this.clearPreview();
      return;
    }
    this.generate();
  }

  private ensureTemplateForSelectedLocale(promptIfMissing: boolean): boolean {
    const locale = this.selectedLocale();
    if (this.templateLocales.has(locale)) {
      return true;
    }
    if (promptIfMissing) {
      this.dialog.open(PublicationNoTemplateDialogComponent, {
        width: '480px',
        maxWidth: '95vw',
        data: { locale },
      });
    }
    return false;
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
      .generate(
        this.data.positionId,
        {
          format,
          contactEmail: this.configForm.controls.contactEmail.value,
          contactPhone: this.configForm.controls.contactPhone.value,
        },
        this.selectedLocale(),
      )
      .subscribe({
        next: (blob) => {
          this.setPreview(blob, format);
          this.generating = false;
        },
        error: (err) => {
          this.generating = false;
          this.feedback.showApiError(err, { fallbackMessage: PUBGEN_ERROR_GENERATE });
        },
      });
  }

  private loadDialCodes(): void {
    this.referenceData.getUserTenantContext().subscribe({
      next: (ctx) => {
        this.referenceData.listCountryDialCodes(ctx.countryId).subscribe({
          next: (options) => this.applyDialCodes(options, ctx.countryId),
          error: (err) => this.feedback.showApiError(err, { fallbackMessage: PUBGEN_DIAL_CODES_ERROR }),
        });
      },
      error: () => {
        this.referenceData.listCountryDialCodes().subscribe({
          next: (options) => this.applyDialCodes(options, null),
          error: (err) => this.feedback.showApiError(err, { fallbackMessage: PUBGEN_DIAL_CODES_ERROR }),
        });
      },
    });
  }

  private applyDialCodes(options: CountryDialCodeOption[], preferredCountryId: number | null): void {
    this.dialCodeOptions = options;
    if (!options.length) {
      this.shareForm.controls.countryPrefix.setValue(DEFAULT_DIAL_CODE);
      return;
    }
    const preferred =
      (preferredCountryId != null
        ? options.find((o) => o.countryId === preferredCountryId)?.dialCode
        : null) ??
      options.find((o) => o.dialCode === DEFAULT_DIAL_CODE)?.dialCode ??
      options[0].dialCode;
    this.shareForm.controls.countryPrefix.setValue(preferred);
  }

  private clearPreview(): void {
    this.generateSub?.unsubscribe();
    this.generating = false;
    this.revokeObjectUrl();
    this.currentBlob = null;
    this.previewImageSrc = null;
    this.previewPdfUrl = null;
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
