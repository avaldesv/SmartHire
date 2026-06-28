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
import {
  PIPELINE_STAGES_CANCEL,
  PIPELINE_STAGES_COLUMN_COLOR,
  PIPELINE_STAGES_COLUMN_ORDER,
  PIPELINE_STAGES_COLUMN_REORDER,
  PIPELINE_STAGES_COLUMN_STAGE,
  PIPELINE_STAGES_DELETE_ERROR,
  PIPELINE_STAGES_DELETE_SUCCESS,
  PIPELINE_STAGES_EDIT_TITLE,
  PIPELINE_STAGES_FIELD_ACTIVE,
  PIPELINE_STAGES_FIELD_CODE,
  PIPELINE_STAGES_FIELD_COLOR,
  PIPELINE_STAGES_FIELD_COUNTRY,
  PIPELINE_STAGES_FIELD_DESCRIPTION,
  PIPELINE_STAGES_FIELD_ORDER,
  PIPELINE_STAGES_FIELD_STAGE,
  PIPELINE_STAGES_LOAD_ERROR,
  PIPELINE_STAGES_MOVE_DOWN,
  PIPELINE_STAGES_MOVE_UP,
  PIPELINE_STAGES_NEW_BUTTON,
  PIPELINE_STAGES_NEW_TITLE,
  PIPELINE_STAGES_NO,
  PIPELINE_STAGES_PAGE_TITLE,
  PIPELINE_STAGES_RECORD_SCOPE,
  PIPELINE_STAGES_REORDER_ERROR,
  PIPELINE_STAGES_SAVE,
  PIPELINE_STAGES_SAVE_ERROR,
  PIPELINE_STAGES_SAVE_SUCCESS,
  PIPELINE_STAGES_SAVING,
  PIPELINE_STAGES_SCOPE_GLOBAL,
  PIPELINE_STAGES_SCOPE_TENANT,
  PIPELINE_STAGES_SNACK_CLOSE,
  PIPELINE_STAGES_YES,
  pipelineStagesDeleteConfirm,
} from '../../../core/i18n/pipeline-stages-labels';

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

  readonly pageTitle = PIPELINE_STAGES_PAGE_TITLE;
  readonly newButton = PIPELINE_STAGES_NEW_BUTTON;
  readonly editTitle = PIPELINE_STAGES_EDIT_TITLE;
  readonly newTitle = PIPELINE_STAGES_NEW_TITLE;
  readonly recordScope = PIPELINE_STAGES_RECORD_SCOPE;
  readonly scopeTenant = PIPELINE_STAGES_SCOPE_TENANT;
  readonly scopeGlobal = PIPELINE_STAGES_SCOPE_GLOBAL;
  readonly fieldCountry = PIPELINE_STAGES_FIELD_COUNTRY;
  readonly fieldCode = PIPELINE_STAGES_FIELD_CODE;
  readonly fieldStage = PIPELINE_STAGES_FIELD_STAGE;
  readonly fieldDescription = PIPELINE_STAGES_FIELD_DESCRIPTION;
  readonly fieldOrder = PIPELINE_STAGES_FIELD_ORDER;
  readonly fieldColor = PIPELINE_STAGES_FIELD_COLOR;
  readonly fieldActive = PIPELINE_STAGES_FIELD_ACTIVE;
  readonly columnOrder = PIPELINE_STAGES_COLUMN_ORDER;
  readonly columnStage = PIPELINE_STAGES_COLUMN_STAGE;
  readonly columnColor = PIPELINE_STAGES_COLUMN_COLOR;
  readonly columnReorder = PIPELINE_STAGES_COLUMN_REORDER;
  readonly moveUpLabel = PIPELINE_STAGES_MOVE_UP;
  readonly moveDownLabel = PIPELINE_STAGES_MOVE_DOWN;
  readonly cancelLabel = PIPELINE_STAGES_CANCEL;
  readonly savingLabel = PIPELINE_STAGES_SAVING;
  readonly saveLabel = PIPELINE_STAGES_SAVE;
  readonly yesLabel = PIPELINE_STAGES_YES;
  readonly noLabel = PIPELINE_STAGES_NO;

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
        this.snack.open(PIPELINE_STAGES_LOAD_ERROR, PIPELINE_STAGES_SNACK_CLOSE, { duration: 4000 });
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
        this.snack.open(PIPELINE_STAGES_SAVE_SUCCESS, PIPELINE_STAGES_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.saving = false;
        this.snack.open(PIPELINE_STAGES_SAVE_ERROR, PIPELINE_STAGES_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  deleteStage(stage: CatalogPipelineStage): void {
    if (!confirm(pipelineStagesDeleteConfirm(stage.name))) {
      return;
    }
    this.deletingId = stage.id;
    this.pipelineStageService.delete(stage.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.snack.open(PIPELINE_STAGES_DELETE_SUCCESS, PIPELINE_STAGES_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(PIPELINE_STAGES_DELETE_ERROR, PIPELINE_STAGES_SNACK_CLOSE, { duration: 4000 });
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
        this.snack.open(PIPELINE_STAGES_REORDER_ERROR, PIPELINE_STAGES_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }
}
