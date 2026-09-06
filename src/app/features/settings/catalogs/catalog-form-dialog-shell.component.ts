import { NgTemplateOutlet } from '@angular/common';
import { Component, ViewEncapsulation, inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CATALOG_FORM_DIALOG_PANEL_CLASS } from '../../../core/dialog/catalog-dialog.constants';
import {
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';

export { CATALOG_FORM_DIALOG_PANEL_CLASS };

export interface CatalogFormDialogData {
  title: string;
  content: TemplateRef<unknown>;
  subtitle?: string;
  contentClass?: string;
}

@Component({
  selector: 'sh-catalog-form-dialog-shell',
  standalone: true,
  imports: [NgTemplateOutlet, ShModalFormComponent],
  encapsulation: ViewEncapsulation.None,
  template: `
    <sh-modal-form [title]="data.title" [subtitle]="data.subtitle ?? ''" [contentClass]="data.contentClass ?? ''">
      <ng-container *ngTemplateOutlet="data.content" />
    </sh-modal-form>
  `,
  styles: [
    `
      sh-catalog-form-dialog-shell {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        height: 100%;
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

      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .gender-form > mat-checkbox,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .doc-type-form > mat-checkbox,
      sh-catalog-form-dialog-shell .sh-catalog-dialog-body .scope-selector {
        grid-column: 1 / -1;
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
