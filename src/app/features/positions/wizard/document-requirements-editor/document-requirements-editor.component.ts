import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CatalogDocumentTypeService } from '../../../../core/services/catalog-document-type.service';
import {
  REQUISITION_DOCS_WIZARD_ADD_HINT,
  REQUISITION_DOCS_WIZARD_AI_NONE,
  REQUISITION_DOCS_WIZARD_COL_ACTIONS,
  REQUISITION_DOCS_WIZARD_COL_AI,
  REQUISITION_DOCS_WIZARD_COL_MANDATORY,
  REQUISITION_DOCS_WIZARD_COL_MONTHS,
  REQUISITION_DOCS_WIZARD_COL_STATUS,
  REQUISITION_DOCS_WIZARD_COL_TYPE,
  REQUISITION_DOCS_WIZARD_DELETE,
  REQUISITION_DOCS_WIZARD_EDIT,
  REQUISITION_DOCS_WIZARD_EMPTY,
  REQUISITION_DOCS_WIZARD_NO,
  REQUISITION_DOCS_WIZARD_STATUS_CONFIGURED,
  REQUISITION_DOCS_WIZARD_STATUS_NOT_CONFIGURED,
  REQUISITION_DOCS_WIZARD_CONFIGURED_TITLE,
  REQUISITION_DOCS_WIZARD_DELETE,
  REQUISITION_DOCS_WIZARD_EDIT,
  REQUISITION_DOCS_WIZARD_EMPTY,
  REQUISITION_DOCS_WIZARD_NO,
  REQUISITION_DOCS_WIZARD_SUBTITLE,
  REQUISITION_DOCS_WIZARD_YES,
  REQUISITION_WIZARD_LOADING_DOCUMENTS,
  REQUISITION_WIZARD_NO_DOCUMENTS,
  REQUISITION_WIZARD_SELECT_COUNTRY_DOCUMENTS_HINT,
  requisitionDocumentsWizardAiSummary,
} from '../../../../core/i18n/requisition-wizard-labels';
import { CatalogDocumentType } from '../../../../shared/models/catalog-document-type.model';
import { WizardDocumentRequirementRow } from '../../../../shared/models/requisition-wizard.model';
import { DocumentRequirementFormDialogComponent } from './document-requirement-form-dialog.component';

@Component({
  selector: 'sh-document-requirements-editor',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './document-requirements-editor.component.html',
  styleUrl: './document-requirements-editor.component.scss',
})
export class DocumentRequirementsEditorComponent implements OnChanges, OnInit {
  private readonly documentTypeService = inject(CatalogDocumentTypeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) control!: FormControl<WizardDocumentRequirementRow[]>;
  @Input() countryId: number | null = null;
  @Input() disabled = false;
  @Input() isEditMode = false;
  @Input() showValidateAiName = true;
  @Input() showValidateAiValidity = true;
  @Input() showValidityMonths = true;
  @Input() showMandatory = true;
  @Input() validateAiNameReadOnly = false;
  @Input() validateAiValidityReadOnly = false;
  @Input() validityMonthsReadOnly = false;
  @Input() mandatoryReadOnly = false;

  readonly pageSize = 10;
  pageIndex = 0;

  readonly labels = {
    subtitle: REQUISITION_DOCS_WIZARD_SUBTITLE,
    colType: REQUISITION_DOCS_WIZARD_COL_TYPE,
    colStatus: REQUISITION_DOCS_WIZARD_COL_STATUS,
    colAi: REQUISITION_DOCS_WIZARD_COL_AI,
    colMonths: REQUISITION_DOCS_WIZARD_COL_MONTHS,
    colMandatory: REQUISITION_DOCS_WIZARD_COL_MANDATORY,
    colActions: REQUISITION_DOCS_WIZARD_COL_ACTIONS,
    empty: REQUISITION_DOCS_WIZARD_EMPTY,
    edit: REQUISITION_DOCS_WIZARD_EDIT,
    delete: REQUISITION_DOCS_WIZARD_DELETE,
    add: REQUISITION_DOCS_WIZARD_ADD_HINT,
    loading: REQUISITION_WIZARD_LOADING_DOCUMENTS,
    noDocuments: REQUISITION_WIZARD_NO_DOCUMENTS,
    selectCountryHint: REQUISITION_WIZARD_SELECT_COUNTRY_DOCUMENTS_HINT,
    dash: REQUISITION_DOCS_WIZARD_AI_NONE,
    yes: REQUISITION_DOCS_WIZARD_YES,
    no: REQUISITION_DOCS_WIZARD_NO,
    statusConfigured: REQUISITION_DOCS_WIZARD_STATUS_CONFIGURED,
    statusNotConfigured: REQUISITION_DOCS_WIZARD_STATUS_NOT_CONFIGURED,
  };

  get visibleColumns(): string[] {
    const cols: string[] = ['documentTypeName', 'status'];
    if (this.showValidateAiName || this.showValidateAiValidity) {
      cols.push('validateAi');
    }
    if (this.showValidityMonths) {
      cols.push('validityMonths');
    }
    if (this.showMandatory) {
      cols.push('isRequired');
    }
    cols.push('actions');
    return cols;
  }

