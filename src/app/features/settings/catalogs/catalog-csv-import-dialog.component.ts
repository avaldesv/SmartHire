import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CatalogCsvImportResponse,
  CatalogCsvStructureValidationResponse,
  CatalogImportExportService,
  downloadBase64Csv,
  downloadBlob,
} from '../../../core/services/catalog-import-export.service';

export interface CatalogCsvImportDialogData {
  catalogKey: string;
  catalogLabel: string;
}

@Component({
  selector: 'sh-catalog-csv-import-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './catalog-csv-import-dialog.component.html',
  styleUrl: './catalog-csv-import-dialog.component.scss',
})
export class CatalogCsvImportDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CatalogCsvImportDialogComponent, boolean>);
  readonly data = inject<CatalogCsvImportDialogData>(MAT_DIALOG_DATA);
  private readonly catalogImportExport = inject(CatalogImportExportService);

  selectedFile: File | null = null;
  validating = false;
  importing = false;
  validation: CatalogCsvStructureValidationResponse | null = null;
  importResult: CatalogCsvImportResponse | null = null;
  errorMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.validation = null;
    this.importResult = null;
    this.errorMessage = '';
  }

  downloadTemplate(): void {
    this.catalogImportExport.downloadTemplate(this.data.catalogKey).subscribe({
      next: (blob) => downloadBlob(blob, `${this.data.catalogKey}-template.csv`),
      error: () => {
        this.errorMessage = 'No se pudo descargar la plantilla.';
      },
    });
  }

  validateStructure(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Seleccione un archivo CSV.';
      return;
    }
    this.validating = true;
    this.errorMessage = '';
    this.catalogImportExport.validateImport(this.data.catalogKey, this.selectedFile).subscribe({
      next: (response) => {
        this.validation = response;
        this.validating = false;
        if (!response.structureValid) {
          this.errorMessage = response.structureErrors.join(' ');
        }
      },
      error: () => {
        this.validating = false;
        this.errorMessage = 'No se pudo validar el archivo.';
      },
    });
  }

  importCsv(): void {
    if (!this.selectedFile || !this.validation?.structureValid) {
      return;
    }
    this.importing = true;
    this.errorMessage = '';
    this.catalogImportExport.importCatalog(this.data.catalogKey, this.selectedFile).subscribe({
      next: (response) => {
        this.importResult = response;
        this.importing = false;
      },
      error: () => {
        this.importing = false;
        this.errorMessage = 'No se pudo importar el archivo.';
      },
    });
  }

  downloadErrorReport(): void {
    if (!this.importResult?.errorReportCsvBase64) {
      return;
    }
    downloadBase64Csv(this.importResult.errorReportCsvBase64, `${this.data.catalogKey}-import-errors.csv`);
  }

  close(): void {
    this.dialogRef.close(!!this.importResult);
  }
}
