import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, of, switchMap } from 'rxjs';
import { AppPermissions } from '../../../../core/auth/app-permissions';
import { catalogDialogConfig } from '../../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import {
  FEEDBACK_GENERIC_INFO_TITLE,
  FEEDBACK_GENERIC_WARNING_TITLE,
} from '../../../../core/i18n/feedback-labels';
import { getRequisitionStatusLabel } from '../../../../core/i18n/common-labels';
import { CV_BULK_ACTION } from '../../../../core/i18n/cv-bulk-labels';
import { EXCEL_BULK_ACTION } from '../../../../core/i18n/excel-bulk-labels';
import {
  POSITIONS_ACTION_APPLY_CANDIDATES,
  POSITIONS_ACTION_APPROVE_CANCELLATION,
  POSITIONS_ACTION_CANCEL_DIRECT,
  POSITIONS_ACTION_DUPLICATE,
  POSITIONS_ACTION_EXECUTE_CANCELLATION,
  POSITIONS_ACTION_GENERATE_PUBLICATION,
  POSITIONS_ACTION_GO_PRESELECTION,
  POSITIONS_ACTION_GO_SELECTION_ARIA,
  POSITIONS_ACTION_HISTORY,
  POSITIONS_ACTION_MORE_ARIA,
  POSITIONS_ACTION_PUBLISH_ON_PORTAL,
  POSITIONS_ACTION_REASSIGN,
  POSITIONS_ACTION_REJECT_CANCELLATION,
  POSITIONS_ACTION_REQUEST_CANCELLATION,
  POSITIONS_ACTION_VIEW_APPLICANTS,
  POSITIONS_APPROVE_CANCELLATION_ERROR,
  POSITIONS_APPROVE_CANCELLATION_SUCCESS,
  POSITIONS_CANCEL_ERROR,
  POSITIONS_CANCEL_EVIDENCE_UPLOAD_ERROR,
  POSITIONS_CANCEL_SUCCESS,
  POSITIONS_CLEAR_FILTERS,
  POSITIONS_COL_APPLICANTS,
  POSITIONS_COL_BRAND,
  POSITIONS_COL_CATEGORY,
  POSITIONS_COL_CITY,
  POSITIONS_COL_CLIENT,
  POSITIONS_COL_CLIENT_KEY,
  POSITIONS_COL_COUNTRY,
  POSITIONS_COL_CREATED_AT,
  POSITIONS_COL_FIRST_DAY,
  POSITIONS_COL_GROUP,
  POSITIONS_COL_NAME,
  POSITIONS_COL_OT,
  POSITIONS_COL_POSITIONS,
  POSITIONS_COL_PRESELECTION,
  POSITIONS_COL_RECRUITER,
  POSITIONS_COL_REQUISITION,
  POSITIONS_COL_SCOPE,
  POSITIONS_COL_STATE,
  POSITIONS_COL_STATUS,
  POSITIONS_COL_SUPERVISOR,
  POSITIONS_COL_TYPE,
  POSITIONS_DUPLICATE_ERROR,
  POSITIONS_EXECUTE_CANCELLATION_ERROR,
  POSITIONS_EXECUTE_CANCELLATION_SUCCESS,
  POSITIONS_FILTER_ALL,
  POSITIONS_FILTER_BRAND,
  POSITIONS_FILTER_CLIENT,
  POSITIONS_FILTER_CLIENT_POSITION,
  POSITIONS_FILTER_CONTRACT_TYPE,
  POSITIONS_FILTER_COORDINATOR,
  POSITIONS_FILTER_COORDINATOR_APPIAN,
  POSITIONS_FILTER_RECRUITER_APPIAN,
  POSITIONS_FILTER_CLOSER_APPIAN,
  POSITIONS_FILTER_REQUEST_TYPE,
  POSITIONS_FILTER_APPIAN_UNAVAILABLE,
  POSITIONS_FILTER_DEFERRED_UNAVAILABLE,
  POSITIONS_FILTER_COUNTRY,
  POSITIONS_FILTER_COVERAGE_TYPE,
  POSITIONS_FILTER_CREATED_BY,
  POSITIONS_FILTER_DATE_FROM,
  POSITIONS_FILTER_EDUCATION,
  POSITIONS_FILTER_GENERAL_CATEGORY,
  POSITIONS_FILTER_QUESTIONNAIRE,
  POSITIONS_FILTER_RECRUITER,
  POSITIONS_FILTER_RECRUITER_ATS,
  POSITIONS_FILTER_REQUISITION_TYPE,
  POSITIONS_FILTER_RESPONSIBILITY,
  POSITIONS_FILTER_SHIFT,
  POSITIONS_FILTER_STATE,
  POSITIONS_FILTER_STATUS,
  POSITIONS_FILTER_WORKPLACE,
  POSITIONS_FILTERS_CLEARED,
  POSITIONS_LESS_FILTERS,
  POSITIONS_MORE_FILTERS,
  POSITIONS_GENERATE_PUBLICATION_LOAD_ERROR,
  POSITIONS_LOAD_ERROR,
  POSITIONS_PUBLISH_ON_PORTAL_CONFIRM,
  POSITIONS_PUBLISH_ON_PORTAL_ERROR,
  POSITIONS_PUBLISH_ON_PORTAL_SUCCESS,
  POSITIONS_REASSIGN_ERROR,
  POSITIONS_REASSIGN_SUCCESS,
  POSITIONS_REJECT_CANCELLATION_ERROR,
  POSITIONS_REJECT_CANCELLATION_SUCCESS,
  POSITIONS_REQUEST_CANCELLATION_ERROR,
  POSITIONS_REQUEST_CANCELLATION_SUCCESS,
  POSITIONS_SEARCH_LABEL,
  POSITIONS_SEARCH_PLACEHOLDER,
  buildDuplicatedPositionName,
  positionsApproveCancellationConfirm,
  positionsCandidatesApplied,
  positionsDuplicateSuccess,
  positionsExecuteCancellationConfirm,
  positionsRejectCancellationConfirm,
} from '../../../../core/i18n/positions-labels';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogClientService } from '../../../../core/services/catalog-client.service';
import { CatalogGeneralCategoryService } from '../../../../core/services/catalog-general-category.service';
import { CatalogGeographyService } from '../../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../../core/services/catalog-position.service';
import { CatalogResponsibilityLevelService } from '../../../../core/services/catalog-responsibility-level.service';
import { CatalogWorkplaceService } from '../../../../core/services/catalog-workplace.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { PositionService } from '../../../../core/services/position.service';
import { QuestionnaireQuestionnaireApiService } from '../../../../core/services/questionnaire-questionnaire-api.service';
import { SecurityUserService } from '../../../../core/services/security-user.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { TableRowActionsComponent } from '../../../../shared/components/table-row-actions/table-row-actions.component';
import { CatalogClient } from '../../../../shared/models/catalog-client.model';
import { CatalogGeneralCategory } from '../../../../shared/models/catalog-general-category.model';
import { CatalogCountry, CatalogState } from '../../../../shared/models/catalog-geography.model';
import {
  CatalogBrand,
  CatalogContractType,
  CatalogCoverageType,
  CatalogEducationLevel,
  CatalogRequisitionType,
  CatalogShift,
} from '../../../../shared/models/catalog-position.model';
import { CatalogResponsibilityLevel } from '../../../../shared/models/catalog-responsibility-level.model';
import { CatalogWorkplace } from '../../../../shared/models/catalog-workplace.model';
import {
  PositionCancellationRequest,
  PositionListItem,
  PositionUserSummary,
  UploadCancellationEvidenceResponse,
} from '../../../../shared/models/position.model';
import { QuestionnaireItem } from '../../../../shared/models/questionnaire-v2.model';
import { SecurityUser } from '../../../../shared/models/security-user.model';
import {
  CandidatePoolDialogComponent,
  CandidatePoolDialogData,
} from '../../../candidates/dialogs/candidate-pool-dialog/candidate-pool-dialog.component';
import {
  PositionApplicationsDialogComponent,
  PositionApplicationsDialogData,
} from '../../../candidates/dialogs/position-applications-dialog/position-applications-dialog.component';
import {
  CvBulkUploadDialogComponent,
  CvBulkUploadDialogData,
} from '../../list/cv-bulk-upload-dialog/cv-bulk-upload-dialog.component';
import {
  ExcelBulkUploadDialogComponent,
  ExcelBulkUploadDialogData,
} from '../../list/excel-bulk-upload-dialog/excel-bulk-upload-dialog.component';
import {
  PositionCancelDialogComponent,
  PositionCancelDialogResult,
} from '../../list/position-cancel-dialog.component';
import { PositionEventsDialogComponent } from '../../list/position-events-dialog.component';
import { PositionReasonDialogComponent } from '../../list/position-reason-dialog.component';
import {
  PublicationGenerateDialogComponent,
  PublicationGenerateDialogData,
} from '../../list/publication-generate-dialog/publication-generate-dialog.component';
import {
  ReassignPositionDialogComponent,
  ReassignPositionDialogResult,
} from '../../list/reassign-position-dialog.component';
import {
  RequisitionScopeDialogComponent,
  RequisitionScopeDialogResult,
} from '../../wizard/requisition-scope-dialog/requisition-scope-dialog.component';

