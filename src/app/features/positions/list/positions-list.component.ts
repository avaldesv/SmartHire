import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { debounceTime } from 'rxjs';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { PositionService } from '../../../core/services/position.service';
import {
  RequisitionScopeDialogComponent,
  RequisitionScopeDialogResult,
} from '../wizard/requisition-scope-dialog/requisition-scope-dialog.component';
import {
  PublicationGenerateDialogComponent,
  PublicationGenerateDialogData,
} from './publication-generate-dialog/publication-generate-dialog.component';
import {
  POSITIONS_ACTION_APPROVE_CANCELLATION,
  POSITIONS_ACTION_CANCEL_DIRECT,
  POSITIONS_ACTION_DUPLICATE,
  POSITIONS_ACTION_GENERATE_PUBLICATION,
  POSITIONS_ACTION_PUBLISH_ON_PORTAL,
  POSITIONS_ACTION_GO_SELECTION_ARIA,
  POSITIONS_ACTION_MORE_ARIA,
  POSITIONS_ACTION_REJECT_CANCELLATION,
  POSITIONS_ACTION_REQUEST_CANCELLATION,
  POSITIONS_APPROVE_CANCELLATION_ERROR,
  POSITIONS_APPROVE_CANCELLATION_SUCCESS,
  POSITIONS_CANCEL_ERROR,
  POSITIONS_CANCEL_SUCCESS,
  POSITIONS_CLEAR_FILTERS,
  POSITIONS_COL_BRAND,
  POSITIONS_COL_CATEGORY,
  POSITIONS_COL_CITY,
  POSITIONS_COL_CLIENT,
  POSITIONS_COL_CLIENT_KEY,
  POSITIONS_COL_COUNTRY,
  POSITIONS_COL_CREATED_AT,
  POSITIONS_COL_APPLICANTS,
  POSITIONS_COL_FIRST_DAY,
  POSITIONS_COL_GROUP,
  POSITIONS_COL_NAME,
  POSITIONS_COL_OT,
  POSITIONS_COL_POSITIONS,
  POSITIONS_COL_PRESELECTION,
  POSITIONS_COL_RECRUITER,
  POSITIONS_COL_REQUISITION,
  POSITIONS_COL_STATE,
  POSITIONS_COL_STATUS,
  POSITIONS_COL_TYPE,
  POSITIONS_DUPLICATE_ERROR,
  POSITIONS_FILTER_ALL,
  POSITIONS_FILTER_COUNTRY,
  POSITIONS_FILTER_DATE_FROM,
  POSITIONS_FILTER_DATE_TO,
  POSITIONS_FILTER_RECRUITER,
  POSITIONS_FILTER_RECRUITER_PLACEHOLDER,
  POSITIONS_FILTER_STATUS,
  POSITIONS_FILTERS_CLEARED,
  POSITIONS_GENERATE_PUBLICATION_LOAD_ERROR,
  POSITIONS_LOAD_ERROR,
  POSITIONS_NEW_BUTTON,
  POSITIONS_PAGE_SUBTITLE,
  POSITIONS_PAGE_TITLE,
  POSITIONS_PUBLISH_ON_PORTAL_CONFIRM,
  POSITIONS_PUBLISH_ON_PORTAL_ERROR,
  POSITIONS_PUBLISH_ON_PORTAL_SUCCESS,
  POSITIONS_REJECT_CANCELLATION_ERROR,
  POSITIONS_REJECT_CANCELLATION_SUCCESS,
  POSITIONS_REQUEST_CANCELLATION_ERROR,
  POSITIONS_REQUEST_CANCELLATION_SUCCESS,
  POSITIONS_SEARCH_LABEL,
  POSITIONS_SEARCH_PLACEHOLDER,
  POSITIONS_SNACK_CLOSE,
  positionsApproveCancellationConfirm,
  positionsCancelConfirm,
  positionsDuplicateSuccess,
  positionsRejectCancellationConfirm,
  positionsRequestCancellationConfirm,
} from '../../../core/i18n/positions-labels';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem } from '../../../shared/models/position.model';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';

