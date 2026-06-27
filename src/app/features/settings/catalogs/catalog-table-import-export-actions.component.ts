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
} from './catalog-csv-import-dialog.component';

@Component({
  selector: 'sh-catalog-table-import-export-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="table-import-export-actions">
      @if (canExport()) {
        <button
          mat-icon-button
          type="button"
          matTooltip="Exportar CSV"
          [disabled]="exporting"
          (click)="exportData()"
        >
          <mat-icon>download</mat-icon>
        </button>
      }
      @if (canImport()) {
        <button mat-icon-button type="button" matTooltip="Importar CSV" (click)="openImportDialog()">
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
export class CatalogTableImportExportActionsComponent {
  @Input({ required: true }) catalogKey!: string;
  @Input({ required: true }) catalogLabel!: string;
  @Input() countryId: number | null = null;
  @Output() importComplete = new EventEmitter<void>();

  private readonly permissions = inject(PermissionService);
  private readonly catalogImportExport = inject(CatalogImportExportService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  exporting = false;

  canExport(): boolean {
    return this.permissions.hasAll([
      AppPermissions.SETTINGS_CATALOGS_READ,
      AppPermissions.SETTINGS_CATALOGS_EXPORT,
    ]);
  }

  canImport(): boolean {
    return this.permissions.hasAll([
      AppPermissions.SETTINGS_CATALOGS_READ,
      AppPermissions.SETTINGS_CATALOGS_EDIT,
      AppPermissions.SETTINGS_CATALOGS_EXPORT,
      AppPermissions.SETTINGS_CATALOGS_CREATE,
      AppPermissions.SETTINGS_CATALOGS_IMPORT,
    ]);
  }

  exportData(): void {
    this.exporting = true;
    this.catalogImportExport.exportCatalog(this.catalogKey, this.countryId).subscribe({
      next: (blob) => {
        downloadBlob(blob, `${this.catalogKey}-export.csv`);
        this.exporting = false;
      },
      error: () => {
        this.exporting = false;
        this.snackBar.open('No se pudo exportar el catálogo', 'Cerrar', { duration: 4000 });
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
          this.snackBar.open('Importación completada', 'Cerrar', { duration: 3000 });
          this.importComplete.emit();
        }
      });
  }
}
