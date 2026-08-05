import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AppPermissions } from '../../../../core/auth/app-permissions';
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
  POSITIONS_FILTER_COUNTRY,
  POSITIONS_FILTER_COVERAGE_TYPE,
  POSITIONS_FILTER_CREATED_BY,
  POSITIONS_FILTER_DATE_FROM,
  POSITIONS_FILTER_DATE_TO,
  POSITIONS_FILTER_EDUCATION,
  POSITIONS_FILTER_GENERAL_CATEGORY,
  POSITIONS_FILTER_QUESTIONNAIRE,
  POSITIONS_FILTER_RECRUITER,
  POSITIONS_FILTER_RECRUITER_ATS,
  POSITIONS_FILTER_RECRUITER_PLACEHOLDER,
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
  POSITIONS_SNACK_CLOSE,
  buildDuplicatedPositionName,
  positionsApproveCancellationConfirm,
  positionsCancelConfirm,
  positionsCandidatesApplied,
  positionsDuplicateSuccess,
  positionsExecuteCancellationConfirm,
  positionsRejectCancellationConfirm,
  positionsRequestCancellationConfirm,
} from '../../../../core/i18n/positions-labels';
import { AuthService } from '../../../../core/services/auth.service';
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
import { PositionListItem, PositionUserSummary } from '../../../../shared/models/position.model';
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
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
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
  private readonly workplaceService = inject(CatalogWorkplaceService);
  private readonly responsibilityLevelService = inject(CatalogResponsibilityLevelService);
  private readonly generalCategoryService = inject(CatalogGeneralCategoryService);
  private readonly userService = inject(SecurityUserService);
  private readonly questionnaireService = inject(QuestionnaireQuestionnaireApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);
  private readonly auth = inject(AuthService);

  readonly searchLabel = POSITIONS_SEARCH_LABEL;
  readonly searchPlaceholder = POSITIONS_SEARCH_PLACEHOLDER;
  readonly filterStatus = POSITIONS_FILTER_STATUS;
  readonly filterRecruiter = POSITIONS_FILTER_RECRUITER;
  readonly filterRecruiterPlaceholder = POSITIONS_FILTER_RECRUITER_PLACEHOLDER;
  readonly filterCountry = POSITIONS_FILTER_COUNTRY;
  readonly filterAll = POSITIONS_FILTER_ALL;
  readonly filterDateFrom = POSITIONS_FILTER_DATE_FROM;
  readonly filterDateTo = POSITIONS_FILTER_DATE_TO;
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
  advancedFiltersOpen = false;
  data: PositionListItem[] = [];
  countryOptions: CatalogCountry[] = [];
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
    dateTo: [''],
    client: [''],
    requisitionTypeId: [0],
    coverageTypeId: [0],
    brandId: [0],
    workplaceId: [0],
    shiftId: [0],
    contractTypeId: [0],
    educationLevelId: [0],
    responsibilityLevelId: [0],
    clientPosition: [''],
    createdByIds: [[] as number[]],
    careResponsibleUserId: [0],
    careResponsibleAts: [''],
    stateId: [0],
    generalCategoryId: [0],
    questionnaireId: [0],
  });

  private readonly defaultFilterValues = this.filters.getRawValue();

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
      },
    });
    this.loadUsers();
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

  private loadUsers(): void {
    this.userService.list(0, 200).subscribe({
      next: (res) => {
        const activeUsers = res.items.filter((u) => u.isActive);
        this.coordinatorUserOptions = activeUsers;
        const creatorRoles = new Set(['ADMIN', 'GLOBAL_ADMIN', 'RECRUITER']);
        const roleFiltered = activeUsers.filter((u) =>
          u.roles?.some((r) => creatorRoles.has(r.name)),
        );
        this.creatorUserOptions = roleFiltered.length ? roleFiltered : activeUsers;
      },
    });
  }

  private onCountryChanged(countryId: number): void {
    this.resetCountryDependentFilters();
    if (countryId <= 0) {
      this.clearCountryDependentOptions();
      return;
    }
    this.loadCountryDependentOptions(countryId);
  }

  private resetCountryDependentFilters(): void {
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

  private clearCountryDependentOptions(): void {
    this.brandOptions = [];
    this.coverageTypeOptions = [];
    this.shiftOptions = [];
    this.educationLevelOptions = [];
    this.contractTypeOptions = [];
    this.requisitionTypeOptions = [];
    this.workplaceOptions = [];
    this.responsibilityLevelOptions = [];
    this.generalCategoryOptions = [];
    this.stateOptions = [];
  }

  private loadCountryDependentOptions(countryId: number): void {
    this.catalogPositionService.listBrands(countryId, 0, 200).subscribe({
      next: (items) => {
        this.brandOptions = items;
      },
    });
    this.catalogPositionService.listCoverageTypes(countryId, 0, 200).subscribe({
      next: (items) => {
        this.coverageTypeOptions = items;
      },
    });
    this.catalogPositionService.listShifts(countryId, 0, 200).subscribe({
      next: (items) => {
        this.shiftOptions = items;
      },
    });
    this.catalogPositionService.listEducationLevels(countryId, 0, 200).subscribe({
      next: (items) => {
        this.educationLevelOptions = items;
      },
    });
    this.catalogPositionService.listContractTypes(countryId, 0, 200).subscribe({
      next: (items) => {
        this.contractTypeOptions = items;
      },
    });
    this.catalogPositionService.listRequisitionTypes(countryId, 0, 200).subscribe({
      next: (items) => {
        this.requisitionTypeOptions = items;
      },
    });
    this.workplaceService.list(countryId, 0, 200).subscribe({
      next: (res) => {
        this.workplaceOptions = res.items;
      },
    });
    this.responsibilityLevelService.list(countryId, 0, 200).subscribe({
      next: (res) => {
        this.responsibilityLevelOptions = res.items;
      },
    });
    this.generalCategoryService.list(countryId, 0, 200).subscribe({
      next: (res) => {
        this.generalCategoryOptions = res.items;
      },
    });
    this.geographyService.listStates(countryId, 0, 200).subscribe({
      next: (items) => {
        this.stateOptions = items;
      },
    });
  }

  private positiveIdOrNull(id: number): number | null {
    return id > 0 ? id : null;
  }

  openNewRequisition(): void {
    this.dialog
      .open(RequisitionScopeDialogComponent, {
        width: '480px',
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
    const dateFrom = f.dateFrom || null;
    const dateTo = f.dateTo || null;
    this.positionService
      .list(this.pageIndex, this.pageSize, {
        status: status !== 'Todos' ? status : null,
        search: f.search,
        createdFrom: dateFrom,
        createdTo: dateTo,
        countryId: countryId > 0 ? countryId : null,
        recruiter: f.recruiter,
        client: f.client,
        requisitionTypeId: this.positiveIdOrNull(f.requisitionTypeId),
        coverageTypeId: this.positiveIdOrNull(f.coverageTypeId),
        brandId: this.positiveIdOrNull(f.brandId),
        workplaceId: this.positiveIdOrNull(f.workplaceId),
        shiftId: this.positiveIdOrNull(f.shiftId),
        contractTypeId: this.positiveIdOrNull(f.contractTypeId),
        educationLevelId: this.positiveIdOrNull(f.educationLevelId),
        responsibilityLevelId: this.positiveIdOrNull(f.responsibilityLevelId),
        clientPosition: f.clientPosition,
        createdByIds: f.createdByIds.length ? f.createdByIds : null,
        careResponsibleUserId: this.positiveIdOrNull(f.careResponsibleUserId),
        careResponsibleAts: f.careResponsibleAts,
        stateId: this.positiveIdOrNull(f.stateId),
        generalCategoryId: this.positiveIdOrNull(f.generalCategoryId),
        questionnaireId: this.positiveIdOrNull(f.questionnaireId),
      })
      .subscribe({
        next: (res) => {
          this.data = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open(POSITIONS_LOAD_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
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
    this.advancedFiltersOpen = false;
    this.clearCountryDependentOptions();
    this.snack.open(POSITIONS_FILTERS_CLEARED, POSITIONS_SNACK_CLOSE, { duration: 2500 });
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
        this.snack.open(positionsDuplicateSuccess(res.id), POSITIONS_SNACK_CLOSE, { duration: 4000 });
        void this.router.navigate(['/positions', res.id, 'edit']);
      },
      error: () => {
        this.snack.open(POSITIONS_DUPLICATE_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  publishOnPortal(row: PositionListItem): void {
    if (!confirm(POSITIONS_PUBLISH_ON_PORTAL_CONFIRM)) {
      return;
    }
    this.positionService.publishOnPortal(row.id).subscribe({
      next: () => {
        this.snack.open(POSITIONS_PUBLISH_ON_PORTAL_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3500 });
      },
      error: () => {
        this.snack.open(POSITIONS_PUBLISH_ON_PORTAL_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  cancelPosition(row: PositionListItem): void {
    if (!this.canDirectCancel() || row.status === 'CANCELLED') {
      return;
    }
    if (!confirm(positionsCancelConfirm(row.requisitionNo))) {
      return;
    }
    this.dialog
      .open(PositionReasonDialogComponent, {
        width: '480px',
        data: { required: false, title: this.actionCancelDirect },
      })
      .afterClosed()
      .subscribe((reason: string | null | undefined) => {
        if (reason === undefined) {
          return;
        }
        this.positionService.delete(row.id, reason).subscribe({
          next: () => {
            this.reloadAndNotify();
            this.snack.open(POSITIONS_CANCEL_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
          },
          error: () => {
            this.snack.open(POSITIONS_CANCEL_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
          },
        });
      });
  }

  requestCancellation(row: PositionListItem): void {
    if (!this.canRequestCancellation()) {
      return;
    }
    if (row.status !== 'DRAFT' && row.status !== 'ACTIVE') {
      return;
    }
    if (!confirm(positionsRequestCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.dialog
      .open(PositionReasonDialogComponent, {
        width: '480px',
        data: { required: true, title: this.actionRequestCancellation },
      })
      .afterClosed()
      .subscribe((reason: string | null | undefined) => {
        if (!reason) {
          return;
        }
        this.positionService.requestCancellation(row.id, reason).subscribe({
          next: () => {
            this.reloadAndNotify();
            this.snack.open(POSITIONS_REQUEST_CANCELLATION_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
          },
          error: () => {
            this.snack.open(POSITIONS_REQUEST_CANCELLATION_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
          },
        });
      });
  }

  approveCancellation(row: PositionListItem): void {
    if (!this.canEdit() || row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(positionsApproveCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.approveCancellation(row.id).subscribe({
      next: () => {
        this.reloadAndNotify();
        this.snack.open(POSITIONS_APPROVE_CANCELLATION_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(POSITIONS_APPROVE_CANCELLATION_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  rejectCancellation(row: PositionListItem): void {
    if (!this.canEdit() || row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(positionsRejectCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.dialog
      .open(PositionReasonDialogComponent, {
        width: '480px',
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
            this.snack.open(POSITIONS_REJECT_CANCELLATION_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
          },
          error: () => {
            this.snack.open(POSITIONS_REJECT_CANCELLATION_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
          },
        });
      });
  }

  executeCancellation(row: PositionListItem): void {
    if (!this.canExecuteCancellation() || row.status !== 'CANCELLATION_AUTHORIZED') {
      return;
    }
    if (!confirm(positionsExecuteCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.executeCancellation(row.id).subscribe({
      next: () => {
        this.reloadAndNotify();
        this.snack.open(POSITIONS_EXECUTE_CANCELLATION_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(POSITIONS_EXECUTE_CANCELLATION_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  openHistory(row: PositionListItem): void {
    this.dialog.open(PositionEventsDialogComponent, {
      width: '560px',
      data: { positionId: row.id, requisitionNo: row.requisitionNo },
    });
  }

  reassignPosition(row: PositionListItem): void {
    if (!this.canEdit() || row.status === 'CANCELLED') {
      return;
    }
    this.dialog
      .open(ReassignPositionDialogComponent, {
        width: '480px',
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
            this.snack.open(POSITIONS_REASSIGN_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
          },
          error: () => {
            this.snack.open(POSITIONS_REASSIGN_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
          },
        });
      });
  }

  openPoolDialog(row: PositionListItem): void {
    const ref = this.dialog.open<CandidatePoolDialogComponent, CandidatePoolDialogData>(
      CandidatePoolDialogComponent,
      {
        width: '760px',
        maxWidth: '95vw',
        data: { positionId: row.id, requisitionNo: row.requisitionNo },
      },
    );
    ref.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.reloadAndNotify();
        this.snack.open(
          positionsCandidatesApplied(result.created, row.requisitionNo),
          POSITIONS_SNACK_CLOSE,
          { duration: 4000 },
        );
      }
    });
  }

  openApplicationsDialog(row: PositionListItem): void {
    this.dialog.open<PositionApplicationsDialogComponent, PositionApplicationsDialogData>(
      PositionApplicationsDialogComponent,
      {
        width: '720px',
        maxWidth: '95vw',
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
      error: () => {
        this.snack.open(POSITIONS_GENERATE_PUBLICATION_LOAD_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  openCvBulkUpload(row: PositionListItem): void {
    this.dialog.open(CvBulkUploadDialogComponent, {
      width: '560px',
      data: {
        positionId: row.id,
        positionName: row.name ?? `#${row.id}`,
      } as CvBulkUploadDialogData,
    });
  }

  openExcelBulkUpload(row: PositionListItem): void {
    this.dialog.open(ExcelBulkUploadDialogComponent, {
      width: '920px',
      maxWidth: '96vw',
      data: {
        positionId: row.id,
        positionName: row.name ?? `#${row.id}`,
      } as ExcelBulkUploadDialogData,
    });
  }

  private openPublicationGenerateDialog(positionId: number, contactEmail: string, contactPhone: string): void {
    this.dialog.open(PublicationGenerateDialogComponent, {
      width: '1176px',
      maxWidth: '98vw',
      maxHeight: '95vh',
      height: '95vh',
      autoFocus: 'first-heading',
      data: { positionId, contactEmail, contactPhone } as PublicationGenerateDialogData,
    });
  }
}
