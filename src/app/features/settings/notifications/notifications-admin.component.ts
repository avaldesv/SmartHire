import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { NotificationTemplateApiService } from '../../../core/services/notification-template-api.service';
import {
  NotificationActionItem,
  NotificationCoverageItem,
  NotificationLogItem,
  NotificationOutboxItem,
  NotificationTemplateItem,
  PreviewNotificationTemplateResponse,
} from '../../../shared/models/notification-template.model';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { CatalogTableImportExportActionsComponent } from '../catalogs/catalog-table-import-export-actions.component';
import { ShModalActionsDirective } from '../../../shared/components/modal-form/sh-modal-form.component';
import {
  NotificationFormDialogShellComponent,
  NOTIFICATION_FORM_DIALOG_PANEL_CLASS,
} from './notification-form-dialog-shell.component';
import {
  NOTIFICATIONS_ACTION_HINT,
  NOTIFICATIONS_INSERT_VARIABLE,
  NOTIFICATIONS_VARIABLES_HINT,
  NOTIFICATIONS_CANCEL,
  NOTIFICATIONS_CHANNELS_REQUIRED,
  NOTIFICATIONS_COLUMN_ACTION,
  NOTIFICATIONS_COLUMN_ACTIVE,
  NOTIFICATIONS_COLUMN_CHANNELS,
  NOTIFICATIONS_COLUMN_DATE,
  NOTIFICATIONS_COLUMN_MESSAGE,
  NOTIFICATIONS_COLUMN_CHANNEL,
  NOTIFICATIONS_COLUMN_RECIPIENT,
  NOTIFICATIONS_COLUMN_STATUS,
  NOTIFICATIONS_COLUMN_TEMPLATE,
  NOTIFICATIONS_SHOW_MORE,
  NOTIFICATIONS_DELETE_ERROR,
  NOTIFICATIONS_DELETE_SUCCESS,
  NOTIFICATIONS_EDIT_TITLE,
  NOTIFICATIONS_FIELD_ACTIVE,
  NOTIFICATIONS_FIELD_CHANNELS,
  NOTIFICATIONS_FIELD_EMAIL_SUBJECT,
  NOTIFICATIONS_FIELD_EXTERNAL_TEMPLATE_ID,
  NOTIFICATIONS_FIELD_INBOX_TITLE,
  NOTIFICATIONS_FIELD_MESSAGE,
  NOTIFICATIONS_FIELD_SYSTEM_ACTION,
  NOTIFICATIONS_LOAD_ERROR,
  NOTIFICATIONS_LOGS_LOAD_ERROR,
  NOTIFICATIONS_NEW_BUTTON,
  NOTIFICATIONS_NEW_TITLE,
  NOTIFICATIONS_PAGE_TITLE,
  NOTIFICATIONS_PLACEHOLDER_TEMPLATE_ID,
  NOTIFICATIONS_PREVIEW_BUTTON,
  NOTIFICATIONS_PREVIEW_ERROR,
  NOTIFICATIONS_PREVIEW_TITLE,
  NOTIFICATIONS_SAVE,
  NOTIFICATIONS_SAVE_ERROR,
  NOTIFICATIONS_SAVE_SUCCESS,
  NOTIFICATIONS_SAVING,
  NOTIFICATIONS_SELECT_ACTION,
  NOTIFICATIONS_SNACK_CLOSE,
  NOTIFICATIONS_TAB_LOGS,
  NOTIFICATIONS_TAB_COVERAGE,
  NOTIFICATIONS_TAB_FAILED,
  NOTIFICATIONS_COVERAGE_MISSING,
  NOTIFICATIONS_COVERAGE_OK,
  NOTIFICATIONS_COVERAGE_LOAD_ERROR,
  NOTIFICATIONS_COLUMN_MODULE,
  NOTIFICATIONS_COLUMN_DESCRIPTION,
  NOTIFICATIONS_COLUMN_COVERAGE,
  NOTIFICATIONS_COLUMN_ATTEMPTS,
  NOTIFICATIONS_COLUMN_ERROR,
  NOTIFICATIONS_FAILED_LOAD_ERROR,
  NOTIFICATIONS_RETRY_BUTTON,
  NOTIFICATIONS_RETRY_SUCCESS,
  NOTIFICATIONS_RETRY_ERROR,
  notificationsCoverageSummary,
  NOTIFICATIONS_TAB_TEMPLATES,
  NOTIFICATIONS_UPDATE_ERROR,
  NOTIFICATION_CHANNEL_OPTIONS,
  NOTIFICATIONS_CHANNEL_EMAIL_VALUE,
  NOTIFICATIONS_CHANNEL_INBOX,
  NOTIFICATIONS_CHANNEL_INBOX_VALUE,
  notificationChannelLabel,
  notificationsDeleteConfirm,
  notificationsToggleMessage,
  NOTIFICATIONS_FILTER_ACTION,
  NOTIFICATIONS_FILTER_ACTIVE,
  NOTIFICATIONS_FILTER_ACTIVE_ALL,
  NOTIFICATIONS_FILTER_ACTIVE_YES,
  NOTIFICATIONS_FILTER_ACTIVE_NO,
  NOTIFICATIONS_FILTER_SEARCH,
  NOTIFICATIONS_FILTER_SEARCH_ACTION,
  NOTIFICATIONS_FILTER_CHANNEL,
  NOTIFICATIONS_FILTER_MODULE,
  NOTIFICATIONS_FILTER_COVERAGE,
  NOTIFICATIONS_FILTER_COVERAGE_ALL,
  NOTIFICATIONS_FILTER_COVERAGE_OK,
  NOTIFICATIONS_FILTER_COVERAGE_MISSING,
  NOTIFICATIONS_FILTER_CLEAR,
} from '../../../core/i18n/notifications-labels';

