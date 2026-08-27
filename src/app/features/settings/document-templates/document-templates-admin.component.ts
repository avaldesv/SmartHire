import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { debounceTime, filter } from 'rxjs';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  catalogDialogConfig,
  catalogTallDialogConfig,
} from '../../../core/dialog/catalog-dialog.constants';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { COMMON_CLEAR_FILTERS } from '../../../core/i18n/common-labels';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import {
  DOCTEMPLATES_PAGE_TITLE,
  DOCTEMPLATES_TAB_TEMPLATES,
  DOCTEMPLATES_TAB_VARIABLES,
  DOCTEMPLATES_TPL_COL_ACTIVE,
  DOCTEMPLATES_TPL_COL_FILENAME,
  DOCTEMPLATES_TPL_COL_NAME,
  DOCTEMPLATES_TPL_COL_VARIABLES,
  DOCTEMPLATES_TPL_DOWNLOAD,
  DOCTEMPLATES_TPL_EMPTY,
  DOCTEMPLATES_TPL_ERRORS_DELETE,
  DOCTEMPLATES_TPL_ERRORS_DOWNLOAD,
  DOCTEMPLATES_TPL_ERRORS_LIST,
  DOCTEMPLATES_TPL_NEW_BUTTON,
  DOCTEMPLATES_TPL_SEARCH,
  DOCTEMPLATES_TPL_SUCCESS_DELETED,
  DOCTEMPLATES_TPL_SUCCESS_SAVED,
  DOCTEMPLATES_VAR_COL_ACTIVE,
  DOCTEMPLATES_VAR_COL_CODE,
  DOCTEMPLATES_VAR_COL_DESCRIPTION,
  DOCTEMPLATES_VAR_COL_IN_USE,
  DOCTEMPLATES_VAR_COL_LABEL,
  DOCTEMPLATES_VAR_EMPTY,
  DOCTEMPLATES_VAR_ERRORS_DELETE,
  DOCTEMPLATES_VAR_ERRORS_LIST,
  DOCTEMPLATES_VAR_IN_USE_NO,
  DOCTEMPLATES_VAR_IN_USE_YES,
  DOCTEMPLATES_VAR_NEW_BUTTON,
  DOCTEMPLATES_VAR_SEARCH,
  DOCTEMPLATES_VAR_SUCCESS_DELETED,
  DOCTEMPLATES_VAR_SUCCESS_SAVED,
  documentTemplateVariableDeleteConfirm,
  documentTemplatesDeleteConfirm,
} from '../../../core/i18n/document-templates-labels';
import { DocumentTemplateApiService } from '../../../core/services/document-template-api.service';
import { DocumentTemplateVariableApiService } from '../../../core/services/document-template-variable-api.service';
import { PermissionService } from '../../../core/services/permission.service';
import { ShPaginatorComponent } from '../../../shared/components/paginator/sh-paginator.component';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import {
  DocumentTemplateItem,
  DocumentTemplateVariableItem,
} from '../../../shared/models/document-template.model';
import {
  DocumentTemplateFormDialogComponent,
  DocumentTemplateFormDialogData,
} from './document-template-form-dialog.component';
import {
  DocumentTemplateVariableFormDialogComponent,
  DocumentTemplateVariableFormDialogData,
} from './document-template-variable-form-dialog.component';

