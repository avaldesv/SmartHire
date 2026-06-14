import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AiSearchResult, Candidate, ListQuery, PaginatedResult, PreselectionCandidate } from '../../shared/models';
import { MOCK_CANDIDATES, MOCK_PRESELECTION } from '../data/candidates.mock';

@Injectable({ providedIn: 'root' })
export class CandidateService {
  list(query: ListQuery = {}): Observable<PaginatedResult<Candidate>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    let items = [...MOCK_CANDIDATES];
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.firstName.toLowerCase().includes(s) ||
          c.lastName.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s),
      );
    }
    const start = (page - 1) * pageSize;
    return of({ items: items.slice(start, start + pageSize), total: items.length, page, pageSize }).pipe(delay(250));
  }

  getById(id: number): Observable<Candidate | undefined> {
    return of(MOCK_CANDIDATES.find((c) => c.id === id)).pipe(delay(150));
  }

  getPreselection(_positionId: number): Observable<PreselectionCandidate[]> {
    return of(MOCK_PRESELECTION).pipe(delay(200));
  }

  searchAi(_positionId: number, count: number, _years: number, _sources: string[]): Observable<AiSearchResult[]> {
    const results: AiSearchResult[] = MOCK_CANDIDATES.slice(0, count).map((c, i) => ({
      candidateId: c.id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      phone: c.phone,
      compatibility: 92 - i * 5,
      evidence: `Cumple requisitos obligatorios. ${c.experienceYears ?? 2} años experiencia en ${c.specialties?.[0] ?? 'área relevante'}.`,
    }));
    return of(results).pipe(delay(800));
  }
}
