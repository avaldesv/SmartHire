import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'sh-cvs-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>Configuración de CVs</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-form-field appearance="outline"><mat-label>Formato aceptado</mat-label><mat-select formControlName="format"><mat-option value="pdf">PDF</mat-option><mat-option value="docx">DOCX</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Tamaño máximo (MB)</mat-label><input matInput type="number" formControlName="maxSizeMb" /></mat-form-field>
      <mat-slide-toggle formControlName="autoParse">Parseo automático con IA</mat-slide-toggle>
      <mat-slide-toggle formControlName="requirePhoto">Requerir fotografía</mat-slide-toggle>
      <button mat-flat-button color="primary" type="submit">Guardar</button>
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

  readonly form = this.fb.nonNullable.group({
    format: ['pdf'],
    maxSizeMb: [5],
    autoParse: [true],
    requirePhoto: [false],
  });

  save(): void {
    this.snack.open('Configuración de CVs guardada', 'Cerrar', { duration: 2500 });
  }
}
