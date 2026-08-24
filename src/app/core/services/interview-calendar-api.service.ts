import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InterviewCalendarConfig,
  ScheduleInterviewRequest,
  ScheduleInterviewResponse,
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

  schedule(applicationId: number, body: ScheduleInterviewRequest): Observable<ScheduleInterviewResponse> {
    return this.http.post<ScheduleInterviewResponse>(
      this.api.apiUrl(`/api/v1/candidate-applications/${applicationId}/interviews`),
      body,
      { headers: this.api.buildHeaders() },
    );
  }
}
