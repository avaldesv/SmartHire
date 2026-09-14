import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { formatDateToHhMm, parseTimeToDate } from '../../utils/time-value.util';

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
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShTimepickerFieldComponent),
      multi: true,
    },
  ],
  template: `
    <mat-form-field appearance="outline" class="time-field" subscriptSizing="dynamic">
      @if (label) {
        <mat-label>{{ label }}</mat-label>
      }
      <input matInput [matTimepicker]="picker" [formControl]="innerCtrl" [disabled]="isDisabled" />
      <mat-timepicker-toggle matIconSuffix [for]="picker" [disabled]="isDisabled" />
      <mat-timepicker #picker interval="30minutes" />
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
  @Input() label = '';

  readonly innerCtrl = new FormControl<Date | null>(null);

  isDisabled = false;

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private writing = false;

  constructor() {
    this.innerCtrl.valueChanges.subscribe((date) => {
      if (this.writing) {
        return;
      }
      this.onChange(formatDateToHhMm(date));
      this.onTouched();
    });
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
