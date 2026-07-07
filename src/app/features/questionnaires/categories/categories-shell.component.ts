import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { QUESTIONNAIRES_CATEGORIES_TITLE } from '../../../core/i18n/questionnaires-labels';
import { QCAT_TAB_CATEGORIES, QCAT_TAB_TAGS } from '../../../core/i18n/questionnaire-categories-labels';
import { KnowledgeCategoriesAdminComponent } from './knowledge-categories-admin.component';
import { TagsAdminComponent } from './tags-admin.component';

@Component({
  selector: 'sh-questionnaire-categories-shell',
  standalone: true,
  imports: [MatTabsModule, KnowledgeCategoriesAdminComponent, TagsAdminComponent],
  templateUrl: './categories-shell.component.html',
  styleUrl: './categories-shell.component.scss',
})
export class CategoriesShellComponent {
  readonly title = QUESTIONNAIRES_CATEGORIES_TITLE;
  readonly tabCategories = QCAT_TAB_CATEGORIES;
  readonly tabTags = QCAT_TAB_TAGS;
}
