import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ListQuery, PaginatedResult, Requisition } from '../../shared/models';
import { MOCK_KPIS, MOCK_REQUISITIONS } from '../data/requisitions.mock';

@Injectable({ providedIn: 'root' })
export class RequisitionService {
  getKpis() {
    return of(MOCK_KPIS).pipe(delay(200));
  }

  list(query: ListQuery = {}): Observable<PaginatedResult<Requisition>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    let items = [...MOCK_REQUISITIONS];

    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (r) =>
          r.requisitionNo.toLowerCase().includes(s) ||
          r.name.toLowerCase().includes(s) ||
          r.client.toLowerCase().includes(s),
      );
    }
    if (query.status && query.status !== 'Todos') {
      items = items.filter((r) => r.status === query.status);
    }
    if (query.client && query.client !== 'Todos') {
      items = items.filter((r) => r.client === query.client);
    }

    const start = (page - 1) * pageSize;
    return of({
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      pageSize,
    }).pipe(delay(300));
  }

  getById(id: number): Observable<Requisition | undefined> {
    return of(MOCK_REQUISITIONS.find((r) => r.id === id)).pipe(delay(150));
  }

  getClients(): Observable<string[]> {
    return of([...new Set(MOCK_REQUISITIONS.map((r) => r.client))].slice(0, 20)).pipe(delay(100));
  }
}
