import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

/** Default page sizes for SmartHire list tables and dialogs. */
export const SH_PAGINATOR_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

/**
 * Project paginator: MatPaginator + i18n (`SmarthireMatPaginatorIntl`) and shared defaults.
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

      :host ::ng-deep .mat-mdc-paginator-page-size-label {
        white-space: nowrap;
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
