import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ResolvedRequisitionFormField, WizardFieldOption } from '../../../../shared/models/requisition-wizard.model';
import { resolveWizardFieldLabel } from '../requisition-wizard-labels';
import {
  REQUISITION_SCOPE_LOADING,
  REQUISITION_WIZARD_OPEN_TIME_PICKER,
} from '../../../../core/i18n/requisition-wizard-labels';

@Component({
  selector: 'sh-dynamic-wizard-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dynamic-wizard-field.component.html',
  styleUrl: './dynamic-wizard-field.component.scss',
})
export class DynamicWizardFieldComponent {
  @Input({ required: true }) field!: ResolvedRequisitionFormField;
  @Input({ required: true }) control!: FormControl;
  @Input() options: WizardFieldOption[] = [];
  @Input() loadingOptions = false;
  @Input() disabled = false;

  @ViewChild('timeInput') timeInput?: ElementRef<HTMLInputElement>;

  readonly loadingOptionsLabel = REQUISITION_SCOPE_LOADING;
  readonly openTimePickerLabel = REQUISITION_WIZARD_OPEN_TIME_PICKER;

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

  get isMultiselect(): boolean {
    return this.field.uiType === 'multiselect';
  }

  get isCheckbox(): boolean {
    return this.field.uiType === 'checkbox';
  }

  get isSimpleInput(): boolean {
    return this.field.uiType === 'text' || this.isTextarea || this.isNumber;
  }

  openTimePicker(event?: Event): void {
    if (this.disabled) {
      return;
    }
    const target = event?.currentTarget as HTMLElement | undefined;
    if (target?.tagName === 'BUTTON') {
      event?.preventDefault();
      event?.stopPropagation();
    }
    const input = this.timeInput?.nativeElement;
    if (!input) {
      return;
    }
    if (document.activeElement !== input) {
      input.focus();
    }
    const withPicker = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof withPicker.showPicker === 'function') {
      try {
        withPicker.showPicker();
      } catch {
        // Some browsers reject showPicker outside a trusted gesture.
      }
    }
  }
}
