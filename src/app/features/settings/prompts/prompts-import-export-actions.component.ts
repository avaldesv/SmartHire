import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  CatalogImportExportService,
  downloadBlob,
} from '../../../core/services/catalog-import-export.service';
import { PermissionService } from '../../../core/services/permission.service';
import {
  CatalogCsvImportDialogComponent,
  CatalogCsvImportDialogData,
} from '../catalogs/catalog-csv-import-dialog.component';
import {
  CATALOG_IMPORT_COMPLETE,
  CATALOG_IMPORT_EXPORT_ERROR,
  CATALOG_IMPORT_EXPORT_TOOLTIP,
  CATALOG_IMPORT_IMPORT_TOOLTIP,
  CATALOG_IMPORT_SNACK_CLOSE,
} from '../../../core/i18n/catalog-import-labels';
import { PROMPTS_PAGE_TITLE } from '../../../core/i18n/prompts-i18n-labels';

const AI_PROMPTS_CATALOG_KEY = 'ai-prompts';

@Component({
  selector: 'sh-prompts-import-export-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="table-import-export-actions">
      @if (canExport()) {
        <button
          mat-icon-button
          type="button"
          [matTooltip]="exportTooltip"
          [disabled]="exporting"
          (click)="exportData()"
        >
          <mat-icon>download</mat-icon>
        </button>
      }
      @if (canImport()) {
        <button mat-icon-button type="button" [matTooltip]="importTooltip" (click)="openImportDialog()">
          <mat-icon>upload</mat-icon>
        </button>
      }
    </div>
  `,
  styles: `
    .table-import-export-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `,
})
export class PromptsImportExportActionsComponent {
  @Output() importComplete = new EventEmitter<void>();

  private readonly permissions = inject(PermissionService);
  private readonly catalogImportExport = inject(CatalogImportExportService);
  private readonly dialog = inject(MatDialog);
  private readonly feedback = inject(FeedbackDialogService);

  exporting = false;
  readonly exportTooltip = CATALOG_IMPORT_EXPORT_TOOLTIP;
  readonly importTooltip = CATALOG_IMPORT_IMPORT_TOOLTIP;

  canExport(): boolean {
    return this.permissions.hasAll([
      AppPermissions.SETTINGS_PROMPTS_READ,
      AppPermissions.SETTINGS_PROMPTS_EXPORT,
    ]);
  }

  canImport(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_PROMPTS_IMPORT);
  }

  exportData(): void {
    this.exporting = true;
    this.catalogImportExport.exportCatalog(AI_PROMPTS_CATALOG_KEY).subscribe({
      next: (blob) => {
        downloadBlob(blob, `${AI_PROMPTS_CATALOG_KEY}-export.csv`);
        this.exporting = false;
      },
      error: (err) => {
        this.exporting = false;
        this.feedback.showApiError(err, { fallbackMessage: CATALOG_IMPORT_EXPORT_ERROR });
      },
    });
  }

  openImportDialog(): void {
    const data: CatalogCsvImportDialogData = {
      catalogKey: AI_PROMPTS_CATALOG_KEY,
      catalogLabel: PROMPTS_PAGE_TITLE,
    };
    this.dialog
      .open(CatalogCsvImportDialogComponent, {
        width: '560px',
        data,
      })
      .afterClosed()
      .subscribe((imported) => {
        if (imported) {
          this.feedback.showSuccess(CATALOG_IMPORT_COMPLETE);
          this.importComplete.emit();
        }
      });
  }
}
