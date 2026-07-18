import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  POSITIONS_NO_PUBLICATION_TEMPLATE_CREATE,
  POSITIONS_NO_PUBLICATION_TEMPLATE_MESSAGE,
  POSITIONS_NO_PUBLICATION_TEMPLATE_OK,
  POSITIONS_NO_PUBLICATION_TEMPLATE_TITLE,
} from '../../../core/i18n/positions-labels';

/** Optional dialog payload when opened from generate flow. */
export interface PublicationNoTemplateDialogData {
  locale?: string;
}

@Component({
  selector: 'sh-publication-no-template-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content>
      <p class="message">{{ message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">{{ okLabel }}</button>
      <button mat-flat-button color="primary" type="button" (click)="goToTemplates()">{{ createLabel }}</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .message {
        margin: 0;
        max-width: 420px;
        line-height: 1.45;
      }
    `,
  ],
})
export class PublicationNoTemplateDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<PublicationNoTemplateDialogComponent, void>);
  private readonly router = inject(Router);

  readonly title = POSITIONS_NO_PUBLICATION_TEMPLATE_TITLE;
  readonly message = POSITIONS_NO_PUBLICATION_TEMPLATE_MESSAGE;
  readonly okLabel = POSITIONS_NO_PUBLICATION_TEMPLATE_OK;
  readonly createLabel = POSITIONS_NO_PUBLICATION_TEMPLATE_CREATE;

  close(): void {
    this.dialogRef.close();
  }

  goToTemplates(): void {
    this.dialogRef.close();
    void this.router.navigate(['/settings/publication-templates']);
  }
}
