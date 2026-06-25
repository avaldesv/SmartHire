import { Component, Input } from '@angular/core';
import { isGlobalScopedRecord } from '../../utils/tenant-scope.util';

@Component({
  selector: 'sh-scope-badge',
  standalone: true,
  template: `<span class="scope-badge" [class.scope-badge--global]="isGlobal" [class.scope-badge--tenant]="!isGlobal">{{ label }}</span>`,
  styleUrl: './scope-badge.component.scss',
})
export class ScopeBadgeComponent {
  @Input({ required: true }) companyId!: number | null | undefined;

  get isGlobal(): boolean {
    return isGlobalScopedRecord(this.companyId);
  }

  get label(): string {
    return this.isGlobal ? 'Global' : 'Tenant';
  }
}
