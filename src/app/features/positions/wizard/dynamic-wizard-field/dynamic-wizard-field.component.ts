import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ResolvedRequisitionFormField, WizardFieldOption } from '../../../../shared/models/requisition-wizard.model';
import { resolveWizardFieldLabel } from '../requisition-wizard-labels';

@Component({
  selector: 'sh-dynamic-wizard-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './dynamic-wizard-field.component.html',
  styleUrl: './dynamic-wizard-field.component.scss',
})
export class DynamicWizardFieldComponent {
  @Input({ required: true }) field!: ResolvedRequisitionFormField;
  @Input({ required: true }) control!: FormControl;
  @Input() options: WizardFieldOption[] = [];
  @Input() loadingOptions = false;
  @Input() disabled = false;

  get label(): string {
    return resolveWizardFieldLabel(this.field.fieldKey, this.field.labelI18nKey);
  }

  get isTextarea(): boolean {
    return this.field.uiType === 'textarea';
  }

  get isNumber(): boolean {
    return this.field.uiType === 'number';
  }

  get isDate(): boolean {
    return this.field.uiType === 'date';
  }

  get isTime(): boolean {
    return this.field.uiType === 'time';
  }

  get isSelect(): boolean {
    return this.field.uiType === 'select' || this.field.uiType === 'user-picker';
  }

  get isCheckbox(): boolean {
    return this.field.uiType === 'checkbox';
  }

  get isSimpleInput(): boolean {
    return this.field.uiType === 'text' || this.isTextarea || this.isNumber || this.isDate || this.isTime;
  }
}
