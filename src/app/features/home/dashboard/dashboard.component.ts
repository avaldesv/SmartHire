import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { PositionService } from '../../../core/services/position.service';
import {
  DASHBOARD_ACTION_APPLY_CANDIDATES,
  DASHBOARD_ACTION_APPROVE_CANCELLATION,
  DASHBOARD_ACTION_CANCEL_DIRECT,
  DASHBOARD_ACTION_DUPLICATE,
  DASHBOARD_ACTION_EDIT,
  DASHBOARD_ACTION_GO_SELECTION,
  DASHBOARD_ACTION_REJECT_CANCELLATION,
  DASHBOARD_ACTION_REQUEST_CANCELLATION,
  DASHBOARD_ACTION_VIEW_APPLICANTS,
  DASHBOARD_APPROVE_CANCELLATION_ERROR,
  DASHBOARD_APPROVE_CANCELLATION_SUCCESS,
  DASHBOARD_CANCEL_ERROR,
  DASHBOARD_CANCEL_SUCCESS,
  DASHBOARD_CLEAR_FILTERS,
  DASHBOARD_COL_BRAND,
  DASHBOARD_COL_CATEGORY,
  DASHBOARD_COL_CITY,
  DASHBOARD_COL_CLIENT,
  DASHBOARD_COL_CLIENT_KEY,
  DASHBOARD_COL_COUNTRY,
  DASHBOARD_COL_CREATED_AT,
  DASHBOARD_COL_OT,
  DASHBOARD_COL_POSITION,
  DASHBOARD_COL_POSITIONS_COUNT,
  DASHBOARD_COL_RECRUITER,
  DASHBOARD_COL_REQUISITION,
  DASHBOARD_COL_START_DATE,
  DASHBOARD_COL_STATE,
  DASHBOARD_COL_STATUS,
  DASHBOARD_COL_TYPE,
  DASHBOARD_DUPLICATE_ERROR,
  DASHBOARD_FILTER_ALL,
  DASHBOARD_FILTER_COUNTRY,
  DASHBOARD_FILTER_DATE_FROM,
  DASHBOARD_FILTER_DATE_TO,
  DASHBOARD_FILTER_RECRUITER,
  DASHBOARD_FILTER_RECRUITER_PLACEHOLDER,
  DASHBOARD_FILTER_STATUS,
  DASHBOARD_FILTERS_CLEARED,
  DASHBOARD_KPI_INTERESTED,
  DASHBOARD_KPI_INTERESTED_SUB,
  DASHBOARD_KPI_PRESELECTED,
  DASHBOARD_KPI_PRESELECTED_SUB,
  DASHBOARD_KPI_TOTAL_POSITIONS,
  DASHBOARD_KPI_TOTAL_POSITIONS_SUB,
  DASHBOARD_LOAD_KPIS_ERROR,
  DASHBOARD_LOAD_REQUESTS_ERROR,
  DASHBOARD_NEW_REQUISITION,
  DASHBOARD_PAGINATOR_ARIA,
  DASHBOARD_REJECT_CANCELLATION_ERROR,
  DASHBOARD_REJECT_CANCELLATION_SUCCESS,
  DASHBOARD_REQUEST_CANCELLATION_ERROR,
  DASHBOARD_REQUEST_CANCELLATION_SUCCESS,
  DASHBOARD_SEARCH_LABEL,
  DASHBOARD_SEARCH_PLACEHOLDER,
  DASHBOARD_SECTION_REQUESTS,
  DASHBOARD_SNACK_CLOSE,
  DASHBOARD_SUBTITLE,
  DASHBOARD_WELCOME,
  dashboardApproveCancellationConfirm,
  dashboardCancelConfirm,
  dashboardCandidatesApplied,
  dashboardDuplicateSuccess,
  dashboardRejectCancellationConfirm,
  dashboardRequestCancellationConfirm,
} from '../../../core/i18n/dashboard-labels';
import { getRequisitionStatusLabel } from '../../../core/i18n/common-labels';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';
import {
  CandidatePoolDialogComponent,
  CandidatePoolDialogData,
} from '../../candidates/dialogs/candidate-pool-dialog/candidate-pool-dialog.component';
import {
  PositionApplicationsDialogComponent,
  PositionApplicationsDialogData,
} from '../../candidates/dialogs/position-applications-dialog/position-applications-dialog.component';

