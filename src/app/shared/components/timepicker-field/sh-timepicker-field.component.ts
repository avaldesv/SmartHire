import { Component, Input, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { formatDateToHhMm, parseTimeToDate, TIME_INPUT_PLACEHOLDER } from '../../utils/time-value.util';

/**
 * Material timepicker bound to HH:mm (24h) strings for API compatibility.
 * Display uses en-US so values show as 12h AM/PM; typing 14:00 parses to 2:00 PM.
 */
@Component({
  selector: 'sh-timepicker-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ],
  template: `
    <mat-form-field appearance="outline" class="time-field" subscriptSizing="dynamic">
      @if (label) {
        <mat-label>{{ label }}</mat-label>
      }
      <input
        matInput
        [matTimepicker]="picker"
        [formControl]="innerCtrl"
        [placeholder]="placeholder"
        [disabled]="isDisabled"
        [required]="isRequired"
        [errorStateMatcher]="errorStateMatcher"
      />
      <mat-timepicker-toggle matIconSuffix [for]="picker" [disabled]="isDisabled" />
      <mat-timepicker #picker interval="30minutes" />
      @if (showError) {
        <mat-error>{{ requiredError }}</mat-error>
      }
    </mat-form-field>
  `,
  styles: `
    :host {
      display: contents;
    }
    .time-field {
      width: 100%;
    }
    input {
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class ShTimepickerFieldComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  @Input() label = '';
  @Input() placeholder = TIME_INPUT_PLACEHOLDER;
  @Input() required = false;

  readonly innerCtrl = new FormControl<Date | null>(null);
  readonly requiredError = $localize`:@@requisition.wizard.errors.fieldRequired:Campo obligatorio`;

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () => this.showError,
  };

  isDisabled = false;

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private writing = false;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.innerCtrl.valueChanges.subscribe((date) => {
      if (this.writing) {
        return;
      }
      this.onChange(formatDateToHhMm(date));
      this.onTouched();
    });
  }

  get isRequired(): boolean {
    return this.required || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  get showError(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && control.touched;
  }

  writeValue(value: string | Date | null): void {
    this.writing = true;
    const parsed =
      typeof value === 'string' || value instanceof Date ? parseTimeToDate(value) : null;
    this.innerCtrl.setValue(parsed, { emitEvent: false });
    this.writing = false;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.innerCtrl.disable({ emitEvent: false });
    } else {
      this.innerCtrl.enable({ emitEvent: false });
    }
  }
}
