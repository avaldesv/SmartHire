import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  SURVEYS_RESULTS_BACK,
  SURVEYS_RESULTS_BY_SURVEY_EMPTY,
  SURVEYS_RESULTS_BY_SURVEY_ERRORS,
  SURVEYS_RESULTS_COL_COMPLETED,
  SURVEYS_RESULTS_COL_IN_PROGRESS,
  SURVEYS_RESULTS_COL_LAST_SENT,
  SURVEYS_RESULTS_COL_RATE,
  SURVEYS_RESULTS_COL_SENT,
  SURVEYS_RESULTS_COL_SURVEY,
  SURVEYS_RESULTS_DRILL_TITLE,
  SURVEYS_RESULTS_KPI_COMPLETED,
  SURVEYS_RESULTS_KPI_IN_PROGRESS,
  SURVEYS_RESULTS_KPI_RATE,
  SURVEYS_RESULTS_KPI_SENT,
  SURVEYS_RESULTS_VIEW_ARIA,
  SURVEYS_RESULTS_VIEW_BY_SURVEY,
  SURVEYS_RESULTS_VIEW_SESSIONS,
} from '../../../core/i18n/survey-labels';
import { SurveyApiService } from '../../../core/services/survey-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import {
  SurveySessionSurveySummaryItem,
  SurveySessionsSummaryTotals,
} from '../../../shared/models/survey.model';
import { SurveySessionsListComponent } from '../shared/survey-sessions-list.component';

type ResultsView = 'sessions' | 'bySurvey';

@Component({
  selector: 'sh-survey-results',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    KpiCardComponent,
    SurveySessionsListComponent,
  ],
  templateUrl: './survey-results.component.html',
  styleUrl: './survey-results.component.scss',
})
export class SurveyResultsComponent implements OnInit {
  private readonly api = inject(SurveyApiService);
  private readonly feedback = inject(FeedbackDialogService);

  view: ResultsView = 'bySurvey';
  loadingSummary = true;
  totals: SurveySessionsSummaryTotals = {
    sessionsSent: 0,
    sessionsCompleted: 0,
    sessionsInProgress: 0,
    completionRate: 0,
  };
  bySurvey: SurveySessionSurveySummaryItem[] = [];
  drillSurvey: SurveySessionSurveySummaryItem | null = null;

  readonly columns = ['survey', 'sent', 'completed', 'inProgress', 'rate', 'lastSent', 'actions'];

  readonly labels = {
    sessions: SURVEYS_RESULTS_VIEW_SESSIONS,
    bySurvey: SURVEYS_RESULTS_VIEW_BY_SURVEY,
    kpiSent: SURVEYS_RESULTS_KPI_SENT,
    kpiCompleted: SURVEYS_RESULTS_KPI_COMPLETED,
    kpiInProgress: SURVEYS_RESULTS_KPI_IN_PROGRESS,
    kpiRate: SURVEYS_RESULTS_KPI_RATE,
    colSurvey: SURVEYS_RESULTS_COL_SURVEY,
    colSent: SURVEYS_RESULTS_COL_SENT,
    colCompleted: SURVEYS_RESULTS_COL_COMPLETED,
    colInProgress: SURVEYS_RESULTS_COL_IN_PROGRESS,
    colRate: SURVEYS_RESULTS_COL_RATE,
    colLastSent: SURVEYS_RESULTS_COL_LAST_SENT,
    empty: SURVEYS_RESULTS_BY_SURVEY_EMPTY,
    viewAria: SURVEYS_RESULTS_VIEW_ARIA,
    back: SURVEYS_RESULTS_BACK,
    drillTitle: SURVEYS_RESULTS_DRILL_TITLE,
  };

  ngOnInit(): void {
    this.loadSummary();
  }

  setView(view: ResultsView): void {
    this.view = view;
    this.drillSurvey = null;
    if (view === 'bySurvey') {
      this.loadSummary();
    }
  }

  loadSummary(): void {
    this.loadingSummary = true;
    this.api.sessionsSummary().subscribe({
      next: (res) => {
        this.totals = res.totals ?? this.totals;
        this.bySurvey = res.bySurvey ?? [];
        this.loadingSummary = false;
      },
      error: (err) => {
        this.loadingSummary = false;
        this.bySurvey = [];
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_RESULTS_BY_SURVEY_ERRORS });
      },
    });
  }

  ratePercent(rate: number | null | undefined): string {
    const value = (rate ?? 0) * 100;
    return `${Math.round(value)}%`;
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

  openSurveyDrill(row: SurveySessionSurveySummaryItem): void {
    this.drillSurvey = row;
  }

  clearDrill(): void {
    this.drillSurvey = null;
  }
}
