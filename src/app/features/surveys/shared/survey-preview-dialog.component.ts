import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { COMMON_EM_DASH } from '../../../core/i18n/common-labels';
import {
  SURVEYS_ERRORS_LIST,
  SURVEYS_FIELD_DESCRIPTION,
  SURVEYS_FIELD_FINAL_MESSAGE,
  SURVEYS_PREVIEW_EMPTY,
  SURVEYS_PREVIEW_NO_QUESTIONS,
  SURVEYS_PREVIEW_TITLE,
  SURVEYS_QUESTION_REQUIRED,
  SURVEYS_RESULTS_DETAIL_CLOSE,
  SURVEYS_RESULTS_DETAIL_TYPE,
  surveysAnswerTypeLabel,
} from '../../../core/i18n/survey-labels';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { SurveyApiService } from '../../../core/services/survey-api.service';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';
import { SurveyDetail } from '../../../shared/models/survey.model';

export interface SurveyPreviewDialogData {
  surveyId: number;
}

@Component({
  selector: 'sh-survey-preview-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './survey-preview-dialog.component.html',
  styleUrl: './survey-preview-dialog.component.scss',
})
export class SurveyPreviewDialogComponent implements OnInit {
  private readonly api = inject(SurveyApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialogRef = inject(MatDialogRef<SurveyPreviewDialogComponent>);
  readonly data = inject<SurveyPreviewDialogData>(MAT_DIALOG_DATA);

  readonly labels = {
    title: SURVEYS_PREVIEW_TITLE,
    close: SURVEYS_RESULTS_DETAIL_CLOSE,
    empty: SURVEYS_PREVIEW_EMPTY,
    noQuestions: SURVEYS_PREVIEW_NO_QUESTIONS,
    type: SURVEYS_RESULTS_DETAIL_TYPE,
    required: SURVEYS_QUESTION_REQUIRED,
    initial: SURVEYS_FIELD_DESCRIPTION,
    final: SURVEYS_FIELD_FINAL_MESSAGE,
    emDash: COMMON_EM_DASH,
  };

  loading = true;
  detail: SurveyDetail | null = null;

  ngOnInit(): void {
    this.api.getById(this.data.surveyId).subscribe({
      next: (detail) => {
        this.detail = detail;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: SURVEYS_ERRORS_LIST });
        this.dialogRef.close();
      },
    });
  }

  answerTypeLabel(answerType: string | null | undefined): string {
    return surveysAnswerTypeLabel(answerType, this.labels.emDash);
  }

  close(): void {
    this.dialogRef.close();
  }
}
