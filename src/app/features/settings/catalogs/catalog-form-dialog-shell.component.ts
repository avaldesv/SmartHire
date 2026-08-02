import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';

export interface CatalogFormDialogData {
  title: string;
  content: TemplateRef<unknown>;
}

@Component({
  selector: 'sh-catalog-form-dialog-shell',
  standalone: true,
  imports: [MatDialogModule, NgTemplateOutlet],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="catalog-form-dialog-body">
      <ng-container *ngTemplateOutlet="data.content" />
    </mat-dialog-content>
  `,
  styles: [
    `
      .catalog-form-dialog-body {
        min-width: min(640px, 92vw);
        max-width: 920px;
        padding-top: 8px;
      }

      :host ::ng-deep .gender-form,
      :host ::ng-deep .doc-type-form,
      :host ::ng-deep form.gender-form,
      :host ::ng-deep form.doc-type-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 12px;
        align-items: start;
      }

      :host ::ng-deep .gender-form > .form-actions,
      :host ::ng-deep .doc-type-form > .form-actions,
      :host ::ng-deep .gender-form > mat-checkbox,
      :host ::ng-deep .doc-type-form > mat-checkbox,
      :host ::ng-deep .scope-selector {
        grid-column: 1 / -1;
      }

      :host ::ng-deep .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }

      @media (max-width: 700px) {
        :host ::ng-deep .gender-form,
        :host ::ng-deep .doc-type-form,
        :host ::ng-deep form.gender-form,
        :host ::ng-deep form.doc-type-form {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CatalogFormDialogShellComponent {
  readonly data = inject<CatalogFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CatalogFormDialogShellComponent, boolean>);

  close(saved = false): void {
    this.dialogRef.close(saved);
  }
}
