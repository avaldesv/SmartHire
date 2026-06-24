import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sh-catalog-list-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="catalog-list-actions">
      <button
        mat-icon-button
        type="button"
        aria-label="Editar"
        [disabled]="editDisabled"
        (click)="editClick.emit()"
      >
        <mat-icon>edit</mat-icon>
      </button>
      @if (showDelete) {
        <button
          mat-icon-button
          color="warn"
          type="button"
          [attr.aria-label]="deleteLabel"
          [disabled]="deleteDisabled"
          (click)="deleteClick.emit()"
        >
          <mat-icon>delete</mat-icon>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .catalog-list-actions {
      display: inline-flex;
      align-items: center;
      gap: 0;
    }
  `,
})
export class CatalogListActionsComponent {
  @Input() editDisabled = false;
  @Input() showDelete = false;
  @Input() deleteDisabled = false;
  @Input() deleteLabel = 'Eliminar';
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();
}
