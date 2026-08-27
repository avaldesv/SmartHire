import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { COMMON_CLEAR_FILTERS } from '../../../core/i18n/common-labels';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { debounceTime, filter } from 'rxjs';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  PUBTEMPLATES_COL_ACTIVE,
  PUBTEMPLATES_COL_DEFAULT,
  PUBTEMPLATES_COL_LOCALE,
  PUBTEMPLATES_COL_NAME,
  PUBTEMPLATES_EMPTY,
  PUBTEMPLATES_ERRORS_ALL_LOCALES_USED,
  PUBTEMPLATES_ERRORS_DELETE,
  PUBTEMPLATES_ERRORS_LIST,
  PUBTEMPLATES_NEW_BUTTON,
  PUBTEMPLATES_PAGE_TITLE,
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
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    TableRowActionsComponent,
  ],
  templateUrl: './publication-templates-admin.component.html',
  styleUrl: './publication-templates-admin.component.scss',
})
export class PublicationTemplatesAdminComponent implements OnInit {
  private readonly api = inject(PublicationTemplateApiService);
  private readonly permissions = inject(PermissionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  loading = true;
  deletingId: number | null = null;
  private allItems: PublicationTemplateItem[] = [];
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
  readonly clearFiltersLabel = COMMON_CLEAR_FILTERS;
  readonly searchLabel = $localize`:@@pubtemplates.search:Buscar plantilla`;

  readonly searchForm = this.fb.nonNullable.group({ search: [''] });

  ngOnInit(): void {
    this.load();
    this.searchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.applyFilter();
    });
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
    this.api.list(0, 100).subscribe({
      next: ({ items }) => {
        this.allItems = items;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: PUBTEMPLATES_ERRORS_LIST });
      },
    });
  }

  private applyFilter(): void {
    const q = this.searchForm.controls.search.value.trim().toLowerCase();
    const filtered = !q
      ? this.allItems
      : this.allItems.filter(
          (r) =>
            r.name?.toLowerCase().includes(q) ||
            (r.locale ?? '').toLowerCase().includes(q),
        );
    this.total = filtered.length;
    const start = this.pageIndex * this.pageSize;
    this.data = filtered.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  clearFilters(): void {
    this.searchForm.controls.search.setValue('');
    this.pageIndex = 0;
    this.applyFilter();
  }

  openCreate(): void {
    if (!this.canCreate()) {
      return;
    }
    this.api.list(0, 100).subscribe({
      next: ({ items }) => {
        const usedLocales = [...new Set(items.map((item) => item.locale.trim().toLowerCase()))];
        const available = ['es', 'en', 'pt'].filter((locale) => !usedLocales.includes(locale));
        if (available.length === 0) {
          this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, PUBTEMPLATES_ERRORS_ALL_LOCALES_USED);
          return;
        }
        this.openDialog({ usedLocales });
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: PUBTEMPLATES_ERRORS_LIST });
      },
    });
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
      {
        width: '1176px',
        maxWidth: '98vw',
        maxHeight: '95vh',
        height: '95vh',
        autoFocus: 'first-heading',
        data,
      },
    );
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.feedback.showSuccess(PUBTEMPLATES_SUCCESS_SAVED);
        this.load();
      });
  }

  deleteTemplate(row: PublicationTemplateItem): void {
    if (!this.canDelete()) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: publicationTemplatesDeleteConfirm(row.name),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.deletingId = row.id;
        this.api.delete(row.id).subscribe({
          next: () => {
            this.deletingId = null;
            this.feedback.showSuccess(PUBTEMPLATES_SUCCESS_DELETED);
            this.load();
          },
          error: (err) => {
            this.deletingId = null;
            this.feedback.showApiError(err, { fallbackMessage: PUBTEMPLATES_ERRORS_DELETE });
          },
        });
      });
  }
}
