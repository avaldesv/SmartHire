import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  CVS_FIELD_AUTO_PARSE,
  CVS_FIELD_FORMAT,
  CVS_FIELD_MAX_SIZE_MB,
  CVS_FIELD_REQUIRE_PHOTO,
  CVS_PAGE_TITLE,
  CVS_SAVE_SUCCESS,
  SETTINGS_CONFIG_SAVE,
  SETTINGS_CONFIG_SNACK_CLOSE,
} from '../../../core/i18n/settings-config-labels';

@Component({
  selector: 'sh-cvs-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>{{ pageTitle }}</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-form-field appearance="outline"><mat-label>{{ fieldFormat }}</mat-label><mat-select formControlName="format"><mat-option value="pdf">PDF</mat-option><mat-option value="docx">DOCX</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>{{ fieldMaxSizeMb }}</mat-label><input matInput type="number" formControlName="maxSizeMb" /></mat-form-field>
      <mat-slide-toggle formControlName="autoParse">{{ fieldAutoParse }}</mat-slide-toggle>
      <mat-slide-toggle formControlName="requirePhoto">{{ fieldRequirePhoto }}</mat-slide-toggle>
      <button mat-flat-button color="primary" type="submit">{{ saveLabel }}</button>
    </form>
  `,
  styles: `
    h3 { margin: 0 0 16px; font-size: 1.1rem; }
    .config-form { display: flex; flex-direction: column; gap: 12px; max-width: 400px; }
  `,
})
export class CvsConfigComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly pageTitle = CVS_PAGE_TITLE;
  readonly fieldFormat = CVS_FIELD_FORMAT;
  readonly fieldMaxSizeMb = CVS_FIELD_MAX_SIZE_MB;
  readonly fieldAutoParse = CVS_FIELD_AUTO_PARSE;
  readonly fieldRequirePhoto = CVS_FIELD_REQUIRE_PHOTO;
  readonly saveLabel = SETTINGS_CONFIG_SAVE;

  readonly form = this.fb.nonNullable.group({
    format: ['pdf'],
    maxSizeMb: [5],
    autoParse: [true],
    requirePhoto: [false],
  });

  save(): void {
    this.snack.open(CVS_SAVE_SUCCESS, SETTINGS_CONFIG_SNACK_CLOSE, { duration: 2500 });
  }
}
