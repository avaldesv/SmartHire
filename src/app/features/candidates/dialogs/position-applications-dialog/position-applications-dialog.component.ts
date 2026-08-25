import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs';
import { AppPermissions } from '../../../../core/auth/app-permissions';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  APP_DIALOG_ACTIONS_MENU,
  APP_DIALOG_ACTION_PRESELECT,
  APP_DIALOG_ACTION_VIEW_DOCUMENTS,
  APP_DIALOG_ACTION_VIEW_PROFILE,
  APP_DIALOG_APPOINTMENT_SCHEDULED_TOOLTIP,
  APP_DIALOG_APPOINTMENT_TOOLTIP,
  APP_DIALOG_CLOSE,
  APP_DIALOG_COL_ACTIONS,
  APP_DIALOG_COL_APPOINTMENT,
  APP_DIALOG_COL_CANDIDATE,
  APP_DIALOG_COL_COMPAT,
  APP_DIALOG_COL_CONTACT,
  APP_DIALOG_COL_CREATED,
  APP_DIALOG_COL_EMAIL,
  APP_DIALOG_COL_EVALUATION,
  APP_DIALOG_COL_SOURCE,
  APP_DIALOG_COL_STATUS,
  APP_DIALOG_CONTACT_ERROR,
  APP_DIALOG_CONTACT_SUCCESS,
  APP_DIALOG_CONTACT_TOOLTIP,
  APP_DIALOG_EM_DASH,
  APP_DIALOG_EMPTY,
  APP_DIALOG_ERRORS_LIST,
  APP_DIALOG_ERRORS_PRESELECT,
  APP_DIALOG_EVALUATION_PENDING_MSG,
  APP_DIALOG_EVALUATION_PENDING_TITLE,
  APP_DIALOG_EVALUATION_TOOLTIP,
  APP_DIALOG_POSITION_PREFIX,
  APP_DIALOG_PRESELECT_SUCCESS,
  APP_DIALOG_TITLE,
  applicationsDialogCandidateFallback,
} from '../../../../core/i18n/position-applications-dialog-labels';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import { PermissionService } from '../../../../core/services/permission.service';
import {
  QuestionnaireEvaluationDialogComponent,
  QuestionnaireEvaluationDialogData,
} from '../../../selection/dialogs/questionnaire-evaluation-dialog/questionnaire-evaluation-dialog.component';
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
import {
  ScheduleInterviewDialogComponent,
  ScheduleInterviewDialogData,
} from '../schedule-interview-dialog/schedule-interview-dialog.component';

export interface PositionApplicationsDialogData {
  positionId: number;
  requisitionNo?: string;
  positionName?: string;
}

export interface PositionApplicationsDialogResult {
  changed?: boolean;
}

const APPLICATIONS_SORT_FIELDS: Record<string, string> = {
  candidate: 'candidate',
  email: 'candidateEmail',
  status: 'status',
  source: 'source',
  compatibility: 'compatibilityPercent',
  createdAt: 'createAt',
};

