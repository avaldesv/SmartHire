import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface CatalogFormDialogData {
  title: string;
  content: TemplateRef<unknown>;
}

/** Shared MatDialog panel class for catalog create/edit shells (header bar bleed). */
export const CATALOG_FORM_DIALOG_PANEL_CLASS = 'sh-catalog-form-dialog-panel';

@Component({
  selector: 'sh-catalog-form-dialog-shell',
  standalone: true,
  imports: [MatDialogModule, NgTemplateOutlet],
  template: `
    <h2 mat-dialog-title class="catalog-dialog-title">{{ data.title }}</h2>
    <mat-dialog-content class="catalog-form-dialog-body">
      <ng-container *ngTemplateOutlet="data.content" />
    </mat-dialog-content>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .catalog-dialog-title {
        margin: 0;
        padding: 16px 24px;
        background: color-mix(in srgb, #0d9488 14%, #f8fafc);
        border-bottom: 1px solid color-mix(in srgb, #0d9488 28%, #e2e8f0);
        color: #0f172a;
        font-size: 1.125rem;
        font-weight: 600;
        line-height: 1.35;
      }

      .catalog-form-dialog-body {
        min-width: min(640px, 92vw);
        max-width: 920px;
        /* Keep outline floating labels clear of the title bar */
        padding-top: 24px !important;
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
