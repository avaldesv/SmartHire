import { Component } from '@angular/core';
import { QUESTIONNAIRES_QUESTIONNAIRES_TITLE } from '../../../core/i18n/questionnaires-labels';
import { QuestionnairesAdminComponent } from './questionnaires-admin.component';

@Component({
  selector: 'sh-questionnaire-questionnaires-shell',
  standalone: true,
  imports: [QuestionnairesAdminComponent],
  templateUrl: './questionnaires-shell.component.html',
  styleUrl: './questionnaires-shell.component.scss',
})
export class QuestionnairesShellComponent {
  readonly title = QUESTIONNAIRES_QUESTIONNAIRES_TITLE;
}
