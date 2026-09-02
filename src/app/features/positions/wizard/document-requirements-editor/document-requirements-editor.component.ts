import { Component, DestroyRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CatalogDocumentTypeService } from '../../../../core/services/catalog-document-type.service';
import {
  REQUISITION_DOCS_WIZARD_ADD,
  REQUISITION_DOCS_WIZARD_COL_ACTIONS,
  REQUISITION_DOCS_WIZARD_COL_AI,
  REQUISITION_DOCS_WIZARD_COL_MANDATORY,
  REQUISITION_DOCS_WIZARD_COL_MONTHS,
  REQUISITION_DOCS_WIZARD_COL_TYPE,
  REQUISITION_DOCS_WIZARD_CONFIGURED_TITLE,
  REQUISITION_DOCS_WIZARD_DELETE,
  REQUISITION_DOCS_WIZARD_DUPLICATE_TYPE,
  REQUISITION_DOCS_WIZARD_EDIT,
  REQUISITION_DOCS_WIZARD_EMPTY,
  REQUISITION_DOCS_WIZARD_MANDATORY,
  REQUISITION_DOCS_WIZARD_NO,
  REQUISITION_DOCS_WIZARD_SUBTITLE,
  REQUISITION_DOCS_WIZARD_TYPE,
  REQUISITION_DOCS_WIZARD_UPDATE,
  REQUISITION_DOCS_WIZARD_VALIDATE_AI,
  REQUISITION_DOCS_WIZARD_VALIDATE_NAME,
  REQUISITION_DOCS_WIZARD_VALIDATE_VALIDITY,
  REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS,
  REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_PLACEHOLDER,
  REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_REQUIRED,
  REQUISITION_DOCS_WIZARD_YES,
  REQUISITION_WIZARD_CANCEL,
  REQUISITION_WIZARD_LOADING_DOCUMENTS,
  REQUISITION_WIZARD_NO_DOCUMENTS,
  REQUISITION_WIZARD_SELECT_COUNTRY_DOCUMENTS_HINT,
  requisitionDocumentsWizardAiSummary,
} from '../../../../core/i18n/requisition-wizard-labels';
import { CatalogDocumentType } from '../../../../shared/models/catalog-document-type.model';
import { WizardDocumentRequirementRow } from '../../../../shared/models/requisition-wizard.model';

interface DocumentDraft {
  documentTypeId: number | null;
  validateAiName: boolean;
  validateAiValidity: boolean;
  validityMonths: number | null;
  isRequired: boolean;
}

