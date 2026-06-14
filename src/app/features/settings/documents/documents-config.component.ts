import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'sh-documents-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>Documentos requeridos</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-checkbox formControlName="ine">INE obligatorio</mat-checkbox>
      <mat-checkbox formControlName="curp">CURP obligatorio</mat-checkbox>
      <mat-checkbox formControlName="rfc">RFC obligatorio</mat-checkbox>
      <mat-checkbox formControlName="comprobante">Comprobante de domicilio</mat-checkbox>
      <mat-form-field appearance="outline"><mat-label>Días para entrega</mat-label><input matInput type="number" formControlName="deadlineDays" /></mat-form-field>
      <button mat-flat-button color="primary" type="submit">Guardar</button>
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

  readonly form = this.fb.nonNullable.group({
    ine: [true],
    curp: [true],
    rfc: [false],
    comprobante: [true],
    deadlineDays: [5],
  });

  save(): void {
    this.snack.open('Configuración de documentos guardada', 'Cerrar', { duration: 2500 });
  }
}
