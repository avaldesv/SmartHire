import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  SETTINGS_CONFIG_SNACK_CLOSE,
  SYSTEM_FIELD_DEBUG_LOGS,
  SYSTEM_FIELD_DEFAULT_LOCALE,
  SYSTEM_FIELD_INSTANCE_NAME,
  SYSTEM_FIELD_MAINTENANCE,
  SYSTEM_FIELD_TIMEZONE,
  SYSTEM_LOCALE_ES_MX,
  SYSTEM_PAGE_TITLE,
  SYSTEM_SAVE_BUTTON,
  SYSTEM_SAVE_SUCCESS,
} from '../../../core/i18n/settings-config-labels';

@Component({
  selector: 'sh-system-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>{{ pageTitle }}</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-form-field appearance="outline"><mat-label>{{ fieldInstanceName }}</mat-label><input matInput formControlName="instanceName" /></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>{{ fieldTimezone }}</mat-label><mat-select formControlName="timezone"><mat-option value="America/Mexico_City">America/Mexico_City</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>{{ fieldDefaultLocale }}</mat-label><mat-select formControlName="locale"><mat-option value="es-MX">{{ localeEsMx }}</mat-option></mat-select></mat-form-field>
      <mat-slide-toggle formControlName="maintenanceMode">{{ fieldMaintenance }}</mat-slide-toggle>
      <mat-slide-toggle formControlName="debugLogs">{{ fieldDebugLogs }}</mat-slide-toggle>
      <button mat-flat-button color="primary" type="submit">{{ saveLabel }}</button>
    </form>
  `,
  styles: `
    h3 { margin: 0 0 16px; font-size: 1.1rem; }
    .config-form { display: flex; flex-direction: column; gap: 12px; max-width: 480px; }
  `,
})
export class SystemConfigComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly pageTitle = SYSTEM_PAGE_TITLE;
  readonly fieldInstanceName = SYSTEM_FIELD_INSTANCE_NAME;
  readonly fieldTimezone = SYSTEM_FIELD_TIMEZONE;
  readonly fieldDefaultLocale = SYSTEM_FIELD_DEFAULT_LOCALE;
  readonly localeEsMx = SYSTEM_LOCALE_ES_MX;
  readonly fieldMaintenance = SYSTEM_FIELD_MAINTENANCE;
  readonly fieldDebugLogs = SYSTEM_FIELD_DEBUG_LOGS;
  readonly saveLabel = SYSTEM_SAVE_BUTTON;

  readonly form = this.fb.nonNullable.group({
    instanceName: ['Smart Hire MX'],
    timezone: ['America/Mexico_City'],
    locale: ['es-MX'],
    maintenanceMode: [false],
    debugLogs: [false],
  });

  save(): void {
    this.snack.open(SYSTEM_SAVE_SUCCESS, SETTINGS_CONFIG_SNACK_CLOSE, { duration: 2500 });
  }
}
