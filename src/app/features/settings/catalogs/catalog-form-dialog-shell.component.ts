import { NgTemplateOutlet } from '@angular/common';
import { Component, ViewEncapsulation, inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface CatalogFormDialogData {
  title: string;
  content: TemplateRef<unknown>;
}

/** Applied to MatDialog overlay pane — styles live in styles.scss (global). */
export const CATALOG_FORM_DIALOG_PANEL_CLASS = 'sh-catalog-form-dialog-panel';

@Component({
  selector: 'sh-catalog-form-dialog-shell',
  standalone: true,
  imports: [MatDialogModule, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="sh-catalog-dialog-header"
      mat-dialog-title
      style="margin:0;padding:18px 24px;background:#ccfbf1;border-bottom:1px solid #99f6e4;font-size:1.125rem;font-weight:600;line-height:1.35;color:#0f172a;box-sizing:border-box;width:100%;"
    >
      <span class="sh-catalog-dialog-header__text">{{ data.title }}</span>
    </div>
    <mat-dialog-content class="sh-catalog-dialog-body" style="padding-top:28px;display:block;">
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
