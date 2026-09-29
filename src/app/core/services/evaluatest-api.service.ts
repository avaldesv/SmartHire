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

export interface EvaluatestCredentials {
  companyId: number;
  baseUrl: string | null;
  subscriptionKeyConfigured: boolean;
  userEmail: string | null;
  passwordConfigured: boolean;
  isEnabled: boolean | null;
  folderName: string | null;
  unityId: number | null;
}

export interface UpsertEvaluatestCredentialsRequest {
  baseUrl: string | null;
  subscriptionKey: string | null;
  userEmail: string | null;
  password: string | null;
  isEnabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class EvaluatestApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getCredentials(companyId: number): Observable<EvaluatestCredentials> {
    return this.http.get<EvaluatestCredentials>(
      this.api.apiUrl(`/api/v1/companies/${companyId}/integrations/evaluatest`),
      { headers: this.api.buildHeaders() },
    );
  }

  upsertCredentials(
    companyId: number,
    request: UpsertEvaluatestCredentialsRequest,
  ): Observable<EvaluatestCredentials> {
    return this.http.put<EvaluatestCredentials>(
      this.api.apiUrl(`/api/v1/companies/${companyId}/integrations/evaluatest`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }

  getCompetenceModels(language: string): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/competence-models', { language });
  }

  getJobLevels(competenceModelId: number, language: string): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/job-levels', { competenceModelId, language });
  }

  getFunctionalAreas(language: string): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/functional-areas', { language });
  }

  getIndustries(language: string): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/industries', { language });
  }

  getIndustryJobTypes(
    industryId: number,
    jobLevelId: number,
    language: string,
    profileLibraryId = 1,
  ): Observable<EvaluatestCatalogItem[]> {
    return this.get('/api/v1/evaluatest/catalogs/industry-job-types', {
      industryId,
      jobLevelId,
      language,
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
