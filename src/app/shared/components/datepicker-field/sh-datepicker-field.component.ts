import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DMY_DATE_FORMATS, DmyDateAdapter } from '../../utils/dmy-date-adapter';
import { formatDateToIso, parseDateInput } from '../../utils/date-value.util';

/**
 * Material datepicker bound to YYYY-MM-DD strings for API compatibility.
 * Display and typing use dd/MM/yyyy; ISO yyyy-mm-dd is accepted and normalized.
 */
@Component({
  selector: 'sh-datepicker-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: DmyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DMY_DATE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShDatepickerFieldComponent),
      multi: true,
    },
  ],
  template: `
    <mat-form-field appearance="outline" class="date-field" [class.full]="full" subscriptSizing="dynamic">
      @if (label) {
        <mat-label>{{ label }}</mat-label>
      }
      <input matInput [matDatepicker]="picker" [formControl]="innerCtrl" [disabled]="isDisabled" />
      <mat-datepicker-toggle matIconSuffix [for]="picker" [disabled]="isDisabled" />
      <mat-datepicker #picker />
    </mat-form-field>
  `,
  styles: `
    :host {
      display: contents;
    }
    .date-field {
      width: 100%;
    }
    input {
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class ShDatepickerFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() full = false;

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
      this.onChange(formatDateToIso(date));
      this.onTouched();
    });
  }

  writeValue(value: string | Date | null): void {
    this.writing = true;
    this.innerCtrl.setValue(parseDateInput(value), { emitEvent: false });
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
