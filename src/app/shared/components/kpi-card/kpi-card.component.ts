import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sh-kpi-card',
  standalone: true,
  imports: [DecimalPipe, MatIconModule],
  template: `
    <div class="kpi-card">
      <div class="kpi-icon" [style.background]="iconBg">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="kpi-body">
        <span class="kpi-label">{{ label }}</span>
        <span class="kpi-value">@if (typeof value === 'number') { {{ value | number }} } @else { {{ value }} }</span>
        @if (subtitle) {
          <span class="kpi-sub">{{ subtitle }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    .kpi-card {
      display: flex; gap: 16px; align-items: flex-start;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;
    }
    .kpi-icon {
      width: 48px; height: 48px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      mat-icon { color: #fff; font-size: 24px; width: 24px; height: 24px; }
    }
    .kpi-body { display: flex; flex-direction: column; }
    .kpi-label { font-size: 13px; color: #64748b; margin-bottom: 4px; }
    .kpi-value { font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1.1; }
    .kpi-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  `,
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number | string;
  @Input() subtitle = '';
  @Input() icon = 'analytics';
  @Input() iconBg = '#2563eb';
}