@Component({
  selector: 'sh-document-requirements-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './document-requirements-editor.component.html',
  styleUrl: './document-requirements-editor.component.scss',
})
export class DocumentRequirementsEditorComponent implements OnChanges {
  private readonly documentTypeService = inject(CatalogDocumentTypeService);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) control!: FormControl<WizardDocumentRequirementRow[]>;
  @Input() countryId: number | null = null;
  @Input() disabled = false;
  @Input() showValidateAiName = true;
  @Input() showValidateAiValidity = true;
  @Input() showValidityMonths = true;
  @Input() showMandatory = true;
  @Input() validateAiNameReadOnly = false;
  @Input() validateAiValidityReadOnly = false;
  @Input() validityMonthsReadOnly = false;
  @Input() mandatoryReadOnly = false;

  readonly labels = {
    subtitle: REQUISITION_DOCS_WIZARD_SUBTITLE,
    type: REQUISITION_DOCS_WIZARD_TYPE,
    validateAi: REQUISITION_DOCS_WIZARD_VALIDATE_AI,
    validateName: REQUISITION_DOCS_WIZARD_VALIDATE_NAME,
    validateValidity: REQUISITION_DOCS_WIZARD_VALIDATE_VALIDITY,
    validityMonths: REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS,
    validityMonthsPlaceholder: REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_PLACEHOLDER,
    mandatory: REQUISITION_DOCS_WIZARD_MANDATORY,
    yes: REQUISITION_DOCS_WIZARD_YES,
    no: REQUISITION_DOCS_WIZARD_NO,
    add: REQUISITION_DOCS_WIZARD_ADD,
    update: REQUISITION_DOCS_WIZARD_UPDATE,
    configuredTitle: REQUISITION_DOCS_WIZARD_CONFIGURED_TITLE,
    colType: REQUISITION_DOCS_WIZARD_COL_TYPE,
    colAi: REQUISITION_DOCS_WIZARD_COL_AI,
    colMonths: REQUISITION_DOCS_WIZARD_COL_MONTHS,
    colMandatory: REQUISITION_DOCS_WIZARD_COL_MANDATORY,
    colActions: REQUISITION_DOCS_WIZARD_COL_ACTIONS,
    empty: REQUISITION_DOCS_WIZARD_EMPTY,
    duplicateType: REQUISITION_DOCS_WIZARD_DUPLICATE_TYPE,
    validityMonthsRequired: REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_REQUIRED,
    edit: REQUISITION_DOCS_WIZARD_EDIT,
    delete: REQUISITION_DOCS_WIZARD_DELETE,
    cancel: REQUISITION_WIZARD_CANCEL,
    loading: REQUISITION_WIZARD_LOADING_DOCUMENTS,
    noDocuments: REQUISITION_WIZARD_NO_DOCUMENTS,
    selectCountryHint: REQUISITION_WIZARD_SELECT_COUNTRY_DOCUMENTS_HINT,
  };

  readonly columns = ['documentTypeName', 'validateAi', 'validityMonths', 'isRequired', 'actions'];

  get visibleColumns(): string[] {
    const cols: string[] = ['documentTypeName'];
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

  get showAiGroup(): boolean {
    return this.showValidateAiName || this.showValidateAiValidity;
  }

  documentTypes: CatalogDocumentType[] = [];
  loading = false;
  draftError: string | null = null;
  editingDocumentTypeId: number | null = null;

  draft: DocumentDraft = this.emptyDraft();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryId']) {
      this.loadDocumentTypes();
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

  get availableDocumentTypes(): CatalogDocumentType[] {
    const used = new Set(this.rows.map((row) => row.documentTypeId));
    if (this.editingDocumentTypeId != null) {
      used.delete(this.editingDocumentTypeId);
    }
    return this.documentTypes.filter((doc) => !used.has(doc.id));
  }

  get submitLabel(): string {
    return this.editingDocumentTypeId != null ? this.labels.update : this.labels.add;
  }

  aiSummary(row: WizardDocumentRequirementRow): string {
    const name = this.showValidateAiName ? row.validateAiName : false;
    const validity = this.showValidateAiValidity ? row.validateAiValidity : false;
    return requisitionDocumentsWizardAiSummary(name, validity);
  }

  documentLabel(documentTypeId: number): string {
    return this.documentTypes.find((doc) => doc.id === documentTypeId)?.name ?? String(documentTypeId);
  }

  mandatoryLabel(isRequired: boolean): string {
    return isRequired ? this.labels.yes : this.labels.no;
  }

  onDocumentTypeChange(documentTypeId: number | null): void {
    this.draft.documentTypeId = documentTypeId;
    this.draftError = null;
    if (documentTypeId == null) {
      return;
    }
    const catalogType = this.documentTypes.find((doc) => doc.id === documentTypeId);
    if (this.showValidateAiName && catalogType?.validatesWithAi) {
      this.draft.validateAiName = true;
    }
  }

  onValidateValidityChange(checked: boolean): void {
    this.draft.validateAiValidity = checked;
    if (!checked) {
      this.draft.validityMonths = null;
    }
    this.draftError = null;
  }

  onValidityMonthsInput(raw: string): void {
    const trimmed = raw.trim();
    this.draft.validityMonths = trimmed ? Number(trimmed) : null;
  }

  submitDraft(): void {
    if (this.disabled) {
      return;
    }
    this.draftError = null;
    if (this.draft.documentTypeId == null) {
      return;
    }
    this.applyHiddenSectionDefaults();
    if (
      this.showValidateAiValidity &&
      this.draft.validateAiValidity &&
      (this.draft.validityMonths == null || this.draft.validityMonths < 1)
    ) {
      this.draftError = this.labels.validityMonthsRequired;
      return;
    }
    const row: WizardDocumentRequirementRow = {
      documentTypeId: this.draft.documentTypeId,
      isRequired: this.showMandatory ? this.draft.isRequired : false,
      selected: true,
      validateAiName: this.showValidateAiName ? this.draft.validateAiName : false,
      validateAiValidity: this.showValidateAiValidity ? this.draft.validateAiValidity : false,
      validityMonths:
        this.showValidityMonths && this.draft.validateAiValidity ? this.draft.validityMonths : null,
    };
    const current = [...this.rows];
    const index = current.findIndex((item) => item.documentTypeId === row.documentTypeId);
    if (index >= 0 && this.editingDocumentTypeId !== row.documentTypeId) {
      this.draftError = this.labels.duplicateType;
      return;
    }
    if (index >= 0) {
      current[index] = row;
    } else {
      current.push(row);
    }
    this.control.setValue(current);
    this.control.markAsDirty();
    this.resetDraft();
  }

  editRow(row: WizardDocumentRequirementRow): void {
    if (this.disabled) {
      return;
    }
    this.editingDocumentTypeId = row.documentTypeId;
    this.draft = {
      documentTypeId: row.documentTypeId,
      validateAiName: row.validateAiName,
      validateAiValidity: row.validateAiValidity,
      validityMonths: row.validityMonths,
      isRequired: row.isRequired,
    };
    this.draftError = null;
  }

  removeRow(documentTypeId: number): void {
    if (this.disabled) {
      return;
    }
    const next = this.rows.filter((row) => row.documentTypeId !== documentTypeId);
    this.control.setValue(next);
    this.control.markAsDirty();
    if (this.editingDocumentTypeId === documentTypeId) {
      this.resetDraft();
    }
  }

  cancelEdit(): void {
    this.resetDraft();
  }

  private loadDocumentTypes(): void {
    if (this.countryId == null) {
      this.documentTypes = [];
      return;
    }
    this.loading = true;
    this.documentTypeService
      .list(this.countryId, 0, 200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.documentTypes = response.items.filter((doc) => doc.isActive);
          this.loading = false;
        },
        error: () => {
          this.documentTypes = [];
          this.loading = false;
        },
      });
  }

  private resetDraft(): void {
    this.editingDocumentTypeId = null;
    this.draft = this.emptyDraft();
    this.draftError = null;
  }

  private emptyDraft(): DocumentDraft {
    return {
      documentTypeId: null,
      validateAiName: false,
      validateAiValidity: false,
      validityMonths: null,
      isRequired: false,
    };
  }

  private applyHiddenSectionDefaults(): void {
    const catalogType =
      this.draft.documentTypeId != null
        ? this.documentTypes.find((doc) => doc.id === this.draft.documentTypeId)
        : undefined;
    if (!this.showValidateAiName) {
      this.draft.validateAiName = catalogType?.validatesWithAi ?? false;
    }
    if (!this.showValidateAiValidity) {
      this.draft.validateAiValidity = false;
    }
    if (!this.showValidityMonths || !this.showValidateAiValidity) {
      this.draft.validityMonths = null;
    }
    if (!this.showMandatory) {
      this.draft.isRequired = false;
    }
  }
}
