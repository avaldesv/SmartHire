import { Component } from '@angular/core';
import { QUESTIONNAIRES_EXAMS_TITLE } from '../../../core/i18n/questionnaires-labels';
import { ExamsAdminComponent } from './exams-admin.component';

@Component({
  selector: 'sh-questionnaire-exams-shell',
  standalone: true,
  imports: [ExamsAdminComponent],
  templateUrl: './exams-shell.component.html',
  styleUrl: './exams-shell.component.scss',
})
export class ExamsShellComponent {
  readonly title = QUESTIONNAIRES_EXAMS_TITLE;
}
