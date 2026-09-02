import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { AppPermissions } from '../../../../core/auth/app-permissions';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  CANDIDATE_EDIT_DIALOG_CANCEL,
  CANDIDATE_EDIT_DIALOG_ERROR,
  CANDIDATE_EDIT_DIALOG_LOAD_ERROR,
  CANDIDATE_EDIT_DIALOG_SAVE,
  CANDIDATE_EDIT_DIALOG_SUCCESS,
  CANDIDATE_EDIT_DIALOG_TITLE,
  CANDIDATE_EDIT_CV_CURRENT,
  CANDIDATE_EDIT_CV_DOWNLOAD,
  CANDIDATE_EDIT_CV_ERROR,
  CANDIDATE_EDIT_CV_HINT,
  CANDIDATE_EDIT_CV_NONE,
  CANDIDATE_EDIT_CV_NO_TYPE,
  CANDIDATE_EDIT_CV_SUCCESS,
  CANDIDATE_EDIT_CV_UPLOADING,
  CANDIDATE_EDIT_FIELD_CURP,
  CANDIDATE_EDIT_FIELD_EMAIL,
  CANDIDATE_EDIT_FIELD_FIRST_NAME,
  CANDIDATE_EDIT_FIELD_GENDER,
  CANDIDATE_EDIT_FIELD_LAST_NAME,
  CANDIDATE_EDIT_FIELD_NSS,
  CANDIDATE_EDIT_FIELD_PHONE,
  CANDIDATE_EDIT_FIELD_RFC,
  CANDIDATE_EDIT_SECTION_CV,
  CANDIDATE_EDIT_SECTION_PERSONAL,
} from '../../../../core/i18n/candidate-edit-dialog-labels';
import { CatalogGenderService } from '../../../../core/services/catalog-gender.service';
import { CandidateApiService } from '../../../../core/services/candidate-api.service';
import { CandidateDocumentApiService } from '../../../../core/services/candidate-document-api.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { CandidateDetail } from '../../../../shared/models/candidate.model';
import { CandidateDocumentListItem } from '../../../../shared/models/candidate-document.model';
import { CatalogGender } from '../../../../shared/models/catalog-gender.model';

export interface CandidateEditDialogData {
  candidateId: number;
  applicationId: number;
  candidateName?: string;
}

export interface CandidateEditDialogResult {
  saved: boolean;
}

const CV_NAME_PATTERN = /cv|currícul|curricul|resume|hoja de vida/i;

function findCvDocumentTypeId(items: CandidateDocumentListItem[]): number | null {
  const match = items.find((item) => {
    if (item.documentTypeId == null) {
      return false;
    }
    const name = item.documentTypeName ?? '';
    return CV_NAME_PATTERN.test(name);
  });
  return match?.documentTypeId ?? null;
}

function findCvDocumentRow(items: CandidateDocumentListItem[]): CandidateDocumentListItem | null {
  const withFile = items.find(
    (item) => item.documentTypeId != null && item.fileName && !item.isMissing && CV_NAME_PATTERN.test(item.documentTypeName ?? ''),
  );
  if (withFile) {
    return withFile;
  }
  return items.find((item) => item.documentTypeId != null && CV_NAME_PATTERN.test(item.documentTypeName ?? '')) ?? null;
}

