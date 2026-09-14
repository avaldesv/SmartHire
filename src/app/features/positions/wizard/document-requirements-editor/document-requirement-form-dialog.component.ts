import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  REQUISITION_DOCS_WIZARD_EDIT,
  REQUISITION_DOCS_WIZARD_MANDATORY,
  REQUISITION_DOCS_WIZARD_NO,
  REQUISITION_DOCS_WIZARD_TYPE,
  REQUISITION_DOCS_WIZARD_VALIDATE_AI,
  REQUISITION_DOCS_WIZARD_VALIDATE_NAME,
  REQUISITION_DOCS_WIZARD_VALIDATE_VALIDITY,
  REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS,
  REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_PLACEHOLDER,
  REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_REQUIRED,
  REQUISITION_DOCS_WIZARD_YES,
  REQUISITION_WIZARD_CANCEL,
  REQUISITION_WIZARD_SAVE,
} from '../../../../core/i18n/requisition-wizard-labels';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../../shared/components/modal-form/sh-modal-form.component';
import {
  DocumentRequirementFormDialogData,
  DocumentRequirementFormDialogResult,
} from './document-requirement-form-dialog.model';

@Component({
  selector: 'sh-document-requirement-form-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './document-requirement-form-dialog.component.html',
  styleUrl: './document-requirement-form-dialog.component.scss',
})
export class DocumentRequirementFormDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<DocumentRequirementFormDialogComponent, DocumentRequirementFormDialogResult | undefined>,
  );
  readonly data = inject<DocumentRequirementFormDialogData>(MAT_DIALOG_DATA);

  readonly title = REQUISITION_DOCS_WIZARD_EDIT;
  readonly labels = {
    type: REQUISITION_DOCS_WIZARD_TYPE,
    validateAi: REQUISITION_DOCS_WIZARD_VALIDATE_AI,
    validateName: REQUISITION_DOCS_WIZARD_VALIDATE_NAME,
    validateValidity: REQUISITION_DOCS_WIZARD_VALIDATE_VALIDITY,
    validityMonths: REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS,
    validityMonthsPlaceholder: REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_PLACEHOLDER,
    mandatory: REQUISITION_DOCS_WIZARD_MANDATORY,
    yes: REQUISITION_DOCS_WIZARD_YES,
    no: REQUISITION_DOCS_WIZARD_NO,
    cancel: REQUISITION_WIZARD_CANCEL,
    save: REQUISITION_WIZARD_SAVE,
  };

  validateAiName = this.data.validateAiName;
  validateAiValidity = this.data.validateAiValidity;
  validityMonths: number | null = this.data.validityMonths;
  isRequired = this.data.isRequired;
  error: string | null = null;

  get showAiGroup(): boolean {
    return this.data.showValidateAiName || this.data.showValidateAiValidity;
  }

  onValidateValidityChange(checked: boolean): void {
    this.validateAiValidity = checked;
    if (!checked) {
      this.validityMonths = null;
    }
    this.error = null;
  }

  onValidityMonthsInput(raw: string): void {
    const trimmed = raw.trim();
    this.validityMonths = trimmed ? Number(trimmed) : null;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.error = null;
    if (
      this.data.showValidateAiValidity &&
      this.validateAiValidity &&
      (this.validityMonths == null || this.validityMonths < 1)
    ) {
      this.error = REQUISITION_DOCS_WIZARD_VALIDITY_MONTHS_REQUIRED;
      return;
    }
    this.dialogRef.close({
      documentTypeId: this.data.documentTypeId,
      validateAiName: this.data.showValidateAiName ? this.validateAiName : false,
      validateAiValidity: this.data.showValidateAiValidity ? this.validateAiValidity : false,
      validityMonths:
        this.data.showValidityMonths && this.validateAiValidity ? this.validityMonths : null,
      isRequired: this.data.showMandatory ? this.isRequired : false,
    });
  }
}
