import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  QuestionnairePositionAssignmentApiItem,
  UpsertQuestionnairePositionAssignmentRequest,
} from '../../shared/models/questionnaire.model';
import { ApiClientService } from './api-client.service';

/** Position assignment API (RF-015 stub until F3 exam-position links). */
@Injectable({ providedIn: 'root' })
export class QuestionnaireApiService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiClientService);

  getPositionAssignment(positionId: number): Observable<QuestionnairePositionAssignmentApiItem> {
    return this.http.get<QuestionnairePositionAssignmentApiItem>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/questionnaire-assignment`),
      { headers: this.api.buildHeaders() },
    );
  }

  upsertPositionAssignment(
    positionId: number,
    request: UpsertQuestionnairePositionAssignmentRequest,
  ): Observable<QuestionnairePositionAssignmentApiItem> {
    return this.http.put<QuestionnairePositionAssignmentApiItem>(
      this.api.apiUrl(`/api/v1/positions/${positionId}/questionnaire-assignment`),
      request,
      { headers: this.api.buildHeaders() },
    );
  }
}
