import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationTemplateApiService } from '../../../core/services/notification-template-api.service';
import { NotificationTemplateItem } from '../../../shared/models/notification-template.model';

@Component({
  selector: 'sh-notifications-admin',
  standalone: true,
  imports: [MatTableModule, MatChipsModule, MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './notifications-admin.component.html',
  styleUrl: './notifications-admin.component.scss',
})
export class NotificationsAdminComponent implements OnInit {
  private readonly notificationApi = inject(NotificationTemplateApiService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  savingId: number | null = null;
  data: NotificationTemplateItem[] = [];
  readonly columns = ['action', 'channels', 'templateId', 'message', 'active'];

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
}
