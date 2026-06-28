import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { AuditLog } from '../../../shared/models';
import {
  AUDIT_COLUMN_ACTION,
  AUDIT_COLUMN_DETAILS,
  AUDIT_COLUMN_ENTITY,
  AUDIT_COLUMN_ENTITY_ID,
  AUDIT_COLUMN_TIMESTAMP,
  AUDIT_COLUMN_USER,
  AUDIT_PAGE_TITLE,
} from '../../../core/i18n/audit-labels';

@Component({
  selector: 'sh-audit-logs',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss',
})
export class AuditLogsComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  readonly pageTitle = AUDIT_PAGE_TITLE;
  readonly columnTimestamp = AUDIT_COLUMN_TIMESTAMP;
  readonly columnUser = AUDIT_COLUMN_USER;
  readonly columnAction = AUDIT_COLUMN_ACTION;
  readonly columnEntity = AUDIT_COLUMN_ENTITY;
  readonly columnEntityId = AUDIT_COLUMN_ENTITY_ID;
  readonly columnDetails = AUDIT_COLUMN_DETAILS;

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
