import { Component } from '@angular/core';
import { QUESTIONNAIRES_CATEGORIES_TITLE } from '../../../core/i18n/questionnaires-labels';
import { KnowledgeCategoriesAdminComponent } from './knowledge-categories-admin.component';

@Component({
  selector: 'sh-questionnaire-categories-shell',
  standalone: true,
  imports: [KnowledgeCategoriesAdminComponent],
  templateUrl: './categories-shell.component.html',
  styleUrl: './categories-shell.component.scss',
})
export class CategoriesShellComponent {
  readonly title = QUESTIONNAIRES_CATEGORIES_TITLE;
}