@Component({
  selector: 'sh-notifications-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatPaginatorModule,
    MatDialogModule,
    TableRowActionsComponent,
    CatalogTableImportExportActionsComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './notifications-admin.component.html',
  styleUrl: './notifications-admin.component.scss',
})
export class NotificationsAdminComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('templateFormTpl') templateFormTpl!: TemplateRef<unknown>;

  /** When true, hides page title and tab headers (used from Catálogos → Notificaciones). */
  @Input() embedded = false;
  /** Which section to show when embedded (or to sync tab index). */
  @Input() section: 'templates' | 'logs' | 'coverage' | 'failed' = 'templates';

  private readonly notificationApi = inject(NotificationTemplateApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly destroy$ = new Subject<void>();
  private formDialogRef: MatDialogRef<NotificationFormDialogShellComponent, boolean> | null = null;

  loading = true;
  logsLoading = false;
  coverageLoading = false;
  failedLoading = false;
  retryingOutboxId: number | null = null;
  saving = false;
  previewLoading = false;
  savingId: number | null = null;
  deletingId: number | null = null;
  editingId: number | null = null;
  data: NotificationTemplateItem[] = [];
  templatesTotal = 0;
  templatesPageIndex = 0;
  templatesPageSize = 25;
  actions: NotificationActionItem[] = [];
  logs: NotificationLogItem[] = [];
  logsTotal = 0;
  logsPageIndex = 0;
  logsPageSize = 25;
  coverageItems: NotificationCoverageItem[] = [];
  coverageTotal = 0;
  coveragePageIndex = 0;
  coveragePageSize = 25;
  coverageSummary = '';
  coverageModules: string[] = [];
  failedOutbox: NotificationOutboxItem[] = [];
  failedTotal = 0;
  failedPageIndex = 0;
  failedPageSize = 25;
  preview: PreviewNotificationTemplateResponse | null = null;
  selectedTabIndex = 0;
  readonly pageSizeOptions = [10, 25, 50];
  readonly columns = ['action', 'channels', 'templateId', 'message', 'active', 'actions'];
  readonly logColumns = ['action', 'channel', 'recipient', 'status', 'renderedPreview', 'createAt'];
  readonly coverageColumns = ['actionCode', 'module', 'description', 'coverage', 'templateChannels'];
  readonly failedColumns = ['actionCode', 'attempts', 'lastError', 'createAt', 'actions'];
  readonly channelOptions = NOTIFICATION_CHANNEL_OPTIONS;
  readonly logChannelOptions = [
    ...NOTIFICATION_CHANNEL_OPTIONS,
    { value: NOTIFICATIONS_CHANNEL_INBOX_VALUE, label: NOTIFICATIONS_CHANNEL_INBOX },
  ];
  readonly channelLabel = notificationChannelLabel;

  readonly pageTitle = NOTIFICATIONS_PAGE_TITLE;
  readonly tabTemplates = NOTIFICATIONS_TAB_TEMPLATES;
  readonly tabLogs = NOTIFICATIONS_TAB_LOGS;
  readonly tabCoverage = NOTIFICATIONS_TAB_COVERAGE;
  readonly tabFailed = NOTIFICATIONS_TAB_FAILED;
  readonly newButton = NOTIFICATIONS_NEW_BUTTON;
  readonly editTitle = NOTIFICATIONS_EDIT_TITLE;
  readonly newTitle = NOTIFICATIONS_NEW_TITLE;
  readonly fieldSystemAction = NOTIFICATIONS_FIELD_SYSTEM_ACTION;
  readonly fieldChannels = NOTIFICATIONS_FIELD_CHANNELS;
  readonly fieldExternalTemplateId = NOTIFICATIONS_FIELD_EXTERNAL_TEMPLATE_ID;
  readonly fieldMessage = NOTIFICATIONS_FIELD_MESSAGE;
  readonly fieldEmailSubject = NOTIFICATIONS_FIELD_EMAIL_SUBJECT;
  readonly fieldInboxTitle = NOTIFICATIONS_FIELD_INBOX_TITLE;
  readonly fieldActive = NOTIFICATIONS_FIELD_ACTIVE;
  readonly columnAction = NOTIFICATIONS_COLUMN_ACTION;
  readonly columnChannels = NOTIFICATIONS_COLUMN_CHANNELS;
  readonly columnTemplate = NOTIFICATIONS_COLUMN_TEMPLATE;
  readonly columnMessage = NOTIFICATIONS_COLUMN_MESSAGE;
  readonly columnChannel = NOTIFICATIONS_COLUMN_CHANNEL;
  readonly columnRecipient = NOTIFICATIONS_COLUMN_RECIPIENT;
  readonly columnStatus = NOTIFICATIONS_COLUMN_STATUS;
  readonly columnDate = NOTIFICATIONS_COLUMN_DATE;
  readonly columnModule = NOTIFICATIONS_COLUMN_MODULE;
  readonly columnDescription = NOTIFICATIONS_COLUMN_DESCRIPTION;
  readonly columnCoverage = NOTIFICATIONS_COLUMN_COVERAGE;
  readonly columnAttempts = NOTIFICATIONS_COLUMN_ATTEMPTS;
  readonly columnError = NOTIFICATIONS_COLUMN_ERROR;
  readonly coverageMissingLabel = NOTIFICATIONS_COVERAGE_MISSING;
  readonly coverageOkLabel = NOTIFICATIONS_COVERAGE_OK;
  readonly retryButton = NOTIFICATIONS_RETRY_BUTTON;
  readonly showMoreLabel = NOTIFICATIONS_SHOW_MORE;
  readonly columnActive = NOTIFICATIONS_COLUMN_ACTIVE;
  readonly messagePreviewLength = 30;
  readonly selectActionLabel = NOTIFICATIONS_SELECT_ACTION;
  readonly actionHintLabel = NOTIFICATIONS_ACTION_HINT;
  readonly variablesHintLabel = NOTIFICATIONS_VARIABLES_HINT;
  readonly insertVariableLabel = NOTIFICATIONS_INSERT_VARIABLE;
  readonly previewButton = NOTIFICATIONS_PREVIEW_BUTTON;
  readonly previewTitle = NOTIFICATIONS_PREVIEW_TITLE;
  readonly filterAction = NOTIFICATIONS_FILTER_ACTION;
  readonly filterActive = NOTIFICATIONS_FILTER_ACTIVE;
  readonly filterActiveAll = NOTIFICATIONS_FILTER_ACTIVE_ALL;
  readonly filterActiveYes = NOTIFICATIONS_FILTER_ACTIVE_YES;
  readonly filterActiveNo = NOTIFICATIONS_FILTER_ACTIVE_NO;
  readonly filterSearch = NOTIFICATIONS_FILTER_SEARCH;
  readonly filterSearchAction = NOTIFICATIONS_FILTER_SEARCH_ACTION;
  readonly filterChannel = NOTIFICATIONS_FILTER_CHANNEL;
  readonly filterModule = NOTIFICATIONS_FILTER_MODULE;
  readonly filterCoverage = NOTIFICATIONS_FILTER_COVERAGE;
  readonly filterCoverageAll = NOTIFICATIONS_FILTER_COVERAGE_ALL;
  readonly filterCoverageOk = NOTIFICATIONS_FILTER_COVERAGE_OK;
  readonly filterCoverageMissing = NOTIFICATIONS_FILTER_COVERAGE_MISSING;
  readonly filterClear = NOTIFICATIONS_FILTER_CLEAR;

  private readonly expandedMessageIds = new Set<number>();
  readonly cancelLabel = NOTIFICATIONS_CANCEL;
  readonly savingLabel = NOTIFICATIONS_SAVING;
  readonly saveLabel = NOTIFICATIONS_SAVE;
  readonly placeholderTemplateId = NOTIFICATIONS_PLACEHOLDER_TEMPLATE_ID;

  readonly templateForm = this.fb.nonNullable.group({
    action: ['', Validators.required],
    channels: [[] as string[], Validators.required],
    templateId: [''],
    message: ['', Validators.required],
    emailSubject: [''],
    inboxTitle: [''],
    isActive: [true],
  });

  readonly templatesFilterForm = this.fb.nonNullable.group({
    action: [''],
    active: ['all' as 'all' | 'yes' | 'no'],
    search: [''],
  });

  readonly logsFilterForm = this.fb.nonNullable.group({
    action: [''],
    channel: [''],
  });

  readonly coverageFilterForm = this.fb.nonNullable.group({
    module: [''],
    coverage: ['all' as 'all' | 'ok' | 'missing'],
    search: [''],
  });

  readonly failedFilterForm = this.fb.nonNullable.group({
    action: [''],
  });

  ngOnInit(): void {
    this.loadActions();
    this.applySection(true);
    this.templatesFilterForm.controls.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.templatesPageIndex = 0;
        this.load();
      });
    this.coverageFilterForm.controls.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.coveragePageIndex = 0;
        this.loadCoverage();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['section'] && !changes['section'].firstChange) {
      this.applySection(true);
    }
  }

  private applySection(loadData: boolean): void {
    const index =
      this.section === 'logs' ? 1 : this.section === 'coverage' ? 2 : this.section === 'failed' ? 3 : 0;
    this.selectedTabIndex = index;
    if (!loadData) {
      return;
    }
    if (index === 1) {
      this.loadLogs();
    } else if (index === 2) {
      this.loadCoverage();
    } else if (index === 3) {
      this.loadFailedOutbox();
    } else {
      this.load();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.formDialogRef?.close(false);
  }

  loadActions(): void {
    this.notificationApi.listActions().subscribe({
      next: (items) => {
        this.actions = items;
        this.coverageModules = [...new Set(items.map((a) => a.module).filter(Boolean))].sort();
      },
      error: (err) => {
        this.actions = [];
        this.coverageModules = [];
      },
    });
  }

  load(): void {
    this.loading = true;
    this.expandedMessageIds.clear();
    const f = this.templatesFilterForm.getRawValue();
    const filters: string[] = [];
    const search = f.search.trim();
    if (search && !f.action) {
      filters.push(`actionCode:CONTAINS:${search.toUpperCase()}`);
    }
    this.notificationApi
      .list(this.templatesPageIndex, this.templatesPageSize, {
        action: f.action || null,
        isActive: f.active === 'all' ? null : f.active === 'yes',
        filters,
      })
      .subscribe({
        next: ({ items, total }) => {
          this.data = items;
          this.templatesTotal = total;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_LOAD_ERROR });
        },
      });
  }

  onTemplatesFilterChange(): void {
    this.templatesPageIndex = 0;
    this.load();
  }

  clearTemplatesFilters(): void {
    this.templatesFilterForm.reset({ action: '', active: 'all', search: '' });
    this.templatesPageIndex = 0;
    this.load();
  }

  onTemplatesPage(event: PageEvent): void {
    this.templatesPageIndex = event.pageIndex;
    this.templatesPageSize = event.pageSize;
    this.load();
  }

  loadLogs(): void {
    this.logsLoading = true;
    const f = this.logsFilterForm.getRawValue();
    this.notificationApi
      .listLogs(
        {
          action: f.action || undefined,
          channel: f.channel || undefined,
        },
        this.logsPageIndex,
        this.logsPageSize,
      )
      .subscribe({
        next: ({ items, total }) => {
          this.logs = items;
          this.logsTotal = total;
          this.logsLoading = false;
        },
        error: (err) => {
          this.logsLoading = false;
          this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_LOGS_LOAD_ERROR });
        },
      });
  }

  onLogsFilterChange(): void {
    this.logsPageIndex = 0;
    this.loadLogs();
  }

  clearLogsFilters(): void {
    this.logsFilterForm.reset({ action: '', channel: '' });
    this.logsPageIndex = 0;
    this.loadLogs();
  }

  onLogsPage(event: PageEvent): void {
    this.logsPageIndex = event.pageIndex;
    this.logsPageSize = event.pageSize;
    this.loadLogs();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    if (index === 1) {
      this.loadLogs();
    }
    if (index === 2) {
      this.loadCoverage();
    }
    if (index === 3) {
      this.loadFailedOutbox();
    }
  }

  loadCoverage(): void {
    this.coverageLoading = true;
    const f = this.coverageFilterForm.getRawValue();
    const hasActiveTemplate =
      f.coverage === 'all' ? null : f.coverage === 'ok';
    this.notificationApi
      .getCoverage(
        {
          module: f.module || null,
          actionCode: f.search.trim() || null,
          hasActiveTemplate,
        },
        this.coveragePageIndex,
        this.coveragePageSize,
      )
      .subscribe({
        next: (res) => {
          this.coverageItems = res.items ?? [];
          this.coverageTotal = res.pagination?.total ?? res.items?.length ?? 0;
          this.coverageSummary = notificationsCoverageSummary(res.coveredActions, res.totalActions);
          this.coverageLoading = false;
        },
        error: (err) => {
          this.coverageLoading = false;
          this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_COVERAGE_LOAD_ERROR });
        },
      });
  }

  onCoverageFilterChange(): void {
    this.coveragePageIndex = 0;
    this.loadCoverage();
  }

  clearCoverageFilters(): void {
    this.coverageFilterForm.reset({ module: '', coverage: 'all', search: '' });
    this.coveragePageIndex = 0;
    this.loadCoverage();
  }

  onCoveragePage(event: PageEvent): void {
    this.coveragePageIndex = event.pageIndex;
    this.coveragePageSize = event.pageSize;
    this.loadCoverage();
  }

  loadFailedOutbox(): void {
    this.failedLoading = true;
    const action = this.failedFilterForm.controls.action.value;
    this.notificationApi.listFailedOutbox(this.failedPageIndex, this.failedPageSize, action || null).subscribe({
      next: ({ items, total }) => {
        this.failedOutbox = items;
        this.failedTotal = total;
        this.failedLoading = false;
      },
      error: (err) => {
        this.failedLoading = false;
        this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_FAILED_LOAD_ERROR });
      },
    });
  }

  onFailedFilterChange(): void {
    this.failedPageIndex = 0;
    this.loadFailedOutbox();
  }

  clearFailedFilters(): void {
    this.failedFilterForm.reset({ action: '' });
    this.failedPageIndex = 0;
    this.loadFailedOutbox();
  }

  onFailedPage(event: PageEvent): void {
    this.failedPageIndex = event.pageIndex;
    this.failedPageSize = event.pageSize;
    this.loadFailedOutbox();
  }

  retryOutbox(row: NotificationOutboxItem): void {
    this.retryingOutboxId = row.id;
    this.notificationApi.retryOutbox(row.id).subscribe({
      next: () => {
        this.retryingOutboxId = null;
        this.feedback.showSuccess(NOTIFICATIONS_RETRY_SUCCESS);
        this.loadFailedOutbox();
      },
      error: (err) => {
        this.retryingOutboxId = null;
        this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_RETRY_ERROR });
      },
    });
  }

  createTemplateForAction(actionCode: string): void {
    this.selectedTabIndex = 0;
    this.openCreate();
    queueMicrotask(() => {
      this.templateForm.patchValue({ action: actionCode });
      this.onActionSelected(actionCode);
    });
  }

  selectedActionMeta(): NotificationActionItem | undefined {
    const code = this.templateForm.controls.action.value;
    return this.actions.find((a) => a.code === code);
  }

  onActionSelected(code: string): void {
    const action = this.actions.find((a) => a.code === code);
    if (!action) {
      return;
    }
    if (!this.editingId && action.defaultChannels?.length) {
      this.templateForm.patchValue({ channels: [...action.defaultChannels] });
    }
  }

  openCreate(): void {
    this.editingId = null;
    this.preview = null;
    this.templateForm.reset({
      action: '',
      channels: [NOTIFICATIONS_CHANNEL_EMAIL_VALUE],
      templateId: '',
      message: '',
      emailSubject: '',
      inboxTitle: '',
      isActive: true,
    });
    this.openFormDialog(this.newTitle);
  }

  openEdit(row: NotificationTemplateItem): void {
    this.editingId = row.id;
    this.preview = null;
    this.templateForm.reset({
      action: row.action,
      channels: [...row.channels],
      templateId: row.templateId ?? '',
      message: row.message,
      emailSubject: row.emailSubject ?? '',
      inboxTitle: row.inboxTitle ?? '',
      isActive: row.active,
    });
    this.openFormDialog(this.editTitle);
  }

  private openFormDialog(title: string): void {
    this.formDialogRef?.close(false);
    queueMicrotask(() => {
      if (!this.templateFormTpl) {
        return;
      }
      this.formDialogRef = this.dialog.open(NotificationFormDialogShellComponent, {
        width: '800px',
        maxWidth: '95vw',
        autoFocus: 'first-tabbable',
        panelClass: NOTIFICATION_FORM_DIALOG_PANEL_CLASS,
        data: { title, content: this.templateFormTpl },
      });
      this.formDialogRef.afterClosed().subscribe((saved) => {
        this.formDialogRef = null;
        this.editingId = null;
        this.preview = null;
        if (saved) {
          this.load();
        }
      });
    });
  }

  cancelForm(): void {
    this.formDialogRef?.close(false);
  }

  runPreview(): void {
    const value = this.templateForm.getRawValue();
    if (!value.action.trim()) {
      this.templateForm.controls.action.markAsTouched();
      return;
    }
    this.previewLoading = true;
    this.notificationApi
      .preview({
        action: value.action.trim(),
        message: value.message.trim() || undefined,
        emailSubject: value.emailSubject.trim() || undefined,
        inboxTitle: value.inboxTitle.trim() || undefined,
        templateId: value.templateId.trim() || undefined,
        samplePayload: this.buildSamplePayload(value.action.trim()),
      })
      .subscribe({
        next: (result) => {
          this.preview = result;
          this.previewLoading = false;
        },
        error: (err) => {
          this.previewLoading = false;
          this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_PREVIEW_ERROR });
        },
      });
  }

  private buildSamplePayload(actionCode: string): Record<string, unknown> {
    const meta = this.actions.find((a) => a.code === actionCode);
    const payload: Record<string, unknown> = {};
    for (const variable of meta?.variablesSchema ?? []) {
      payload[variable] = `[${variable}]`;
    }
    return payload;
  }

  insertVariable(variable: string, field: 'message' | 'emailSubject' | 'inboxTitle'): void {
    const token = `{{${variable}}}`;
    const controlName = field === 'message' ? 'message' : field === 'emailSubject' ? 'emailSubject' : 'inboxTitle';
    const control = this.templateForm.controls[controlName];
    const current = control.value ?? '';
    const spacer = current.length > 0 && !current.endsWith(' ') ? ' ' : '';
    control.setValue(`${current}${spacer}${token}`);
    control.markAsDirty();
  }

  saveForm(): void {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }
    const value = this.templateForm.getRawValue();
    if (!value.channels.length) {
      this.feedback.showSuccess(NOTIFICATIONS_CHANNELS_REQUIRED);
      return;
    }

    const payload = {
      action: value.action.trim(),
      channels: value.channels,
      templateId: value.templateId.trim() || undefined,
      message: value.message.trim(),
      emailSubject: value.emailSubject.trim() || undefined,
      inboxTitle: value.inboxTitle.trim() || undefined,
      isActive: value.isActive,
    };

    this.saving = true;
    const request$ = this.editingId
      ? this.notificationApi.update(this.editingId, payload)
      : this.notificationApi.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.feedback.showSuccess(NOTIFICATIONS_SAVE_SUCCESS);
        this.formDialogRef?.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_SAVE_ERROR });
      },
    });
  }

  toggle(row: NotificationTemplateItem, active: boolean): void {
    const previous = row.active;
    row.active = active;
    this.savingId = row.id;
    this.notificationApi
      .update(row.id, {
        action: row.action,
        channels: row.channels,
        templateId: row.templateId,
        message: row.message,
        emailSubject: row.emailSubject,
        inboxTitle: row.inboxTitle,
        isActive: active,
      })
      .subscribe({
        next: (updated) => {
          Object.assign(row, updated);
          this.savingId = null;
          this.feedback.showSuccess(notificationsToggleMessage(row.action, row.active));
        },
        error: (err) => {
          row.active = previous;
          this.savingId = null;
          this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_UPDATE_ERROR });
        },
      });
  }

  isMessageTruncated(message: string): boolean {
    return message.length > this.messagePreviewLength;
  }

  isMessageExpanded(id: number): boolean {
    return this.expandedMessageIds.has(id);
  }

  messagePreview(message: string): string {
    return message.slice(0, this.messagePreviewLength);
  }

  expandMessage(id: number): void {
    this.expandedMessageIds.add(id);
  }

  deleteTemplate(row: NotificationTemplateItem): void {
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: notificationsDeleteConfirm(row.action),
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
    this.deletingId = row.id;
    this.notificationApi.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        if (this.editingId === row.id) {
          this.cancelForm();
        }
        this.feedback.showSuccess(NOTIFICATIONS_DELETE_SUCCESS);
        this.load();
      },
      error: (err) => {
        this.deletingId = null;
        this.feedback.showApiError(err, { fallbackMessage: NOTIFICATIONS_DELETE_ERROR });
      },
    });
      });
  }
}