import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
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
  notificationChannelLabel,
  notificationsDeleteConfirm,
  notificationsToggleMessage,
} from '../../../core/i18n/notifications-labels';

@Component({
  selector: 'sh-notifications-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    TableRowActionsComponent,
    CatalogTableImportExportActionsComponent,
  ],
  templateUrl: './notifications-admin.component.html',
  styleUrl: './notifications-admin.component.scss',
})
export class NotificationsAdminComponent implements OnInit {
  private readonly notificationApi = inject(NotificationTemplateApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  loading = true;
  logsLoading = false;
  coverageLoading = false;
  failedLoading = false;
  retryingOutboxId: number | null = null;
  saving = false;
  previewLoading = false;
  savingId: number | null = null;
  deletingId: number | null = null;
  showForm = false;
  editingId: number | null = null;
  data: NotificationTemplateItem[] = [];
  actions: NotificationActionItem[] = [];
  logs: NotificationLogItem[] = [];
  coverageItems: NotificationCoverageItem[] = [];
  coverageSummary = '';
  failedOutbox: NotificationOutboxItem[] = [];
  preview: PreviewNotificationTemplateResponse | null = null;
  selectedTabIndex = 0;
  readonly columns = ['action', 'channels', 'templateId', 'message', 'active', 'actions'];
  readonly logColumns = ['action', 'channel', 'recipient', 'status', 'renderedPreview', 'createAt'];
  readonly coverageColumns = ['actionCode', 'module', 'description', 'coverage', 'templateChannels'];
  readonly failedColumns = ['actionCode', 'attempts', 'lastError', 'createAt', 'actions'];
  readonly channelOptions = NOTIFICATION_CHANNEL_OPTIONS;
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

  ngOnInit(): void {
    this.loadActions();
    this.load();
  }

  loadActions(): void {
    this.notificationApi.listActions().subscribe({
      next: (items) => {
        this.actions = items;
      },
      error: () => {
        this.actions = [];
      },
    });
  }

  load(): void {
    this.loading = true;
    this.expandedMessageIds.clear();
    this.notificationApi.list().subscribe({
      next: ({ items }) => {
        this.data = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(NOTIFICATIONS_LOAD_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  loadLogs(): void {
    this.logsLoading = true;
    this.notificationApi.listLogs({}, 0, 50).subscribe({
      next: ({ items }) => {
        this.logs = items;
        this.logsLoading = false;
      },
      error: () => {
        this.logsLoading = false;
        this.snack.open(NOTIFICATIONS_LOGS_LOAD_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    if (index === 1 && !this.logs.length && !this.logsLoading) {
      this.loadLogs();
    }
    if (index === 2 && !this.coverageItems.length && !this.coverageLoading) {
      this.loadCoverage();
    }
    if (index === 3 && !this.failedOutbox.length && !this.failedLoading) {
      this.loadFailedOutbox();
    }
  }

  loadCoverage(): void {
    this.coverageLoading = true;
    this.notificationApi.getCoverage().subscribe({
      next: (res) => {
        this.coverageItems = res.items ?? [];
        this.coverageSummary = notificationsCoverageSummary(res.coveredActions, res.totalActions);
        this.coverageLoading = false;
      },
      error: () => {
        this.coverageLoading = false;
        this.snack.open(NOTIFICATIONS_COVERAGE_LOAD_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  loadFailedOutbox(): void {
    this.failedLoading = true;
    this.notificationApi.listFailedOutbox(0, 50).subscribe({
      next: ({ items }) => {
        this.failedOutbox = items;
        this.failedLoading = false;
      },
      error: () => {
        this.failedLoading = false;
        this.snack.open(NOTIFICATIONS_FAILED_LOAD_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  retryOutbox(row: NotificationOutboxItem): void {
    this.retryingOutboxId = row.id;
    this.notificationApi.retryOutbox(row.id).subscribe({
      next: () => {
        this.retryingOutboxId = null;
        this.snack.open(NOTIFICATIONS_RETRY_SUCCESS, NOTIFICATIONS_SNACK_CLOSE, { duration: 2500 });
        this.loadFailedOutbox();
      },
      error: () => {
        this.retryingOutboxId = null;
        this.snack.open(NOTIFICATIONS_RETRY_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  createTemplateForAction(actionCode: string): void {
    this.openCreate();
    this.templateForm.patchValue({ action: actionCode });
    this.onActionSelected(actionCode);
    this.selectedTabIndex = 0;
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
    this.showForm = true;
    this.templateForm.reset({
      action: '',
      channels: [NOTIFICATIONS_CHANNEL_EMAIL_VALUE],
      templateId: '',
      message: '',
      emailSubject: '',
      inboxTitle: '',
      isActive: true,
    });
  }

  openEdit(row: NotificationTemplateItem): void {
    this.editingId = row.id;
    this.preview = null;
    this.showForm = true;
    this.templateForm.reset({
      action: row.action,
      channels: [...row.channels],
      templateId: row.templateId ?? '',
      message: row.message,
      emailSubject: row.emailSubject ?? '',
      inboxTitle: row.inboxTitle ?? '',
      isActive: row.active,
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.preview = null;
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
        error: () => {
          this.previewLoading = false;
          this.snack.open(NOTIFICATIONS_PREVIEW_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
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
      this.snack.open(NOTIFICATIONS_CHANNELS_REQUIRED, NOTIFICATIONS_SNACK_CLOSE, { duration: 3000 });
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
        this.showForm = false;
        this.editingId = null;
        this.preview = null;
        this.snack.open(NOTIFICATIONS_SAVE_SUCCESS, NOTIFICATIONS_SNACK_CLOSE, { duration: 2500 });
        this.load();
      },
      error: () => {
        this.saving = false;
        this.snack.open(NOTIFICATIONS_SAVE_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
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
          this.snack.open(notificationsToggleMessage(row.action, row.active), NOTIFICATIONS_SNACK_CLOSE, {
            duration: 2500,
          });
        },
        error: () => {
          row.active = previous;
          this.savingId = null;
          this.snack.open(NOTIFICATIONS_UPDATE_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
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
    if (!confirm(notificationsDeleteConfirm(row.action))) {
      return;
    }
    this.deletingId = row.id;
    this.notificationApi.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        if (this.editingId === row.id) {
          this.cancelForm();
        }
        this.snack.open(NOTIFICATIONS_DELETE_SUCCESS, NOTIFICATIONS_SNACK_CLOSE, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open(NOTIFICATIONS_DELETE_ERROR, NOTIFICATIONS_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }
}
