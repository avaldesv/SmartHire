import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  REQUISITION_WIZARD_MONEY_DECREMENT,
  REQUISITION_WIZARD_MONEY_INCREMENT,
} from '../../../../core/i18n/requisition-wizard-labels';
import {
  MONEY_STEP,
  formatMoneyDisplay,
  roundMoneyToTwoDecimals,
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoneyStepperFieldComponent),
      multi: true,
    },
  ],
})
export class MoneyStepperFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  /** Extra disable from parent template (in addition to CVA setDisabledState). */
  @Input() disabled = false;
  @Input() min = 0;
  @Input() step = MONEY_STEP;

  displayValue = '';
  private cvaDisabled = false;

  readonly incrementLabel = REQUISITION_WIZARD_MONEY_INCREMENT;
  readonly decrementLabel = REQUISITION_WIZARD_MONEY_DECREMENT;

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get isDisabled(): boolean {
    return this.disabled || this.cvaDisabled;
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

  writeValue(value: unknown): void {
    this.displayValue = formatMoneyDisplay(value);
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
    this.displayValue = raw;
    this.onChange(raw.trim() === '' ? null : raw);
  }

  onBlur(): void {
    const rounded = roundMoneyToTwoDecimals(this.displayValue);
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
