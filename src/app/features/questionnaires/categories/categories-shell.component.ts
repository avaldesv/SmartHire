import { Component } from '@angular/core';
import {
  QUESTIONNAIRES_CATEGORIES_TITLE,
  QUESTIONNAIRES_SHELL_HINT,
} from '../../../core/i18n/questionnaires-labels';

@Component({
  selector: 'sh-questionnaire-categories-shell',
  standalone: true,
  templateUrl: './categories-shell.component.html',
  styleUrl: '../shared/section-shell.component.scss',
})
export class CategoriesShellComponent {
  readonly title = QUESTIONNAIRES_CATEGORIES_TITLE;
  readonly hint = QUESTIONNAIRES_SHELL_HINT;
}
