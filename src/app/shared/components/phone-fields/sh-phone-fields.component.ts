import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CountryDialCodeOption, ReferenceDataService } from '../../../core/services/reference-data.service';

const DEFAULT_PREFIX = '+52';

@Component({
  selector: 'sh-phone-fields',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="phone-row" [formGroup]="form">
      <mat-form-field appearance="outline" class="prefix-field">
        <mat-label i18n="@@phone.prefix">Prefijo del país</mat-label>
        <mat-select [formControlName]="prefixControl">
          @if (allowEmpty) {
            <mat-option [value]="''">—</mat-option>
          }
          @for (option of options; track option.countryId) {
            <mat-option [value]="prefixOf(option)">{{ optionLabel(option) }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="phone-field">
        <mat-label i18n="@@phone.number">Teléfono</mat-label>
        <input matInput [formControlName]="phoneControl" inputmode="tel" autocomplete="tel-national" />
      </mat-form-field>
    </div>
  `,
  styles: `
    .phone-row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .prefix-field {
      flex: 0 0 140px;
      min-width: 120px;
    }
    .phone-field {
      flex: 1 1 180px;
      min-width: 140px;
    }
  `,
})
export class ShPhoneFieldsComponent implements OnInit {
  private readonly referenceData = inject(ReferenceDataService);

  @Input({ required: true }) form!: FormGroup;
  @Input() prefixControl = 'phonePrefix';
  @Input() phoneControl = 'phone';
  @Input() tenantCountryId: number | null = null;
  @Input() allowEmpty = false;

  options: CountryDialCodeOption[] = [];

  ngOnInit(): void {
    this.referenceData.listCountryDialCodes(this.tenantCountryId).subscribe((rows) => {
      this.options = rows ?? [];
      const ctrl = this.form.get(this.prefixControl);
      if (!ctrl || ctrl.value) {
        return;
      }
      const preferred =
        this.options.find((o) => o.countryId === this.tenantCountryId) ??
        this.options.find((o) => this.prefixOf(o) === DEFAULT_PREFIX) ??
        this.options[0];
      if (preferred) {
        ctrl.setValue(this.prefixOf(preferred), { emitEvent: false });
      } else {
        ctrl.setValue(DEFAULT_PREFIX, { emitEvent: false });
      }
    });
  }

  prefixOf(option: CountryDialCodeOption): string {
    return option.phonePrefix || option.dialCode;
  }

  optionLabel(option: CountryDialCodeOption): string {
    const iso = (option.countryCode || '').trim().toUpperCase();
    return iso ? `${this.prefixOf(option)} - ${iso}` : this.prefixOf(option);
  }
}
