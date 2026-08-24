import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  INTERVIEW_CAL_CANCEL,
  INTERVIEW_CAL_TAB_IN_PERSON,
  INTERVIEW_CAL_TAB_VIDEO,
  INTERVIEW_SCHEDULE_CONFIRM,
  INTERVIEW_SCHEDULE_ERROR,
  INTERVIEW_SCHEDULE_MEETING_LINK,
  INTERVIEW_SCHEDULE_MODALITY,
  INTERVIEW_SCHEDULE_START,
  INTERVIEW_SCHEDULE_SUCCESS,
  INTERVIEW_SCHEDULE_TITLE,
} from '../../../../core/i18n/interview-calendar-labels';
import { InterviewCalendarApiService } from '../../../../core/services/interview-calendar-api.service';

export interface ScheduleInterviewDialogData {
  applicationId: number;
  candidateName?: string;
}

@Component({
  selector: 'sh-schedule-interview-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ title }}</span>
    </div>
    <mat-dialog-content class="sh-catalog-dialog-body">
      <div class="sh-catalog-dialog-gap" aria-hidden="true"></div>
      @if (data.candidateName) {
        <p class="candidate">{{ data.candidateName }}</p>
      }
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ modalityLabel }}</mat-label>
          <mat-select formControlName="modality">
            <mat-option value="VIRTUAL">{{ videoLabel }}</mat-option>
            <mat-option value="PRESENTIAL">{{ inPersonLabel }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>{{ startLabel }}</mat-label>
          <input matInput type="datetime-local" formControlName="startAtLocal" />
        </mat-form-field>
        @if (form.controls.modality.value === 'VIRTUAL') {
          <mat-form-field appearance="outline" class="full">
            <mat-label>{{ meetingLinkLabel }}</mat-label>
            <input matInput formControlName="meetingLink" />
          </mat-form-field>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close(null)">{{ cancelLabel }}</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="form.invalid || saving"
        (click)="confirm()"
      >
        {{ confirmLabel }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .full { width: 100%; }
    .form { display: flex; flex-direction: column; gap: 8px; }
    .candidate { margin: 0 0 8px; color: rgba(0,0,0,.7); }
  `,
})
export class ScheduleInterviewDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ScheduleInterviewDialogComponent>);
  readonly data = inject<ScheduleInterviewDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(InterviewCalendarApiService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = INTERVIEW_SCHEDULE_TITLE;
  readonly modalityLabel = INTERVIEW_SCHEDULE_MODALITY;
  readonly startLabel = INTERVIEW_SCHEDULE_START;
  readonly meetingLinkLabel = INTERVIEW_SCHEDULE_MEETING_LINK;
  readonly confirmLabel = INTERVIEW_SCHEDULE_CONFIRM;
  readonly cancelLabel = INTERVIEW_CAL_CANCEL;
  readonly videoLabel = INTERVIEW_CAL_TAB_VIDEO;
  readonly inPersonLabel = INTERVIEW_CAL_TAB_IN_PERSON;

  saving = false;
  readonly form = this.fb.nonNullable.group({
    modality: ['VIRTUAL' as 'VIRTUAL' | 'PRESENTIAL', Validators.required],
    startAtLocal: ['', Validators.required],
    meetingLink: [''],
  });

  confirm(): void {
    if (this.form.invalid || this.saving) {
      return;
    }
    const raw = this.form.getRawValue();
    const startAt = new Date(raw.startAtLocal).toISOString();
    this.saving = true;
    this.api
      .schedule(this.data.applicationId, {
        modality: raw.modality,
        startAt,
        meetingLink: raw.modality === 'VIRTUAL' ? raw.meetingLink || null : null,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.feedback.showSuccess(INTERVIEW_SCHEDULE_SUCCESS);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.saving = false;
          this.feedback.showApiError(err, { fallbackMessage: INTERVIEW_SCHEDULE_ERROR });
        },
      });
  }
}
