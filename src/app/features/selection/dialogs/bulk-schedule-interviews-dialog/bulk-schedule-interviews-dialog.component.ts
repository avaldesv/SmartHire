import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  INTERVIEW_CAL_CANCEL,
  INTERVIEW_CAL_TAB_IN_PERSON,
  INTERVIEW_CAL_TAB_VIDEO,
  INTERVIEW_SCHEDULE_ERROR,
  INTERVIEW_SCHEDULE_MODALITY,
} from '../../../../core/i18n/interview-calendar-labels';
import {
  PRESELECTION_BULK_APPOINTMENT_HINT,
  PRESELECTION_BULK_APPOINTMENT_PARTIAL,
  PRESELECTION_BULK_APPOINTMENT_SUCCESS,
  PRESELECTION_BULK_APPOINTMENT_TITLE,
} from '../../../../core/i18n/preselection-actions-labels';
import { InterviewCalendarApiService } from '../../../../core/services/interview-calendar-api.service';
import { catchError, concatMap, from, map, of, tap, toArray } from 'rxjs';

export interface BulkScheduleCandidateItem {
  applicationId: number;
  name: string;
}

export interface BulkScheduleInterviewsDialogData {
  candidates: BulkScheduleCandidateItem[];
}

export interface BulkScheduleInterviewsDialogResult {
  scheduled: number;
  failed: number;
}

@Component({
  selector: 'sh-bulk-schedule-interviews-dialog',
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
      <p class="hint">{{ hint }}</p>
      <ul class="candidate-list">
        @for (c of data.candidates; track c.applicationId) {
          <li>{{ c.name }}</li>
        }
      </ul>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ modalityLabel }}</mat-label>
          <mat-select formControlName="modality">
            <mat-option value="VIRTUAL">{{ videoLabel }}</mat-option>
            <mat-option value="PRESENTIAL">{{ inPersonLabel }}</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
      @if (processing) {
        <div class="processing">
          <mat-spinner diameter="28" />
          <span>Agendando {{ progressDone }} de {{ data.candidates.length }}…</span>
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
        [disabled]="form.invalid || processing"
        (click)="confirm()">
        Enviar citas ({{ data.candidates.length }})
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .hint {
      margin: 0 0 0.75rem;
      color: rgba(0, 0, 0, 0.65);
      font-size: 0.9rem;
    }
    .candidate-list {
      margin: 0 0 1rem;
      padding-left: 1.25rem;
      max-height: 160px;
      overflow-y: auto;
    }
    .full { width: 100%; }
    .form { margin-top: 0.25rem; }
    .processing {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 0.5rem;
      color: rgba(0, 0, 0, 0.65);
    }
  `,
})
export class BulkScheduleInterviewsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<BulkScheduleInterviewsDialogComponent, BulkScheduleInterviewsDialogResult | null>);
  readonly data = inject<BulkScheduleInterviewsDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(InterviewCalendarApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = PRESELECTION_BULK_APPOINTMENT_TITLE;
  readonly hint = PRESELECTION_BULK_APPOINTMENT_HINT;
  readonly modalityLabel = INTERVIEW_SCHEDULE_MODALITY;
  readonly cancelLabel = INTERVIEW_CAL_CANCEL;
  readonly videoLabel = INTERVIEW_CAL_TAB_VIDEO;
  readonly inPersonLabel = INTERVIEW_CAL_TAB_IN_PERSON;

  processing = false;
  progressDone = 0;

  readonly form = this.fb.nonNullable.group({
    modality: ['VIRTUAL' as 'VIRTUAL' | 'PRESENTIAL', Validators.required],
  });

  confirm(): void {
    if (this.form.invalid || this.processing || !this.data.candidates.length) {
      return;
    }
    const modality = this.form.controls.modality.value;
    this.processing = true;
    this.progressDone = 0;

    from(this.data.candidates)
      .pipe(
        concatMap((candidate) =>
          this.api.suggestedSlot(candidate.applicationId, modality).pipe(
            concatMap((slot) =>
              this.api.schedule(candidate.applicationId, {
                modality,
                startAt: slot.startAt,
              }),
            ),
            map(() => true),
            catchError(() => of(false)),
            tap(() => {
              this.progressDone += 1;
            }),
          ),
        ),
        toArray(),
      )
      .subscribe({
        next: (results) => {
          this.processing = false;
          const scheduled = results.filter(Boolean).length;
          const failed = results.length - scheduled;
          if (failed === 0) {
            this.feedback.showSuccess(`${PRESELECTION_BULK_APPOINTMENT_SUCCESS} (${scheduled})`);
          } else if (scheduled === 0) {
            this.feedback.showApiError(null, { fallbackMessage: INTERVIEW_SCHEDULE_ERROR });
          } else {
            this.feedback.showWarning(
              PRESELECTION_BULK_APPOINTMENT_PARTIAL,
              `${scheduled} agendadas, ${failed} fallaron`,
            );
          }
          this.dialogRef.close({ scheduled, failed });
        },
        error: (err) => {
          this.processing = false;
          this.feedback.showApiError(err, { fallbackMessage: INTERVIEW_SCHEDULE_ERROR });
        },
      });
  }
}
