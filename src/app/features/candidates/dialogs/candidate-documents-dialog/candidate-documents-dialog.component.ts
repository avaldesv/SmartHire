import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
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
  CANDIDATE_DOCS_MARK_NOT_VALIDATED,
  CANDIDATE_DOCS_MARK_VALIDATED,
  CANDIDATE_DOCS_REQUIRED_BADGE,
  CANDIDATE_DOCS_SUCCESS_VALIDATE,
  CANDIDATE_DOCS_VALIDATE,
  CANDIDATE_DOCS_VALIDATION_NOT_VALIDATED,
  CANDIDATE_DOCS_VALIDATION_PENDING,
  CANDIDATE_DOCS_VALIDATION_VALIDATED,
  candidateDocumentsSizeLabel,
} from '../../../../core/i18n/candidate-documents-dialog-labels';
import { CandidateDocumentApiService } from '../../../../core/services/candidate-document-api.service';
import { CandidateDocumentListItem } from '../../../../shared/models/candidate-document.model';
import {
  InvalidateDocumentDialogComponent,
  InvalidateDocumentDialogData,
  InvalidateDocumentDialogResult,
} from '../invalidate-document-dialog/invalidate-document-dialog.component';

export interface CandidateDocumentsDialogData {
  applicationId: number;
  candidateId: number;
  candidateName?: string;
}

@Component({
  selector: 'sh-candidate-documents-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
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
    requiredBadge: CANDIDATE_DOCS_REQUIRED_BADGE,
    emDash: CANDIDATE_DOCS_EM_DASH,
  };

  loading = true;
  saving = false;
  rows: CandidateDocumentListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

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

  dialogTitle(): string {
    const name = this.data.candidateName?.trim();
    return name ? `${this.labels.title} — ${name}` : this.labels.title;
  }

  load(): void {
    this.loading = true;
    this.documentApi.listForApplication(this.data.applicationId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_DOCS_ERRORS_LIST });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  sizeLabel(bytes: number | null | undefined): string {
    return candidateDocumentsSizeLabel(bytes);
  }

  validationLabel(row: CandidateDocumentListItem): string {
    if (row.isValidated === true) {
      return CANDIDATE_DOCS_VALIDATION_VALIDATED;
    }
    if (row.isValidated === false) {
      return CANDIDATE_DOCS_VALIDATION_NOT_VALIDATED;
    }
    return CANDIDATE_DOCS_VALIDATION_PENDING;
  }

  validationClass(row: CandidateDocumentListItem): string {
    if (row.isValidated === true) {
      return 'validation-badge validation-badge--validated';
    }
    if (row.isValidated === false) {
      return 'validation-badge validation-badge--rejected';
    }
    return 'validation-badge validation-badge--pending';
  }

  rowClass(row: CandidateDocumentListItem): string {
    return row.isRequiredForPosition ? 'row-required' : '';
  }

  download(row: CandidateDocumentListItem): void {
    if (!row.downloadUrl) {
      this.feedback.showApiError(null, { fallbackMessage: CANDIDATE_DOCS_ERRORS_DOWNLOAD });
      return;
    }
    window.open(row.downloadUrl, '_blank', 'noopener,noreferrer');
  }

  markValidated(row: CandidateDocumentListItem): void {
    this.saveValidation(row, true);
  }

  markNotValidated(row: CandidateDocumentListItem): void {
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
    if (this.saving) {
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
