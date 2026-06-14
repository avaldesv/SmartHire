import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'sh-beneficiary-wizard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    PageHeaderComponent,
  ],
  templateUrl: './beneficiary-wizard.component.html',
  styleUrl: './beneficiary-wizard.component.scss',
})
export class BeneficiaryWizardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly candidateId = this.route.snapshot.paramMap.get('id');

  readonly step1 = this.fb.nonNullable.group({
    type: ['Primario' as const, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    relationship: ['', Validators.required],
  });

  readonly step2 = this.fb.nonNullable.group({
    irrevocable: [false],
    age: [0, [Validators.required, Validators.min(0)]],
    percent: [100, [Validators.required, Validators.min(1), Validators.max(100)]],
    country: ['México', Validators.required],
  });

  readonly step3 = this.fb.nonNullable.group({
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  save(): void {
    if (this.step1.invalid || this.step2.invalid || this.step3.invalid) {
      [this.step1, this.step2, this.step3].forEach((f) => f.markAllAsTouched());
      this.snack.open('Complete todos los pasos', 'Cerrar', { duration: 3000 });
      return;
    }
    this.snack.open('Beneficiario registrado', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/candidates', this.candidateId]);
  }

  cancel(): void {
    this.router.navigate(['/candidates', this.candidateId]);
  }
}