  documentTypes: CatalogDocumentType[] = [];
  loading = false;
  private mergingCatalog = false;

  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.documentTypes.length && !this.mergingCatalog) {
        this.mergeCatalog();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryId']) {
      this.pageIndex = 0;
      this.loadDocumentTypes();
    } else if (changes['isEditMode'] && this.documentTypes.length) {
      this.mergeCatalog();
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.control.disable({ emitEvent: false });
      } else {
        this.control.enable({ emitEvent: false });
      }
    }
  }

  get rows(): WizardDocumentRequirementRow[] {
    return this.control.value ?? [];
  }

  get pagedRows(): WizardDocumentRequirementRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
  }

  statusLabel(row: WizardDocumentRequirementRow): string {
    return row.isActive ? this.labels.statusConfigured : this.labels.statusNotConfigured;
  }

  aiSummary(row: WizardDocumentRequirementRow): string {
    if (!row.isActive) {
      return this.labels.dash;
    }
    const name = this.showValidateAiName ? row.validateAiName : false;
    const validity = this.showValidateAiValidity ? row.validateAiValidity : false;
    return requisitionDocumentsWizardAiSummary(name, validity);
  }

  monthsLabel(row: WizardDocumentRequirementRow): string {
    if (!row.isActive || row.validityMonths == null) {
      return this.labels.dash;
    }
    return String(row.validityMonths);
  }

  mandatoryLabel(row: WizardDocumentRequirementRow): string {
    if (!row.isActive) {
      return this.labels.dash;
    }
    return row.isRequired ? this.labels.yes : this.labels.no;
  }

  documentLabel(documentTypeId: number): string {
    return this.documentTypes.find((doc) => doc.id === documentTypeId)?.name ?? String(documentTypeId);
  }

  deactivate(row: WizardDocumentRequirementRow): void {
    if (this.disabled) {
      return;
    }
    this.patchRow(row.documentTypeId, {
      ...this.emptyRow(row.documentTypeId, false),
    });
  }

  activate(row: WizardDocumentRequirementRow): void {
    if (this.disabled) {
      return;
    }
    this.patchRow(row.documentTypeId, {
      ...this.emptyRow(row.documentTypeId, true),
    });
  }

  editRow(row: WizardDocumentRequirementRow): void {
    if (this.disabled || !row.isActive) {
      return;
    }
    this.dialog
      .open(DocumentRequirementFormDialogComponent, {
        width: '520px',
        data: {
          documentTypeName: this.documentLabel(row.documentTypeId),
          documentTypeId: row.documentTypeId,
          validateAiName: row.validateAiName,
          validateAiValidity: row.validateAiValidity,
          validityMonths: row.validityMonths,
          isRequired: row.isRequired,
          showValidateAiName: this.showValidateAiName,
          showValidateAiValidity: this.showValidateAiValidity,
          showValidityMonths: this.showValidityMonths,
          showMandatory: this.showMandatory,
          validateAiNameReadOnly: this.validateAiNameReadOnly,
          validateAiValidityReadOnly: this.validateAiValidityReadOnly,
          validityMonthsReadOnly: this.validityMonthsReadOnly,
          mandatoryReadOnly: this.mandatoryReadOnly,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.patchRow(row.documentTypeId, {
          ...row,
          isActive: true,
          validateAiName: result.validateAiName,
          validateAiValidity: result.validateAiValidity,
          validityMonths: result.validityMonths,
          isRequired: result.isRequired,
        });
      });
  }

  private patchRow(documentTypeId: number, next: WizardDocumentRequirementRow): void {
    const current = [...this.rows];
    const index = current.findIndex((item) => item.documentTypeId === documentTypeId);
    if (index < 0) {
      return;
    }
    current[index] = next;
    this.control.setValue(current);
    this.control.markAsDirty();
  }

  private emptyRow(documentTypeId: number, isActive: boolean): WizardDocumentRequirementRow {
    return {
      documentTypeId,
      isRequired: false,
      selected: isActive,
      validateAiName: false,
      validateAiValidity: false,
      validityMonths: null,
      isActive,
    };
  }

  private loadDocumentTypes(): void {
    if (this.countryId == null) {
      this.documentTypes = [];
      this.control.setValue([], { emitEvent: false });
      return;
    }
    this.loading = true;
    this.documentTypeService
      .list(this.countryId, 0, 200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.documentTypes = response.items.filter((doc) => doc.isActive);
          this.mergeCatalog();
          this.loading = false;
        },
        error: () => {
          this.documentTypes = [];
          this.loading = false;
        },
      });
  }

  private mergeCatalog(): void {
    this.mergingCatalog = true;
    const savedByType = new Map((this.control.value ?? []).map((row) => [row.documentTypeId, row]));
    const next = this.documentTypes.map((doc) => {
      const saved = savedByType.get(doc.id);
      if (saved) {
        return {
          ...saved,
          isActive: saved.isActive !== false,
        };
      }
      return this.emptyRow(doc.id, !this.isEditMode);
    });
    this.control.setValue(next, { emitEvent: false });
    this.mergingCatalog = false;
  }
}
