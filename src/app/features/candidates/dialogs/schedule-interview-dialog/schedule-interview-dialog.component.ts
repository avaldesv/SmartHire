import { Component, DestroyRef, LOCALE_ID, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  INTERVIEW_SCHEDULE_CONFIRM,
  INTERVIEW_SCHEDULE_ERROR,
  INTERVIEW_SCHEDULE_LOADING_SLOT,
  INTERVIEW_SCHEDULE_MODALITY,
  INTERVIEW_SCHEDULE_NO_SLOT,
  INTERVIEW_SCHEDULE_PROPOSED,
  INTERVIEW_SCHEDULE_SUCCESS,
  INTERVIEW_SCHEDULE_TITLE,
} from '../../../../core/i18n/interview-calendar-labels';
import { InterviewCalendarApiService } from '../../../../core/services/interview-calendar-api.service';
import { SuggestedInterviewSlot } from '../../../../shared/models/interview-calendar.model';

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
    MatSelectModule,
    MatProgressSpinnerModule,
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

        <div class="proposed">
          <span class="proposed__label">{{ proposedLabel }}</span>
          @if (loadingSlot) {
            <div class="proposed__loading">
              <mat-spinner diameter="28" />
              <span>{{ loadingSlotLabel }}</span>
            </div>
          } @else if (slotError || !suggested) {
            <p class="proposed__error">{{ noSlotLabel }}</p>
          } @else {
            <p class="proposed__value">{{ formatSlot(suggested) }}</p>
          }
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close(null)">{{ cancelLabel }}</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="form.invalid || saving || loadingSlot || !suggested || slotError"
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
    .proposed { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
    .proposed__label { font-size: 12px; font-weight: 500; color: rgba(0,0,0,.6); }
    .proposed__value { margin: 0; font-size: 15px; font-weight: 500; }
    .proposed__error { margin: 0; color: #b91c1c; }
    .proposed__loading {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(0,0,0,.65);
    }
  `,
})
export class ScheduleInterviewDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ScheduleInterviewDialogComponent>);
  readonly data = inject<ScheduleInterviewDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(InterviewCalendarApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly localeId = inject(LOCALE_ID);

  readonly title = INTERVIEW_SCHEDULE_TITLE;
  readonly modalityLabel = INTERVIEW_SCHEDULE_MODALITY;
  readonly proposedLabel = INTERVIEW_SCHEDULE_PROPOSED;
  readonly loadingSlotLabel = INTERVIEW_SCHEDULE_LOADING_SLOT;
  readonly noSlotLabel = INTERVIEW_SCHEDULE_NO_SLOT;
  readonly confirmLabel = INTERVIEW_SCHEDULE_CONFIRM;
  readonly cancelLabel = INTERVIEW_CAL_CANCEL;
  readonly videoLabel = INTERVIEW_CAL_TAB_VIDEO;
  readonly inPersonLabel = INTERVIEW_CAL_TAB_IN_PERSON;

  saving = false;
  loadingSlot = false;
  slotError = false;
  suggested: SuggestedInterviewSlot | null = null;

  readonly form = this.fb.nonNullable.group({
    modality: ['VIRTUAL' as 'VIRTUAL' | 'PRESENTIAL', Validators.required],
  });

  ngOnInit(): void {
    this.loadSuggestedSlot(this.form.controls.modality.value);
    this.form.controls.modality.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((modality) => this.loadSuggestedSlot(modality));
  }

  formatSlot(slot: SuggestedInterviewSlot): string {
    const start = new Date(slot.startAt);
    const end = new Date(slot.endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return `${slot.startAt} – ${slot.endAt}`;
    }
    const datePart = new Intl.DateTimeFormat(this.localeId, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(start);
    const timeFmt = new Intl.DateTimeFormat(this.localeId, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart}, ${timeFmt.format(start)} – ${timeFmt.format(end)}`;
  }

  confirm(): void {
    if (this.form.invalid || this.saving || !this.suggested || this.loadingSlot || this.slotError) {
      return;
    }
    const modality = this.form.controls.modality.value;
    this.saving = true;
    this.api
      .schedule(this.data.applicationId, {
        modality,
        startAt: this.suggested.startAt,
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

  private loadSuggestedSlot(modality: 'VIRTUAL' | 'PRESENTIAL'): void {
    this.loadingSlot = true;
    this.slotError = false;
    this.suggested = null;
    this.api.suggestedSlot(this.data.applicationId, modality).subscribe({
      next: (slot) => {
        this.loadingSlot = false;
        this.suggested = slot;
        this.slotError = false;
      },
      error: () => {
        this.loadingSlot = false;
        this.suggested = null;
        this.slotError = true;
      },
    });
  }
}