@Component({
  selector: 'sh-position-applications-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    StatusBadgeComponent,
  ],
  templateUrl: './position-applications-dialog.component.html',
  styleUrl: './position-applications-dialog.component.scss',
})
export class PositionApplicationsDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<PositionApplicationsDialogComponent, PositionApplicationsDialogResult>);
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
    colContact: APP_DIALOG_COL_CONTACT,
    colEvaluation: APP_DIALOG_COL_EVALUATION,
    colAppointment: APP_DIALOG_COL_APPOINTMENT,
    colActions: APP_DIALOG_COL_ACTIONS,
    actionsMenu: APP_DIALOG_ACTIONS_MENU,
    viewProfile: APP_DIALOG_ACTION_VIEW_PROFILE,
    viewDocuments: APP_DIALOG_ACTION_VIEW_DOCUMENTS,
    preselect: APP_DIALOG_ACTION_PRESELECT,
    contactTooltip: APP_DIALOG_CONTACT_TOOLTIP,
    evaluationTooltip: APP_DIALOG_EVALUATION_TOOLTIP,
    appointmentTooltip: APP_DIALOG_APPOINTMENT_TOOLTIP,
    appointmentScheduledTooltip: APP_DIALOG_APPOINTMENT_SCHEDULED_TOOLTIP,
    emDash: APP_DIALOG_EM_DASH,
  };

  loading = true;
  rows: CandidateApplicationListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  sortActive = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  preselectingId: number | null = null;
  contactingApplicationId: number | null = null;
  private changed = false;

  readonly columns = [
    'candidate',
    'email',
    'status',
    'source',
    'compatibility',
    'createdAt',
    'contact',
    'evaluation',
    'appointment',
    'actions',
  ];

  ngOnInit(): void {
    this.load();
  }

  get canReadCandidate(): boolean {
    return this.permission.hasAuthority(AppPermissions.CANDIDATE_READ);
  }

  get canEditSelection(): boolean {
    return this.permission.hasAuthority(AppPermissions.SELECTION_EDIT);
  }

  positionLabel(): string {
    return this.data.requisitionNo ?? `${this.labels.positionPrefix} ${this.data.positionId}`;
  }

  hasRowActions(row: CandidateApplicationListItem): boolean {
    return this.canReadCandidate || this.canPreselect(row);
  }

  canPreselect(row: CandidateApplicationListItem): boolean {
    return this.canEditSelection && row.status?.toUpperCase() !== 'PRESELECTED';
  }

  load(): void {
    this.loading = true;
    this.applicationApi
      .list(this.pageIndex, this.pageSize, {
        positionId: this.data.positionId,
        ordersBy: this.buildOrdersBy(),
      })
      .subscribe({
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

  onSortChange(sort: Sort): void {
    this.sortActive = sort.active || 'createdAt';
    this.sortDirection = sort.direction === 'asc' ? 'asc' : 'desc';
    this.pageIndex = 0;
    this.load();
  }

  candidateName(row: CandidateApplicationListItem): string {
    const first = row.candidateFirstName ?? '';
    const last = row.candidateLastName ?? '';
    const name = `${first} ${last}`.trim();
    return name || applicationsDialogCandidateFallback(row.candidateId);
  }

  contactQuestionnaire(row: CandidateApplicationListItem): void {
    if (!this.canEditSelection || this.contactingApplicationId != null) {
      return;
    }
    this.contactingApplicationId = row.id;
    this.applicationApi.contactQuestionnaire(row.id).subscribe({
      next: (res) => {
        this.contactingApplicationId = null;
        this.feedback.showSuccess(res.message?.trim() || APP_DIALOG_CONTACT_SUCCESS);
      },
      error: (err) => {
        this.contactingApplicationId = null;
        this.feedback.showApiError(err, { fallbackMessage: APP_DIALOG_CONTACT_ERROR });
      },
    });
  }

  openEvaluationPending(row: CandidateApplicationListItem): void {
    if (row.questionnaireStatus !== 'ANSWERED') {
      this.feedback.showInfo(
        APP_DIALOG_EVALUATION_PENDING_TITLE,
        `${APP_DIALOG_EVALUATION_PENDING_MSG} (${this.candidateName(row)})`,
      );
      return;
    }
    const data: QuestionnaireEvaluationDialogData = {
      applicationId: row.id,
      candidateName: this.candidateName(row),
    };
    this.dialog.open(QuestionnaireEvaluationDialogComponent, {
      ...catalogDialogConfig('920px'),
      maxWidth: '96vw',
      data,
    });
  }

  scheduleInterview(row: CandidateApplicationListItem): void {
    if (!this.canEditSelection) {
      return;
    }
    const dialogRef = this.dialog.open<
      ScheduleInterviewDialogComponent,
      ScheduleInterviewDialogData,
      boolean | null
    >(ScheduleInterviewDialogComponent, {
      ...catalogDialogConfig('480px'),
      data: { applicationId: row.id, candidateName: this.candidateName(row) },
    });
    dialogRef
      .afterClosed()
      .pipe(filter((ok): ok is true => ok === true))
      .subscribe(() => {
        row.interviewScheduled = true;
        this.changed = true;
      });
  }

  appointmentTooltip(row: CandidateApplicationListItem): string {
    return row.interviewScheduled
      ? this.labels.appointmentScheduledTooltip
      : this.labels.appointmentTooltip;
  }

  preselect(row: CandidateApplicationListItem): void {
    if (!this.canPreselect(row) || this.preselectingId != null) {
      return;
    }
    this.preselectingId = row.id;
    this.applicationApi
      .updateApplication(row.id, { status: 'PRESELECTED', isSelected: true })
      .subscribe({
        next: () => {
          this.preselectingId = null;
          this.changed = true;
          this.feedback.showSuccess(APP_DIALOG_PRESELECT_SUCCESS);
          this.load();
        },
        error: (err) => {
          this.preselectingId = null;
          this.feedback.showApiError(err, { fallbackMessage: APP_DIALOG_ERRORS_PRESELECT });
        },
      });
  }

  openProfile(row: CandidateApplicationListItem): void {
    this.dialog.open<CandidateProfileDialogComponent, CandidateProfileDialogData>(
      CandidateProfileDialogComponent,
      {
        ...catalogDialogConfig('920px'),
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
        ...catalogDialogConfig('960px'),
        autoFocus: false,
        data: {
          applicationId: row.id,
          candidateId: row.candidateId,
          candidateName: this.candidateName(row),
        },
      },
    );
  }

  close(): void {
    this.dialogRef.close({ changed: this.changed });
  }

  private buildOrdersBy(): string[] {
    const field = APPLICATIONS_SORT_FIELDS[this.sortActive] ?? 'createAt';
    return [`${field}:${this.sortDirection}`];
  }
}
