import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'sh-system-config',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h3>Configuración del sistema</h3>
    <form [formGroup]="form" (ngSubmit)="save()" class="sh-card config-form">
      <mat-form-field appearance="outline"><mat-label>Nombre de la instancia</mat-label><input matInput formControlName="instanceName" /></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Zona horaria</mat-label><mat-select formControlName="timezone"><mat-option value="America/Mexico_City">America/Mexico_City</mat-option></mat-select></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Idioma default</mat-label><mat-select formControlName="locale"><mat-option value="es-MX">Español (México)</mat-option></mat-select></mat-form-field>
      <mat-slide-toggle formControlName="maintenanceMode">Modo mantenimiento</mat-slide-toggle>
      <mat-slide-toggle formControlName="debugLogs">Logs de depuración</mat-slide-toggle>
      <button mat-flat-button color="primary" type="submit">Guardar configuración</button>
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

  readonly form = this.fb.nonNullable.group({
    instanceName: ['Smart Hire MX'],
    timezone: ['America/Mexico_City'],
    locale: ['es-MX'],
    maintenanceMode: [false],
    debugLogs: [false],
  });

  save(): void {
    this.snack.open('Configuración del sistema guardada', 'Cerrar', { duration: 2500 });
  }
}
