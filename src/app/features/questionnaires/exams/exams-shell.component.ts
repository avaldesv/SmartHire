import { Component } from '@angular/core';
import {
  QUESTIONNAIRES_EXAMS_TITLE,
  QUESTIONNAIRES_SHELL_HINT,
} from '../../../core/i18n/questionnaires-labels';

@Component({
  selector: 'sh-questionnaire-exams-shell',
  standalone: true,
  templateUrl: './exams-shell.component.html',
  styleUrl: '../shared/section-shell.component.scss',
})
export class ExamsShellComponent {
  readonly title = QUESTIONNAIRES_EXAMS_TITLE;
  readonly hint = QUESTIONNAIRES_SHELL_HINT;
}
