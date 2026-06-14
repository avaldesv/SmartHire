import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { NotificationTemplate } from '../../../shared/models';

@Component({
  selector: 'sh-notifications-admin',
  standalone: true,
  imports: [MatTableModule, MatChipsModule, MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './notifications-admin.component.html',
  styleUrl: './notifications-admin.component.scss',
})
export class NotificationsAdminComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  data: NotificationTemplate[] = [];
  readonly columns = ['action', 'channels', 'templateId', 'message', 'active'];

  ngOnInit(): void {
    this.settings.getNotifications().subscribe((n) => {
      this.data = n;
      this.loading = false;
    });
  }

  toggle(row: NotificationTemplate): void {
    row.active = !row.active;
    this.snack.open(`Notificación ${row.action} ${row.active ? 'activada' : 'desactivada'}`, 'Cerrar', { duration: 2500 });
  }
}
