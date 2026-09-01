import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { AppPermissions } from '../../../../core/auth/app-permissions';
import {
  CANDIDATE_DOCS_ALL_DELIVERED,
  CANDIDATE_DOCS_CHOOSE_FILE,
  CANDIDATE_DOCS_COL_ACTIONS,
  CANDIDATE_DOCS_COL_CREATED,
  CANDIDATE_DOCS_COL_FILE,
  CANDIDATE_DOCS_COL_SIZE,
  CANDIDATE_DOCS_COL_STATUS,
  CANDIDATE_DOCS_COL_TYPE,
  CANDIDATE_DOCS_COL_VALIDATION,
  CANDIDATE_DOCS_DIALOG_CLOSE,
  CANDIDATE_DOCS_DIALOG_EMPTY,
  CANDIDATE_DOCS_DIALOG_TITLE,
  CANDIDATE_DOCS_DOWNLOAD,
  CANDIDATE_DOCS_EM_DASH,
  CANDIDATE_DOCS_ERRORS_DOWNLOAD,
  CANDIDATE_DOCS_ERRORS_LIST,
  CANDIDATE_DOCS_ERRORS_VALIDATE,
  CANDIDATE_DOCS_MARK_AS_NOT_VALID,
  CANDIDATE_DOCS_MARK_AS_VALIDATED,
  CANDIDATE_DOCS_MARK_NOT_VALIDATED,
  CANDIDATE_DOCS_MARK_VALIDATED,
  CANDIDATE_DOCS_MISSING_FILE,
  CANDIDATE_DOCS_NO_REQUIREMENTS,
  CANDIDATE_DOCS_STATUS_EXTRACTED,
  CANDIDATE_DOCS_SUCCESS_VALIDATE,
  CANDIDATE_DOCS_SUMMARY_HEADLINE,
  CANDIDATE_DOCS_SUMMARY_MISSING_BADGE,
  CANDIDATE_DOCS_SUMMARY_PENDING,
  CANDIDATE_DOCS_UPLOAD,
  CANDIDATE_DOCS_UPLOAD_ERROR,
  CANDIDATE_DOCS_UPLOAD_SUCCESS,
  CANDIDATE_DOCS_UPLOADING,
  CANDIDATE_DOCS_VALIDATE,
  CANDIDATE_DOCS_VALIDATION_MISSING,
  CANDIDATE_DOCS_VALIDATION_NOT_VALIDATED,
  CANDIDATE_DOCS_VALIDATION_PENDING,
  CANDIDATE_DOCS_VALIDATION_VALIDATED,
  candidateDocumentsHeaderSubtitle,
  candidateDocumentsSizeLabel,
} from '../../../../core/i18n/candidate-documents-dialog-labels';
import { CandidateDocumentApiService } from '../../../../core/services/candidate-document-api.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { ApplicationDocumentsSummary, CandidateDocumentListItem } from '../../../../shared/models/candidate-document.model';
import {
  InvalidateDocumentDialogComponent,
  InvalidateDocumentDialogData,
  InvalidateDocumentDialogResult,
} from '../invalidate-document-dialog/invalidate-document-dialog.component';

export interface CandidateDocumentsDialogData {
  applicationId: number;
  candidateId: number;
  candidateName?: string;
  requisitionNo?: string;
}

export const CANDIDATE_DOCUMENTS_DIALOG_WIDTH = '1200px';
export const CANDIDATE_DOCUMENTS_DIALOG_MAX_HEIGHT = '88vh';
const PROGRESS_RING_RADIUS = 34;
const PROGRESS_RING_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RING_RADIUS;

export function candidateDocumentsDialogConfig(extra: MatDialogConfig = {}): MatDialogConfig {
  return catalogDialogConfig(CANDIDATE_DOCUMENTS_DIALOG_WIDTH, {
    maxWidth: '96vw',
    maxHeight: CANDIDATE_DOCUMENTS_DIALOG_MAX_HEIGHT,
    panelClass: ['sh-catalog-form-dialog-panel', 'sh-candidate-documents-dialog-panel'],
    ...extra,
  });
}

