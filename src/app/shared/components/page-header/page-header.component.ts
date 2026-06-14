import { Component, Input } from '@angular/core';

@Component({
  selector: 'sh-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div>
        <h2>{{ title }}</h2>
        @if (subtitle) { <p>{{ subtitle }}</p> }
      </div>
      <div class="actions"><ng-content /></div>
    </div>
  `,
  styles: `
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
    }
    h2 { margin: 0; font-size: 1.35rem; font-weight: 600; }
    p { margin: 4px 0 0; color: #64748b; font-size: 14px; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  `,
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
}
