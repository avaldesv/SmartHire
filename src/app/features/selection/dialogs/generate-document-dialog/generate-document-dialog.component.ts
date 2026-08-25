import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  DOCTEMPLATES_GENERATE_CLOSE,
  DOCTEMPLATES_GENERATE_COL_ACTIONS,
  DOCTEMPLATES_GENERATE_COL_NAME,
  DOCTEMPLATES_GENERATE_EMPTY,
  DOCTEMPLATES_GENERATE_ERRORS_GENERATE,
  DOCTEMPLATES_GENERATE_ERRORS_LIST,
  DOCTEMPLATES_GENERATE_SUCCESS,
  DOCTEMPLATES_GENERATE_TITLE,
  DOCTEMPLATES_GENERATE_WORD,
} from '../../../../core/i18n/document-templates-labels';
import { DocumentTemplateApiService } from '../../../../core/services/document-template-api.service';
import { CatalogCompanyService } from '../../../../core/services/catalog-company.service';
import { TenantContextService } from '../../../../core/services/tenant-context.service';
import { downloadBlob } from '../../../../core/services/catalog-import-export.service';
import { DocumentTemplateItem } from '../../../../shared/models/document-template.model';

export interface GenerateDocumentDialogData {
  applicationId: number;
  candidateName?: string;
}

@Component({
  selector: 'sh-generate-document-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './generate-document-dialog.component.html',
  styleUrl: './generate-document-dialog.component.scss',
})
export class GenerateDocumentDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<GenerateDocumentDialogComponent, boolean>);
  readonly data = inject<GenerateDocumentDialogData>(MAT_DIALOG_DATA);
  private readonly templateApi = inject(DocumentTemplateApiService);
  private readonly companyService = inject(CatalogCompanyService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly title = DOCTEMPLATES_GENERATE_TITLE;
  readonly colName = DOCTEMPLATES_GENERATE_COL_NAME;
  readonly colActions = DOCTEMPLATES_GENERATE_COL_ACTIONS;
  readonly wordActionLabel = DOCTEMPLATES_GENERATE_WORD;
  readonly closeLabel = DOCTEMPLATES_GENERATE_CLOSE;
  readonly emptyLabel = DOCTEMPLATES_GENERATE_EMPTY;
  readonly listErrorLabel = DOCTEMPLATES_GENERATE_ERRORS_LIST;
  readonly columns = ['name', 'actions'];

  templates: DocumentTemplateItem[] = [];
  loading = true;
  loadError = false;
  generatingId: number | null = null;
  pageIndex = 0;
  readonly pageSize = 10;
  total = 0;
  tenantName = '';

  ngOnInit(): void {
    this.loadTenantName();
    this.load();
  }

  private loadTenantName(): void {
    this.companyService.getById(this.tenantContext.getCompanyId()).subscribe({
      next: (company) => {
        this.tenantName =
          company.name?.trim() || company.tradeName?.trim() || `Tenant ${company.id}`;
      },
      error: () => {
        this.tenantName = `Tenant ${this.tenantContext.getCompanyId()}`;
      },
    });
  }

  load(): void {
    this.loading = true;
    this.loadError = false;
    this.templateApi.list(this.pageIndex, this.pageSize, { isActive: true }).subscribe({
      next: (res) => {
        this.templates = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.loadError = true;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_GENERATE_ERRORS_LIST });
      },
    });
  }

  onPage(event: PageEvent): void {
    if (event.pageIndex === this.pageIndex && event.pageSize === this.pageSize) {
      return;
    }
    this.pageIndex = event.pageIndex;
    this.load();
  }

  generate(row: DocumentTemplateItem): void {
    if (this.generatingId != null) {
      return;
    }
    const filename = this.buildDownloadFilename(row);

    this.generatingId = row.id;
    this.templateApi.generate(row.id, this.data.applicationId).subscribe({
      next: (blob) => {
        downloadBlob(blob, filename);
        this.generatingId = null;
        this.feedback.showSuccess(DOCTEMPLATES_GENERATE_SUCCESS);
      },
      error: (err) => {
        this.generatingId = null;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_GENERATE_ERRORS_GENERATE });
      },
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  private buildDownloadFilename(template: DocumentTemplateItem): string {
    const candidatePart = this.sanitizeFilenamePart(this.data.candidateName?.trim() || 'Candidato');
    const tenantPart = this.sanitizeFilenamePart(this.tenantName || `Tenant ${this.tenantContext.getCompanyId()}`);
    const documentPart = this.sanitizeFilenamePart(
      template.name?.trim() || template.fileName?.replace(/\.docx?$/i, '') || 'Documento',
    );
    return `${candidatePart} - ${tenantPart} - ${documentPart}.docx`;
  }

  private sanitizeFilenamePart(value: string): string {
    return value.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, ' ').trim() || 'documento';
  }
}
