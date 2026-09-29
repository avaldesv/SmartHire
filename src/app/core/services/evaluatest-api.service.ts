import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';

export interface EvaluatestCatalogItem {
  id?: number | null;
  idAlt?: number | null;
  name?: string | null;
  nameAlt?: string | null;
  description?: string | null;
  resolvedId?: number | null;
  resolvedName?: string | null;
}

@Injectable({ providedIn: 'root' })
export class EvaluatestApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getCompetenceModels(languageId: number): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/competence-models', { languageId });
  }

  getJobLevels(competenceModelId: number, languageId: number): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/job-levels', { competenceModelId, languageId });
  }

  getFunctionalAreas(languageId: number): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/functional-areas', { languageId });
  }

  getIndustries(languageId: number): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/industries', { languageId });
  }

  getIndustryJobTypes(
    industryId: number,
    jobLevelId: number,
    languageId: number,
    profileLibraryId = 1,
  ): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/industry-job-types', {
      industryId,
      jobLevelId,
      languageId,
      profileLibraryId,
    });
  }

  private get(path: string, query: Record<string, string | number>): Observable<EvaluatestCatalogItem[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      params = params.set(key, String(value));
    }
    return this.http.get<EvaluatestCatalogItem[]>(this.api.apiUrl(path), {
      headers: this.api.buildHeaders(),
      params,
    });
  }
}

/** Normalize Evaluatest catalog item id/name (PascalCase or camelCase). */
export function evaluatestOptionId(item: EvaluatestCatalogItem): number | null {
  const raw = item as EvaluatestCatalogItem & { Id?: number | null; Name?: string | null };
  const id = item.resolvedId ?? item.id ?? item.idAlt ?? raw.Id ?? null;
  return id == null ? null : Number(id);
}

export function evaluatestOptionLabel(item: EvaluatestCatalogItem): string {
  const raw = item as EvaluatestCatalogItem & { Id?: number | null; Name?: string | null };
  return (
    (item.resolvedName ?? item.name ?? item.nameAlt ?? raw.Name ?? '').trim() ||
    String(evaluatestOptionId(item) ?? '')
  );
}
