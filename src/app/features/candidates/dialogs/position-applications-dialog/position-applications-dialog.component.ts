import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AppPermissions } from '../../../../core/auth/app-permissions';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  APP_DIALOG_ACTIONS_MENU,
  APP_DIALOG_ACTION_VIEW_DOCUMENTS,
  APP_DIALOG_ACTION_VIEW_PROFILE,
  APP_DIALOG_CLOSE,
  APP_DIALOG_COL_ACTIONS,
  APP_DIALOG_COL_CANDIDATE,
  APP_DIALOG_COL_COMPAT,
  APP_DIALOG_COL_CREATED,
  APP_DIALOG_COL_EMAIL,
  APP_DIALOG_COL_SOURCE,
  APP_DIALOG_COL_STATUS,
  APP_DIALOG_EM_DASH,
  APP_DIALOG_EMPTY,
  APP_DIALOG_ERRORS_LIST,
  APP_DIALOG_POSITION_PREFIX,
  APP_DIALOG_TITLE,
  applicationsDialogCandidateFallback,
} from '../../../../core/i18n/position-applications-dialog-labels';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { CandidateApplicationListItem } from '../../../../shared/models/candidate-application.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import {
  CandidateDocumentsDialogComponent,
  CandidateDocumentsDialogData,
} from '../candidate-documents-dialog/candidate-documents-dialog.component';
import {
  CandidateProfileDialogComponent,
  CandidateProfileDialogData,
} from '../candidate-profile-dialog/candidate-profile-dialog.component';

export interface PositionApplicationsDialogData {
  positionId: number;
  requisitionNo?: string;
  positionName?: string;
}

@Component({
  selector: 'sh-position-applications-dialog',
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
    StatusBadgeComponent,
  ],
  templateUrl: './position-applications-dialog.component.html',
  styleUrl: './position-applications-dialog.component.scss',
})
export class PositionApplicationsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<PositionApplicationsDialogComponent>);
  readonly data = inject<PositionApplicationsDialogData>(MAT_DIALOG_DATA);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);
  private readonly permission = inject(PermissionService);

  readonly labels = {
    title: APP_DIALOG_TITLE,
    positionPrefix: APP_DIALOG_POSITION_PREFIX,
    empty: APP_DIALOG_EMPTY,
    close: APP_DIALOG_CLOSE,
    colCandidate: APP_DIALOG_COL_CANDIDATE,
    colEmail: APP_DIALOG_COL_EMAIL,
    colStatus: APP_DIALOG_COL_STATUS,
    colSource: APP_DIALOG_COL_SOURCE,
    colCompat: APP_DIALOG_COL_COMPAT,
    colCreated: APP_DIALOG_COL_CREATED,
    colActions: APP_DIALOG_COL_ACTIONS,
    actionsMenu: APP_DIALOG_ACTIONS_MENU,
    viewProfile: APP_DIALOG_ACTION_VIEW_PROFILE,
    viewDocuments: APP_DIALOG_ACTION_VIEW_DOCUMENTS,
    emDash: APP_DIALOG_EM_DASH,
  };

  loading = true;
  rows: CandidateApplicationListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = [
    'candidate',
    'email',
    'status',
    'source',
    'compatibility',
    'createdAt',
    'actions',
  ];

  ngOnInit(): void {
    this.load();
  }

  get canReadCandidate(): boolean {
    return this.permission.hasAuthority(AppPermissions.CANDIDATE_READ);
  }

  positionLabel(): string {
    return this.data.requisitionNo ?? `${this.labels.positionPrefix} ${this.data.positionId}`;
  }

  load(): void {
    this.loading = true;
    this.applicationApi.list(this.pageIndex, this.pageSize, { positionId: this.data.positionId }).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: APP_DIALOG_ERRORS_LIST });
      },
    });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  candidateName(row: CandidateApplicationListItem): string {
    const first = row.candidateFirstName ?? '';
    const last = row.candidateLastName ?? '';
    const name = `${first} ${last}`.trim();
    return name || applicationsDialogCandidateFallback(row.candidateId);
  }

  openProfile(row: CandidateApplicationListItem): void {
    this.dialog.open<CandidateProfileDialogComponent, CandidateProfileDialogData>(
      CandidateProfileDialogComponent,
      {
        width: '920px',
        maxWidth: '95vw',
        autoFocus: false,
        data: {
          candidateId: row.candidateId,
          candidateName: this.candidateName(row),
        },
      },
    );
  }

  openDocuments(row: CandidateApplicationListItem): void {
    this.dialog.open<CandidateDocumentsDialogComponent, CandidateDocumentsDialogData>(
      CandidateDocumentsDialogComponent,
      {
        width: '800px',
        maxWidth: '95vw',
        autoFocus: false,
        data: {
          candidateId: row.candidateId,
          candidateName: this.candidateName(row),
        },
      },
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
