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

const CHANNEL_OPTIONS = ['Correo', 'WhatsApp'] as const;

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
  readonly channelOptions = [...CHANNEL_OPTIONS];

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
    this.notificationApi.list().subscribe({
      next: ({ items }) => {
        this.data = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar las plantillas de notificación', 'Cerrar', { duration: 3500 });
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.showForm = true;
    this.templateForm.reset({
      action: '',
      channels: ['Correo'],
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
      this.snack.open('Selecciona al menos un canal', 'Cerrar', { duration: 3000 });
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
        this.snack.open('Plantilla guardada', 'Cerrar', { duration: 2500 });
        this.load();
      },
      error: () => {
        this.saving = false;
        this.snack.open('No se pudo guardar la plantilla', 'Cerrar', { duration: 3500 });
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
          this.snack.open(`Notificación ${row.action} ${row.active ? 'activada' : 'desactivada'}`, 'Cerrar', {
            duration: 2500,
          });
        },
        error: () => {
          row.active = previous;
          this.savingId = null;
          this.snack.open('No se pudo actualizar la plantilla', 'Cerrar', { duration: 3500 });
        },
      });
  }

  deleteTemplate(row: NotificationTemplateItem): void {
    if (!confirm(`¿Eliminar la plantilla "${row.action}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.deletingId = row.id;
    this.notificationApi.delete(row.id).subscribe({
      next: () => {
        this.deletingId = null;
        if (this.editingId === row.id) {
          this.cancelForm();
        }
        this.snack.open('Plantilla eliminada', 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.deletingId = null;
        this.snack.open('No se pudo eliminar la plantilla', 'Cerrar', { duration: 3500 });
      },
    });
  }
}