@Component({
  selector: 'sh-dashboard',
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
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    KpiCardComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly positionService = inject(PositionService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  readonly user = this.auth.currentUser;
  readonly welcomeLabel = DASHBOARD_WELCOME;
  readonly subtitle = DASHBOARD_SUBTITLE;
  readonly kpiTotalPositions = DASHBOARD_KPI_TOTAL_POSITIONS;
  readonly kpiTotalPositionsSub = DASHBOARD_KPI_TOTAL_POSITIONS_SUB;
  readonly kpiPreselected = DASHBOARD_KPI_PRESELECTED;
  readonly kpiPreselectedSub = DASHBOARD_KPI_PRESELECTED_SUB;
  readonly kpiInterested = DASHBOARD_KPI_INTERESTED;
  readonly kpiInterestedSub = DASHBOARD_KPI_INTERESTED_SUB;
  readonly sectionRequests = DASHBOARD_SECTION_REQUESTS;
  readonly newRequisition = DASHBOARD_NEW_REQUISITION;
  readonly searchLabel = DASHBOARD_SEARCH_LABEL;
  readonly searchPlaceholder = DASHBOARD_SEARCH_PLACEHOLDER;
  readonly filterStatus = DASHBOARD_FILTER_STATUS;
  readonly filterRecruiter = DASHBOARD_FILTER_RECRUITER;
  readonly filterRecruiterPlaceholder = DASHBOARD_FILTER_RECRUITER_PLACEHOLDER;
  readonly filterCountry = DASHBOARD_FILTER_COUNTRY;
  readonly filterAll = DASHBOARD_FILTER_ALL;
  readonly filterDateFrom = DASHBOARD_FILTER_DATE_FROM;
  readonly filterDateTo = DASHBOARD_FILTER_DATE_TO;
  readonly clearFiltersLabel = DASHBOARD_CLEAR_FILTERS;
  readonly colRequisition = DASHBOARD_COL_REQUISITION;
  readonly colPosition = DASHBOARD_COL_POSITION;
  readonly colOt = DASHBOARD_COL_OT;
  readonly colClient = DASHBOARD_COL_CLIENT;
  readonly colClientKey = DASHBOARD_COL_CLIENT_KEY;
  readonly colPositionsCount = DASHBOARD_COL_POSITIONS_COUNT;
  readonly colCity = DASHBOARD_COL_CITY;
  readonly colState = DASHBOARD_COL_STATE;
  readonly colBrand = DASHBOARD_COL_BRAND;
  readonly colType = DASHBOARD_COL_TYPE;
  readonly colCategory = DASHBOARD_COL_CATEGORY;
  readonly colCountry = DASHBOARD_COL_COUNTRY;
  readonly colStartDate = DASHBOARD_COL_START_DATE;
  readonly colStatus = DASHBOARD_COL_STATUS;
  readonly colRecruiter = DASHBOARD_COL_RECRUITER;
  readonly colCreatedAt = DASHBOARD_COL_CREATED_AT;
  readonly actionEdit = DASHBOARD_ACTION_EDIT;
  readonly actionGoSelection = DASHBOARD_ACTION_GO_SELECTION;
  readonly actionApplyCandidates = DASHBOARD_ACTION_APPLY_CANDIDATES;
  readonly actionViewApplicants = DASHBOARD_ACTION_VIEW_APPLICANTS;
  readonly actionDuplicate = DASHBOARD_ACTION_DUPLICATE;
  readonly actionRequestCancellation = DASHBOARD_ACTION_REQUEST_CANCELLATION;
  readonly actionApproveCancellation = DASHBOARD_ACTION_APPROVE_CANCELLATION;
  readonly actionRejectCancellation = DASHBOARD_ACTION_REJECT_CANCELLATION;
  readonly actionCancelDirect = DASHBOARD_ACTION_CANCEL_DIRECT;
  readonly paginatorAria = DASHBOARD_PAGINATOR_ARIA;

  loading = true;
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  data: PositionListItem[] = [];
  countryOptions: CatalogCountry[] = [];

  kpis = { totalPositions: 0, preselected: 0, interested: 0 };

  readonly statusOptions = ['Todos', 'DRAFT', 'PENDING_CANCELLATION'];

  readonly displayedColumns = [
    'requisitionNo',
    'name',
    'ot',
    'client',
    'clientKey',
    'positionsCount',
    'city',
    'state',
    'brand',
    'type',
    'category',
    'country',
    'startDate',
    'status',
    'recruiter',
    'createdAt',
    'actions',
  ];

  readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['Todos'],
    countryId: [0],
    recruiter: [''],
    dateFrom: [''],
    dateTo: [''],
  });

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
    this.loadKpis();
    this.loadData();
    this.filters.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.pageIndex = 0;
      this.loadData();
    });
  }

  loadKpis(): void {
    this.positionService.getDashboardKpis().subscribe({
      next: (res) => {
        this.kpis = {
          totalPositions: res.totalPositions,
          preselected: res.preselectedCandidates,
          interested: res.interestedCandidates,
        };
      },
      error: () => {
        this.snack.open(DASHBOARD_LOAD_KPIS_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  loadData(): void {
    this.loading = true;
    const status = this.filters.controls.status.value;
    const search = this.filters.controls.search.value;
    const dateFrom = this.filters.controls.dateFrom.value || null;
    const dateTo = this.filters.controls.dateTo.value || null;
    const countryId = this.filters.controls.countryId.value;
    const recruiter = this.filters.controls.recruiter.value;
    this.positionService
      .list(
        this.pageIndex,
        this.pageSize,
        status !== 'Todos' ? status : null,
        search,
        dateFrom,
        dateTo,
        countryId > 0 ? countryId : null,
        recruiter,
      )
      .subscribe({
        next: (res) => {
          this.data = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open(DASHBOARD_LOAD_REQUESTS_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
        },
      });
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadData();
  }

  clearFilters(): void {
    this.filters.reset({ search: '', status: 'Todos', countryId: 0, recruiter: '', dateFrom: '', dateTo: '' });
    this.snack.open(DASHBOARD_FILTERS_CLEARED, DASHBOARD_SNACK_CLOSE, { duration: 2500 });
  }

  duplicatePosition(row: PositionListItem): void {
    this.positionService.duplicate(row.id).subscribe({
      next: (res) => {
        this.loadKpis();
        this.loadData();
        this.snack.open(dashboardDuplicateSuccess(res.id), DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
      error: () => {
        this.snack.open(DASHBOARD_DUPLICATE_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  cancelPosition(row: PositionListItem): void {
    if (!confirm(dashboardCancelConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.delete(row.id).subscribe({
      next: () => {
        this.loadKpis();
        this.loadData();
        this.snack.open(DASHBOARD_CANCEL_SUCCESS, DASHBOARD_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(DASHBOARD_CANCEL_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  requestCancellation(row: PositionListItem): void {
    if (row.status !== 'DRAFT') {
      return;
    }
    if (!confirm(dashboardRequestCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.requestCancellation(row.id).subscribe({
      next: () => {
        this.loadData();
        this.snack.open(DASHBOARD_REQUEST_CANCELLATION_SUCCESS, DASHBOARD_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(DASHBOARD_REQUEST_CANCELLATION_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  approveCancellation(row: PositionListItem): void {
    if (row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(dashboardApproveCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.approveCancellation(row.id).subscribe({
      next: () => {
        this.loadKpis();
        this.loadData();
        this.snack.open(DASHBOARD_APPROVE_CANCELLATION_SUCCESS, DASHBOARD_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(DASHBOARD_APPROVE_CANCELLATION_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  rejectCancellation(row: PositionListItem): void {
    if (row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(dashboardRejectCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.rejectCancellation(row.id).subscribe({
      next: () => {
        this.loadData();
        this.snack.open(DASHBOARD_REJECT_CANCELLATION_SUCCESS, DASHBOARD_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(DASHBOARD_REJECT_CANCELLATION_ERROR, DASHBOARD_SNACK_CLOSE, { duration: 4000 });
      },
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
        this.loadKpis();
        this.snack.open(
          dashboardCandidatesApplied(result.created, row.requisitionNo),
          DASHBOARD_SNACK_CLOSE,
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
}
