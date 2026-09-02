import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  PRESELECTION_CHANGE_STAGE_CANCEL,
  PRESELECTION_CHANGE_STAGE_CANDIDATES_LABEL,
  PRESELECTION_CHANGE_STAGE_ERROR,
  PRESELECTION_CHANGE_STAGE_LABEL,
  PRESELECTION_CHANGE_STAGE_SAVE,
  PRESELECTION_CHANGE_STAGE_SUBTITLE,
  PRESELECTION_CHANGE_STAGE_SUCCESS,
  PRESELECTION_CHANGE_STAGE_TITLE,
} from '../../../../core/i18n/preselection-actions-labels';
import { CandidateApplicationApiService } from '../../../../core/services/candidate-application-api.service';
import {
  getCandidateApplicationStageLabel,
  PRESELECTION_CHANGEABLE_STAGES,
} from '../../../../shared/constants/candidate-application-stage';

export interface ChangeApplicationStageCandidateItem {
  applicationId: number;
  name: string;
  currentStatus?: string | null;
}

export interface ChangeApplicationStageDialogData {
  positionId: number;
  candidates: ChangeApplicationStageCandidateItem[];
}

export interface ChangeApplicationStageDialogResult {
  updated: number;
}

@Component({
  selector: 'sh-change-application-stage-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './change-application-stage-dialog.component.html',
  styleUrl: './change-application-stage-dialog.component.scss',
})
export class ChangeApplicationStageDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeApplicationStageDialogComponent, ChangeApplicationStageDialogResult | null>);
  readonly data = inject<ChangeApplicationStageDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = PRESELECTION_CHANGE_STAGE_TITLE;
  readonly subtitle = PRESELECTION_CHANGE_STAGE_SUBTITLE;
  readonly candidatesLabel = PRESELECTION_CHANGE_STAGE_CANDIDATES_LABEL;
  readonly stageFieldLabel = PRESELECTION_CHANGE_STAGE_LABEL;
  readonly cancelLabel = PRESELECTION_CHANGE_STAGE_CANCEL;
  readonly saveLabel = PRESELECTION_CHANGE_STAGE_SAVE;
  readonly processingLabel = PRESELECTION_CHANGE_STAGE_SAVE;
  readonly stages = PRESELECTION_CHANGEABLE_STAGES;

  processing = false;

  readonly form = this.fb.nonNullable.group({
    status: ['', Validators.required],
  });

  stageLabel(status: string): string {
    return getCandidateApplicationStageLabel(status);
  }

  submit(): void {
    if (this.form.invalid || this.processing) {
      return;
    }
    const status = this.form.getRawValue().status;
    this.processing = true;
    this.applicationApi
      .updateStatus({
        positionId: this.data.positionId,
        applicationIds: this.data.candidates.map((c) => c.applicationId),
        status,
      })
      .subscribe({
        next: (res) => {
          this.processing = false;
          this.feedback.showSuccess(`${PRESELECTION_CHANGE_STAGE_SUCCESS} (${res.updatedCount})`);
          this.dialogRef.close({ updated: res.updatedCount });
        },
        error: (err) => {
          this.processing = false;
          this.feedback.showApiError(err, { fallbackMessage: PRESELECTION_CHANGE_STAGE_ERROR });
        },
      });
  }
}
