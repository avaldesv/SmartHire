import { Component } from '@angular/core';
import { TagsAdminComponent } from './tags-admin.component';

@Component({
  selector: 'sh-questionnaire-tags-shell',
  standalone: true,
  imports: [TagsAdminComponent],
  template: `
    <section class="categories-shell">
      <div class="tab-body">
        <sh-tags-admin />
      </div>
    </section>
  `,
  styleUrl: './categories-shell.component.scss',
})
export class TagsShellComponent {}
