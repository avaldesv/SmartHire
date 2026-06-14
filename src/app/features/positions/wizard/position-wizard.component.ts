import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'sh-position-wizard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    PageHeaderComponent,
  ],
  templateUrl: './position-wizard.component.html',
  styleUrl: './position-wizard.component.scss',
})
export class PositionWizardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly clientForm = this.fb.nonNullable.group({
    clientCountry: ['México', Validators.required],
    brand: ['Smart Hire MX', Validators.required],
    recruitmentType: ['Reclutamiento Puro', Validators.required],
    coverageCategory: ['Operativo', Validators.required],
    ot: ['', Validators.required],
    clientKey: ['', Validators.required],
    legalName: ['', Validators.required],
    contactName: ['', Validators.required],
    clientPosition: ['', Validators.required],
  });

  readonly generalForm = this.fb.nonNullable.group({
    generalNotes: [''],
    contractType: ['Indeterminado', Validators.required],
    shift: ['Diurno', Validators.required],
    salary: [0, [Validators.required, Validators.min(1)]],
    workDays: ['L-V', Validators.required],
  });

  readonly manpowerForm = this.fb.nonNullable.group({
    positionsCount: [1, [Validators.required, Validators.min(1)]],
    headcount: [1, Validators.required],
    startDate: ['', Validators.required],
  });

  readonly hiringForm = this.fb.nonNullable.group({
    contractType: ['Temporal', Validators.required],
    benefits: ['Estándar', Validators.required],
    probationDays: [30, Validators.required],
  });

  readonly languagesForm = this.fb.nonNullable.group({
    primaryLanguage: ['Español', Validators.required],
    secondaryLanguage: [''],
    levelRequired: ['Intermedio', Validators.required],
  });

  readonly addressForm = this.fb.nonNullable.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
  });

  readonly requirementsForm = this.fb.nonNullable.group({
    requirements: ['', Validators.required],
    education: ['Licenciatura', Validators.required],
    experienceYears: [2, Validators.required],
  });

  readonly documentsForm = this.fb.nonNullable.group({
    ine: [true],
    curp: [true],
    rfc: [false],
    comprobante: [true],
  });

  exportJson(): void {
    const payload = {
      ...this.clientForm.getRawValue(),
      ...this.generalForm.getRawValue(),
      ...this.manpowerForm.getRawValue(),
      ...this.hiringForm.getRawValue(),
      ...this.languagesForm.getRawValue(),
      ...this.addressForm.getRawValue(),
      ...this.requirementsForm.getRawValue(),
      documents: Object.entries(this.documentsForm.getRawValue())
        .filter(([, v]) => v)
        .map(([k]) => k),
    };
    console.log('JSON export:', payload);
    this.snack.open('JSON exportado a consola', 'Cerrar', { duration: 3000 });
  }

  sendAts(): void {
    this.snack.open('Enviado a ATS (simulado)', 'Cerrar', { duration: 3000 });
  }

  create(): void {
    const forms = [
      this.clientForm,
      this.generalForm,
      this.manpowerForm,
      this.hiringForm,
      this.languagesForm,
      this.addressForm,
      this.requirementsForm,
    ];
    if (forms.some((f) => f.invalid)) {
      forms.forEach((f) => f.markAllAsTouched());
      this.snack.open('Complete los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }
    this.snack.open('Requisición creada correctamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/positions']);
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}
