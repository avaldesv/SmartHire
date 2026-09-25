import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs';
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
  SURVEYS_RESULTS_DETAIL_ANSWER,
  SURVEYS_RESULTS_DETAIL_CLOSE,
  SURVEYS_RESULTS_DETAIL_NO_ANSWERS,
  SURVEYS_RESULTS_DETAIL_QUESTION,
  SURVEYS_RESULTS_DETAIL_TITLE,
  SURVEYS_RESULTS_DETAIL_TYPE,
  SURVEYS_RESULTS_EMPTY,
  SURVEYS_RESULTS_ERRORS_DETAIL,
  SURVEYS_RESULTS_ERRORS_LIST,
  SURVEYS_RESULTS_FILTER_ALL,
  SURVEYS_RESULTS_FILTER_COMPLETED,
  SURVEYS_RESULTS_FILTER_NO,
  SURVEYS_RESULTS_FILTER_PHONE,
  SURVEYS_RESULTS_FILTER_YES,
  SURVEYS_RESULTS_TITLE,
  SURVEYS_RESULTS_VIEW_ARIA,
} from '../../../core/i18n/survey-labels';
import { SurveyApiService } from '../../../core/services/survey-api.service';
import { ShPaginatorComponent } from '../../../shared/components/paginator/sh-paginator.component';
import {
  ListSurveySessionsRequest,
  SurveySessionAnswer,
  SurveySessionDetail,
  SurveySessionListItem,
} from '../../../shared/models/survey.model';

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
    ShPaginatorComponent,
  ],
  templateUrl: './survey-sessions-list.component.html',
  styleUrl: './survey-sessions-list.component.scss',
})
export class SurveySessionsListComponent implements OnInit, OnChanges {
  private readonly api = inject(SurveyApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);

  /** When set, uses position-scoped session APIs (SELECTION_READ). */
  @Input() positionId: number | null = null;
  /** Filter sessions to one survey (drill-down). */
  @Input() surveyId: number | null = null;
  /** Show position column (global results). Hidden for position-scoped list. */
  @Input() showPositionColumn = true;
  @Input() showSurveyColumn = true;
  @Input() showTitle = true;
  /** Open detail in side drawer instead of MatDialog. */
  @Input() useDrawer = true;

  loading = true;
  detailLoading = false;
  data: SurveySessionListItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  columns: string[] = [];
  drawerOpen = false;
  detail: SurveySessionDetail | null = null;
  answers: SurveySessionAnswer[] = [];

  readonly labels = {
    title: SURVEYS_RESULTS_TITLE,
    empty: SURVEYS_RESULTS_EMPTY,
    clearFilters: COMMON_CLEAR_FILTERS,
    phone: SURVEYS_RESULTS_FILTER_PHONE,
    completed: SURVEYS_RESULTS_FILTER_COMPLETED,
    all: SURVEYS_RESULTS_FILTER_ALL,
    yes: SURVEYS_RESULTS_FILTER_YES,
    no: SURVEYS_RESULTS_FILTER_NO,
    colCandidate: SURVEYS_RESULTS_COL_CANDIDATE,
    colSurvey: SURVEYS_RESULTS_COL_SURVEY,
    colPosition: SURVEYS_RESULTS_COL_POSITION,
    colPhone: SURVEYS_RESULTS_COL_PHONE,
    colProgress: SURVEYS_RESULTS_COL_PROGRESS,
    colCompleted: SURVEYS_RESULTS_COL_COMPLETED,
    colDate: SURVEYS_RESULTS_COL_DATE,
    viewAria: SURVEYS_RESULTS_VIEW_ARIA,
    detailTitle: SURVEYS_RESULTS_DETAIL_TITLE,
    close: SURVEYS_RESULTS_DETAIL_CLOSE,
    question: SURVEYS_RESULTS_DETAIL_QUESTION,
    answer: SURVEYS_RESULTS_DETAIL_ANSWER,
    type: SURVEYS_RESULTS_DETAIL_TYPE,
    noAnswers: SURVEYS_RESULTS_DETAIL_NO_ANSWERS,
  };

  readonly answerColumns = ['order', 'question', 'type', 'answer'];

  readonly filterForm = this.fb.nonNullable.group({
    phone: [''],
    completed: ['' as '' | 'true' | 'false'],
  });

  ngOnInit(): void {
    this.refreshColumns();
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
      this.closeDrawer();
      this.load();
    }
  }

  clearFilters(): void {
    this.filterForm.reset({ phone: '', completed: '' });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  candidateName(row: SurveySessionListItem | SurveySessionDetail | null): string {
    if (!row) {
      return '—';
    }
    return `${row.candidateFirstName ?? ''} ${row.candidateLastName ?? ''}`.trim() || '—';
  }

  progressLabel(row: SurveySessionListItem | SurveySessionDetail | null): string {
    if (!row) {
      return '—';
    }
    const answered = row.totalQuestionAnswers ?? 0;
    const total = row.totalQuestionsSend ?? row.totalQuestions ?? 0;
    return `${answered} / ${total}`;
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
    this.drawerOpen = true;
    this.detailLoading = true;
    this.detail = null;
    this.answers = [];
    const request$ =
      this.positionId != null && this.positionId > 0
        ? this.api.getPositionSession(this.positionId, row.id)
        : this.api.getSession(row.id);

    request$.subscribe({
      next: (detail) => {
        this.detail = detail;
        this.answers = [...(detail.answers ?? [])].sort(
          (a, b) =>
            (a.sortOrder ?? a.questionIndex ?? 0) - (b.sortOrder ?? b.questionIndex ?? 0),
        );
        this.detailLoading = false;
      },
      error: (err) => {
        this.detailLoading = false;
        this.drawerOpen = false;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_RESULTS_ERRORS_DETAIL });
      },
    });
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.detail = null;
    this.answers = [];
  }

  answerOrder(row: SurveySessionAnswer): number {
    return (row.sortOrder ?? row.questionIndex ?? 0) + 1;
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

  private load(): void {
    this.loading = true;
    const completedRaw = this.filterForm.controls.completed.value;
    const request: ListSurveySessionsRequest = {
      phone: this.filterForm.controls.phone.value.trim() || null,
      isSurveyCompleted:
        completedRaw === 'true' ? true : completedRaw === 'false' ? false : null,
      surveyId: this.surveyId != null && this.surveyId > 0 ? this.surveyId : null,
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
