import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  CANDIDATE_DOCS_COL_ACTIONS,
  CANDIDATE_DOCS_COL_CREATED,
  CANDIDATE_DOCS_COL_FILE,
  CANDIDATE_DOCS_COL_SIZE,
  CANDIDATE_DOCS_COL_STATUS,
  CANDIDATE_DOCS_COL_TYPE,
  CANDIDATE_DOCS_DIALOG_CLOSE,
  CANDIDATE_DOCS_DIALOG_EMPTY,
  CANDIDATE_DOCS_DIALOG_TITLE,
  CANDIDATE_DOCS_DOWNLOAD,
  CANDIDATE_DOCS_EM_DASH,
  CANDIDATE_DOCS_ERRORS_DOWNLOAD,
  CANDIDATE_DOCS_ERRORS_LIST,
  candidateDocumentsSizeLabel,
} from '../../../../core/i18n/candidate-documents-dialog-labels';
import { CandidateDocumentApiService } from '../../../../core/services/candidate-document-api.service';
import { CandidateDocumentListItem } from '../../../../shared/models/candidate-document.model';

export interface CandidateDocumentsDialogData {
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

  readonly labels = {
    title: CANDIDATE_DOCS_DIALOG_TITLE,
    close: CANDIDATE_DOCS_DIALOG_CLOSE,
    empty: CANDIDATE_DOCS_DIALOG_EMPTY,
    colType: CANDIDATE_DOCS_COL_TYPE,
    colFile: CANDIDATE_DOCS_COL_FILE,
    colSize: CANDIDATE_DOCS_COL_SIZE,
    colStatus: CANDIDATE_DOCS_COL_STATUS,
    colCreated: CANDIDATE_DOCS_COL_CREATED,
    colActions: CANDIDATE_DOCS_COL_ACTIONS,
    download: CANDIDATE_DOCS_DOWNLOAD,
    emDash: CANDIDATE_DOCS_EM_DASH,
  };

  loading = true;
  rows: CandidateDocumentListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['documentTypeName', 'fileName', 'sizeBytes', 'status', 'createAt', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  dialogTitle(): string {
    const name = this.data.candidateName?.trim();
    return name ? `${this.labels.title} — ${name}` : this.labels.title;
  }

  load(): void {
    this.loading = true;
    this.documentApi.list(this.data.candidateId, this.pageIndex, this.pageSize).subscribe({
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

  download(row: CandidateDocumentListItem): void {
    if (!row.downloadUrl) {
      this.feedback.showApiError(null, { fallbackMessage: CANDIDATE_DOCS_ERRORS_DOWNLOAD });
      return;
    }
    window.open(row.downloadUrl, '_blank', 'noopener,noreferrer');
  }

  close(): void {
    this.dialogRef.close();
  }
}
