import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CandidateApiService } from '../../../core/services/candidate-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { CreateCandidateRequest } from '../../../shared/models/candidate.model';
import {
  CatalogCountry,
  CatalogMunicipality,
  CatalogNeighborhood,
  CatalogState,
} from '../../../shared/models/catalog-geography.model';

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
  private readonly candidateService = inject(CandidateApiService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  isEdit = false;
  loading = false;
  saving = false;
  candidateId: number | null = null;

  countries: CatalogCountry[] = [];
  states: CatalogState[] = [];
  municipalities: CatalogMunicipality[] = [];
  neighborhoods: CatalogNeighborhood[] = [];

  loadingGeo = {
    countries: false,
    states: false,
    municipalities: false,
    neighborhoods: false,
  };

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    curp: [''],
    rfc: [''],
    nss: [''],
    gender: [''],
    countryId: [null as number | null, Validators.required],
    stateId: [{ value: null as number | null, disabled: true }, Validators.required],
    municipalityId: [{ value: null as number | null, disabled: true }, Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{4,5}$/)]],
    neighborhoodId: [{ value: null as number | null, disabled: true }, Validators.required],
    country: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    desiredSalary: [0],
    source: ['Carga Manual', Validators.required],
    active: [true],
  });

  ngOnInit(): void {
    this.loadCountries();
    this.setupCascade();
    this.loadCandidateIfEdit();
  }

  private loadCountries(): void {
    this.loadingGeo.countries = true;
    this.geographyService.listCountries().subscribe({
      next: (items) => {
        this.countries = items;
        this.loadingGeo.countries = false;
        const mexico = items.find((c) => c.code === 'MX');
        if (mexico && !this.isEdit) {
          this.form.patchValue({ countryId: mexico.id, country: mexico.name });
          this.form.controls.stateId.enable();
          this.loadStates(mexico.id);
        }
      },
      error: () => {
        this.loadingGeo.countries = false;
        this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private setupCascade(): void {
    this.form.controls.countryId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((countryId) => {
      this.resetStates();
      this.resetMunicipalities();
      this.resetNeighborhoods();
      if (countryId == null) {
        this.form.controls.stateId.disable();
        return;
      }
      const country = this.countries.find((c) => c.id === countryId);
      this.form.patchValue({ country: country?.name ?? '' }, { emitEvent: false });
      this.form.controls.stateId.enable();
      this.loadStates(countryId);
    });

    this.form.controls.stateId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((stateId) => {
      this.resetMunicipalities();
      this.resetNeighborhoods();
      if (stateId == null) {
        this.form.controls.municipalityId.disable();
        return;
      }
      const state = this.states.find((s) => s.id === stateId);
      this.form.patchValue({ state: state?.name ?? '' }, { emitEvent: false });
      this.form.controls.municipalityId.enable();
      this.loadMunicipalities(stateId);
    });

    this.form.controls.municipalityId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((municipalityId) => {
      this.resetNeighborhoods();
      if (municipalityId == null) {
        return;
      }
      const municipality = this.municipalities.find((m) => m.id === municipalityId);
      this.form.patchValue({ city: municipality?.name ?? '' }, { emitEvent: false });
      const postalCode = this.form.controls.postalCode.value;
      if (postalCode?.length >= 4) {
        this.loadNeighborhoods(postalCode);
      }
    });

    this.form.controls.postalCode.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((cp) => !!cp && cp.length >= 4),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((postalCode) => {
        this.resetNeighborhoods();
        this.loadNeighborhoods(postalCode);
      });

    this.form.controls.neighborhoodId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((neighborhoodId) => {
      if (neighborhoodId == null) {
        return;
      }
      const neighborhood = this.neighborhoods.find((n) => n.id === neighborhoodId);
      if (neighborhood && !this.form.controls.city.value) {
        this.form.patchValue({ city: neighborhood.name }, { emitEvent: false });
      }
    });
  }

  private loadStates(countryId: number): void {
    this.loadingGeo.states = true;
    this.geographyService.listStates(countryId).subscribe({
      next: (items) => {
        this.states = items;
        this.loadingGeo.states = false;
      },
      error: () => {
        this.loadingGeo.states = false;
        this.snack.open('No se pudieron cargar los estados', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private loadMunicipalities(stateId: number): void {
    this.loadingGeo.municipalities = true;
    this.geographyService.listMunicipalities(stateId).subscribe({
      next: (items) => {
        this.municipalities = items;
        this.loadingGeo.municipalities = false;
      },
      error: () => {
        this.loadingGeo.municipalities = false;
        this.snack.open('No se pudieron cargar los municipios', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private loadNeighborhoods(postalCode: string): void {
    this.loadingGeo.neighborhoods = true;
    this.form.controls.neighborhoodId.disable();
    this.geographyService.listNeighborhoodsByPostalCode(postalCode).subscribe({
      next: (items) => {
        this.neighborhoods = items;
        this.loadingGeo.neighborhoods = false;
        if (items.length) {
          this.form.controls.neighborhoodId.enable();
        } else {
          this.snack.open('Sin colonias para ese código postal', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => {
        this.loadingGeo.neighborhoods = false;
        this.snack.open('No se pudieron cargar las colonias', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private resetStates(): void {
    this.states = [];
    this.form.patchValue({ stateId: null, state: '' }, { emitEvent: false });
  }

  private resetMunicipalities(): void {
    this.municipalities = [];
    this.form.controls.municipalityId.disable();
    this.form.patchValue({ municipalityId: null }, { emitEvent: false });
  }

  private resetNeighborhoods(): void {
    this.neighborhoods = [];
    this.form.controls.neighborhoodId.disable();
    this.form.patchValue({ neighborhoodId: null }, { emitEvent: false });
  }

  private loadCandidateIfEdit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.candidateId = +id;
      this.loading = true;
      this.candidateService.getById(this.candidateId).subscribe({
        next: (c) => {
          this.form.patchValue({
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone ?? '',
            curp: c.curp ?? '',
            rfc: c.rfc ?? '',
            nss: c.nss ?? '',
            country: c.country,
            city: c.city ?? '',
            state: c.state,
            countryId: c.countryId,
            stateId: c.stateId,
            desiredSalary: c.desiredSalary ?? 0,
            source: c.source === 'MANUAL' ? 'Carga Manual' : (c.source ?? 'Carga Manual'),
            active: c.isActive,
          });
          if (c.countryId) {
            this.form.controls.stateId.enable();
            this.loadStates(c.countryId);
          }
          if (c.stateId) {
            this.form.controls.municipalityId.enable();
            this.loadMunicipalities(c.stateId);
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open('No se pudo cargar el candidato', 'Cerrar', { duration: 4000 });
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = this.buildPayload();
    const request$ = this.isEdit && this.candidateId
      ? this.candidateService.update(this.candidateId, { ...payload, isActive: this.form.controls.active.value })
      : this.candidateService.create(payload);
    request$.subscribe({
      next: () => {
        this.saving = false;
        this.snack.open(this.isEdit ? 'Candidato actualizado' : 'Candidato creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/candidates']);
      },
      error: () => {
        this.saving = false;
        this.snack.open('No se pudo guardar el candidato', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private buildPayload(): CreateCandidateRequest {
    const v = this.form.getRawValue();
    return {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone || null,
      curp: v.curp || null,
      rfc: v.rfc || null,
      nss: v.nss || null,
      countryId: v.countryId,
      stateId: v.stateId,
      city: v.city || null,
      desiredSalary: v.desiredSalary > 0 ? v.desiredSalary : null,
      source: v.source === 'Carga Manual' ? 'MANUAL' : v.source,
    };
  }

  cancel(): void {
    this.router.navigate(['/candidates']);
  }
}
