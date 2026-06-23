import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CandidateBeneficiaryApiService } from '../../../core/services/candidate-beneficiary-api.service';
import { CatalogKinshipService } from '../../../core/services/catalog-kinship.service';
import { CatalogKinship } from '../../../shared/models/catalog-kinship.model';
import {
  BeneficiaryType,
  CandidateBeneficiaryPayload,
} from '../../../shared/models/candidate-beneficiary.model';

type WizardBeneficiaryType = 'Primario' | 'Contingente';

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
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './beneficiary-wizard.component.html',
  styleUrl: './beneficiary-wizard.component.scss',
})
export class BeneficiaryWizardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly beneficiaryApi = inject(CandidateBeneficiaryApiService);
  private readonly kinshipService = inject(CatalogKinshipService);

  readonly candidateId = Number(this.route.snapshot.paramMap.get('id'));
  readonly beneficiaryId = this.route.snapshot.queryParamMap.get('beneficiaryId');
  readonly isEdit = !!this.beneficiaryId;

  loading = true;
  saving = false;
  kinships: CatalogKinship[] = [];

  readonly step1 = this.fb.nonNullable.group({
    type: ['Primario' as WizardBeneficiaryType, Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    kinshipId: [null as number | null, Validators.required],
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

  ngOnInit(): void {
    if (!this.candidateId || Number.isNaN(this.candidateId)) {
      this.snack.open('Candidato inválido', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/candidates']);
      return;
    }
    this.loadKinships();
  }

  private loadKinships(): void {
    this.kinshipService.list(0, 100).subscribe({
      next: ({ items }) => {
        this.kinships = items.filter((k) => k.isActive);
        if (this.isEdit && this.beneficiaryId) {
          this.loadBeneficiary(Number(this.beneficiaryId));
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar el catálogo de parentesco', 'Cerrar', { duration: 3500 });
      },
    });
  }

  private loadBeneficiary(id: number): void {
    this.beneficiaryApi.getById(this.candidateId, id).subscribe({
      next: (row) => {
        this.step1.patchValue({
          type: row.beneficiaryType === 'CONTINGENT' ? 'Contingente' : 'Primario',
          firstName: row.firstName,
          lastName: row.lastName,
          kinshipId: row.kinshipId,
        });
        this.step2.patchValue({
          irrevocable: row.irrevocable,
          age: row.age ?? 0,
          percent: row.percent,
          country: row.country ?? 'México',
        });
        this.step3.patchValue({
          phone: row.phone ?? '',
          email: row.email ?? '',
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar el beneficiario', 'Cerrar', { duration: 3500 });
        this.router.navigate(['/candidates', this.candidateId]);
      },
    });
  }

  save(): void {
    if (this.step1.invalid || this.step2.invalid || this.step3.invalid) {
      [this.step1, this.step2, this.step3].forEach((f) => f.markAllAsTouched());
      this.snack.open('Complete todos los pasos', 'Cerrar', { duration: 3000 });
      return;
    }

    const payload = this.buildPayload();
    this.saving = true;
    const request$ =
      this.isEdit && this.beneficiaryId
        ? this.beneficiaryApi.update(this.candidateId, Number(this.beneficiaryId), payload)
        : this.beneficiaryApi.create(this.candidateId, payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.snack.open(this.isEdit ? 'Beneficiario actualizado' : 'Beneficiario registrado', 'Cerrar', {
          duration: 3000,
        });
        this.router.navigate(['/candidates', this.candidateId]);
      },
      error: (err) => {
        this.saving = false;
        const message =
          err?.error?.message ?? err?.error?.detail ?? 'No se pudo guardar el beneficiario';
        this.snack.open(message, 'Cerrar', { duration: 4000 });
      },
    });
  }

  private buildPayload(): CandidateBeneficiaryPayload {
    const s1 = this.step1.getRawValue();
    const s2 = this.step2.getRawValue();
    const s3 = this.step3.getRawValue();
    const beneficiaryType: BeneficiaryType = s1.type === 'Contingente' ? 'CONTINGENT' : 'PRIMARY';
    return {
      beneficiaryType,
      firstName: s1.firstName.trim(),
      lastName: s1.lastName.trim(),
      secondLastName: null,
      kinshipId: s1.kinshipId,
      irrevocable: s2.irrevocable,
      age: s2.age,
      percent: s2.percent,
      country: s2.country.trim() || null,
      phone: s3.phone.trim() || null,
      email: s3.email.trim() || null,
      isActive: true,
    };
  }

  cancel(): void {
    this.router.navigate(['/candidates', this.candidateId]);
  }
}
