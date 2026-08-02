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
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { PositionService } from '../../../core/services/position.service';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  RequisitionScopeDialogComponent,
  RequisitionScopeDialogResult,
} from '../wizard/requisition-scope-dialog/requisition-scope-dialog.component';
import {
  PublicationGenerateDialogComponent,
  PublicationGenerateDialogData,
} from './publication-generate-dialog/publication-generate-dialog.component';
import {
  CvBulkUploadDialogComponent,
  CvBulkUploadDialogData,
} from './cv-bulk-upload-dialog/cv-bulk-upload-dialog.component';
import {
  ExcelBulkUploadDialogComponent,
  ExcelBulkUploadDialogData,
} from './excel-bulk-upload-dialog/excel-bulk-upload-dialog.component';
import { CV_BULK_ACTION } from '../../../core/i18n/cv-bulk-labels';
import { EXCEL_BULK_ACTION } from '../../../core/i18n/excel-bulk-labels';
import {
  POSITIONS_ACTION_APPROVE_CANCELLATION,
  POSITIONS_ACTION_CANCEL_DIRECT,
  POSITIONS_ACTION_DUPLICATE,
  POSITIONS_ACTION_EXECUTE_CANCELLATION,
  POSITIONS_ACTION_GENERATE_PUBLICATION,
  POSITIONS_ACTION_HISTORY,
  POSITIONS_ACTION_PUBLISH_ON_PORTAL,
  POSITIONS_ACTION_GO_SELECTION_ARIA,
  POSITIONS_ACTION_MORE_ARIA,
  POSITIONS_ACTION_REASSIGN,
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
  POSITIONS_COL_SCOPE,
  POSITIONS_COL_STATE,
  POSITIONS_COL_STATUS,
  POSITIONS_COL_SUPERVISOR,
  POSITIONS_COL_TYPE,
  POSITIONS_DUPLICATE_ERROR,
  POSITIONS_EXECUTE_CANCELLATION_ERROR,
  POSITIONS_EXECUTE_CANCELLATION_SUCCESS,
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
  POSITIONS_REASSIGN_ERROR,
  POSITIONS_REASSIGN_SUCCESS,
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
  positionsExecuteCancellationConfirm,
  positionsRejectCancellationConfirm,
  positionsRequestCancellationConfirm,
  buildDuplicatedPositionName,
} from '../../../core/i18n/positions-labels';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { PositionListItem, PositionUserSummary } from '../../../shared/models/position.model';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { PositionEventsDialogComponent } from './position-events-dialog.component';
import { PositionReasonDialogComponent } from './position-reason-dialog.component';
import {
  ReassignPositionDialogComponent,
  ReassignPositionDialogResult,
} from './reassign-position-dialog.component';

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
  private readonly permissions = inject(PermissionService);
  private readonly auth = inject(AuthService);

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
  readonly actionGeneratePublication = POSITIONS_ACTION_GENERATE_PUBLICATION;
  readonly actionPublishOnPortal = POSITIONS_ACTION_PUBLISH_ON_PORTAL;
  readonly actionCvBulk = CV_BULK_ACTION;
  readonly actionExcelBulk = EXCEL_BULK_ACTION;
  readonly goSelectionAria = POSITIONS_ACTION_GO_SELECTION_ARIA;
  readonly moreActionsAria = POSITIONS_ACTION_MORE_ARIA;

  loading = true;
  data: PositionListItem[] = [];
  countryOptions: CatalogCountry[] = [];
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
    const positionName = buildDuplicatedPositionName(row.name);
    this.positionService.duplicate(row.id, positionName).subscribe({
      next: (res) => {
        this.load();
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
            this.load();
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
            this.load();
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
        this.load();
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
            this.load();
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
        this.load();
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
            this.load();
            this.snack.open(POSITIONS_REASSIGN_SUCCESS, POSITIONS_SNACK_CLOSE, { duration: 3000 });
          },
          error: () => {
            this.snack.open(POSITIONS_REASSIGN_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
          },
        });
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
