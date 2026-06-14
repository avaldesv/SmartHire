import { Component, Input } from '@angular/core';

@Component({
  selector: 'sh-status-badge',
  standalone: true,
  template: `<span class="status-badge" [class]="cssClass">{{ status }}</span>`,
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;

  get cssClass(): string {
    return this.status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }
}
