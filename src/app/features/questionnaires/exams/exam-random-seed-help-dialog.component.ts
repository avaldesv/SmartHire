import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
  QEXAM_CLOSE,
  QEXAM_RANDOM_SEED_EXAMPLE_EMPTY,
  QEXAM_RANDOM_SEED_EXAMPLE_FIXED,
  QEXAM_RANDOM_SEED_HINT_EXAMPLE_TITLE,
  QEXAM_RANDOM_SEED_HINT_BODY,
  QEXAM_RANDOM_SEED_HINT_TITLE,
} from '../../../core/i18n/questionnaire-exams-labels';

@Component({
  selector: 'sh-exam-random-seed-help-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content class="help-content">
      <p>{{ body }}</p>
      <p class="help-subtitle">{{ exampleTitle }}</p>
      <ul>
        <li>{{ exampleEmpty }}</li>
        <li>{{ exampleFixed }}</li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>{{ closeLabel }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .help-content {
      max-width: 420px;
      font-size: 0.875rem;
      line-height: 1.45;
      color: rgba(0, 0, 0, 0.8);
    }

    .help-subtitle {
      margin: 12px 0 4px;
      font-weight: 500;
    }

    ul {
      margin: 0;
      padding-left: 18px;
    }
  `,
})
export class ExamRandomSeedHelpDialogComponent {
  readonly title = QEXAM_RANDOM_SEED_HINT_TITLE;
  readonly body = QEXAM_RANDOM_SEED_HINT_BODY;
  readonly exampleTitle = QEXAM_RANDOM_SEED_HINT_EXAMPLE_TITLE;
  readonly exampleEmpty = QEXAM_RANDOM_SEED_EXAMPLE_EMPTY;
  readonly exampleFixed = QEXAM_RANDOM_SEED_EXAMPLE_FIXED;
  readonly closeLabel = QEXAM_CLOSE;
}
