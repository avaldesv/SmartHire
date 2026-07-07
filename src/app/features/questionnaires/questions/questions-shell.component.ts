import { Component } from '@angular/core';
import {
  QUESTIONNAIRES_QUESTIONS_TITLE,
  QUESTIONNAIRES_SHELL_HINT,
} from '../../../core/i18n/questionnaires-labels';

@Component({
  selector: 'sh-questionnaire-questions-shell',
  standalone: true,
  templateUrl: './questions-shell.component.html',
  styleUrl: '../shared/section-shell.component.scss',
})
export class QuestionsShellComponent {
  readonly title = QUESTIONNAIRES_QUESTIONS_TITLE;
  readonly hint = QUESTIONNAIRES_SHELL_HINT;
}
