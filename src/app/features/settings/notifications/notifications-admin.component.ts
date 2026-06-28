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
import { NotificationTemplateApiService } from '../../../core/services/notification-template-api.service';
import { NotificationTemplateItem } from '../../../shared/models/notification-template.model';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';
import { CatalogTableImportExportActionsComponent } from '../catalogs/catalog-table-import-export-actions.component';
import {
  NOTIFICATIONS_CANCEL,
  NOTIFICATIONS_CHANNELS_REQUIRED,
  NOTIFICATIONS_COLUMN_ACTION,
  NOTIFICATIONS_COLUMN_ACTIVE,
  NOTIFICATIONS_COLUMN_CHANNELS,
  NOTIFICATIONS_COLUMN_MESSAGE,
  NOTIFICATIONS_COLUMN_TEMPLATE,
  NOTIFICATIONS_SHOW_MORE,
  NOTIFICATIONS_DELETE_ERROR,
  NOTIFICATIONS_DELETE_SUCCESS,
  NOTIFICATIONS_EDIT_TITLE,
  NOTIFICATIONS_FIELD_ACTIVE,
  NOTIFICATIONS_FIELD_CHANNELS,
  NOTIFICATIONS_FIELD_EXTERNAL_TEMPLATE_ID,
  NOTIFICATIONS_FIELD_MESSAGE,
  NOTIFICATIONS_FIELD_SYSTEM_ACTION,
  NOTIFICATIONS_LOAD_ERROR,
  NOTIFICATIONS_NEW_BUTTON,
  NOTIFICATIONS_NEW_TITLE,
  NOTIFICATIONS_PAGE_TITLE,
  NOTIFICATIONS_PLACEHOLDER_ACTION,
  NOTIFICATIONS_PLACEHOLDER_TEMPLATE_ID,
  NOTIFICATIONS_SAVE,
  NOTIFICATIONS_SAVE_ERROR,
  NOTIFICATIONS_SAVE_SUCCESS,
  NOTIFICATIONS_SAVING,
  NOTIFICATIONS_SNACK_CLOSE,
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
  saving = false;
  savingId: number | null = null;
  deletingId: number | null = null;
  showForm = false;
  editingId: number | null = null;
  data: NotificationTemplateItem[] = [];
  readonly columns = ['action', 'channels', 'templateId', 'message', 'active', 'actions'];
  readonly channelOptions = NOTIFICATION_CHANNEL_OPTIONS;
  readonly channelLabel = notificationChannelLabel;

  readonly pageTitle = NOTIFICATIONS_PAGE_TITLE;
  readonly newButton = NOTIFICATIONS_NEW_BUTTON;
  readonly editTitle = NOTIFICATIONS_EDIT_TITLE;
  readonly newTitle = NOTIFICATIONS_NEW_TITLE;
  readonly fieldSystemAction = NOTIFICATIONS_FIELD_SYSTEM_ACTION;
  readonly fieldChannels = NOTIFICATIONS_FIELD_CHANNELS;
  readonly fieldExternalTemplateId = NOTIFICATIONS_FIELD_EXTERNAL_TEMPLATE_ID;
  readonly fieldMessage = NOTIFICATIONS_FIELD_MESSAGE;
  readonly fieldActive = NOTIFICATIONS_FIELD_ACTIVE;
  readonly columnAction = NOTIFICATIONS_COLUMN_ACTION;
  readonly columnChannels = NOTIFICATIONS_COLUMN_CHANNELS;
  readonly columnTemplate = NOTIFICATIONS_COLUMN_TEMPLATE;
  readonly columnMessage = NOTIFICATIONS_COLUMN_MESSAGE;
  readonly showMoreLabel = NOTIFICATIONS_SHOW_MORE;
  readonly columnActive = NOTIFICATIONS_COLUMN_ACTIVE;
  readonly messagePreviewLength = 30;

  private readonly expandedMessageIds = new Set<number>();
  readonly cancelLabel = NOTIFICATIONS_CANCEL;
  readonly savingLabel = NOTIFICATIONS_SAVING;
  readonly saveLabel = NOTIFICATIONS_SAVE;
  readonly placeholderAction = NOTIFICATIONS_PLACEHOLDER_ACTION;
  readonly placeholderTemplateId = NOTIFICATIONS_PLACEHOLDER_TEMPLATE_ID;

  readonly templateForm = this.fb.nonNullable.group({
    action: ['', Validators.required],
    channels: [[] as string[], Validators.required],
    templateId: [''],
    message: ['', Validators.required],
    isActive: [true],
  });

  ngOnInit(): void {
    this.load();
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

  openCreate(): void {
    this.editingId = null;
    this.showForm = true;
    this.templateForm.reset({
      action: '',
      channels: [NOTIFICATIONS_CHANNEL_EMAIL_VALUE],
      templateId: '',
      message: '',
      isActive: true,
    });
  }

  openEdit(row: NotificationTemplateItem): void {
    this.editingId = row.id;
    this.showForm = true;
    this.templateForm.reset({
      action: row.action,
      channels: [...row.channels],
      templateId: row.templateId ?? '',
      message: row.message,
      isActive: row.active,
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
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