@Component({
  selector: 'sh-document-templates-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    ShPaginatorComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TableRowActionsComponent,
  ],
  templateUrl: './document-templates-admin.component.html',
  styleUrl: './document-templates-admin.component.scss',
})
export class DocumentTemplatesAdminComponent implements OnInit {
  private readonly variableApi = inject(DocumentTemplateVariableApiService);
  private readonly templateApi = inject(DocumentTemplateApiService);
  private readonly permissions = inject(PermissionService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly pageTitle = DOCTEMPLATES_PAGE_TITLE;
  readonly tabVariables = DOCTEMPLATES_TAB_VARIABLES;
  readonly tabTemplates = DOCTEMPLATES_TAB_TEMPLATES;
  readonly clearFiltersLabel = COMMON_CLEAR_FILTERS;

  readonly varNewButton = DOCTEMPLATES_VAR_NEW_BUTTON;
  readonly varSearchLabel = DOCTEMPLATES_VAR_SEARCH;
  readonly varColCode = DOCTEMPLATES_VAR_COL_CODE;
  readonly varColLabel = DOCTEMPLATES_VAR_COL_LABEL;
  readonly varColDescription = DOCTEMPLATES_VAR_COL_DESCRIPTION;
  readonly varColInUse = DOCTEMPLATES_VAR_COL_IN_USE;
  readonly varColActive = DOCTEMPLATES_VAR_COL_ACTIVE;
  readonly varEmpty = DOCTEMPLATES_VAR_EMPTY;
  readonly varInUseYes = DOCTEMPLATES_VAR_IN_USE_YES;
  readonly varInUseNo = DOCTEMPLATES_VAR_IN_USE_NO;

  readonly tplNewButton = DOCTEMPLATES_TPL_NEW_BUTTON;
  readonly tplSearchLabel = DOCTEMPLATES_TPL_SEARCH;
  readonly tplColName = DOCTEMPLATES_TPL_COL_NAME;
  readonly tplColFileName = DOCTEMPLATES_TPL_COL_FILENAME;
  readonly tplColActive = DOCTEMPLATES_TPL_COL_ACTIVE;
  readonly tplColVariables = DOCTEMPLATES_TPL_COL_VARIABLES;
  readonly tplEmpty = DOCTEMPLATES_TPL_EMPTY;
  readonly tplDownload = DOCTEMPLATES_TPL_DOWNLOAD;

  activeTabIndex = 0;
  variablesLoading = true;
  templatesLoading = true;
  deletingId: number | null = null;
  downloadingId: number | null = null;

  private allVariables: DocumentTemplateVariableItem[] = [];
  variables: DocumentTemplateVariableItem[] = [];
  variablesTotal = 0;
  variablesPageIndex = 0;
  variablesPageSize = 10;

  private allTemplates: DocumentTemplateItem[] = [];
  templates: DocumentTemplateItem[] = [];
  templatesTotal = 0;
  templatesPageIndex = 0;
  templatesPageSize = 10;

  readonly variableColumns = ['code', 'label', 'description', 'inUse', 'isActive', 'actions'];
  readonly templateColumns = ['name', 'usedVariableCodes', 'fileName', 'isActive', 'actions'];

  readonly templatesSearchForm = this.fb.nonNullable.group({ search: [''] });
  readonly variablesSearchForm = this.fb.nonNullable.group({ search: [''] });

  private variablesLoaded = false;
  private templatesLoaded = false;

  ngOnInit(): void {
    this.loadTemplates();
    this.templatesSearchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.templatesPageIndex = 0;
      this.applyTemplatesFilter();
    });
    this.variablesSearchForm.controls.search.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.variablesPageIndex = 0;
      this.applyVariablesFilter();
    });
  }

  canCreate(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_CATALOGS_CREATE);
  }

  canEdit(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_CATALOGS_EDIT);
  }

  canDelete(): boolean {
    return this.permissions.hasAuthority(AppPermissions.SETTINGS_CATALOGS_DELETE);
  }

  onTabChange(index: number): void {
    this.activeTabIndex = index;
    if (index === 0 && !this.templatesLoaded) {
      this.loadTemplates();
    }
    if (index === 1 && !this.variablesLoaded) {
      this.loadVariables();
    }
  }

  loadVariables(): void {
    this.variablesLoading = true;
    this.variableApi.list(0, 500).subscribe({
      next: ({ items }) => {
        this.allVariables = items;
        this.applyVariablesFilter();
        this.variablesLoading = false;
        this.variablesLoaded = true;
      },
      error: (err) => {
        this.variablesLoading = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_VAR_ERRORS_LIST });
      },
    });
  }

  loadTemplates(): void {
    this.templatesLoading = true;
    this.templateApi.list(0, 500).subscribe({
      next: ({ items }) => {
        this.allTemplates = items;
        this.applyTemplatesFilter();
        this.templatesLoading = false;
        this.templatesLoaded = true;
      },
      error: (err) => {
        this.templatesLoading = false;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_TPL_ERRORS_LIST });
      },
    });
  }

  private applyVariablesFilter(): void {
    const q = this.variablesSearchForm.controls.search.value.trim().toLowerCase();
    const filtered = !q
      ? this.allVariables
      : this.allVariables.filter(
          (row) =>
            row.code?.toLowerCase().includes(q) ||
            row.label?.toLowerCase().includes(q) ||
            (row.description ?? '').toLowerCase().includes(q),
        );
    this.variablesTotal = filtered.length;
    const start = this.variablesPageIndex * this.variablesPageSize;
    this.variables = filtered.slice(start, start + this.variablesPageSize);
  }

  private applyTemplatesFilter(): void {
    const q = this.templatesSearchForm.controls.search.value.trim().toLowerCase();
    const filtered = !q
      ? this.allTemplates
      : this.allTemplates.filter(
          (row) =>
            row.name?.toLowerCase().includes(q) ||
            (row.fileName ?? '').toLowerCase().includes(q) ||
            (row.usedVariableCodes ?? []).some((code) => code.toLowerCase().includes(q)),
        );
    this.templatesTotal = filtered.length;
    const start = this.templatesPageIndex * this.templatesPageSize;
    this.templates = filtered.slice(start, start + this.templatesPageSize);
  }

  onVariablesPage(event: PageEvent): void {
    this.variablesPageIndex = event.pageIndex;
    this.variablesPageSize = event.pageSize;
    this.applyVariablesFilter();
  }

  onTemplatesPage(event: PageEvent): void {
    this.templatesPageIndex = event.pageIndex;
    this.templatesPageSize = event.pageSize;
    this.applyTemplatesFilter();
  }

  clearTemplatesFilters(): void {
    this.templatesSearchForm.controls.search.setValue('');
    this.templatesPageIndex = 0;
    this.applyTemplatesFilter();
  }

  clearVariablesFilters(): void {
    this.variablesSearchForm.controls.search.setValue('');
    this.variablesPageIndex = 0;
    this.applyVariablesFilter();
  }

  openCreateVariable(): void {
    if (!this.canCreate()) {
      return;
    }
    this.openVariableDialog({});
  }

  openEditVariable(row: DocumentTemplateVariableItem): void {
    if (!this.canEdit()) {
      return;
    }
    this.openVariableDialog({ variable: row });
  }

  deleteVariable(row: DocumentTemplateVariableItem): void {
    if (!this.canDelete() || row.inUse) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: documentTemplateVariableDeleteConfirm(row.code),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.deletingId = row.id;
        this.variableApi.delete(row.id).subscribe({
          next: () => {
            this.deletingId = null;
            this.feedback.showSuccess(DOCTEMPLATES_VAR_SUCCESS_DELETED);
            this.loadVariables();
          },
          error: (err) => {
            this.deletingId = null;
            this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_VAR_ERRORS_DELETE });
          },
        });
      });
  }

  inUseTitle(row: DocumentTemplateVariableItem): string {
    return row.usedInTemplateNames?.length ? row.usedInTemplateNames.join(', ') : '';
  }

  private openVariableDialog(data: DocumentTemplateVariableFormDialogData): void {
    const ref = this.dialog.open<
      DocumentTemplateVariableFormDialogComponent,
      DocumentTemplateVariableFormDialogData,
      boolean
    >(DocumentTemplateVariableFormDialogComponent, {
      ...catalogDialogConfig('520px'),
      autoFocus: 'first-heading',
      data,
    });
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.feedback.showSuccess(DOCTEMPLATES_VAR_SUCCESS_SAVED);
        this.loadVariables();
      });
  }

  openCreateTemplate(): void {
    if (!this.canCreate()) {
      return;
    }
    this.openTemplateDialog({});
  }

  openEditTemplate(row: DocumentTemplateItem): void {
    if (!this.canEdit()) {
      return;
    }
    this.openTemplateDialog({ templateId: row.id });
  }

  private openTemplateDialog(data: DocumentTemplateFormDialogData): void {
    const ref = this.dialog.open<DocumentTemplateFormDialogComponent, DocumentTemplateFormDialogData, boolean>(
      DocumentTemplateFormDialogComponent,
      {
        ...catalogTallDialogConfig('960px'),
        autoFocus: 'first-heading',
        data,
      },
    );
    ref
      .afterClosed()
      .pipe(filter((saved): saved is boolean => saved === true))
      .subscribe(() => {
        this.feedback.showSuccess(DOCTEMPLATES_TPL_SUCCESS_SAVED);
        this.loadTemplates();
      });
  }

  downloadTemplate(row: DocumentTemplateItem): void {
    this.downloadingId = row.id;
    this.templateApi.download(row.id).subscribe({
      next: ({ downloadUrl }) => {
        this.downloadingId = null;
        if (downloadUrl) {
          window.open(downloadUrl, '_blank', 'noopener');
        } else {
          this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, DOCTEMPLATES_TPL_ERRORS_DOWNLOAD);
        }
      },
      error: (err) => {
        this.downloadingId = null;
        this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_TPL_ERRORS_DOWNLOAD });
      },
    });
  }

  deleteTemplate(row: DocumentTemplateItem): void {
    if (!this.canDelete()) {
      return;
    }
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: documentTemplatesDeleteConfirm(row.name),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.deletingId = row.id;
        this.templateApi.delete(row.id).subscribe({
          next: () => {
            this.deletingId = null;
            this.feedback.showSuccess(DOCTEMPLATES_TPL_SUCCESS_DELETED);
            this.loadTemplates();
          },
          error: (err) => {
            this.deletingId = null;
            this.feedback.showApiError(err, { fallbackMessage: DOCTEMPLATES_TPL_ERRORS_DELETE });
          },
        });
      });
  }
}
