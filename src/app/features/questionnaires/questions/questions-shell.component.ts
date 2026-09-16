import { Component } from '@angular/core';
import { QuestionsAdminComponent } from './questions-admin.component';

@Component({
  selector: 'sh-questionnaire-questions-shell',
  standalone: true,
  imports: [QuestionsAdminComponent],
  templateUrl: './questions-shell.component.html',
  styleUrl: './questions-shell.component.scss',
})
export class QuestionsShellComponent {}
