import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  CatalogImportExportService,
  downloadBlob,
} from '../../../core/services/catalog-import-export.service';
import { PermissionService } from '../../../core/services/permission.service';
import {
  CatalogCsvImportDialogComponent,
  CatalogCsvImportDialogData,
} from '../../settings/catalogs/catalog-csv-import-dialog.component';
import {
  CATALOG_IMPORT_COMPLETE,
  CATALOG_IMPORT_EXPORT_ERROR,
  CATALOG_IMPORT_EXPORT_TOOLTIP,
  CATALOG_IMPORT_IMPORT_TOOLTIP,
  CATALOG_IMPORT_SNACK_CLOSE,
} from '../../../core/i18n/catalog-import-labels';

@Component({
  selector: 'sh-questionnaire-import-export-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule],
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
export class QuestionnaireImportExportActionsComponent {
  @Input({ required: true }) catalogKey!: string;
  @Input({ required: true }) catalogLabel!: string;
  @Output() importComplete = new EventEmitter<void>();

  private readonly permissions = inject(PermissionService);
  private readonly catalogImportExport = inject(CatalogImportExportService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  exporting = false;
  readonly exportTooltip = CATALOG_IMPORT_EXPORT_TOOLTIP;
  readonly importTooltip = CATALOG_IMPORT_IMPORT_TOOLTIP;

  canExport(): boolean {
    return this.permissions.hasAll([
      AppPermissions.QUESTIONNAIRE_READ,
      AppPermissions.QUESTIONNAIRE_EXPORT,
    ]);
  }

  canImport(): boolean {
    return this.permissions.hasAll([
      AppPermissions.QUESTIONNAIRE_READ,
      AppPermissions.QUESTIONNAIRE_CREATE,
      AppPermissions.QUESTIONNAIRE_EDIT,
      AppPermissions.QUESTIONNAIRE_IMPORT,
    ]);
  }

  exportData(): void {
    this.exporting = true;
    this.catalogImportExport.exportCatalog(this.catalogKey).subscribe({
      next: (blob) => {
        downloadBlob(blob, `${this.catalogKey}-export.csv`);
        this.exporting = false;
      },
      error: () => {
        this.exporting = false;
        this.snackBar.open(CATALOG_IMPORT_EXPORT_ERROR, CATALOG_IMPORT_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  openImportDialog(): void {
    const data: CatalogCsvImportDialogData = {
      catalogKey: this.catalogKey,
      catalogLabel: this.catalogLabel,
    };
    this.dialog
      .open(CatalogCsvImportDialogComponent, {
        width: '560px',
        data,
      })
      .afterClosed()
      .subscribe((imported) => {
        if (imported) {
          this.snackBar.open(CATALOG_IMPORT_COMPLETE, CATALOG_IMPORT_SNACK_CLOSE, { duration: 3000 });
          this.importComplete.emit();
        }
      });
  }
}
