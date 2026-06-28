import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  INTERVIEWS_FIELD_DURATION,
  INTERVIEWS_FIELD_MODALITY,
  INTERVIEWS_FIELD_REMINDER,
  INTERVIEWS_MODALITY_HYBRID,
  INTERVIEWS_MODALITY_IN_PERSON,
  INTERVIEWS_MODALITY_VIRTUAL,
  INTERVIEWS_PAGE_TITLE,
  INTERVIEWS_SAVE_SUCCESS,
  SETTINGS_CONFIG_SAVE,
  SETTINGS_CONFIG_SNACK_CLOSE,
} from '../../../core/i18n/settings-config-labels';

@Component({
  selector: 'sh-interviews-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>{{ pageTitle }}</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-form-field appearance="outline"><mat-label>{{ fieldDuration }}</mat-label><input matInput type="number" formControlName="durationMin" /></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>{{ fieldModality }}</mat-label><mat-select formControlName="modality"><mat-option value="presencial">{{ modalityInPerson }}</mat-option><mat-option value="virtual">{{ modalityVirtual }}</mat-option><mat-option value="mixta">{{ modalityHybrid }}</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>{{ fieldReminder }}</mat-label><input matInput type="number" formControlName="reminderHours" /></mat-form-field>
      <button mat-flat-button color="primary" type="submit">{{ saveLabel }}</button>
    </form>
  `,
  styles: `
    h3 { margin: 0 0 16px; font-size: 1.1rem; }
    .config-form { display: flex; flex-direction: column; gap: 12px; max-width: 400px; }
  `,
})
export class InterviewsConfigComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly pageTitle = INTERVIEWS_PAGE_TITLE;
  readonly fieldDuration = INTERVIEWS_FIELD_DURATION;
  readonly fieldModality = INTERVIEWS_FIELD_MODALITY;
  readonly fieldReminder = INTERVIEWS_FIELD_REMINDER;
  readonly modalityInPerson = INTERVIEWS_MODALITY_IN_PERSON;
  readonly modalityVirtual = INTERVIEWS_MODALITY_VIRTUAL;
  readonly modalityHybrid = INTERVIEWS_MODALITY_HYBRID;
  readonly saveLabel = SETTINGS_CONFIG_SAVE;

  readonly form = this.fb.nonNullable.group({
    durationMin: [45],
    modality: ['virtual'],
    reminderHours: [24],
  });

  save(): void {
    this.snack.open(INTERVIEWS_SAVE_SUCCESS, SETTINGS_CONFIG_SNACK_CLOSE, { duration: 2500 });
  }
}
