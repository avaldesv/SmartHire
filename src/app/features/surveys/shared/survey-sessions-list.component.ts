import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs';
import { catalogTallDialogConfig } from '../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { COMMON_CLEAR_FILTERS } from '../../../core/i18n/common-labels';
import {
  SURVEYS_RESULTS_COL_CANDIDATE,
  SURVEYS_RESULTS_COL_COMPLETED,
  SURVEYS_RESULTS_COL_DATE,
  SURVEYS_RESULTS_COL_PHONE,
  SURVEYS_RESULTS_COL_POSITION,
  SURVEYS_RESULTS_COL_PROGRESS,
  SURVEYS_RESULTS_COL_SURVEY,
  SURVEYS_RESULTS_EMPTY,
  SURVEYS_RESULTS_ERRORS_LIST,
  SURVEYS_RESULTS_FILTER_ALL,
  SURVEYS_RESULTS_FILTER_CANDIDATE,
  SURVEYS_RESULTS_FILTER_COMPLETED,
  SURVEYS_RESULTS_FILTER_DATE_FROM,
  SURVEYS_RESULTS_FILTER_DATE_TO,
  SURVEYS_RESULTS_FILTER_NO,
  SURVEYS_RESULTS_FILTER_PHONE,
  SURVEYS_RESULTS_FILTER_POSITION,
  SURVEYS_RESULTS_FILTER_SURVEY,
  SURVEYS_RESULTS_FILTER_YES,
  SURVEYS_RESULTS_TITLE,
  SURVEYS_RESULTS_VIEW_ARIA,
} from '../../../core/i18n/survey-labels';
import { SurveyApiService } from '../../../core/services/survey-api.service';
import { ShPaginatorComponent } from '../../../shared/components/paginator/sh-paginator.component';
import {
  ListSurveySessionsRequest,
  SurveyListItem,
  SurveySessionListItem,
} from '../../../shared/models/survey.model';
import {
  SurveySessionDetailDialogComponent,
  SurveySessionDetailDialogData,
} from './survey-session-detail-dialog.component';

