import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import {
  AuditLog,
  CatalogItem,
  ListQuery,
  NotificationTemplate,
  PaginatedResult,
  PipelineStage,
  Questionnaire,
  SystemUser,
  UserGroup,
} from '../../shared/models';
import {
  MOCK_AUDIT_LOGS,
  MOCK_CATALOGS,
  MOCK_GROUPS,
  MOCK_MMR_ROWS,
  MOCK_NOTIFICATIONS,
  MOCK_PIPELINE,
  MOCK_QUESTIONNAIRES,
  MOCK_REPORT_KPIS,
  MOCK_SYSTEM_USERS,
  REPORT_CATEGORIES,
} from '../data/settings.mock';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  listUsers(query: ListQuery = {}): Observable<PaginatedResult<SystemUser>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    let items = [...MOCK_SYSTEM_USERS];
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (u) =>
          u.firstName.toLowerCase().includes(s) ||
          u.lastName.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s),
      );
    }
    const start = (page - 1) * pageSize;
    return of({ items: items.slice(start, start + pageSize), total: items.length, page, pageSize }).pipe(delay(250));
  }

  getGroups(): Observable<UserGroup[]> {
    return of(MOCK_GROUPS).pipe(delay(150));
  }

  getCatalogs(category?: string): Observable<CatalogItem[]> {
    const items = category ? MOCK_CATALOGS.filter((c) => c.category === category) : MOCK_CATALOGS;
    return of(items).pipe(delay(150));
  }

  getNotifications(): Observable<NotificationTemplate[]> {
    return of(MOCK_NOTIFICATIONS).pipe(delay(150));
  }

  getQuestionnaires(): Observable<Questionnaire[]> {
    return of(MOCK_QUESTIONNAIRES).pipe(delay(150));
  }

  getPipeline(): Observable<PipelineStage[]> {
    return of(MOCK_PIPELINE).pipe(delay(150));
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return of(MOCK_AUDIT_LOGS).pipe(delay(200));
  }

  getMmrData() {
    return of({ kpis: MOCK_REPORT_KPIS, rows: MOCK_MMR_ROWS }).pipe(delay(300));
  }

  getReportCategories() {
    return of(REPORT_CATEGORIES).pipe(delay(100));
  }
}
