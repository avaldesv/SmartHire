import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateService } from '../../../mock/services/candidate.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'sh-candidate-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './candidate-form.component.html',
  styleUrl: './candidate-form.component.scss',
})
export class CandidateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly candidateService = inject(CandidateService);
  private readonly snack = inject(MatSnackBar);

  isEdit = false;
  loading = false;
  candidateId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    curp: [''],
    rfc: [''],
    nss: [''],
    gender: [''],
    country: ['México', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    desiredSalary: [0],
    source: ['Carga Manual', Validators.required],
    active: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.candidateId = +id;
      this.loading = true;
      this.candidateService.getById(this.candidateId).subscribe((c) => {
        if (c) {
          this.form.patchValue({
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone,
            curp: c.curp ?? '',
            rfc: c.rfc ?? '',
            nss: c.nss ?? '',
            gender: c.gender ?? '',
            country: c.country,
            city: c.city,
            state: c.state,
            desiredSalary: c.desiredSalary ?? 0,
            source: c.source,
            active: c.active,
          });
        }
        this.loading = false;
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const msg = this.isEdit ? 'Candidato actualizado' : 'Candidato creado';
    this.snack.open(msg, 'Cerrar', { duration: 3000 });
    this.router.navigate(['/candidates']);
  }

  cancel(): void {
    this.router.navigate(['/candidates']);
  }
}