@Component({
  selector: 'sh-candidate-documents-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './candidate-documents-dialog.component.html',
  styleUrl: './candidate-documents-dialog.component.scss',
})
export class CandidateDocumentsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CandidateDocumentsDialogComponent>);
  readonly data = inject<CandidateDocumentsDialogData>(MAT_DIALOG_DATA);
  private readonly documentApi = inject(CandidateDocumentApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);
  private readonly permission = inject(PermissionService);

  @ViewChild('inlineFileInput') inlineFileInput?: ElementRef<HTMLInputElement>;

  readonly labels = {
    title: CANDIDATE_DOCS_DIALOG_TITLE,
    close: CANDIDATE_DOCS_DIALOG_CLOSE,
    empty: CANDIDATE_DOCS_DIALOG_EMPTY,
    colType: CANDIDATE_DOCS_COL_TYPE,
    colFile: CANDIDATE_DOCS_COL_FILE,
    colSize: CANDIDATE_DOCS_COL_SIZE,
    colStatus: CANDIDATE_DOCS_COL_STATUS,
    colValidation: CANDIDATE_DOCS_COL_VALIDATION,
    colCreated: CANDIDATE_DOCS_COL_CREATED,
    colActions: CANDIDATE_DOCS_COL_ACTIONS,
    download: CANDIDATE_DOCS_DOWNLOAD,
    validate: CANDIDATE_DOCS_VALIDATE,
    markValidated: CANDIDATE_DOCS_MARK_VALIDATED,
    markNotValidated: CANDIDATE_DOCS_MARK_NOT_VALIDATED,
    markAsValidated: CANDIDATE_DOCS_MARK_AS_VALIDATED,
    markAsNotValid: CANDIDATE_DOCS_MARK_AS_NOT_VALID,
    emDash: CANDIDATE_DOCS_EM_DASH,
    missingFile: CANDIDATE_DOCS_MISSING_FILE,
    upload: CANDIDATE_DOCS_UPLOAD,
    uploading: CANDIDATE_DOCS_UPLOADING,
    chooseFile: CANDIDATE_DOCS_CHOOSE_FILE,
    summaryMissingBadge: CANDIDATE_DOCS_SUMMARY_MISSING_BADGE,
  };

  loading = true;
  saving = false;
  uploadingTypeId: number | null = null;
  pendingUploadTypeId: number | null = null;
  rows: CandidateDocumentListItem[] = [];
  summary: ApplicationDocumentsSummary | null = null;

  readonly columns = [
    'documentTypeName',
    'fileName',
    'sizeBytes',
    'status',
    'validation',
    'createAt',
    'actions',
  ];

  ngOnInit(): void {
    this.load();
  }

  get canUploadDocuments(): boolean {
    return this.permission.hasAuthority(AppPermissions.SELECTION_EDIT);
  }

  headerSubtitle(): string | null {
    return candidateDocumentsHeaderSubtitle(this.data.candidateName, this.data.requisitionNo);
  }

  showComplianceCard(): boolean {
    return this.summary != null || this.complianceHint() != null;
  }

  summaryHeadline(): string | null {
    if (!this.summary || this.summary.requiredCount <= 0) {
      return null;
    }
    if (this.summary.missingCount === 0) {
      return CANDIDATE_DOCS_ALL_DELIVERED;
    }
    return `${this.summary.uploadedRequiredCount} de ${this.summary.requiredCount} ${CANDIDATE_DOCS_SUMMARY_HEADLINE}`;
  }

  summarySubline(): string | null {
    if (!this.summary || this.summary.requiredCount <= 0) {
      return null;
    }
    if (this.summary.missingCount === 0) {
      return `${this.summary.uploadedRequiredCount} de ${this.summary.requiredCount} ${CANDIDATE_DOCS_SUMMARY_HEADLINE}`;
    }
    return `${this.summary.missingCount} ${CANDIDATE_DOCS_SUMMARY_PENDING}`;
  }

  complianceHint(): string | null {
    if (this.summary && this.summary.requiredCount > 0) {
      return null;
    }
    return CANDIDATE_DOCS_NO_REQUIREMENTS;
  }

  progressPercent(): number {
    if (!this.summary || this.summary.requiredCount <= 0) {
      return 0;
    }
    return Math.round((this.summary.uploadedRequiredCount / this.summary.requiredCount) * 100);
  }

  progressDashArray(): string {
    return `${PROGRESS_RING_CIRCUMFERENCE} ${PROGRESS_RING_CIRCUMFERENCE}`;
  }

  progressDashOffset(): number {
    const ratio = this.progressPercent() / 100;
    return PROGRESS_RING_CIRCUMFERENCE * (1 - ratio);
  }

  load(): void {
    this.loading = true;
    this.documentApi.listForApplication(this.data.applicationId).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.summary = res.summary;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_DOCS_ERRORS_LIST });
      },
    });
  }

  sizeLabel(bytes: number | null | undefined): string {
    return candidateDocumentsSizeLabel(bytes);
  }

  statusLabel(status: string | null | undefined): string {
    if (!status) {
      return this.labels.emDash;
    }
    if (status.toUpperCase() === 'EXTRACTED') {
      return CANDIDATE_DOCS_STATUS_EXTRACTED;
    }
    return status;
  }

  isMissingRow(row: CandidateDocumentListItem): boolean {
    return row.isMissing === true;
  }

  fileNameLabel(row: CandidateDocumentListItem): string {
    if (this.isMissingRow(row)) {
      return this.labels.missingFile;
    }
    return row.fileName ?? this.labels.emDash;
  }

  validationLabel(row: CandidateDocumentListItem): string {
    if (this.isMissingRow(row)) {
      return CANDIDATE_DOCS_VALIDATION_MISSING;
    }
    if (row.isValidated === true) {
      return CANDIDATE_DOCS_VALIDATION_VALIDATED;
    }
    if (row.isValidated === false) {
      return CANDIDATE_DOCS_VALIDATION_NOT_VALIDATED;
    }
    return CANDIDATE_DOCS_VALIDATION_PENDING;
  }

  validationIcon(row: CandidateDocumentListItem): string {
    if (this.isMissingRow(row)) {
      return 'error_outline';
    }
    if (row.isValidated === true) {
      return 'check_circle';
    }
    if (row.isValidated === false) {
      return 'cancel';
    }
    return 'schedule';
  }

  isValidationPending(row: CandidateDocumentListItem): boolean {
    if (this.isMissingRow(row)) {
      return false;
    }
    return row.isValidated !== true && row.isValidated !== false;
  }

  isValidationValidated(row: CandidateDocumentListItem): boolean {
    return row.isValidated === true;
  }

  validateActionAriaLabel(row: CandidateDocumentListItem): string {
    if (this.isValidationValidated(row)) {
      return CANDIDATE_DOCS_MARK_AS_NOT_VALID;
    }
    if (row.isValidated === false) {
      return CANDIDATE_DOCS_MARK_AS_VALIDATED;
    }
    return CANDIDATE_DOCS_VALIDATE;
  }

  validateIconClass(row: CandidateDocumentListItem): string {
    if (this.isValidationValidated(row)) {
      return 'validate-action validate-action--validated';
    }
    if (row.isValidated === false) {
      return 'validate-action validate-action--rejected';
    }
    return 'validate-action validate-action--pending';
  }

  onValidateAction(row: CandidateDocumentListItem): void {
    if (this.isValidationValidated(row)) {
      this.markNotValidated(row);
      return;
    }
    if (row.isValidated === false) {
      this.markValidated(row);
    }
  }

  validationClass(row: CandidateDocumentListItem): string {
    if (this.isMissingRow(row)) {
      return 'validation-badge validation-badge--missing';
    }
    if (row.isValidated === true) {
      return 'validation-badge validation-badge--validated';
    }
    if (row.isValidated === false) {
      return 'validation-badge validation-badge--rejected';
    }
    return 'validation-badge validation-badge--pending';
  }

  rowClass(row: CandidateDocumentListItem): string {
    if (this.isMissingRow(row)) {
      return row.isRequiredForPosition ? 'row-missing-required' : 'row-missing-optional';
    }
    return '';
  }

  download(row: CandidateDocumentListItem): void {
    if (!row.downloadUrl) {
      this.feedback.showApiError(null, { fallbackMessage: CANDIDATE_DOCS_ERRORS_DOWNLOAD });
      return;
    }
    window.open(row.downloadUrl, '_blank', 'noopener,noreferrer');
  }

  openInlineFilePicker(row: CandidateDocumentListItem): void {
    if (!this.canUploadDocuments || !row.documentTypeId) {
      return;
    }
    this.pendingUploadTypeId = row.documentTypeId;
    this.inlineFileInput?.nativeElement.click();
  }

  onInlineFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const documentTypeId = this.pendingUploadTypeId;
    input.value = '';
    this.pendingUploadTypeId = null;
    if (!file || documentTypeId == null) {
      return;
    }
    this.uploadDocument(documentTypeId, file);
  }

  uploadDocument(documentTypeId: number, file: File): void {
    if (this.uploadingTypeId != null) {
      return;
    }
    this.uploadingTypeId = documentTypeId;
    this.documentApi.uploadForApplication(this.data.applicationId, documentTypeId, file).subscribe({
      next: () => {
        this.uploadingTypeId = null;
        this.feedback.showSuccess(CANDIDATE_DOCS_UPLOAD_SUCCESS);
        this.load();
      },
      error: (err) => {
        this.uploadingTypeId = null;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_DOCS_UPLOAD_ERROR });
      },
    });
  }

  markValidated(row: CandidateDocumentListItem): void {
    if (!row.id) {
      return;
    }
    this.saveValidation(row, true);
  }

  markNotValidated(row: CandidateDocumentListItem): void {
    if (!row.id) {
      return;
    }
    this.dialog
      .open<InvalidateDocumentDialogComponent, InvalidateDocumentDialogData, InvalidateDocumentDialogResult | null>(
        InvalidateDocumentDialogComponent,
        {
          ...catalogDialogConfig('520px'),
          autoFocus: false,
          data: { fileName: row.fileName },
        },
      )
      .afterClosed()
      .subscribe((result) => {
        if (!result?.rejectionReason) {
          return;
        }
        this.saveValidation(row, false, result.rejectionReason);
      });
  }

  private saveValidation(row: CandidateDocumentListItem, isValidated: boolean, rejectionReason?: string): void {
    if (this.saving || !row.id) {
      return;
    }
    this.saving = true;
    this.documentApi
      .updateValidation(this.data.applicationId, row.id, {
        isValidated,
        rejectionReason: isValidated ? null : rejectionReason ?? null,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.feedback.showSuccess(CANDIDATE_DOCS_SUCCESS_VALIDATE);
          this.load();
        },
        error: (err) => {
          this.saving = false;
          this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_DOCS_ERRORS_VALIDATE });
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
