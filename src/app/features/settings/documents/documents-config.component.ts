import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  DOCUMENTS_FIELD_CURP,
  DOCUMENTS_FIELD_DEADLINE_DAYS,
  DOCUMENTS_FIELD_INE,
  DOCUMENTS_FIELD_PROOF_OF_ADDRESS,
  DOCUMENTS_FIELD_RFC,
  DOCUMENTS_PAGE_TITLE,
  DOCUMENTS_SAVE_SUCCESS,
  SETTINGS_CONFIG_SAVE,
  SETTINGS_CONFIG_SNACK_CLOSE,
} from '../../../core/i18n/settings-config-labels';

@Component({
  selector: 'sh-documents-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>{{ pageTitle }}</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-checkbox formControlName="ine">{{ fieldIne }}</mat-checkbox>
      <mat-checkbox formControlName="curp">{{ fieldCurp }}</mat-checkbox>
      <mat-checkbox formControlName="rfc">{{ fieldRfc }}</mat-checkbox>
      <mat-checkbox formControlName="comprobante">{{ fieldProofOfAddress }}</mat-checkbox>
      <mat-form-field appearance="outline"><mat-label>{{ fieldDeadlineDays }}</mat-label><input matInput type="number" formControlName="deadlineDays" /></mat-form-field>
      <button mat-flat-button color="primary" type="submit">{{ saveLabel }}</button>
    </form>
  `,
  styles: `
    h3 { margin: 0 0 16px; font-size: 1.1rem; }
    .config-form { display: flex; flex-direction: column; gap: 12px; max-width: 400px; }
  `,
})
export class DocumentsConfigComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly pageTitle = DOCUMENTS_PAGE_TITLE;
  readonly fieldIne = DOCUMENTS_FIELD_INE;
  readonly fieldCurp = DOCUMENTS_FIELD_CURP;
  readonly fieldRfc = DOCUMENTS_FIELD_RFC;
  readonly fieldProofOfAddress = DOCUMENTS_FIELD_PROOF_OF_ADDRESS;
  readonly fieldDeadlineDays = DOCUMENTS_FIELD_DEADLINE_DAYS;
  readonly saveLabel = SETTINGS_CONFIG_SAVE;

  readonly form = this.fb.nonNullable.group({
    ine: [true],
    curp: [true],
    rfc: [false],
    comprobante: [true],
    deadlineDays: [5],
  });

  save(): void {
    this.snack.open(DOCUMENTS_SAVE_SUCCESS, SETTINGS_CONFIG_SNACK_CLOSE, { duration: 2500 });
  }
}
