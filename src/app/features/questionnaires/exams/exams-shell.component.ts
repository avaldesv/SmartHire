import { Component } from '@angular/core';
import { ExamsAdminComponent } from './exams-admin.component';

@Component({
  selector: 'sh-questionnaire-exams-shell',
  standalone: true,
  imports: [ExamsAdminComponent],
  templateUrl: './exams-shell.component.html',
  styleUrl: './exams-shell.component.scss',
})
export class ExamsShellComponent {}
