import { Component, Input, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DMY_DATE_FORMATS, DmyDateAdapter } from '../../utils/dmy-date-adapter';
import { DATE_INPUT_PLACEHOLDER, formatDateToIso, parseDateInput } from '../../utils/date-value.util';

/**
 * Material datepicker bound to YYYY-MM-DD strings for API compatibility.
 * Display and typing use dd/MM/yyyy; ISO yyyy-mm-dd is accepted and normalized.
 */
@Component({
  selector: 'sh-datepicker-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: DmyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DMY_DATE_FORMATS },
  ],
  template: `
    <mat-form-field appearance="outline" class="date-field" [class.full]="full" subscriptSizing="dynamic">
      @if (label) {
        <mat-label>{{ label }}</mat-label>
      }
      <input
        matInput
        [matDatepicker]="picker"
        [formControl]="innerCtrl"
        [placeholder]="placeholder"
        [disabled]="isDisabled"
        [required]="isRequired"
        [errorStateMatcher]="errorStateMatcher"
      />
      <mat-datepicker-toggle matIconSuffix [for]="picker" [disabled]="isDisabled" />
      <mat-datepicker #picker />
      @if (showError) {
        <mat-error>{{ requiredError }}</mat-error>
      }
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
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  @Input() label = '';
  @Input() placeholder = DATE_INPUT_PLACEHOLDER;
  @Input() full = false;
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
      this.onChange(formatDateToIso(date));
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
