import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sh-table-row-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="table-row-actions">
      @if (showView) {
        @if (viewRouterLink) {
          <a
            mat-icon-button
            [routerLink]="viewRouterLink"
            aria-label="Ver"
            [class.disabled-link]="viewDisabled"
            [attr.aria-disabled]="viewDisabled"
            (click)="viewDisabled ? $event.preventDefault() : null"
          >
            <mat-icon>visibility</mat-icon>
          </a>
        } @else {
          <button
            mat-icon-button
            type="button"
            aria-label="Ver"
            [disabled]="viewDisabled"
            (click)="viewClick.emit()"
          >
            <mat-icon>visibility</mat-icon>
          </button>
        }
      }

      @if (showEdit) {
        @if (editRouterLink) {
          <a
            mat-icon-button
            [routerLink]="editRouterLink"
            aria-label="Editar"
            [class.disabled-link]="editDisabled"
            [attr.aria-disabled]="editDisabled"
            (click)="editDisabled ? $event.preventDefault() : null"
          >
            <mat-icon>edit</mat-icon>
          </a>
        } @else {
          <button
            mat-icon-button
            type="button"
            aria-label="Editar"
            [disabled]="editDisabled"
            (click)="editClick.emit()"
          >
            <mat-icon>edit</mat-icon>
          </button>
        }
      }

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

    .table-row-actions {
      display: inline-flex;
      align-items: center;
      gap: 0;
    }

    .disabled-link {
      pointer-events: none;
      opacity: 0.38;
    }
  `,
})
export class TableRowActionsComponent {
  @Input() showView = false;
  @Input() showEdit = true;
  @Input() showDelete = false;
  @Input() viewDisabled = false;
  @Input() editDisabled = false;
  @Input() deleteDisabled = false;
  @Input() deleteLabel = 'Eliminar';
  @Input() viewRouterLink: unknown[] | string | null = null;
  @Input() editRouterLink: unknown[] | string | null = null;
  @Output() viewClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();
}
