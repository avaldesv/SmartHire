import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  PROMPTS_FIELD_ANALYSIS,
  PROMPTS_FIELD_INTERVIEW,
  PROMPTS_FIELD_PRESELECTION,
  PROMPTS_PAGE_TITLE,
  PROMPTS_SAVE_BUTTON,
  PROMPTS_SAVE_SUCCESS,
  SETTINGS_CONFIG_SNACK_CLOSE,
} from '../../../core/i18n/settings-config-labels';

@Component({
  selector: 'sh-prompts-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>{{ pageTitle }}</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-form-field appearance="outline"><mat-label>{{ fieldPreselection }}</mat-label><textarea matInput rows="4" formControlName="preselection"></textarea></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>{{ fieldAnalysis }}</mat-label><textarea matInput rows="4" formControlName="analysis"></textarea></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>{{ fieldInterview }}</mat-label><textarea matInput rows="3" formControlName="interview"></textarea></mat-form-field>
      <button mat-flat-button color="primary" type="submit">{{ saveLabel }}</button>
    </form>
  `,
  styles: `
    h3 { margin: 0 0 16px; font-size: 1.1rem; }
    .config-form { display: flex; flex-direction: column; gap: 12px; max-width: 600px; }
  `,
})
export class PromptsConfigComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly pageTitle = PROMPTS_PAGE_TITLE;
  readonly fieldPreselection = PROMPTS_FIELD_PRESELECTION;
  readonly fieldAnalysis = PROMPTS_FIELD_ANALYSIS;
  readonly fieldInterview = PROMPTS_FIELD_INTERVIEW;
  readonly saveLabel = PROMPTS_SAVE_BUTTON;

  readonly form = this.fb.nonNullable.group({
    preselection: ['Evalúa candidatos según requisitos obligatorios y deseables de la posición.'],
    analysis: ['Genera un análisis comparativo de los candidatos preseleccionados.'],
    interview: ['Sugiere preguntas de entrevista basadas en el perfil.'],
  });

  save(): void {
    this.snack.open(PROMPTS_SAVE_SUCCESS, SETTINGS_CONFIG_SNACK_CLOSE, { duration: 2500 });
  }
}
