import { Component } from '@angular/core';
import { QUESTIONNAIRES_TAGS_TITLE } from '../../../core/i18n/questionnaires-labels';
import { TagsAdminComponent } from './tags-admin.component';

@Component({
  selector: 'sh-questionnaire-tags-shell',
  standalone: true,
  imports: [TagsAdminComponent],
  template: `
    <section class="categories-shell">
      <h3>{{ title }}</h3>
      <div class="tab-body">
        <sh-tags-admin />
      </div>
    </section>
  `,
  styleUrl: './categories-shell.component.scss',
})
export class TagsShellComponent {
  readonly title = QUESTIONNAIRES_TAGS_TITLE;
}
