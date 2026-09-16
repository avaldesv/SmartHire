import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMON_DELETE } from '../../../core/i18n/common-labels';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';

/** @deprecated Use sh-table-row-actions directly. Kept for catalog admin imports. */
@Component({
  selector: 'sh-catalog-list-actions',
  standalone: true,
  imports: [TableRowActionsComponent],
  template: `
    <sh-table-row-actions
      [showEdit]="true"
      [showDelete]="showDelete"
      [editDisabled]="editDisabled"
      [deleteDisabled]="deleteDisabled"
      [deleteLabel]="deleteLabel"
      (editClick)="editClick.emit()"
      (deleteClick)="deleteClick.emit()"
    />
  `,
})
export class CatalogListActionsComponent {
  @Input() editDisabled = false;
  @Input() showDelete = false;
  @Input() deleteDisabled = false;
  @Input() deleteLabel = COMMON_DELETE;
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();
}
