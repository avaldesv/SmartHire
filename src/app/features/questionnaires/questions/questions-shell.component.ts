import { Component } from '@angular/core';
import { QUESTIONNAIRES_QUESTIONS_TITLE } from '../../../core/i18n/questionnaires-labels';
import { QuestionsAdminComponent } from './questions-admin.component';

@Component({
  selector: 'sh-questionnaire-questions-shell',
  standalone: true,
  imports: [QuestionsAdminComponent],
  templateUrl: './questions-shell.component.html',
  styleUrl: './questions-shell.component.scss',
})
export class QuestionsShellComponent {
  readonly title = QUESTIONNAIRES_QUESTIONS_TITLE;
}
