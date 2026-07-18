import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  PUBTEMPLATES_COL_ACTIVE,
  PUBTEMPLATES_COL_DEFAULT,
  PUBTEMPLATES_COL_LOCALE,
  PUBTEMPLATES_COL_NAME,
  PUBTEMPLATES_EMPTY,
  PUBTEMPLATES_ERRORS_DELETE,
  PUBTEMPLATES_ERRORS_LIST,
  PUBTEMPLATES_NEW_BUTTON,
  PUBTEMPLATES_PAGE_TITLE,
  PUBTEMPLATES_SNACK_CLOSE,
  PUBTEMPLATES_SUCCESS_DELETED,
  PUBTEMPLATES_SUCCESS_SAVED,
  publicationTemplatesDeleteConfirm,
} from '../../../core/i18n/publication-templates-labels';
import { PermissionService } from '../../../core/services/permission.service';
import { PublicationTemplateApiService } from '../../../core/services/publication-template-api.service';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { PublicationTemplateItem } from '../../../shared/models/publication-template.model';
import {
  PublicationTemplateFormDialogComponent,
  PublicationTemplateFormDialogData,
} from './publication-template-form-dialog.component';

@Component({
  selector: 'sh-publication-templates-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TableRowActionsComponent,
  ],
  templateUrl: './publication-templates-admin.component.html',
  styleUrl: './publication-templates-admin.component.scss',
})
export class PublicationTemplatesAdminComponent implements OnInit {
  private readonly api = inject(PublicationTemplateApiService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  loading = true;
  deletingId: number | null = null;
  data: PublicationTemplateItem[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['name', 'locale', 'isDefault', 'isActive', 'actions'];

  readonly pageTitle = PUBTEMPLATES_PAGE_TITLE;
  readonly newButton = PUBTEMPLATES_NEW_BUTTON;
  readonly columnName = PUBTEMPLATES_COL_NAME;
  readonly columnLocale = PUBTEMPLATES_COL_LOCALE;
  readonly columnDefault = PUBTEMPLATES_COL_DEFAULT;
  readonly columnActive = PUBTEMPLATES_COL_ACTIVE;
  readonly emptyLabel = PUBTEMPLATES_EMPTY;

  ngOnInit(): void {
    this.load();
  }

  canCreate(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_PUBLICATION_CREATE);
  }

  canEdit(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_PUBLICATION_EDIT);
  }

  canDelete(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_PUBLICATION_DELETE);
  }

  load(): void {
    this.loading = true;
    this.api.list(this.pageIndex, this.pageSize).subscribe({
      next: ({ items, total }) => {
        this.data = items;
        this.total = total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(PUBTEMPLATES_ERRORS_LIST, PUBTEMPLATES_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  openCreate(): void {
    this.openDialog({});
  }

  openEdit(row: PublicationTemplateItem): void {
    if (!this.canEdit()) {
      return;
    }
    this.openDialog({ templateId: row.id });
  }

  private openDialog(data: PublicationTemplateFormDialogData): void {
    const ref = this.dialog.open<PublicationTemplateFormDialogComponent, PublicationTemplateFormDialogData, boolean>(
      PublicationTemplateFormDialogComponent,
      { width: '820px', maxWidth: '95vw', data },
    );
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.snack.open(PUBTEMPLATES_SUCCESS_SAVED, PUBTEMPLATES_SNACK_CLOSE, { duration: 2500 });
        this.load();
      });
  }

  deleteTemplate(row: PublicationTemplateItem): void {
    if (!this.canDelete()) {
      return;
    }
    if (!confirm(publicationTemplatesDeleteConfirm(row.name))) {
      return;
    }
    this.deletingId = row.id;
    this.api.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        this.snack.open(PUBTEMPLATES_SUCCESS_DELETED, PUBTEMPLATES_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(PUBTEMPLATES_ERRORS_DELETE, PUBTEMPLATES_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }
}
