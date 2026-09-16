import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CandidateCourseCertification,
  CandidateCourseCertificationListResponse,
  CandidateEducation,
  CandidateEducationListResponse,
  CandidateExperience,
  CandidateExperienceListResponse,
  CandidateLanguage,
  CandidateLanguageListResponse,
  CandidateSkill,
  CandidateSkillListResponse,
} from '../../shared/models/candidate-profile-section.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class CandidateProfileSectionApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  listExperiences(
    candidateId: number,
    page = 0,
    size = 50,
  ): Observable<{ items: CandidateExperience[]; total: number }> {
    return this.http
      .post<CandidateExperienceListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/experiences/list`),
        { isActive: null, filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  listEducations(
    candidateId: number,
    page = 0,
    size = 50,
  ): Observable<{ items: CandidateEducation[]; total: number }> {
    return this.http
      .post<CandidateEducationListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/educations/list`),
        { isActive: null, filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  listCourseCertifications(
    candidateId: number,
    page = 0,
    size = 50,
  ): Observable<{ items: CandidateCourseCertification[]; total: number }> {
    return this.http
      .post<CandidateCourseCertificationListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/course-certifications/list`),
        { isActive: null, filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  listLanguages(
    candidateId: number,
    page = 0,
    size = 50,
  ): Observable<{ items: CandidateLanguage[]; total: number }> {
    return this.http
      .post<CandidateLanguageListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/languages/list`),
        { isActive: null, filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }

  listSkills(
    candidateId: number,
    page = 0,
    size = 50,
  ): Observable<{ items: CandidateSkill[]; total: number }> {
    return this.http
      .post<CandidateSkillListResponse>(
        this.api.apiUrl(`/api/v1/candidates/${candidateId}/skills/list`),
        { isActive: null, filters: [], ordersBy: [] },
        { headers: this.api.buildHeaders(page, size) },
      )
      .pipe(map((res) => ({ items: res.data ?? [], total: res.pagination?.total ?? 0 })));
  }
}
