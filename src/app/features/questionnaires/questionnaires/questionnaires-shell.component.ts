import { Component } from '@angular/core';
import {
  QUESTIONNAIRES_QUESTIONNAIRES_TITLE,
  QUESTIONNAIRES_SHELL_HINT,
} from '../../../core/i18n/questionnaires-labels';

@Component({
  selector: 'sh-questionnaire-questionnaires-shell',
  standalone: true,
  templateUrl: './questionnaires-shell.component.html',
  styleUrl: '../shared/section-shell.component.scss',
})
export class QuestionnairesShellComponent {
  readonly title = QUESTIONNAIRES_QUESTIONNAIRES_TITLE;
  readonly hint = QUESTIONNAIRES_SHELL_HINT;
}
