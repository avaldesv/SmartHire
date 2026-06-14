import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'sh-interviews-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>Configuración de entrevistas</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-form-field appearance="outline"><mat-label>Duración default (min)</mat-label><input matInput type="number" formControlName="durationMin" /></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Modalidad</mat-label><mat-select formControlName="modality"><mat-option value="presencial">Presencial</mat-option><mat-option value="virtual">Virtual</mat-option><mat-option value="mixta">Mixta</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Recordatorio (horas antes)</mat-label><input matInput type="number" formControlName="reminderHours" /></mat-form-field>
      <button mat-flat-button color="primary" type="submit">Guardar</button>
    </form>
  `,
  styles: `
    h3 { margin: 0 0 16px; font-size: 1.1rem; }
    .config-form { display: flex; flex-direction: column; gap: 12px; max-width: 400px; }
  `,
})
export class InterviewsConfigComponent {
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly form = this.fb.nonNullable.group({
    durationMin: [45],
    modality: ['virtual'],
    reminderHours: [24],
  });

  save(): void {
    this.snack.open('Configuración de entrevistas guardada', 'Cerrar', { duration: 2500 });
  }
}
