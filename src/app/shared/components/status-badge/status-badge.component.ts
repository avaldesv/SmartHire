import { Component, Input } from '@angular/core';
import { getRequisitionStatusLabel } from '../../../core/i18n/common-labels';

@Component({
  selector: 'sh-status-badge',
  standalone: true,
  template: `<span class="status-badge" [class]="cssClass">{{ displayStatus }}</span>`,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;

  get displayStatus(): string {
    return getRequisitionStatusLabel(this.status);
  }

  get cssClass(): string {
    return this.status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }
}
