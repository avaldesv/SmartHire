import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { COMMON_EM_DASH } from '../../../core/i18n/common-labels';
import {
  SURVEYS_RESULTS_COL_CANDIDATE,
  SURVEYS_RESULTS_COL_COMPLETED,
  SURVEYS_RESULTS_COL_PHONE,
  SURVEYS_RESULTS_COL_POSITION,
  SURVEYS_RESULTS_COL_PROGRESS,
  SURVEYS_RESULTS_COL_SURVEY,
  SURVEYS_RESULTS_DETAIL_ANSWER,
  SURVEYS_RESULTS_DETAIL_CLOSE,
  SURVEYS_RESULTS_DETAIL_NO_ANSWERS,
  SURVEYS_RESULTS_DETAIL_ORDER,
  SURVEYS_RESULTS_DETAIL_QUESTION,
  SURVEYS_RESULTS_DETAIL_TITLE,
  SURVEYS_RESULTS_DETAIL_TYPE,
  SURVEYS_RESULTS_ERRORS_DETAIL,
  SURVEYS_RESULTS_FILTER_NO,
  SURVEYS_RESULTS_FILTER_YES,
  surveysAnswerTypeLabel,
} from '../../../core/i18n/survey-labels';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { SurveyApiService } from '../../../core/services/survey-api.service';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';
import { SurveySessionAnswer, SurveySessionDetail } from '../../../shared/models/survey.model';

export interface SurveySessionDetailDialogData {
  sessionId: number;
  positionId?: number | null;
}

@Component({
  selector: 'sh-survey-session-detail-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './survey-session-detail-dialog.component.html',
  styleUrl: './survey-session-detail-dialog.component.scss',
})
export class SurveySessionDetailDialogComponent implements OnInit {
  private readonly api = inject(SurveyApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialogRef = inject(MatDialogRef<SurveySessionDetailDialogComponent>);
  readonly data = inject<SurveySessionDetailDialogData>(MAT_DIALOG_DATA);

  readonly labels = {
    title: SURVEYS_RESULTS_DETAIL_TITLE,
    close: SURVEYS_RESULTS_DETAIL_CLOSE,
    candidate: SURVEYS_RESULTS_COL_CANDIDATE,
    survey: SURVEYS_RESULTS_COL_SURVEY,
    position: SURVEYS_RESULTS_COL_POSITION,
    phone: SURVEYS_RESULTS_COL_PHONE,
    progress: SURVEYS_RESULTS_COL_PROGRESS,
    completed: SURVEYS_RESULTS_COL_COMPLETED,
    order: SURVEYS_RESULTS_DETAIL_ORDER,
    question: SURVEYS_RESULTS_DETAIL_QUESTION,
    answer: SURVEYS_RESULTS_DETAIL_ANSWER,
    type: SURVEYS_RESULTS_DETAIL_TYPE,
    noAnswers: SURVEYS_RESULTS_DETAIL_NO_ANSWERS,
    yes: SURVEYS_RESULTS_FILTER_YES,
    no: SURVEYS_RESULTS_FILTER_NO,
    empty: COMMON_EM_DASH,
  };

  readonly answerColumns = ['order', 'question', 'type', 'answer'];

  loading = true;
  detail: SurveySessionDetail | null = null;
  answers: SurveySessionAnswer[] = [];

  ngOnInit(): void {
    const request$ =
      this.data.positionId != null && this.data.positionId > 0
        ? this.api.getPositionSession(this.data.positionId, this.data.sessionId)
        : this.api.getSession(this.data.sessionId);

    request$.subscribe({
      next: (detail) => {
        this.detail = detail;
        this.answers = [...(detail.answers ?? [])].sort(
          (a, b) =>
            (a.sortOrder ?? a.questionIndex ?? 0) - (b.sortOrder ?? b.questionIndex ?? 0),
        );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_RESULTS_ERRORS_DETAIL });
        this.dialogRef.close();
      },
    });
  }

  candidateName(): string {
    if (!this.detail) {
      return this.labels.empty;
    }
    return (
      `${this.detail.candidateFirstName ?? ''} ${this.detail.candidateLastName ?? ''}`.trim() ||
      this.labels.empty
    );
  }

  progressLabel(): string {
    if (!this.detail) {
      return this.labels.empty;
    }
    const answered = this.detail.totalQuestionAnswers ?? 0;
    const total = this.detail.totalQuestionsSend ?? this.detail.totalQuestions ?? 0;
    return `${answered} / ${total}`;
  }

  answerOrder(row: SurveySessionAnswer): number {
    return (row.sortOrder ?? row.questionIndex ?? 0) + 1;
  }

  answerTypeLabel(answerType: string | null | undefined): string {
    return surveysAnswerTypeLabel(answerType, this.labels.empty);
  }

  close(): void {
    this.dialogRef.close();
  }
}