@Component({
  selector: 'sh-candidate-edit-dialog',
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
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ title }}</span>
    </div>
    <mat-dialog-content class="sh-catalog-dialog-body">
      <div class="sh-catalog-dialog-gap" aria-hidden="true"></div>
      @if (loading) {
        <div class="loading-wrap"><mat-spinner diameter="36" /></div>
      } @else {
        <h3 class="section-title">{{ sectionPersonal }}</h3>
        <form [formGroup]="form" class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldFirstName }}</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldLastName }}</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldEmail }}</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldPhone }}</mat-label>
            <input matInput formControlName="phone" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldGender }}</mat-label>
            <mat-select formControlName="genderId">
              <mat-option [value]="null">—</mat-option>
              @for (g of genders; track g.id) {
                <mat-option [value]="g.id">{{ g.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldCurp }}</mat-label>
            <input matInput formControlName="curp" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldRfc }}</mat-label>
            <input matInput formControlName="rfc" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ fieldNss }}</mat-label>
            <input matInput formControlName="nss" />
          </mat-form-field>
        </form>

        <h3 class="section-title">{{ sectionCv }}</h3>
        @if (!cvDocumentTypeId) {
          <p class="cv-hint muted">{{ cvNoType }}</p>
        } @else {
          <div
            class="cv-dropzone"
            [class.cv-dropzone--active]="dragOver"
            [class.cv-dropzone--disabled]="!canUploadCv || cvUploading"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event)"
            (click)="openFilePicker()"
          >
            @if (cvUploading) {
              <mat-spinner diameter="28" />
              <span>{{ cvUploadingLabel }}</span>
            } @else {
              <mat-icon>upload_file</mat-icon>
              <span>{{ cvHint }}</span>
            }
          </div>
          <input
            #fileInput
            type="file"
            class="file-input"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            (change)="onFileSelected($event)"
          />
          <div class="cv-current">
            <span class="muted">{{ cvCurrent }}:</span>
            @if (cvFileName) {
              <span>{{ cvFileName }}</span>
              <button mat-button type="button" (click)="downloadCv()">{{ cvDownload }}</button>
            } @else {
              <span class="muted">{{ cvNone }}</span>
            }
          </div>
        }
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" [disabled]="saving" (click)="dialogRef.close(null)">
        {{ cancelLabel }}
      </button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="loading || saving || !canEdit || form.invalid"
        (click)="save()"
      >
        {{ saveLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .loading-wrap {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    .section-title {
      margin: 0 0 0.75rem;
      font-size: 0.95rem;
      font-weight: 600;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.25rem 1rem;
      margin-bottom: 1.25rem;
    }
    .cv-dropzone {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1.25rem;
      border: 2px dashed var(--sh-border, #cbd5e1);
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      color: var(--sh-text-muted, #64748b);
      transition: border-color 0.15s, background 0.15s;
    }
    .cv-dropzone--active {
      border-color: var(--sh-primary, #2563eb);
      background: rgba(37, 99, 235, 0.04);
    }
    .cv-dropzone--disabled {
      opacity: 0.6;
      pointer-events: none;
    }
    .file-input {
      display: none;
    }
    .cv-current {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
      font-size: 0.875rem;
    }
    .muted {
      color: var(--sh-text-muted, #64748b);
    }
    .cv-hint {
      font-size: 0.875rem;
    }
    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class CandidateEditDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CandidateEditDialogComponent, CandidateEditDialogResult | null>);
  readonly data = inject<CandidateEditDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly candidateApi = inject(CandidateApiService);
  private readonly documentApi = inject(CandidateDocumentApiService);
  private readonly genderService = inject(CatalogGenderService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly permission = inject(PermissionService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  readonly title = CANDIDATE_EDIT_DIALOG_TITLE;
  readonly saveLabel = CANDIDATE_EDIT_DIALOG_SAVE;
  readonly cancelLabel = CANDIDATE_EDIT_DIALOG_CANCEL;
  readonly sectionPersonal = CANDIDATE_EDIT_SECTION_PERSONAL;
  readonly sectionCv = CANDIDATE_EDIT_SECTION_CV;
  readonly cvHint = CANDIDATE_EDIT_CV_HINT;
  readonly cvCurrent = CANDIDATE_EDIT_CV_CURRENT;
  readonly cvNone = CANDIDATE_EDIT_CV_NONE;
  readonly cvNoType = CANDIDATE_EDIT_CV_NO_TYPE;
  readonly cvUploadingLabel = CANDIDATE_EDIT_CV_UPLOADING;
  readonly cvDownload = CANDIDATE_EDIT_CV_DOWNLOAD;
  readonly fieldFirstName = CANDIDATE_EDIT_FIELD_FIRST_NAME;
  readonly fieldLastName = CANDIDATE_EDIT_FIELD_LAST_NAME;
  readonly fieldEmail = CANDIDATE_EDIT_FIELD_EMAIL;
  readonly fieldPhone = CANDIDATE_EDIT_FIELD_PHONE;
  readonly fieldGender = CANDIDATE_EDIT_FIELD_GENDER;
  readonly fieldCurp = CANDIDATE_EDIT_FIELD_CURP;
  readonly fieldRfc = CANDIDATE_EDIT_FIELD_RFC;
  readonly fieldNss = CANDIDATE_EDIT_FIELD_NSS;

  readonly canEdit = this.permission.hasAuthority(AppPermissions.CANDIDATE_EDIT);
  readonly canUploadCv = this.permission.hasAuthority(AppPermissions.SELECTION_EDIT);

  loading = true;
  saving = false;
  cvUploading = false;
  dragOver = false;
  genders: CatalogGender[] = [];
  cvDocumentTypeId: number | null = null;
  cvFileName: string | null = null;
  private candidateSnapshot: CandidateDetail | null = null;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    genderId: [null as number | null],
    curp: [''],
    rfc: [''],
    nss: [''],
  });

  ngOnInit(): void {
    if (!this.canEdit) {
      this.form.disable();
    }
    this.load();
  }

  private load(): void {
    this.loading = true;
    forkJoin({
      candidate: this.candidateApi.getById(this.data.candidateId),
      documents: this.documentApi.listForApplication(this.data.applicationId),
    }).subscribe({
      next: ({ candidate, documents }) => {
        this.candidateSnapshot = candidate;
        this.cvDocumentTypeId = findCvDocumentTypeId(documents.items);
        const cvRow = findCvDocumentRow(documents.items);
        this.cvFileName = cvRow?.fileName ?? null;
        this.form.patchValue({
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone ?? '',
          genderId: candidate.genderId,
          curp: candidate.curp ?? '',
          rfc: candidate.rfc ?? '',
          nss: candidate.nss ?? '',
        });
        const countryId = candidate.countryId ?? 1;
        this.genderService.list(countryId, 0, 100).subscribe({
          next: (res) => {
            this.genders = res.items;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_EDIT_DIALOG_LOAD_ERROR });
      },
    });
  }

  save(): void {
    if (this.form.invalid || this.saving || !this.canEdit || !this.candidateSnapshot) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const base = this.candidateSnapshot;
    this.saving = true;
    this.candidateApi
      .update(this.data.candidateId, {
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        phone: v.phone || null,
        curp: v.curp || null,
        rfc: v.rfc || null,
        nss: v.nss || null,
        genderId: v.genderId,
        countryId: base.countryId,
        stateId: base.stateId,
        city: base.city,
        desiredSalary: base.desiredSalary,
        source: base.source,
        experienceYears: base.experienceYears,
        isActive: base.isActive,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.feedback.showSuccess(CANDIDATE_EDIT_DIALOG_SUCCESS);
          this.dialogRef.close({ saved: true });
        },
        error: (err) => {
          this.saving = false;
          this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_EDIT_DIALOG_ERROR });
        },
      });
  }

  openFilePicker(): void {
    if (!this.canUploadCv || this.cvUploading || !this.cvDocumentTypeId) {
      return;
    }
    this.fileInput?.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.canUploadCv || this.cvUploading) {
      return;
    }
    this.dragOver = true;
  }

  onDragLeave(): void {
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    if (!this.canUploadCv || this.cvUploading) {
      return;
    }
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.uploadCv(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) {
      this.uploadCv(file);
    }
  }

  private uploadCv(file: File): void {
    if (!this.cvDocumentTypeId || this.cvUploading) {
      return;
    }
    this.cvUploading = true;
    this.documentApi.uploadForApplication(this.data.applicationId, this.cvDocumentTypeId, file).subscribe({
      next: (res) => {
        this.cvUploading = false;
        this.cvFileName = res.fileName ?? file.name;
        this.feedback.showSuccess(CANDIDATE_EDIT_CV_SUCCESS);
      },
      error: (err) => {
        this.cvUploading = false;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_EDIT_CV_ERROR });
      },
    });
  }

  downloadCv(): void {
    this.candidateApi.downloadCv(this.data.candidateId).subscribe({
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_EDIT_CV_ERROR });
      },
    });
  }
}
