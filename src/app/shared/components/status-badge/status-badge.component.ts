import { Component, Input } from '@angular/core';
import { getRequisitionStatusLabel } from '../../../core/i18n/common-labels';

@Component({
  selector: 'sh-status-badge',
  standalone: true,
  template: `<span class="status-badge" [class]="cssClass" [style.color]="colorHex || null" [style.background-color]="backgroundColorHex || null">{{ displayStatus }}</span>`,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;
  /** Optional catalog text color (#RRGGBB). When set, overrides CSS class colors. */
  @Input() colorHex: string | null | undefined;
  /** Optional catalog background (#RRGGBB). When set, overrides CSS class colors. */
  @Input() backgroundColorHex: string | null | undefined;

  get displayStatus(): string {
    return getRequisitionStatusLabel(this.status);
  }

  get cssClass(): string {
    // Keep class for fallback when catalog colors are absent.
    return this.status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }
}
