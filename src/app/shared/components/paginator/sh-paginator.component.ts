import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

/** Default page sizes for SmartHire list tables and dialogs. */
export const SH_PAGINATOR_PAGE_SIZE_OPTIONS = [5, 10, 25] as const;

/**
 * Thin wrapper around MatPaginator with SmartHire defaults
 * (page size options, first/last buttons). Labels come from MatPaginatorIntl.
 */
@Component({
  selector: 'sh-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="length"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      [hidePageSize]="hidePageSize"
      [disabled]="disabled"
      [showFirstLastButtons]="showFirstLastButtons"
      (page)="page.emit($event)"
    />
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ShPaginatorComponent {
  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [...SH_PAGINATOR_PAGE_SIZE_OPTIONS];
  @Input() hidePageSize = false;
  @Input() disabled = false;
  @Input() showFirstLastButtons = true;

  @Output() readonly page = new EventEmitter<PageEvent>();
}
