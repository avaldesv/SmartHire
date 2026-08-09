import { NgTemplateOutlet } from '@angular/common';
import { Component, ViewEncapsulation, inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CATALOG_FORM_DIALOG_PANEL_CLASS } from '../../../core/dialog/catalog-dialog.constants';

export { CATALOG_FORM_DIALOG_PANEL_CLASS };

export interface CatalogFormDialogData {
  title: string;
  content: TemplateRef<unknown>;
}

@Component({
  selector: 'sh-catalog-form-dialog-shell',
  standalone: true,
  imports: [MatDialogModule, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="sh-catalog-dialog-header" mat-dialog-title>
      <span class="sh-catalog-dialog-header__text">{{ data.title }}</span>
    </div>
    <mat-dialog-content class="sh-catalog-dialog-body">
      <div class="sh-catalog-dialog-gap" aria-hidden="true"></div>
      <ng-container *ngTemplateOutlet="data.content" />
    </mat-dialog-content>
  `,
  styles: [
    `
      sh-catalog-form-dialog-shell {
        display: block;
      }

      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .gender-form,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .doc-type-form,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body form.gender-form,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body form.doc-type-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 12px;
        align-items: start;
      }

      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .gender-form > .form-actions,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .doc-type-form > .form-actions,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .gender-form > mat-checkbox,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .doc-type-form > mat-checkbox,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .scope-selector {
        grid-column: 1 / -1;
      }

      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }

      @media (max-width: 700px) {
        sh-catalog-form-dialog-shell .sh-catalog-dialog-body .gender-form,
        sh-catalog-form-dialog-shell .sh-catalog-dialog-body .doc-type-form,
        sh-catalog-form-dialog-shell .sh-catalog-dialog-body form.gender-form,
        sh-catalog-form-dialog-shell .sh-catalog-dialog-body form.doc-type-form {
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