@Component({
  selector: 'sh-positions-list',
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
    PageHeaderComponent,
    StatusBadgeComponent,
    TableRowActionsComponent,
  ],
  templateUrl: './positions-list.component.html',
  styleUrl: './positions-list.component.scss',
})
export class PositionsListComponent implements OnInit {
  private readonly positionService = inject(PositionService);
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly pageTitle = POSITIONS_PAGE_TITLE;
  readonly pageSubtitle = POSITIONS_PAGE_SUBTITLE;
  readonly newButton = POSITIONS_NEW_BUTTON;
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
  readonly colStatus = POSITIONS_COL_STATUS;
  readonly colRecruiter = POSITIONS_COL_RECRUITER;
  readonly colCreatedAt = POSITIONS_COL_CREATED_AT;
  readonly actionDuplicate = POSITIONS_ACTION_DUPLICATE;
  readonly actionRequestCancellation = POSITIONS_ACTION_REQUEST_CANCELLATION;
  readonly actionApproveCancellation = POSITIONS_ACTION_APPROVE_CANCELLATION;
  readonly actionRejectCancellation = POSITIONS_ACTION_REJECT_CANCELLATION;
  readonly actionCancelDirect = POSITIONS_ACTION_CANCEL_DIRECT;
  readonly actionGeneratePublication = POSITIONS_ACTION_GENERATE_PUBLICATION;
  readonly actionPublishOnPortal = POSITIONS_ACTION_PUBLISH_ON_PORTAL;
  readonly goSelectionAria = POSITIONS_ACTION_GO_SELECTION_ARIA;
  readonly moreActionsAria = POSITIONS_ACTION_MORE_ARIA;

  loading = true;
  data: PositionListItem[] = [];
  countryOptions: CatalogCountry[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly statusOptions = ['Todos', 'DRAFT', 'PENDING_CANCELLATION'];

  readonly filters = this.fb.nonNullable.group({
    search: [''],
    status: ['Todos'],
    countryId: [0],
    recruiter: [''],
    dateFrom: [''],
    dateTo: [''],
  });

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
    'actions',
  ];

  statusLabel(status: string): string {
    return status === 'Todos' ? this.filterAll : status;
  }

  ngOnInit(): void {
    this.geographyService.listCountries(0, 200).subscribe({
      next: (countries) => {
        this.countryOptions = countries.filter((c) => c.isActive);
      },
    });
    this.load();
    this.filters.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
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
    const status = this.filters.controls.status.value;
    const countryId = this.filters.controls.countryId.value;
    const dateFrom = this.filters.controls.dateFrom.value || null;
    const dateTo = this.filters.controls.dateTo.value || null;
    this.positionService
      .list(
        this.pageIndex,
        this.pageSize,
        status !== 'Todos' ? status : null,
        this.filters.controls.search.value,
        dateFrom,
        dateTo,
        countryId > 0 ? countryId : null,
        this.filters.controls.recruiter.value,
      )
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
    this.filters.reset({ search: '', status: 'Todos', countryId: 0, recruiter: '', dateFrom: '', dateTo: '' });
    this.snack.open(POSITIONS_FILTERS_CLEARED, POSITIONS_SNACK_CLOSE, { duration: 2500 });
  }

  duplicatePosition(row: PositionListItem): void {
    this.positionService.duplicate(row.id).subscribe({
      next: (res) => {
        this.load();
        this.snack.open(positionsDuplicateSuccess(res.id), POSITIONS_SNACK_CLOSE, { duration: 4000 });
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
    if (!confirm(positionsCancelConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.delete(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open(POSITIONS_CANCEL_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(POSITIONS_CANCEL_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  requestCancellation(row: PositionListItem): void {
    if (row.status !== 'DRAFT') {
      return;
    }
    if (!confirm(positionsRequestCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.requestCancellation(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open(POSITIONS_REQUEST_CANCELLATION_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(POSITIONS_REQUEST_CANCELLATION_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  approveCancellation(row: PositionListItem): void {
    if (row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(positionsApproveCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.approveCancellation(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open(POSITIONS_APPROVE_CANCELLATION_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(POSITIONS_APPROVE_CANCELLATION_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
  }

  rejectCancellation(row: PositionListItem): void {
    if (row.status !== 'PENDING_CANCELLATION') {
      return;
    }
    if (!confirm(positionsRejectCancellationConfirm(row.requisitionNo))) {
      return;
    }
    this.positionService.rejectCancellation(row.id).subscribe({
      next: () => {
        this.load();
        this.snack.open(POSITIONS_REJECT_CANCELLATION_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
      },
      error: () => {
        this.snack.open(POSITIONS_REJECT_CANCELLATION_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
      },
    });
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
