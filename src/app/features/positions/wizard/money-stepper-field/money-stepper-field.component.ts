import { Component, DoCheck, Input, inject, viewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  REQUISITION_WIZARD_FIELD_REQUIRED,
  REQUISITION_WIZARD_MONEY_DECREMENT,
  REQUISITION_WIZARD_MONEY_INCREMENT,
} from '../../../../core/i18n/requisition-wizard-labels';
import {
  MONEY_STEP,
  formatMoneyDisplay,
  roundMoneyToTwoDecimals,
  sanitizeNonNegativeMoneyInput,
  stepMoneyValue,
} from '../requisition-money.util';

/**
 * Money control: text input with x.00 mask + custom ±0.01 spinner buttons.
 * Avoids type="number" so trailing decimals stay visible.
 */
@Component({
  selector: 'sh-money-stepper-field',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './money-stepper-field.component.html',
  styleUrl: './money-stepper-field.component.scss',
})
export class MoneyStepperFieldComponent implements ControlValueAccessor, DoCheck {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly matInput = viewChild(MatInput);

  @Input() label = '';
  /** Extra disable from parent template (in addition to CVA setDisabledState). */
  @Input() disabled = false;
  @Input() required = false;
  @Input() min = 0;
  @Input() step = MONEY_STEP;
  /**
   * When true (salary field only): strip non-numeric keystrokes/paste from the visible input
   * and default empty values to 0.00.
   */
  @Input() blockNonNumeric = false;

  displayValue = '';
  private cvaDisabled = false;

  readonly incrementLabel = REQUISITION_WIZARD_MONEY_INCREMENT;
  readonly decrementLabel = REQUISITION_WIZARD_MONEY_DECREMENT;
  readonly requiredError = REQUISITION_WIZARD_FIELD_REQUIRED;

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => this.showError,
  };

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get isDisabled(): boolean {
    return this.disabled || this.cvaDisabled;
  }

  get isRequired(): boolean {
    return this.required || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  get showError(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && control.touched;
  }

  get canDecrement(): boolean {
    if (this.isDisabled) {
      return false;
    }
    const current = roundMoneyToTwoDecimals(this.displayValue) ?? 0;
    return current > this.min;
  }

  get canIncrement(): boolean {
    return !this.isDisabled;
  }

  ngDoCheck(): void {
    this.matInput()?.updateErrorState();
  }

  writeValue(value: unknown): void {
    const display = formatMoneyDisplay(value);
    this.displayValue = this.blockNonNumeric && display === '' ? '0.00' : display;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled = isDisabled;
  }

  onInput(raw: string): void {
    const next = this.blockNonNumeric ? sanitizeNonNegativeMoneyInput(raw) : raw;
    this.displayValue = next;
    this.onChange(next.trim() === '' ? null : next);
  }

  onBlur(): void {
    const rounded = roundMoneyToTwoDecimals(this.displayValue);
    if (this.blockNonNumeric) {
      const next = Math.max(this.min, rounded ?? 0).toFixed(2);
      this.displayValue = next;
      this.onChange(next);
      this.onTouched();
      return;
    }
    const next = rounded == null ? null : Math.max(this.min, rounded).toFixed(2);
    this.displayValue = next ?? '';
    this.onChange(next);
    this.onTouched();
  }

  increment(): void {
    if (!this.canIncrement) {
      return;
    }
    this.applyStep(this.step);
  }

  decrement(): void {
    if (!this.canDecrement) {
      return;
    }
    this.applyStep(-this.step);
  }

  private applyStep(delta: number): void {
    const next = stepMoneyValue(this.displayValue, delta, this.min);
    this.displayValue = next;
    this.onChange(next);
    this.onTouched();
  }
}
