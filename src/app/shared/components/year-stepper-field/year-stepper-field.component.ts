import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/**
 * Year filter control: chevron stepper + numeric input (`< 2026 >`).
 * Compatible with reactive forms via ControlValueAccessor.
 */
@Component({
  selector: 'sh-year-stepper-field',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './year-stepper-field.component.html',
  styleUrl: './year-stepper-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearStepperFieldComponent),
      multi: true,
    },
  ],
})
export class YearStepperFieldComponent implements ControlValueAccessor {
  @Input() label = 'Año';
  @Input() required = false;
  @Input() minYear = 2000;
  @Input() maxYear = 2100;

  value = new Date().getFullYear();
  disabled = false;
  touched = false;

  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get canDecrement(): boolean {
    return !this.disabled && this.value > this.minYear;
  }

  get canIncrement(): boolean {
    return !this.disabled && this.value < this.maxYear;
  }

  writeValue(value: number | null): void {
    if (value == null || Number.isNaN(Number(value))) {
      this.value = new Date().getFullYear();
      return;
    }
    this.value = this.clamp(Number(value));
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  decrement(): void {
    if (!this.canDecrement) {
      return;
    }
    this.setValue(this.value - 1);
  }

  increment(): void {
    if (!this.canIncrement) {
      return;
    }
    this.setValue(this.value + 1);
  }

  onInput(raw: string): void {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    this.setValue(parsed);
  }

  markTouched(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  private setValue(next: number): void {
    const clamped = this.clamp(next);
    this.value = clamped;
    this.onChange(clamped);
    this.markTouched();
  }

  private clamp(year: number): number {
    return Math.min(this.maxYear, Math.max(this.minYear, Math.trunc(year)));
  }
}
