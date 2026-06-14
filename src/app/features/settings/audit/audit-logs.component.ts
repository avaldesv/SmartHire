import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { AuditLog } from '../../../shared/models';

@Component({
  selector: 'sh-audit-logs',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss',
})
export class AuditLogsComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  loading = true;
  data: AuditLog[] = [];
  readonly columns = ['timestamp', 'user', 'action', 'entity', 'entityId', 'details'];

  ngOnInit(): void {
    this.settings.getAuditLogs().subscribe((logs) => {
      this.data = logs;
      this.loading = false;
    });
  }
}
