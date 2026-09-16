import { Component } from '@angular/core';
import { KnowledgeCategoriesAdminComponent } from './knowledge-categories-admin.component';

@Component({
  selector: 'sh-questionnaire-categories-shell',
  standalone: true,
  imports: [KnowledgeCategoriesAdminComponent],
  templateUrl: './categories-shell.component.html',
  styleUrl: './categories-shell.component.scss',
})
export class CategoriesShellComponent {}
