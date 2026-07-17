import { Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { catchError, filter, forkJoin, Observable, of, tap } from 'rxjs';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  REQ_FORM_CONFIG_COL_ACTIONS,
  REQ_FORM_CONFIG_COL_COUNTRY,
  REQ_FORM_CONFIG_COL_COVERAGE,
  REQ_FORM_CONFIG_COL_NAME,
  REQ_FORM_CONFIG_COL_PUBLISHED_AT,
  REQ_FORM_CONFIG_COL_STATUS,
  REQ_FORM_CONFIG_COL_VERSION,
  REQ_FORM_CONFIG_CREATE_DRAFT,
  REQ_FORM_CONFIG_EMPTY_LIST,
  REQ_FORM_CONFIG_FIELD_COVERAGE,
  REQ_FORM_CONFIG_FIELD_COUNTRY,
  REQ_FORM_CONFIG_LIST_TITLE,
  REQ_FORM_CONFIG_LIST_ERROR,
  REQ_FORM_CONFIG_LOAD_ERROR,
  REQ_FORM_CONFIG_PAGE_TITLE,
  REQ_FORM_CONFIG_REFRESH_LIST,
  REQ_FORM_CONFIG_SELECT_COUNTRY_COVERAGE,
  REQ_FORM_CONFIG_SELECTORS_HINT,
  REQ_FORM_CONFIG_SNACK_CLOSE,
  REQ_FORM_CONFIG_STATUS_DRAFT,
  REQ_FORM_CONFIG_STATUS_PUBLISHED,
  REQ_FORM_CONFIG_STATUS_DEPRECATED,
  REQ_FORM_CONFIG_FIELD_STATUS,
  REQ_FORM_CONFIG_FILTER_ALL,
  REQ_FORM_CONFIG_CLONE,
  REQ_FORM_CONFIG_CLONE_SUCCESS,
  REQ_FORM_CONFIG_CLONE_ERROR,
  REQ_FORM_CONFIG_DELETE_ERROR,
  REQ_FORM_CONFIG_DELETE_SUCCESS,
  reqFormConfigDeleteConfirm,
} from '../../../core/i18n/requisition-form-config-labels';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../core/services/catalog-position.service';
import { PermissionService } from '../../../core/services/permission.service';
import { RequisitionFormConfigService } from '../../../core/services/requisition-form-config.service';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogCoverageType } from '../../../shared/models/catalog-position.model';
import {
  RequisitionFormConfigDetail,
  RequisitionFormConfigSummary,
  RequisitionFormConfigStatus,
} from '../../../shared/models/requisition-form.model';
import { RequisitionFormConfigCreateDialogComponent } from './requisition-form-config-create-dialog.component';
import { RequisitionFormConfigDialogComponent } from './requisition-form-config-dialog.component';

