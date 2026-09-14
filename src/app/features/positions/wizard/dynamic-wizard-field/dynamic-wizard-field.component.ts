import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ResolvedRequisitionFormField, WizardFieldOption } from '../../../../shared/models/requisition-wizard.model';
import { ShDatepickerFieldComponent } from '../../../../shared/components/datepicker-field/sh-datepicker-field.component';
import { ShTimepickerFieldComponent } from '../../../../shared/components/timepicker-field/sh-timepicker-field.component';
import { resolveWizardFieldLabel } from '../requisition-wizard-labels';
import { REQUISITION_SCOPE_LOADING } from '../../../../core/i18n/requisition-wizard-labels';
import { isRequisitionPositiveIntegerField } from '../requisition-integer.util';
import { isRequisitionMoneyField } from '../requisition-money.util';
import { MoneyStepperFieldComponent } from '../money-stepper-field/money-stepper-field.component';

@Component({
  selector: 'sh-dynamic-wizard-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MoneyStepperFieldComponent,
    ShDatepickerFieldComponent,
    ShTimepickerFieldComponent,
  ],
  templateUrl: './dynamic-wizard-field.component.html',
  styleUrl: './dynamic-wizard-field.component.scss',
})
export class DynamicWizardFieldComponent {
  @Input({ required: true }) field!: ResolvedRequisitionFormField;
  @Input({ required: true }) control!: FormControl;
  @Input() options: WizardFieldOption[] = [];
  @Input() loadingOptions = false;
  @Input() disabled = false;

  readonly loadingOptionsLabel = REQUISITION_SCOPE_LOADING;

  get label(): string {
    return resolveWizardFieldLabel(this.field.fieldKey, this.field.labelI18nKey);
  }

  get isTextarea(): boolean {
    return this.field.uiType === 'textarea';
  }

  get isNumber(): boolean {
    return this.field.uiType === 'number';
  }

  get isMoney(): boolean {
    return this.isNumber && isRequisitionMoneyField(this.field.fieldKey);
  }

  get numberMin(): number | null {
    if (!this.isNumber || this.isMoney) {
      return null;
    }
    return isRequisitionPositiveIntegerField(this.field.fieldKey) ? 1 : 0;
  }

  get numberStep(): number | null {
    if (!this.isNumber || this.isMoney) {
      return null;
    }
    return isRequisitionPositiveIntegerField(this.field.fieldKey) ? 1 : null;
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

  get isMultiselect(): boolean {
    return this.field.uiType === 'multiselect';
  }

  get isCheckbox(): boolean {
    return this.field.uiType === 'checkbox';
  }

  get isSimpleInput(): boolean {
    return this.field.uiType === 'text' || this.isTextarea || (this.isNumber && !this.isMoney);
  }
}
