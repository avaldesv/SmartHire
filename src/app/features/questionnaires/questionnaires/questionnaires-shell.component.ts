import { Component } from '@angular/core';
import { QuestionnairesAdminComponent } from './questionnaires-admin.component';

@Component({
  selector: 'sh-questionnaire-questionnaires-shell',
  standalone: true,
  imports: [QuestionnairesAdminComponent],
  templateUrl: './questionnaires-shell.component.html',
  styleUrl: './questionnaires-shell.component.scss',
})
export class QuestionnairesShellComponent {}