interface ClientOption {
  id: number;
  label: string;
  /** Value used in positions list filter (companyArea / legalName / …). */
  filterValue: string;
}

@Component({
  selector: 'sh-positions-table',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    StatusBadgeComponent,
    TableRowActionsComponent,
  ],
  templateUrl: './positions-table.component.html',
  styleUrl: './positions-table.component.scss',
})
export class PositionsTableComponent implements OnInit {
  @Input() embedded = false;
  @Output() readonly changed = new EventEmitter<void>();

  private readonly positionService = inject(PositionService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly catalogPositionService = inject(CatalogPositionService);
  private readonly catalogClientService = inject(CatalogClientService);
  private readonly workplaceService = inject(CatalogWorkplaceService);
  private readonly responsibilityLevelService = inject(CatalogResponsibilityLevelService);
  private readonly generalCategoryService = inject(CatalogGeneralCategoryService);
  private readonly userService = inject(SecurityUserService);
  private readonly questionnaireService = inject(QuestionnaireQuestionnaireApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);
  private readonly auth = inject(AuthService);

  readonly searchLabel = POSITIONS_SEARCH_LABEL;
  readonly searchPlaceholder = POSITIONS_SEARCH_PLACEHOLDER;
  readonly filterStatus = POSITIONS_FILTER_STATUS;
  readonly filterRecruiter = POSITIONS_FILTER_RECRUITER;
  readonly filterCountry = POSITIONS_FILTER_COUNTRY;
  readonly filterAll = POSITIONS_FILTER_ALL;
  readonly filterDateFrom = POSITIONS_FILTER_DATE_FROM;
  readonly clearFiltersLabel = POSITIONS_CLEAR_FILTERS;
  readonly moreFiltersLabel = POSITIONS_MORE_FILTERS;
  readonly lessFiltersLabel = POSITIONS_LESS_FILTERS;
  readonly filterClient = POSITIONS_FILTER_CLIENT;
  readonly filterRequisitionType = POSITIONS_FILTER_REQUISITION_TYPE;
  readonly filterCoverageType = POSITIONS_FILTER_COVERAGE_TYPE;
  readonly filterBrand = POSITIONS_FILTER_BRAND;
  readonly filterWorkplace = POSITIONS_FILTER_WORKPLACE;
  readonly filterShift = POSITIONS_FILTER_SHIFT;
  readonly filterContractType = POSITIONS_FILTER_CONTRACT_TYPE;
  readonly filterEducation = POSITIONS_FILTER_EDUCATION;
  readonly filterResponsibility = POSITIONS_FILTER_RESPONSIBILITY;
  readonly filterClientPosition = POSITIONS_FILTER_CLIENT_POSITION;
  readonly filterCreatedBy = POSITIONS_FILTER_CREATED_BY;
  readonly filterCoordinator = POSITIONS_FILTER_COORDINATOR;
  readonly filterCoordinatorAppian = POSITIONS_FILTER_COORDINATOR_APPIAN;
  readonly filterRecruiterAppian = POSITIONS_FILTER_RECRUITER_APPIAN;
  readonly filterCloserAppian = POSITIONS_FILTER_CLOSER_APPIAN;
  readonly filterRequestType = POSITIONS_FILTER_REQUEST_TYPE;
  readonly filterAppianUnavailable = POSITIONS_FILTER_APPIAN_UNAVAILABLE;
  readonly filterDeferredUnavailable = POSITIONS_FILTER_DEFERRED_UNAVAILABLE;
  readonly filterRecruiterAts = POSITIONS_FILTER_RECRUITER_ATS;
  readonly filterState = POSITIONS_FILTER_STATE;
  readonly filterGeneralCategory = POSITIONS_FILTER_GENERAL_CATEGORY;
  readonly filterQuestionnaire = POSITIONS_FILTER_QUESTIONNAIRE;
  readonly colRequisition = POSITIONS_COL_REQUISITION;
  readonly colName = POSITIONS_COL_NAME;
  readonly colOt = POSITIONS_COL_OT;
  readonly colClient = POSITIONS_COL_CLIENT;
  readonly colClientKey = POSITIONS_COL_CLIENT_KEY;
  readonly colPositionsCount = POSITIONS_COL_POSITIONS;
  readonly colApplicants = POSITIONS_COL_APPLICANTS;
  readonly colPreselection = POSITIONS_COL_PRESELECTION;
  readonly colFirstDay = POSITIONS_COL_FIRST_DAY;
  readonly colCity = POSITIONS_COL_CITY;
  readonly colState = POSITIONS_COL_STATE;
  readonly colBrand = POSITIONS_COL_BRAND;
  readonly colType = POSITIONS_COL_TYPE;
  readonly colCategory = POSITIONS_COL_CATEGORY;
  readonly colCountry = POSITIONS_COL_COUNTRY;
  readonly colGroup = POSITIONS_COL_GROUP;
  readonly colSupervisor = POSITIONS_COL_SUPERVISOR;
  readonly colScope = POSITIONS_COL_SCOPE;
  readonly colStatus = POSITIONS_COL_STATUS;
  readonly colRecruiter = POSITIONS_COL_RECRUITER;
  readonly colCreatedAt = POSITIONS_COL_CREATED_AT;
  readonly actionDuplicate = POSITIONS_ACTION_DUPLICATE;
  readonly actionRequestCancellation = POSITIONS_ACTION_REQUEST_CANCELLATION;
  readonly actionApproveCancellation = POSITIONS_ACTION_APPROVE_CANCELLATION;
  readonly actionRejectCancellation = POSITIONS_ACTION_REJECT_CANCELLATION;
  readonly actionExecuteCancellation = POSITIONS_ACTION_EXECUTE_CANCELLATION;
  readonly actionCancelDirect = POSITIONS_ACTION_CANCEL_DIRECT;
  readonly actionReassign = POSITIONS_ACTION_REASSIGN;
  readonly actionHistory = POSITIONS_ACTION_HISTORY;
  readonly actionGoPreselection = POSITIONS_ACTION_GO_PRESELECTION;
  readonly actionApplyCandidates = POSITIONS_ACTION_APPLY_CANDIDATES;
  readonly actionViewApplicants = POSITIONS_ACTION_VIEW_APPLICANTS;
  readonly actionGeneratePublication = POSITIONS_ACTION_GENERATE_PUBLICATION;
  readonly actionPublishOnPortal = POSITIONS_ACTION_PUBLISH_ON_PORTAL;
  readonly actionCvBulk = CV_BULK_ACTION;
  readonly actionExcelBulk = EXCEL_BULK_ACTION;
  readonly goSelectionAria = POSITIONS_ACTION_GO_SELECTION_ARIA;
  readonly moreActionsAria = POSITIONS_ACTION_MORE_ARIA;

  loading = true;
  /** Q1-B: filas 2–7 abiertas por defecto; Fila 1 siempre visible. */
  advancedFiltersOpen = false;
  data: PositionListItem[] = [];
  countryOptions: CatalogCountry[] = [];
  clientOptions: ClientOption[] = [];
  brandOptions: CatalogBrand[] = [];
  coverageTypeOptions: CatalogCoverageType[] = [];
  shiftOptions: CatalogShift[] = [];
  educationLevelOptions: CatalogEducationLevel[] = [];
  contractTypeOptions: CatalogContractType[] = [];
  requisitionTypeOptions: CatalogRequisitionType[] = [];
  workplaceOptions: CatalogWorkplace[] = [];
  responsibilityLevelOptions: CatalogResponsibilityLevel[] = [];
  generalCategoryOptions: CatalogGeneralCategory[] = [];
  stateOptions: CatalogState[] = [];
  recruiterUserOptions: SecurityUser[] = [];
  creatorUserOptions: SecurityUser[] = [];
  coordinatorUserOptions: SecurityUser[] = [];
  questionnaireOptions: QuestionnaireItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly statusOptions = [
    'Todos',
    'DRAFT',
    'ACTIVE',
    'PENDING_CANCELLATION',
    'CANCELLATION_AUTHORIZED',
    'CANCELLED',
  ];

  readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['Todos'],
    countryId: [0],
    recruiter: [''],
    dateFrom: [''],
    client: [''],
    requisitionTypeId: [0],
    requisitionTypeName: [''],
    coverageTypeId: [0],
    coverageTypeName: [''],
    brandId: [0],
    brandName: [''],
    workplaceId: [0],
    workplaceName: [''],
    shiftId: [0],
    shiftName: [''],
    contractTypeId: [0],
    contractTypeName: [''],
    educationLevelId: [0],
    educationLevelName: [''],
    responsibilityLevelId: [0],
    responsibilityLevelName: [''],
    clientPosition: [''],
    createdByIds: [[] as number[]],
    careResponsibleUserId: [0],
    careResponsibleAts: [''],
    stateId: [0],
    stateName: [''],
    generalCategoryId: [0],
    generalCategoryName: [''],
    questionnaireId: [0],
  });

  private readonly defaultFilterValues = this.filters.getRawValue();

  /** Typeahead text; not part of filters group so typing does not reload the table. */
  readonly clientSearch = new FormControl<string | ClientOption>('', { nonNullable: true });

  get hasCountrySelected(): boolean {
    return this.filters.controls.countryId.value > 0;
  }

  readonly columns = [
    'requisitionNo',
    'name',
    'ot',
    'createdAt',
    'positionsCount',
    'applicantsCount',
    'preselectedCount',
    'hiredCount',
    'recruiter',
    'supervisor',
    'recruiterGroup',
    'type',
    'category',
    'brand',
    'client',
    'clientKey',
    'country',
    'city',
    'state',
    'status',
    'cancellationScope',
    'actions',
  ];

  /** Nombre / Reclutador / Supervisor */
  readonly cellMaxChars = 40;
  /** Categoría ≈ "Con esfuerzo de reclutamiento" */
  readonly categoryMaxChars = 'Con esfuerzo de reclutamiento'.length;

  canRequestCancellation(): boolean {
    return this.isTenantAdmin() || this.permissions.hasAny([
      AppPermissions.REQUISITION_CANCELLATION_REQUEST,
      AppPermissions.REQUISITION_EDIT,
    ]);
  }

  canExecuteCancellation(): boolean {
    return (
      this.isTenantAdmin() || this.permissions.hasAuthority(AppPermissions.REQUISITION_CANCEL_EXECUTE)
    );
  }

  canDirectCancel(): boolean {
    return this.isTenantAdmin() || this.permissions.hasAny([
      AppPermissions.REQUISITION_CANCEL_DIRECT,
      AppPermissions.REQUISITION_DELETE,
    ]);
  }

  canEdit(): boolean {
    return this.isTenantAdmin() || this.permissions.hasAuthority(AppPermissions.REQUISITION_EDIT);
  }

  private isTenantAdmin(): boolean {
    if (this.permissions.isGlobalAdmin()) {
      return true;
    }
    const roles = this.auth.currentUser()?.roles ?? [];
    return roles.includes('ADMIN') || roles.includes('GLOBAL_ADMIN');
  }

  userDisplayName(user?: PositionUserSummary | null): string {
    if (!user) {
      return '—';
    }
    const name = `${user.name ?? ''} ${user.lastName ?? ''}`.trim();
    return name || user.email || '—';
  }

  displayRecruiter(row: PositionListItem): string {
    const fromAssigned = this.userDisplayName(row.assignedUser);
    if (fromAssigned !== '—') {
      return fromAssigned;
    }
    const raw = row.recruiter?.trim();
    if (raw && raw !== '—') {
      return raw;
    }
    return '—';
  }

  /** Visible cell text capped to max chars; full value stays in [title]. */
  truncateCell(value: string | null | undefined, maxChars: number): string {
    const text = (value ?? '').trim();
    if (!text || text === '—') {
      return '—';
    }
    return text.length > maxChars ? `${text.slice(0, maxChars)}…` : text;
  }

  statusLabel(status: string): string {
    if (status === 'Todos') {
      return this.filterAll;
    }
    return getRequisitionStatusLabel(status);
  }

  ngOnInit(): void {
    this.geographyService.listCountries(0, 200).subscribe({
      next: (countries) => {
        this.countryOptions = countries.filter((c) => c.isActive);
        const selectedCountryId = this.filters.controls.countryId.value;
        if (selectedCountryId > 0) {
          this.loadCountryDependentCatalogs(selectedCountryId);
        }
      },
    });
    this.loadUsers();
    this.bindClientSearch();
    this.questionnaireService.list({ isActive: true }, 0, 200).subscribe({
      next: (res) => {
        this.questionnaireOptions = res.items;
      },
    });
    this.filters.controls.countryId.valueChanges.pipe(distinctUntilChanged()).subscribe((countryId) => {
      this.onCountryChanged(countryId);
    });
    this.load();
    this.filters.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  toggleAdvancedFilters(): void {
    this.advancedFiltersOpen = !this.advancedFiltersOpen;
  }

  userDisplayNameFromSecurityUser(user: SecurityUser): string {
    const name = `${user.name ?? ''} ${user.lastName ?? ''}`.trim();
    return name || user.email || user.username;
  }

  displayClient(option: ClientOption | string | null): string {
    if (!option) {
      return '';
    }
    return typeof option === 'string' ? option : option.label;
  }

  readonly displayClientFn = (option: ClientOption | string | null): string => this.displayClient(option);

  onClientSearchFocus(): void {
    const trimmed = this.clientSearchText(this.clientSearch.value);
    if (trimmed.length > 0) {
      return;
    }
    this.searchClients('').subscribe((options) => {
      this.clientOptions = options;
    });
  }

  onClientSelected(option: ClientOption): void {
    this.clientSearch.setValue(option, { emitEvent: false });
    this.clientOptions = [option];
    this.filters.patchValue({ client: option.filterValue });
  }

  clearClientFilter(): void {
    this.clientSearch.setValue('', { emitEvent: false });
    this.clientOptions = [];
    this.filters.patchValue({ client: '' });
  }

  private bindClientSearch(): void {
    this.clientSearch.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => this.clientSearchText(a) === this.clientSearchText(b)),
        switchMap((term) => {
          const selected = this.parseClientOption(term);
          if (selected) {
            this.filters.patchValue({ client: selected.filterValue }, { emitEvent: false });
            this.clientOptions = [selected];
            return of([selected]);
          }

          const trimmed = typeof term === 'string' ? term.trim() : '';
          if (!trimmed) {
            if (this.filters.controls.client.value) {
              this.filters.patchValue({ client: '' });
            }
            return of([] as ClientOption[]);
          }

          const currentFilter = this.filters.controls.client.value;
          if (currentFilter) {
            const current = this.clientOptions.find((o) => o.filterValue === currentFilter);
            if (current?.label.trim() === trimmed) {
              return of([current]);
            }
            this.filters.patchValue({ client: '' }, { emitEvent: false });
          }
          return this.searchClients(trimmed);
        }),
      )
      .subscribe((options) => {
        this.clientOptions = options;
      });
  }

  private searchClients(term: string) {
    return this.catalogClientService.searchByCompanyArea(term, 20).pipe(
      map((items) =>
        items
          .filter((c) => !!this.clientDisplayName(c))
          .map((c) => ({
            id: c.id,
            label: this.clientDisplayName(c),
            filterValue: this.clientFilterValue(c),
          })),
      ),
      catchError(() => of([] as ClientOption[])),
    );
  }

  private parseClientOption(term: unknown): ClientOption | null {
    if (term == null || typeof term !== 'object' || !('id' in term) || !('label' in term) || !('filterValue' in term)) {
      return null;
    }
    const raw = term as ClientOption;
    return typeof raw.id === 'number' && typeof raw.label === 'string' && typeof raw.filterValue === 'string'
      ? raw
      : null;
  }

  private clientSearchText(value: unknown): string {
    const option = this.parseClientOption(value);
    if (option) {
      return option.label.trim();
    }
    return typeof value === 'string' ? value.trim() : '';
  }

  clientDisplayName(client: CatalogClient): string {
    return (
      client.companyArea?.trim() ||
      client.tradeName?.trim() ||
      client.legalName?.trim() ||
      client.code
    );
  }

  /** Prefer companyArea for list filter (matches UI label); fall back to legal/trade name. */
  clientFilterValue(client: CatalogClient): string {
    return (
      client.companyArea?.trim() ||
      client.legalName?.trim() ||
      client.tradeName?.trim() ||
      client.code
    );
  }

  private loadUsers(): void {
    this.userService.list(0, 200).subscribe({
      next: (res) => {
        const activeUsers = res.items.filter((u) => u.isActive);
        this.coordinatorUserOptions = activeUsers;
        this.recruiterUserOptions = activeUsers;
        const creatorRoles = new Set(['ADMIN', 'GLOBAL_ADMIN', 'RECRUITER']);
        const roleFiltered = activeUsers.filter((u) =>
          u.roles?.some((r) => creatorRoles.has(r.name)),
        );
        this.creatorUserOptions = roleFiltered.length ? roleFiltered : activeUsers;
      },
    });
  }

  private onCountryChanged(countryId: number): void {
    // Preserve selected option labels as *Name before clearing catalogs / ids (3B/4B).
    this.captureSelectedNamesIntoNameControls();
    this.clearCountryDependentIds();

    if (countryId > 0) {
      this.loadCountryDependentCatalogs(countryId, () => this.mapNameFiltersToIds());
      return;
    }

    this.clearCountryDependentCatalogs();
    this.stateOptions = [];
  }

  /**
   * When leaving select mode (or switching country), copy selected option names into *Name
   * controls so text mode / remapping can use them.
   */
  private captureSelectedNamesIntoNameControls(): void {
    const f = this.filters.getRawValue();
    this.filters.patchValue(
      {
        brandName: this.nameFromSelectedId(f.brandId, this.brandOptions, f.brandName),
        workplaceName: this.nameFromSelectedId(f.workplaceId, this.workplaceOptions, f.workplaceName),
        contractTypeName: this.nameFromSelectedId(f.contractTypeId, this.contractTypeOptions, f.contractTypeName),
        educationLevelName: this.nameFromSelectedId(
          f.educationLevelId,
          this.educationLevelOptions,
          f.educationLevelName,
        ),
        responsibilityLevelName: this.nameFromSelectedId(
          f.responsibilityLevelId,
          this.responsibilityLevelOptions,
          f.responsibilityLevelName,
        ),
        coverageTypeName: this.nameFromSelectedId(f.coverageTypeId, this.coverageTypeOptions, f.coverageTypeName),
        requisitionTypeName: this.nameFromSelectedId(
          f.requisitionTypeId,
          this.requisitionTypeOptions,
          f.requisitionTypeName,
        ),
        stateName: this.nameFromSelectedId(f.stateId, this.stateOptions, f.stateName),
        generalCategoryName: this.nameFromSelectedId(
          f.generalCategoryId,
          this.generalCategoryOptions,
          f.generalCategoryName,
        ),
        shiftName: this.nameFromSelectedId(f.shiftId, this.shiftOptions, f.shiftName),
      },
      { emitEvent: false },
    );
  }

  private nameFromSelectedId(
    id: number,
    options: ReadonlyArray<{ id: number; name: string }>,
    currentName: string,
  ): string {
    if (id > 0) {
      const match = options.find((o) => o.id === id);
      return match?.name?.trim() || currentName;
    }
    return currentName;
  }

  private clearCountryDependentIds(): void {
    this.filters.patchValue(
      {
        requisitionTypeId: 0,
        coverageTypeId: 0,
        brandId: 0,
        workplaceId: 0,
        shiftId: 0,
        contractTypeId: 0,
        educationLevelId: 0,
        responsibilityLevelId: 0,
        stateId: 0,
        generalCategoryId: 0,
      },
      { emitEvent: false },
    );
  }

  /** Map *Name text → *Id after catalogs for the selected country are loaded (3B). */
  private mapNameFiltersToIds(): void {
    const f = this.filters.getRawValue();
    this.filters.patchValue(
      {
        ...this.namedIdPatch('brandId', 'brandName', f.brandName, this.brandOptions),
        ...this.namedIdPatch('workplaceId', 'workplaceName', f.workplaceName, this.workplaceOptions),
        ...this.namedIdPatch('contractTypeId', 'contractTypeName', f.contractTypeName, this.contractTypeOptions),
        ...this.namedIdPatch(
          'educationLevelId',
          'educationLevelName',
          f.educationLevelName,
          this.educationLevelOptions,
        ),
        ...this.namedIdPatch(
          'responsibilityLevelId',
          'responsibilityLevelName',
          f.responsibilityLevelName,
          this.responsibilityLevelOptions,
        ),
        ...this.namedIdPatch('coverageTypeId', 'coverageTypeName', f.coverageTypeName, this.coverageTypeOptions),
        ...this.namedIdPatch(
          'requisitionTypeId',
          'requisitionTypeName',
          f.requisitionTypeName,
          this.requisitionTypeOptions,
        ),
        ...this.namedIdPatch('stateId', 'stateName', f.stateName, this.stateOptions),
        ...this.namedIdPatch(
          'generalCategoryId',
          'generalCategoryName',
          f.generalCategoryName,
          this.generalCategoryOptions,
        ),
        ...this.namedIdPatch('shiftId', 'shiftName', f.shiftName, this.shiftOptions),
      },
      { emitEvent: true },
    );
  }

  private namedIdPatch(
    idKey: string,
    nameKey: string,
    nameValue: string,
    options: ReadonlyArray<{ id: number; name: string }>,
  ): Record<string, number | string> {
    const trimmed = (nameValue ?? '').trim();
    if (!trimmed) {
      return { [idKey]: 0, [nameKey]: '' };
    }
    const needle = trimmed.toLowerCase();
    // Prefer exact name, then first partial (option name CONTAINS typed text).
    const exact = options.find((o) => (o.name ?? '').trim().toLowerCase() === needle);
    const partial = exact
      ? undefined
      : options.find((o) => (o.name ?? '').trim().toLowerCase().includes(needle));
    const match = exact ?? partial;
    if (match) {
      return { [idKey]: match.id, [nameKey]: '' };
    }
    // No match → clear id and name (3B).
    return { [idKey]: 0, [nameKey]: '' };
  }

  private clearCountryDependentCatalogs(): void {
    this.brandOptions = [];
    this.coverageTypeOptions = [];
    this.shiftOptions = [];
    this.educationLevelOptions = [];
    this.contractTypeOptions = [];
    this.requisitionTypeOptions = [];
    this.workplaceOptions = [];
    this.responsibilityLevelOptions = [];
    this.generalCategoryOptions = [];
  }

  private loadCountryDependentCatalogs(countryId: number, onReady?: () => void): void {
    forkJoin({
      brands: this.catalogPositionService.listBrands(countryId, 0, 200).pipe(catchError(() => of([] as CatalogBrand[]))),
      coverageTypes: this.catalogPositionService
        .listCoverageTypes(countryId, 0, 200)
        .pipe(catchError(() => of([] as CatalogCoverageType[]))),
      shifts: this.catalogPositionService.listShifts(countryId, 0, 200).pipe(catchError(() => of([] as CatalogShift[]))),
      educationLevels: this.catalogPositionService
        .listEducationLevels(countryId, 0, 200)
        .pipe(catchError(() => of([] as CatalogEducationLevel[]))),
      contractTypes: this.catalogPositionService
        .listContractTypes(countryId, 0, 200)
        .pipe(catchError(() => of([] as CatalogContractType[]))),
      requisitionTypes: this.catalogPositionService
        .listRequisitionTypes(countryId, 0, 200)
        .pipe(catchError(() => of([] as CatalogRequisitionType[]))),
      workplaces: this.workplaceService.list(countryId, 0, 200).pipe(
        map((res) => res.items.filter((item) => item.isActive)),
        catchError(() => of([] as CatalogWorkplace[])),
      ),
      responsibilityLevels: this.responsibilityLevelService.list(countryId, 0, 200).pipe(
        map((res) => res.items.filter((item) => item.isActive)),
        catchError(() => of([] as CatalogResponsibilityLevel[])),
      ),
      generalCategories: this.generalCategoryService.list(countryId, 0, 200).pipe(
        map((res) => res.items.filter((item) => item.isActive)),
        catchError(() => of([] as CatalogGeneralCategory[])),
      ),
      states: this.geographyService.listStates(countryId, 0, 500).pipe(
        map((items) => items.filter((item) => item.isActive !== false)),
        catchError(() => of([] as CatalogState[])),
      ),
    }).subscribe({
      next: (res) => {
        this.brandOptions = res.brands;
        this.coverageTypeOptions = res.coverageTypes;
        this.shiftOptions = res.shifts.filter((item) => item.isActive !== false);
        this.educationLevelOptions = res.educationLevels;
        this.contractTypeOptions = res.contractTypes;
        this.requisitionTypeOptions = res.requisitionTypes;
        this.workplaceOptions = res.workplaces;
        this.responsibilityLevelOptions = res.responsibilityLevels;
        this.generalCategoryOptions = res.generalCategories;
        this.stateOptions = res.states;
        onReady?.();
      },
      error: () => {
        this.clearCountryDependentCatalogs();
        this.stateOptions = [];
        onReady?.();
      },
    });
  }

  private positiveIdOrNull(id: number): number | null {
    return id > 0 ? id : null;
  }

  private trimOrNull(value: string): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  openNewRequisition(): void {
    this.dialog
      .open(RequisitionScopeDialogComponent, {
        ...catalogDialogConfig('720px'),
        disableClose: true,
        data: {},
      })
      .afterClosed()
      .subscribe((result: RequisitionScopeDialogResult | null | undefined) => {
        if (!result) {
          return;
        }
        void this.router.navigate(['/positions/new'], {
          queryParams: {
            countryId: result.countryId,
            coverageTypeId: result.coverageTypeId,
          },
        });
      });
  }

  load(): void {
    this.loading = true;
    const f = this.filters.getRawValue();
    const status = f.status;
    const countryId = f.countryId;
    const hasCountry = countryId > 0;
    const dateFrom = f.dateFrom || null;
    this.positionService
      .list(this.pageIndex, this.pageSize, {
        status: status !== 'Todos' ? status : null,
        search: f.search,
        createdFrom: dateFrom,
        createdTo: null,
        countryId: hasCountry ? countryId : null,
        recruiter: f.recruiter || null,
        client: f.client,
        requisitionTypeId: hasCountry ? this.positiveIdOrNull(f.requisitionTypeId) : null,
        requisitionTypeName: hasCountry ? null : this.trimOrNull(f.requisitionTypeName),
        coverageTypeId: hasCountry ? this.positiveIdOrNull(f.coverageTypeId) : null,
        coverageTypeName: hasCountry ? null : this.trimOrNull(f.coverageTypeName),
        brandId: hasCountry ? this.positiveIdOrNull(f.brandId) : null,
        brandName: hasCountry ? null : this.trimOrNull(f.brandName),
        workplaceId: hasCountry ? this.positiveIdOrNull(f.workplaceId) : null,
        workplaceName: hasCountry ? null : this.trimOrNull(f.workplaceName),
        shiftId: hasCountry ? this.positiveIdOrNull(f.shiftId) : null,
        shiftName: hasCountry ? null : this.trimOrNull(f.shiftName),
        contractTypeId: hasCountry ? this.positiveIdOrNull(f.contractTypeId) : null,
        contractTypeName: hasCountry ? null : this.trimOrNull(f.contractTypeName),
        educationLevelId: hasCountry ? this.positiveIdOrNull(f.educationLevelId) : null,
        educationLevelName: hasCountry ? null : this.trimOrNull(f.educationLevelName),
        responsibilityLevelId: hasCountry ? this.positiveIdOrNull(f.responsibilityLevelId) : null,
        responsibilityLevelName: hasCountry ? null : this.trimOrNull(f.responsibilityLevelName),
        clientPosition: f.clientPosition,
        createdByIds: f.createdByIds.length ? f.createdByIds : null,
        careResponsibleUserId: this.positiveIdOrNull(f.careResponsibleUserId),
        careResponsibleAts: f.careResponsibleAts,
        stateId: hasCountry ? this.positiveIdOrNull(f.stateId) : null,
        stateName: hasCountry ? null : this.trimOrNull(f.stateName),
        generalCategoryId: hasCountry ? this.positiveIdOrNull(f.generalCategoryId) : null,
        generalCategoryName: hasCountry ? null : this.trimOrNull(f.generalCategoryName),
        questionnaireId: this.positiveIdOrNull(f.questionnaireId),
      })
      .subscribe({
        next: (res) => {
          this.data = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.feedback.showApiError(err, { fallbackMessage: POSITIONS_LOAD_ERROR });
        },
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.load();
  }

  clearFilters(): void {
    this.filters.reset(this.defaultFilterValues);
    this.clientSearch.setValue('', { emitEvent: false });
    this.clientOptions = [];
    this.stateOptions = [];
    this.clearCountryDependentCatalogs();
    this.feedback.showInfo(FEEDBACK_GENERIC_INFO_TITLE, POSITIONS_FILTERS_CLEARED);
  }

  private reloadAndNotify(): void {
    this.load();
    this.changed.emit();
  }

  duplicatePosition(row: PositionListItem): void {
    const positionName = buildDuplicatedPositionName(row.name);
    this.positionService.duplicate(row.id, positionName).subscribe({
      next: (res) => {
        this.reloadAndNotify();
        this.feedback.showSuccess(positionsDuplicateSuccess(res.id));
        void this.router.navigate(['/positions', res.id, 'edit']);
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: POSITIONS_DUPLICATE_ERROR });
      },
    });
  }

  publishOnPortal(row: PositionListItem): void {
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: POSITIONS_PUBLISH_ON_PORTAL_CONFIRM,
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.positionService.publishOnPortal(row.id).subscribe({
          next: () => {
            this.feedback.showSuccess(POSITIONS_PUBLISH_ON_PORTAL_SUCCESS);
          },
          error: (err) => {
            this.feedback.showApiError(err, { fallbackMessage: POSITIONS_PUBLISH_ON_PORTAL_ERROR });
          },
        });
      });
  }

  cancelPosition(row: PositionListItem): void {
    if (!this.canDirectCancel() || row.status === 'CANCELLED') {
      return;
    }
    this.openEnrichedCancelDialog(row, 'direct');
  }

  requestCancellation(row: PositionListItem): void {
    if (!this.canRequestCancellation()) {
      return;
    }
    if (row.status !== 'DRAFT' && row.status !== 'ACTIVE') {
      return;
    }
    this.openEnrichedCancelDialog(row, 'request');
  }

  private openEnrichedCancelDialog(row: PositionListItem, mode: 'request' | 'direct'): void {
    this.dialog
      .open(PositionCancelDialogComponent, {
        ...catalogDialogConfig('720px'),
        maxHeight: '92vh',
        data: {
          positionId: row.id,
          title: mode === 'request' ? this.actionRequestCancellation : this.actionCancelDirect,
        },
      })
      .afterClosed()
      .subscribe((result: PositionCancelDialogResult | null | undefined) => {
        if (!result) {
          return;
        }
        this.submitEnrichedCancellation(row.id, mode, result);
      });
  }

  private submitEnrichedCancellation(
    positionId: number,
    mode: 'request' | 'direct',
    result: PositionCancelDialogResult,
  ): void {
    const buildBody = (evidence?: UploadCancellationEvidenceResponse): PositionCancellationRequest => ({
      cancellationTypeId: result.cancellationTypeId,
      cancellationReasonId: result.cancellationReasonId,
      description: result.description,
      evidenceStorageKey: evidence?.storageKey ?? null,
      evidenceFileName: evidence?.fileName ?? null,
      evidenceContentType: evidence?.contentType ?? null,
    });

    const callApi = (body: PositionCancellationRequest): void => {
      const request$ =
        mode === 'request'
          ? this.positionService.requestCancellation(positionId, body)
          : this.positionService.delete(positionId, body);
      request$.subscribe({
        next: () => {
          this.reloadAndNotify();
          this.feedback.showSuccess(
            mode === 'request' ? POSITIONS_REQUEST_CANCELLATION_SUCCESS : POSITIONS_CANCEL_SUCCESS,
          );
        },
        error: (err) => {
          this.feedback.showApiError(err, {
            fallbackMessage:
              mode === 'request' ? POSITIONS_REQUEST_CANCELLATION_ERROR : POSITIONS_CANCEL_ERROR,
          });
        },
      });
    };

    if (result.evidenceFile) {
      this.positionService.uploadCancellationEvidence(positionId, result.evidenceFile).subscribe({
        next: (evidence) => callApi(buildBody(evidence)),
        error: (err) => {
          this.feedback.showApiError(err, { fallbackMessage: POSITIONS_CANCEL_EVIDENCE_UPLOAD_ERROR });
        },
      });
      return;
    }

    callApi(buildBody());
  }

  approveCancellation(row: PositionListItem): void {
    if (!this.canEdit() || row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: positionsApproveCancellationConfirm(row.requisitionNo),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.positionService.approveCancellation(row.id).subscribe({
          next: () => {
            this.reloadAndNotify();
            this.feedback.showSuccess(POSITIONS_APPROVE_CANCELLATION_SUCCESS);
          },
          error: (err) => {
            this.feedback.showApiError(err, { fallbackMessage: POSITIONS_APPROVE_CANCELLATION_ERROR });
          },
        });
      });
  }

  rejectCancellation(row: PositionListItem): void {
    if (!this.canEdit() || row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: positionsRejectCancellationConfirm(row.requisitionNo),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.dialog
          .open(PositionReasonDialogComponent, {
            ...catalogDialogConfig('480px'),
            data: { required: false, title: this.actionRejectCancellation },
          })
          .afterClosed()
          .subscribe((reason: string | null | undefined) => {
            if (reason === undefined) {
              return;
            }
            this.positionService.rejectCancellation(row.id, reason).subscribe({
              next: () => {
                this.reloadAndNotify();
                this.feedback.showSuccess(POSITIONS_REJECT_CANCELLATION_SUCCESS);
              },
              error: (err) => {
                this.feedback.showApiError(err, { fallbackMessage: POSITIONS_REJECT_CANCELLATION_ERROR });
              },
            });
          });
      });
  }

  executeCancellation(row: PositionListItem): void {
    if (!this.canExecuteCancellation() || row.status !== 'CANCELLATION_AUTHORIZED') {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: positionsExecuteCancellationConfirm(row.requisitionNo),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.positionService.executeCancellation(row.id).subscribe({
          next: () => {
            this.reloadAndNotify();
            this.feedback.showSuccess(POSITIONS_EXECUTE_CANCELLATION_SUCCESS);
          },
          error: (err) => {
            this.feedback.showApiError(err, { fallbackMessage: POSITIONS_EXECUTE_CANCELLATION_ERROR });
          },
        });
      });
  }

  openHistory(row: PositionListItem): void {
    this.dialog.open(PositionEventsDialogComponent, {
      ...catalogDialogConfig('560px'),
      data: { positionId: row.id, requisitionNo: row.requisitionNo },
    });
  }

  reassignPosition(row: PositionListItem): void {
    if (!this.canEdit() || row.status === 'CANCELLED') {
      return;
    }
    this.dialog
      .open(ReassignPositionDialogComponent, {
        ...catalogDialogConfig('480px'),
        data: { currentAssignedUserId: row.assignedUserId },
      })
      .afterClosed()
      .subscribe((result: ReassignPositionDialogResult | null | undefined) => {
        if (!result) {
          return;
        }
        this.positionService.reassign(row.id, result).subscribe({
          next: () => {
            this.reloadAndNotify();
            this.feedback.showSuccess(POSITIONS_REASSIGN_SUCCESS);
          },
          error: (err) => {
            this.feedback.showApiError(err, { fallbackMessage: POSITIONS_REASSIGN_ERROR });
          },
        });
      });
  }

  openPoolDialog(row: PositionListItem): void {
    const ref = this.dialog.open<CandidatePoolDialogComponent, CandidatePoolDialogData>(
      CandidatePoolDialogComponent,
      {
        ...catalogDialogConfig('760px'),
        data: { positionId: row.id, requisitionNo: row.requisitionNo },
      },
    );
    ref.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.reloadAndNotify();
        this.feedback.showSuccess(positionsCandidatesApplied(result.created, row.requisitionNo));
      }
    });
  }

  openApplicationsDialog(row: PositionListItem): void {
    this.dialog.open<PositionApplicationsDialogComponent, PositionApplicationsDialogData>(
      PositionApplicationsDialogComponent,
      {
        ...catalogDialogConfig('720px'),
        data: {
          positionId: row.id,
          requisitionNo: row.requisitionNo,
          positionName: row.name,
        },
      },
    );
  }

  generatePublication(row: PositionListItem): void {
    if (row.status !== 'ACTIVE') {
      return;
    }
    if (row.contactEmail && row.contactPhone) {
      this.openPublicationGenerateDialog(row.id, row.contactEmail, row.contactPhone);
      return;
    }
    this.positionService.getById(row.id).subscribe({
      next: (detail) => {
        this.openPublicationGenerateDialog(row.id, detail.contactEmail ?? '', detail.contactPhone ?? '');
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: POSITIONS_GENERATE_PUBLICATION_LOAD_ERROR });
      },
    });
  }

  openCvBulkUpload(row: PositionListItem): void {
    this.dialog.open(CvBulkUploadDialogComponent, {
      ...catalogDialogConfig('560px'),
      data: {
        positionId: row.id,
        positionName: row.name ?? `#${row.id}`,
      } as CvBulkUploadDialogData,
    });
  }

  openExcelBulkUpload(row: PositionListItem): void {
    this.dialog.open(ExcelBulkUploadDialogComponent, {
      ...catalogDialogConfig('920px', { maxWidth: '96vw' }),
      data: {
        positionId: row.id,
        positionName: row.name ?? `#${row.id}`,
      } as ExcelBulkUploadDialogData,
    });
  }

  private openPublicationGenerateDialog(positionId: number, contactEmail: string, contactPhone: string): void {
    this.dialog.open(PublicationGenerateDialogComponent, {
      ...catalogDialogConfig('1176px', {
        maxWidth: '98vw',
        maxHeight: '95vh',
        height: '95vh',
        autoFocus: 'first-heading',
      }),
      data: { positionId, contactEmail, contactPhone } as PublicationGenerateDialogData,
    });
  }
}
