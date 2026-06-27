import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { PermissionService } from '../../../core/services/permission.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogPipelineStageService } from '../../../core/services/catalog-pipeline-stage.service';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogPipelineStage } from '../../../shared/models/catalog-pipeline-stage.model';
import { TenantDataScope } from '../../../shared/models/tenant-data-scope.model';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { canEditScopedRecord } from '../../../shared/utils/tenant-scope.util';

@Component({
  selector: 'sh-pipeline-stages',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatRadioModule,
    TableRowActionsComponent,
  ],
  templateUrl: './pipeline-stages.component.html',
  styleUrl: './pipeline-stages.component.scss',
})
export class PipelineStagesComponent implements OnInit {
  private readonly pipelineStageService = inject(CatalogPipelineStageService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly isGlobalAdmin = computed(() => this.permissions.isGlobalAdmin());

  loading = true;
  saving = false;
  reordering = false;
  deletingId: number | null = null;
  data: CatalogPipelineStage[] = [];
  countries: CatalogCountry[] = [];
  editingStageId: number | null = null;
  showForm = false;

  readonly columns = ['order', 'name', 'color', 'code', 'active', 'reorder', 'actions'];

  readonly stageForm = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
    code: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    sortOrder: [1, [Validators.required, Validators.min(1)]],
    colorHex: ['#9E9E9E'],
    isActive: [true],
  });

  readonly createScopeForm = this.fb.nonNullable.group({
    scope: ['TENANT' as TenantDataScope],
  });

  ngOnInit(): void {
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.load();
      },
      error: () => {
        this.load();
      },
    });
  }

  load(): void {
    this.loading = true;
    this.pipelineStageService.list().subscribe({
      next: ({ items }) => {
        this.data = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar las etapas del pipeline', 'Cerrar', { duration: 4000 });
      },
    });
  }

  canEditRecord(companyId?: number | null): boolean {
    return canEditScopedRecord(companyId, this.isGlobalAdmin());
  }

  openCreate(): void {
    const nextOrder = this.data.length > 0 ? Math.max(...this.data.map((s) => s.sortOrder)) + 1 : 1;
    this.stageForm.reset({
      countryId: this.countries[0]?.id ?? null,
      code: '',
      name: '',
      description: '',
      sortOrder: nextOrder,
      colorHex: '#9E9E9E',
      isActive: true,
    });
    this.createScopeForm.reset({ scope: 'TENANT' });
    this.editingStageId = null;
    this.showForm = true;
  }

  openEdit(stage: CatalogPipelineStage): void {
    this.editingStageId = stage.id;
    this.showForm = true;
    this.stageForm.patchValue({
      countryId: stage.countryId,
      code: stage.code,
      name: stage.name,
      description: stage.description ?? '',
      sortOrder: stage.sortOrder,
      colorHex: stage.colorHex || '#9E9E9E',
      isActive: stage.isActive,
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingStageId = null;
  }

  save(): void {
    if (this.stageForm.invalid) {
      this.stageForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const value = this.stageForm.getRawValue();
    const payload = {
      countryId: value.countryId,
      code: value.code,
      name: value.name,
      description: value.description || null,
      sortOrder: value.sortOrder,
      colorHex: value.colorHex || '#9E9E9E',
      isActive: value.isActive,
    };

    const request$ =
      this.editingStageId != null
        ? this.pipelineStageService.update(this.editingStageId, payload)
        : this.pipelineStageService.create({
            ...payload,
            scope: this.isGlobalAdmin() ? this.createScopeForm.getRawValue().scope : 'TENANT',
          });

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingStageId = null;
        this.snack.open('Etapa guardada', 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.saving = false;
        this.snack.open('No se pudo guardar la etapa', 'Cerrar', { duration: 4000 });
      },
    });
  }

  deleteStage(stage: CatalogPipelineStage): void {
    if (!confirm(`¿Eliminar la etapa "${stage.name}"?`)) {
      return;
    }
    this.deletingId = stage.id;
    this.pipelineStageService.delete(stage.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.snack.open('Etapa eliminada', 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open('No se pudo eliminar la etapa', 'Cerrar', { duration: 4000 });
      },
    });
  }

  moveStage(stage: CatalogPipelineStage, direction: -1 | 1): void {
    const index = this.data.findIndex((item) => item.id === stage.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= this.data.length) {
      return;
    }

    const target = this.data[targetIndex];
    const payload = [
      { id: stage.id, sortOrder: target.sortOrder },
      { id: target.id, sortOrder: stage.sortOrder },
    ];

    this.reordering = true;
    this.pipelineStageService.reorder(payload).subscribe({
      next: () => {
        this.reordering = false;
        this.load();
      },
      error: () => {
        this.reordering = false;
        this.snack.open('No se pudo reordenar las etapas', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
