import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { distinctUntilChanged, filter } from 'rxjs';
import { CatalogGeographyService } from '../../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../../core/services/catalog-position.service';
import { ReferenceDataService } from '../../../../core/services/reference-data.service';
import { CatalogCountry } from '../../../../shared/models/catalog-geography.model';
import { CatalogCoverageType } from '../../../../shared/models/catalog-position.model';
import {
  REQUISITION_SCOPE_COUNTRY,
  REQUISITION_SCOPE_COVERAGE,
  REQUISITION_SCOPE_HINT,
  REQUISITION_SCOPE_LOADING,
  REQUISITION_WIZARD_CANCEL,
  REQUISITION_WIZARD_CONTINUE,
  REQUISITION_WIZARD_NEW_TITLE,
} from '../requisition-wizard-labels';

export interface RequisitionScopeDialogData {
  countryId?: number | null;
  coverageTypeId?: number | null;
}

export interface RequisitionScopeDialogResult {
  countryId: number;
  coverageTypeId: number;
}

@Component({
  selector: 'sh-requisition-scope-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './requisition-scope-dialog.component.html',
  styleUrl: './requisition-scope-dialog.component.scss',
})
export class RequisitionScopeDialogComponent implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<RequisitionScopeDialogComponent, RequisitionScopeDialogResult | null>,
  );
  private readonly data = inject<RequisitionScopeDialogData>(MAT_DIALOG_DATA, { optional: true });
  private readonly fb = inject(FormBuilder);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly catalogService = inject(CatalogPositionService);
  private readonly referenceData = inject(ReferenceDataService);
  private readonly snack = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  countries: CatalogCountry[] = [];
  coverageTypes: CatalogCoverageType[] = [];
  loadingCountries = false;
  loadingCoverage = false;
  loadingTenant = false;

  readonly labels = {
    newTitle: REQUISITION_WIZARD_NEW_TITLE,
    hint: REQUISITION_SCOPE_HINT,
    country: REQUISITION_SCOPE_COUNTRY,
    coverage: REQUISITION_SCOPE_COVERAGE,
    loading: REQUISITION_SCOPE_LOADING,
    cancel: REQUISITION_WIZARD_CANCEL,
    continue: REQUISITION_WIZARD_CONTINUE,
  };

  readonly form = this.fb.nonNullable.group({
    countryId: [null as number | null, Validators.required],
    coverageTypeId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.form.controls.coverageTypeId.disable({ emitEvent: false });
    this.form.controls.countryId.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((id): id is number => id != null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((countryId) => {
        this.form.controls.coverageTypeId.reset(null, { emitEvent: false });
        this.form.controls.coverageTypeId.disable({ emitEvent: false });
        this.loadCoverageTypes(countryId);
      });

    this.loadCountriesAndPrefill();
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  continue(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { countryId, coverageTypeId } = this.form.getRawValue();
    this.dialogRef.close({ countryId: countryId!, coverageTypeId: coverageTypeId! });
  }

  private loadCountriesAndPrefill(): void {
    this.loadingCountries = true;
    this.loadingTenant = true;
    this.geographyService.listCountries().subscribe({
      next: (items) => {
        this.countries = items;
        this.loadingCountries = false;
        this.prefillCountry();
      },
      error: () => {
        this.loadingCountries = false;
        this.loadingTenant = false;
        this.snack.open('No se pudieron cargar los países', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private prefillCountry(): void {
    const initialCountryId = this.data?.countryId ?? null;
    if (initialCountryId != null) {
      this.loadingTenant = false;
      this.form.patchValue({ countryId: initialCountryId });
      this.loadCoverageTypes(initialCountryId, this.data?.coverageTypeId ?? null);
      return;
    }

    this.referenceData.getUserTenantContext().subscribe({
      next: (ctx) => {
        this.loadingTenant = false;
        const tenantCountryId = ctx.countryId;
        if (tenantCountryId != null && this.countries.some((c) => c.id === tenantCountryId)) {
          this.form.patchValue({ countryId: tenantCountryId });
          this.loadCoverageTypes(tenantCountryId, this.data?.coverageTypeId ?? null);
          return;
        }
        const mexico = this.countries.find((c) => c.code === 'MX');
        if (mexico) {
          this.form.patchValue({ countryId: mexico.id });
          this.loadCoverageTypes(mexico.id, this.data?.coverageTypeId ?? null);
        }
      },
      error: () => {
        this.loadingTenant = false;
        const mexico = this.countries.find((c) => c.code === 'MX');
        if (mexico) {
          this.form.patchValue({ countryId: mexico.id });
          this.loadCoverageTypes(mexico.id, this.data?.coverageTypeId ?? null);
        }
      },
    });
  }

  private loadCoverageTypes(countryId: number, preferredCoverageId: number | null = null): void {
    this.loadingCoverage = true;
    this.catalogService.listCoverageTypes(countryId).subscribe({
      next: (items) => {
        this.coverageTypes = items;
        this.loadingCoverage = false;
        this.form.controls.coverageTypeId.enable({ emitEvent: false });
        if (preferredCoverageId != null && items.some((c) => c.id === preferredCoverageId)) {
          this.form.patchValue({ coverageTypeId: preferredCoverageId });
        }
      },
      error: () => {
        this.coverageTypes = [];
        this.loadingCoverage = false;
        this.form.controls.coverageTypeId.disable({ emitEvent: false });
        this.snack.open('No se pudieron cargar los tipos de cobertura', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
