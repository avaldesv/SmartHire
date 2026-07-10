import { Component } from '@angular/core';
import { QUESTIONNAIRES_QUESTION_TYPES_TITLE } from '../../../core/i18n/questionnaires-labels';
import { QuestionTypesAdminComponent } from './question-types-admin.component';

@Component({
  selector: 'sh-questionnaire-question-types-shell',
  standalone: true,
  imports: [QuestionTypesAdminComponent],
  templateUrl: './question-types-shell.component.html',
  styleUrl: './question-types-shell.component.scss',
})
export class QuestionTypesShellComponent {
  readonly title = QUESTIONNAIRES_QUESTION_TYPES_TITLE;
}
