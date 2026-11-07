import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  CANDIDATE_CHANGE_LOG_CLOSE,
  CANDIDATE_CHANGE_LOG_COL_DATE,
  CANDIDATE_CHANGE_LOG_COL_FIELD,
  CANDIDATE_CHANGE_LOG_COL_NEW,
  CANDIDATE_CHANGE_LOG_COL_OLD,
  CANDIDATE_CHANGE_LOG_COL_USER,
  CANDIDATE_CHANGE_LOG_EMPTY,
  CANDIDATE_CHANGE_LOG_LOAD_ERROR,
  CANDIDATE_CHANGE_LOG_TITLE,
  candidateChangeLogFieldLabel,
  candidateChangeLogValueLabel,
} from '../../../../core/i18n/candidate-block-labels';
import { CandidateApiService } from '../../../../core/services/candidate-api.service';
import { ShPaginatorComponent } from '../../../../shared/components/paginator/sh-paginator.component';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../../shared/components/modal-form/sh-modal-form.component';
import { CandidateChangeLogItem } from '../../../../shared/models/candidate.model';

export interface CandidateChangeLogDialogData {
  candidateId: number;
  firstName: string;
  lastName: string;
}

export function candidateChangeLogDialogConfig(
  data: CandidateChangeLogDialogData,
  extra: MatDialogConfig = {},
): MatDialogConfig<CandidateChangeLogDialogData> {
  return catalogDialogConfig('1000px', { data, ...extra }) as MatDialogConfig<CandidateChangeLogDialogData>;
}

@Component({
  selector: 'sh-candidate-change-log-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ShPaginatorComponent,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './candidate-change-log-dialog.component.html',
  styleUrl: './candidate-change-log-dialog.component.scss',
})
export class CandidateChangeLogDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CandidateChangeLogDialogComponent>);
  readonly data = inject<CandidateChangeLogDialogData>(MAT_DIALOG_DATA);
  private readonly candidateApi = inject(CandidateApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly ui = {
    title: CANDIDATE_CHANGE_LOG_TITLE,
    colDate: CANDIDATE_CHANGE_LOG_COL_DATE,
    colUser: CANDIDATE_CHANGE_LOG_COL_USER,
    colField: CANDIDATE_CHANGE_LOG_COL_FIELD,
    colOld: CANDIDATE_CHANGE_LOG_COL_OLD,
    colNew: CANDIDATE_CHANGE_LOG_COL_NEW,
    empty: CANDIDATE_CHANGE_LOG_EMPTY,
    close: CANDIDATE_CHANGE_LOG_CLOSE,
  };
  readonly fieldLabel = candidateChangeLogFieldLabel;
  readonly valueLabel = candidateChangeLogValueLabel;

  readonly columns = ['createAt', 'user', 'field', 'oldValue', 'newValue'];
  loading = true;
  rows: CandidateChangeLogItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  get candidateName(): string {
    return `${this.data.firstName ?? ''} ${this.data.lastName ?? ''}`.trim();
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.candidateApi.listChangeLog(this.data.candidateId, this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: CANDIDATE_CHANGE_LOG_LOAD_ERROR });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  close(): void {
    this.dialogRef.close();
  }
}
