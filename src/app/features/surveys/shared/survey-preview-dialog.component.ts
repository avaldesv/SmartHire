import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  SURVEYS_FIELD_DESCRIPTION,
  SURVEYS_FIELD_FINAL_MESSAGE,
  SURVEYS_PREVIEW_EMPTY,
  SURVEYS_PREVIEW_NO_QUESTIONS,
  SURVEYS_PREVIEW_TITLE,
  SURVEYS_RESULTS_DETAIL_CLOSE,
  SURVEYS_RESULTS_DETAIL_QUESTION,
  SURVEYS_RESULTS_DETAIL_TYPE,
} from '../../../core/i18n/survey-labels';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { SurveyApiService } from '../../../core/services/survey-api.service';
import { SurveyDetail } from '../../../shared/models/survey.model';
import { SURVEYS_ERRORS_LIST } from '../../../core/i18n/survey-labels';

export interface SurveyPreviewDialogData {
  surveyId: number;
}

@Component({
  selector: 'sh-survey-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
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
    question: SURVEYS_RESULTS_DETAIL_QUESTION,
    type: SURVEYS_RESULTS_DETAIL_TYPE,
    initial: SURVEYS_FIELD_DESCRIPTION,
    final: SURVEYS_FIELD_FINAL_MESSAGE,
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

  close(): void {
    this.dialogRef.close();
  }
}
