import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  PRESELECTION_CHANGE_STAGE_CANCEL,
  PRESELECTION_CHANGE_STAGE_ERROR,
  PRESELECTION_CHANGE_STAGE_LABEL,
  PRESELECTION_CHANGE_STAGE_SAVE,
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
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ title }}</span>
    </div>
    <mat-dialog-content class="sh-catalog-dialog-body">
      <div class="sh-catalog-dialog-gap" aria-hidden="true"></div>
      <ul class="candidate-list">
        @for (c of data.candidates; track c.applicationId) {
          <li>
            {{ c.name }}
            @if (c.currentStatus) {
              <span class="current-stage">({{ stageLabel(c.currentStatus) }})</span>
            }
          </li>
        }
      </ul>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ stageFieldLabel }}</mat-label>
          <mat-select formControlName="status">
            @for (stage of stages; track stage) {
              <mat-option [value]="stage">{{ stageLabel(stage) }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
      @if (processing) {
        <div class="processing">
          <mat-spinner diameter="28" />
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" [disabled]="processing" (click)="dialogRef.close(null)">
        {{ cancelLabel }}
      </button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="processing || form.invalid"
        (click)="submit()"
      >
        {{ saveLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .candidate-list {
      margin: 0 0 1rem;
      padding-left: 1.25rem;
      max-height: 160px;
      overflow-y: auto;
    }
    .current-stage {
      color: var(--sh-text-muted, #64748b);
      font-size: 0.875rem;
    }
    .form .full {
      width: 100%;
    }
    .processing {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
  `,
})
export class ChangeApplicationStageDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeApplicationStageDialogComponent, ChangeApplicationStageDialogResult | null>);
  readonly data = inject<ChangeApplicationStageDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = PRESELECTION_CHANGE_STAGE_TITLE;
  readonly stageFieldLabel = PRESELECTION_CHANGE_STAGE_LABEL;
  readonly cancelLabel = PRESELECTION_CHANGE_STAGE_CANCEL;
  readonly saveLabel = PRESELECTION_CHANGE_STAGE_SAVE;
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