@Component({
  selector: 'sh-requisition-form-config',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    TableRowActionsComponent,
  ],
  templateUrl: './requisition-form-config.component.html',
  styleUrl: './requisition-form-config.component.scss',
})
export class RequisitionFormConfigComponent implements OnInit {
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly positionCatalogService = inject(CatalogPositionService);
  private readonly configService = inject(RequisitionFormConfigService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly pageTitle = REQ_FORM_CONFIG_PAGE_TITLE;
  readonly fieldCountry = REQ_FORM_CONFIG_FIELD_COUNTRY;
  readonly fieldCoverage = REQ_FORM_CONFIG_FIELD_COVERAGE;
  readonly createDraftLabel = REQ_FORM_CONFIG_CREATE_DRAFT;
  readonly refreshListLabel = REQ_FORM_CONFIG_REFRESH_LIST;
  readonly listTitle = REQ_FORM_CONFIG_LIST_TITLE;
  readonly emptyListLabel = REQ_FORM_CONFIG_EMPTY_LIST;
  readonly listErrorLabel = REQ_FORM_CONFIG_LIST_ERROR;
  readonly statusDraft = REQ_FORM_CONFIG_STATUS_DRAFT;
  readonly statusPublished = REQ_FORM_CONFIG_STATUS_PUBLISHED;
  readonly statusDeprecated = REQ_FORM_CONFIG_STATUS_DEPRECATED;
  readonly fieldStatus = REQ_FORM_CONFIG_FIELD_STATUS;
  readonly filterAllLabel = REQ_FORM_CONFIG_FILTER_ALL;
  readonly cloneLabel = REQ_FORM_CONFIG_CLONE;
  readonly selectorsHint = REQ_FORM_CONFIG_SELECTORS_HINT;
  readonly colCountry = REQ_FORM_CONFIG_COL_COUNTRY;
  readonly colCoverage = REQ_FORM_CONFIG_COL_COVERAGE;
  readonly colName = REQ_FORM_CONFIG_COL_NAME;
  readonly colVersion = REQ_FORM_CONFIG_COL_VERSION;
  readonly colStatus = REQ_FORM_CONFIG_COL_STATUS;
  readonly colPublishedAt = REQ_FORM_CONFIG_COL_PUBLISHED_AT;
  readonly colActions = REQ_FORM_CONFIG_COL_ACTIONS;
  readonly listColumns = ['name', 'country', 'coverage', 'version', 'status', 'publishedAt', 'actions'];

  readonly canWrite = computed(() => this.permissions.hasAuthority(AppPermissions.REQUISITION_FORM_CONFIG_WRITE));

  loadingList = false;
  listLoadError = false;
  openingEditor = false;
  deletingId: number | null = null;
  cloningId: number | null = null;
  countries: CatalogCountry[] = [];
  coverageTypes: CatalogCoverageType[] = [];
  private readonly coverageTypesByCountry = new Map<number, CatalogCoverageType[]>();
  configList: RequisitionFormConfigSummary[] = [];
  configListTotal = 0;
  listPageIndex = 0;
  listPageSize = 10;

  readonly selectorForm = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
    coverageTypeId: this.fb.control<number | null>(null),
    status: this.fb.control<RequisitionFormConfigStatus | null>(null),
  });

  ngOnInit(): void {
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
    });
    this.selectorForm.controls.countryId.valueChanges.subscribe((countryId) => {
      this.selectorForm.controls.coverageTypeId.setValue(null, { emitEvent: false });
      this.coverageTypes = [];
      this.listPageIndex = 0;
      if (countryId) {
        this.positionCatalogService.listCoverageTypes(countryId).subscribe({
          next: (items) => {
            this.coverageTypes = items;
            this.coverageTypesByCountry.set(countryId, items);
          },
        });
      }
      this.loadConfigsList();
    });
    this.selectorForm.controls.coverageTypeId.valueChanges.subscribe(() => {
      this.listPageIndex = 0;
      this.loadConfigsList();
    });
    this.selectorForm.controls.status.valueChanges.subscribe(() => {
      this.listPageIndex = 0;
      this.loadConfigsList();
    });
    this.loadConfigsList();
  }

  loadConfigsList(): void {
    const countryId = this.selectorForm.controls.countryId.value;
    const coverageTypeId = this.selectorForm.controls.coverageTypeId.value;
    const status = this.selectorForm.controls.status.value;
    const request: {
      filters: string[];
      ordersBy: string[];
      countryId?: number;
      coverageTypeId?: number;
      status?: string;
    } = {
      filters: [],
      ordersBy: ['version:desc'],
    };
    if (countryId != null) {
      request.countryId = countryId;
    }
    if (coverageTypeId != null) {
      request.coverageTypeId = coverageTypeId;
    }
    if (status != null) {
      request.status = status;
    }

    this.loadingList = true;
    this.listLoadError = false;
    this.configService.list(this.listPageIndex, this.listPageSize, request).subscribe({
      next: ({ items, total }) => {
        this.configList = items;
        this.configListTotal = total;
        this.prefetchCoverageNames(items);
        this.loadingList = false;
      },
      error: () => {
        this.configList = [];
        this.configListTotal = 0;
        this.listLoadError = true;
        this.loadingList = false;
        this.snack.open(REQ_FORM_CONFIG_LIST_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  onListPageChange(event: PageEvent): void {
    this.listPageIndex = event.pageIndex;
    this.listPageSize = event.pageSize;
    this.loadConfigsList();
  }

  createDraft(): void {
    const countryId = this.selectorForm.controls.countryId.value;
    const coverageTypeId = this.selectorForm.controls.coverageTypeId.value;
    if (!countryId || !coverageTypeId) {
      this.snack.open(REQ_FORM_CONFIG_SELECT_COUNTRY_COVERAGE, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3000 });
      return;
    }

    this.openingEditor = true;
    this.configService.list(0, 1, { countryId, coverageTypeId, status: 'DRAFT' }).subscribe({
      next: ({ items }) => {
        const draft = items[0];
        if (draft) {
          this.openConfig(draft);
          return;
        }
        this.openingEditor = false;
        const createRef = this.dialog.open(RequisitionFormConfigCreateDialogComponent, {
          width: '480px',
          maxWidth: '95vw',
          data: {
            countryId,
            coverageTypeId,
            countryName: this.countryName(countryId),
            coverageTypeName: this.coverageName(countryId, coverageTypeId),
          },
        });
        createRef.afterClosed().subscribe((result) => {
          if (!result?.name) {
            return;
          }
          this.openingEditor = true;
          this.configService.create({ countryId, coverageTypeId, name: result.name }).subscribe({
            next: (created) => {
              this.loadConfigsList();
              this.openEditorDialog(created);
            },
            error: () => this.handleOpenError(),
          });
        });
      },
      error: () => this.handleOpenError(),
    });
  }

  openConfig(summary: RequisitionFormConfigSummary): void {
    this.selectorForm.patchValue(
      {
        countryId: summary.countryId,
        coverageTypeId: summary.coverageTypeId,
      },
      { emitEvent: false },
    );
    if (!this.coverageTypesByCountry.has(summary.countryId)) {
      this.positionCatalogService.listCoverageTypes(summary.countryId).subscribe({
        next: (items) => {
          this.coverageTypes = items;
          this.coverageTypesByCountry.set(summary.countryId, items);
        },
      });
    } else {
      this.coverageTypes = this.coverageTypesByCountry.get(summary.countryId) ?? [];
    }

    this.openingEditor = true;
    this.configService.getById(summary.id).subscribe({
      next: (detail) => this.openEditorDialog(detail),
      error: () => this.handleOpenError(),
    });
  }

  deleteConfig(summary: RequisitionFormConfigSummary): void {
    if (!this.canWrite() || summary.status !== 'DRAFT') {
      return;
    }
    const statusLabel = this.statusLabelFor(summary.status);
    if (!confirm(reqFormConfigDeleteConfirm(summary.version, statusLabel))) {
      return;
    }
    this.deletingId = summary.id;
    this.configService.delete(summary.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.loadConfigsList();
        this.snack.open(REQ_FORM_CONFIG_DELETE_SUCCESS, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 2500 });
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(REQ_FORM_CONFIG_DELETE_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  cloneConfig(summary: RequisitionFormConfigSummary): void {
    if (!this.canWrite() || (summary.status !== 'PUBLISHED' && summary.status !== 'DEPRECATED')) {
      return;
    }
    this.cloningId = summary.id;
    this.openingEditor = true;
    this.configService.clone(summary.id).subscribe({
      next: (draft) => {
        this.cloningId = null;
        this.selectorForm.patchValue(
          {
            countryId: draft.countryId,
            coverageTypeId: draft.coverageTypeId,
            status: 'DRAFT',
          },
          { emitEvent: false },
        );
        this.loadConfigsList();
        this.snack.open(REQ_FORM_CONFIG_CLONE_SUCCESS, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3000 });
        this.openEditorDialog(draft);
      },
      error: () => {
        this.cloningId = null;
        this.openingEditor = false;
        this.snack.open(REQ_FORM_CONFIG_CLONE_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  canClone(summary: RequisitionFormConfigSummary): boolean {
    return this.canWrite() && (summary.status === 'PUBLISHED' || summary.status === 'DEPRECATED');
  }

  isViewOnly(summary: RequisitionFormConfigSummary): boolean {
    return summary.status === 'PUBLISHED' || summary.status === 'DEPRECATED';
  }

  countryName(countryId: number): string {
    return this.countries.find((country) => country.id === countryId)?.name ?? String(countryId);
  }

  coverageName(countryId: number, coverageTypeId: number): string {
    const types = this.coverageTypesByCountry.get(countryId) ?? [];
    return types.find((type) => type.id === coverageTypeId)?.name ?? String(coverageTypeId);
  }

  statusLabelFor(status: string | undefined): string {
    if (status === 'PUBLISHED') {
      return this.statusPublished;
    }
    if (status === 'DEPRECATED') {
      return this.statusDeprecated;
    }
    return this.statusDraft;
  }

  private openEditorDialog(config: RequisitionFormConfigDetail): void {
    this.ensureCoverageTypes(config.countryId).subscribe(() => {
      this.openingEditor = false;
      const ref = this.dialog.open(RequisitionFormConfigDialogComponent, {
        width: '1100px',
        maxWidth: '95vw',
        maxHeight: '92vh',
        autoFocus: false,
        data: {
          config,
          countryName: this.countryName(config.countryId),
          coverageTypeName: this.coverageName(config.countryId, config.coverageTypeId),
        },
      });
      ref
        .afterClosed()
        .pipe(filter((changed): changed is boolean => changed === true))
        .subscribe(() => this.loadConfigsList());
    });
  }

  private ensureCoverageTypes(countryId: number): Observable<CatalogCoverageType[]> {
    const cached = this.coverageTypesByCountry.get(countryId);
    if (cached) {
      return of(cached);
    }
    return this.positionCatalogService.listCoverageTypes(countryId).pipe(
      tap((items) => {
        this.coverageTypes = items;
        this.coverageTypesByCountry.set(countryId, items);
      }),
      catchError(() => of([])),
    );
  }

  private handleOpenError(): void {
    this.openingEditor = false;
    this.snack.open(REQ_FORM_CONFIG_LOAD_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
  }

  private prefetchCoverageNames(items: RequisitionFormConfigSummary[]): void {
    const missingCountryIds = [...new Set(items.map((item) => item.countryId))].filter(
      (countryId) => !this.coverageTypesByCountry.has(countryId),
    );
    if (!missingCountryIds.length) {
      return;
    }
    forkJoin(
      missingCountryIds.map((countryId) =>
        this.positionCatalogService.listCoverageTypes(countryId).pipe(catchError(() => of([]))),
      ),
    ).subscribe({
      next: (results) => {
        missingCountryIds.forEach((countryId, index) => {
          this.coverageTypesByCountry.set(countryId, results[index] ?? []);
        });
      },
    });
  }
}
