import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InterviewCalendarConfig,
  ScheduleInterviewRequest,
  ScheduleInterviewResponse,
  SuggestedInterviewSlot,
} from '../../shared/models/interview-calendar.model';
import { ApiClientService } from './api-client.service';

@Injectable({ providedIn: 'root' })
export class InterviewCalendarApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getMyConfig(): Observable<InterviewCalendarConfig> {
    return this.http.get<InterviewCalendarConfig>(
      this.api.apiUrl('/api/v1/users/me/interview-calendar-config'),
      { headers: this.api.buildHeaders() },
    );
  }

  saveMyConfig(body: InterviewCalendarConfig): Observable<InterviewCalendarConfig> {
    return this.http.put<InterviewCalendarConfig>(
      this.api.apiUrl('/api/v1/users/me/interview-calendar-config'),
      body,
      { headers: this.api.buildHeaders() },
    );
  }

  suggestedSlot(
    applicationId: number,
    modality: 'VIRTUAL' | 'PRESENTIAL',
  ): Observable<SuggestedInterviewSlot> {
    return this.http.get<SuggestedInterviewSlot>(
      this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/interviews/suggested-slot`),
      {
        headers: this.api.buildHeaders(),
        params: { modality },
      },
    );
  }

  schedule(applicationId: number, body: ScheduleInterviewRequest): Observable<ScheduleInterviewResponse> {
    return this.http.post<ScheduleInterviewResponse>(
      this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/interviews`),
      body,
      { headers: this.api.buildHeaders() },
    );
  }
}