@Component({
  selector: 'sh-survey-sessions-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    ShPaginatorComponent,
  ],
  templateUrl: './survey-sessions-list.component.html',
  styleUrl: './survey-sessions-list.component.scss',
})
export class SurveySessionsListComponent implements OnInit, OnChanges {
  private readonly api = inject(SurveyApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  @Input() positionId: number | null = null;
  @Input() surveyId: number | null = null;
  @Input() showPositionColumn = true;
  @Input() showSurveyColumn = true;
  @Input() showTitle = true;

  loading = true;
  data: SurveySessionListItem[] = [];
  surveyOptions: SurveyListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  columns: string[] = [];

  readonly labels = {
    title: SURVEYS_RESULTS_TITLE,
    empty: SURVEYS_RESULTS_EMPTY,
    clearFilters: COMMON_CLEAR_FILTERS,
    phone: SURVEYS_RESULTS_FILTER_PHONE,
    completed: SURVEYS_RESULTS_FILTER_COMPLETED,
    all: SURVEYS_RESULTS_FILTER_ALL,
    yes: SURVEYS_RESULTS_FILTER_YES,
    no: SURVEYS_RESULTS_FILTER_NO,
    candidate: SURVEYS_RESULTS_FILTER_CANDIDATE,
    survey: SURVEYS_RESULTS_FILTER_SURVEY,
    position: SURVEYS_RESULTS_FILTER_POSITION,
    dateFrom: SURVEYS_RESULTS_FILTER_DATE_FROM,
    dateTo: SURVEYS_RESULTS_FILTER_DATE_TO,
    colCandidate: SURVEYS_RESULTS_COL_CANDIDATE,
    colSurvey: SURVEYS_RESULTS_COL_SURVEY,
    colPosition: SURVEYS_RESULTS_COL_POSITION,
    colPhone: SURVEYS_RESULTS_COL_PHONE,
    colProgress: SURVEYS_RESULTS_COL_PROGRESS,
    colCompleted: SURVEYS_RESULTS_COL_COMPLETED,
    colDate: SURVEYS_RESULTS_COL_DATE,
    viewAria: SURVEYS_RESULTS_VIEW_ARIA,
  };

  readonly filterForm = this.fb.nonNullable.group({
    candidate: [''],
    surveyId: ['' as '' | number],
    position: [''],
    phone: [''],
    completed: ['' as '' | 'true' | 'false'],
    dateFrom: [''],
    dateTo: [''],
  });

  ngOnInit(): void {
    this.refreshColumns();
    this.loadSurveyOptions();
    this.load();
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showPositionColumn'] || changes['showSurveyColumn']) {
      if (!changes['showPositionColumn']?.firstChange || !changes['showSurveyColumn']?.firstChange) {
        this.refreshColumns();
      }
    }
    if (
      (changes['positionId'] && !changes['positionId'].firstChange) ||
      (changes['surveyId'] && !changes['surveyId'].firstChange)
    ) {
      this.pageIndex = 0;
      this.load();
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      candidate: '',
      surveyId: '',
      position: '',
      phone: '',
      completed: '',
      dateFrom: '',
      dateTo: '',
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  candidateName(row: SurveySessionListItem): string {
    return `${row.candidateFirstName ?? ''} ${row.candidateLastName ?? ''}`.trim() || '—';
  }

  progressPercent(row: SurveySessionListItem): number {
    const answered = row.totalQuestionAnswers ?? 0;
    const total = row.totalQuestionsSend ?? row.totalQuestions ?? 0;
    if (total <= 0) {
      return 0;
    }
    return Math.min(100, Math.round((answered / total) * 100));
  }

  progressLabel(row: SurveySessionListItem): string {
    const answered = row.totalQuestionAnswers ?? 0;
    const total = row.totalQuestionsSend ?? row.totalQuestions ?? 0;
    return `${answered}/${total}`;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString();
  }

  openDetail(row: SurveySessionListItem): void {
    this.dialog.open<SurveySessionDetailDialogComponent, SurveySessionDetailDialogData, void>(
      SurveySessionDetailDialogComponent,
      {
        ...catalogTallDialogConfig('720px'),
        data: {
          sessionId: row.id,
          positionId: this.positionId,
        },
      },
    );
  }

  private refreshColumns(): void {
    this.columns = [
      'candidate',
      ...(this.showSurveyColumn ? ['survey'] : []),
      ...(this.showPositionColumn ? ['position'] : []),
      'phone',
      'progress',
      'completed',
      'date',
      'actions',
    ];
  }

  private loadSurveyOptions(): void {
    this.api.list({ isActive: null }, 0, 200).subscribe({
      next: (res) => {
        this.surveyOptions = res.items;
      },
      error: () => {
        this.surveyOptions = [];
      },
    });
  }

  private load(): void {
    this.loading = true;
    const completedRaw = this.filterForm.controls.completed.value;
    const surveyFilter = this.filterForm.controls.surveyId.value;
    const request: ListSurveySessionsRequest = {
      phone: this.filterForm.controls.phone.value.trim() || null,
      candidate: this.filterForm.controls.candidate.value.trim() || null,
      position: this.filterForm.controls.position.value.trim() || null,
      dateFrom: this.filterForm.controls.dateFrom.value || null,
      dateTo: this.filterForm.controls.dateTo.value || null,
      isSurveyCompleted:
        completedRaw === 'true' ? true : completedRaw === 'false' ? false : null,
      surveyId:
        this.surveyId != null && this.surveyId > 0
          ? this.surveyId
          : surveyFilter === '' || surveyFilter == null
            ? null
            : Number(surveyFilter),
    };

    const request$ =
      this.positionId != null && this.positionId > 0
        ? this.api.listPositionSessions(this.positionId, request, this.pageIndex, this.pageSize)
        : this.api.listSessions(request, this.pageIndex, this.pageSize);

    request$.subscribe({
      next: (res) => {
        this.data = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.data = [];
        this.total = 0;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_RESULTS_ERRORS_LIST });
      },
    });
  }
}
