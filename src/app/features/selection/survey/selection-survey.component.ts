import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveySessionsListComponent } from '../../surveys/shared/survey-sessions-list.component';

@Component({
  selector: 'sh-selection-survey',
  standalone: true,
  imports: [SurveySessionsListComponent],
  template: `
    <sh-survey-sessions-list
      [positionId]="positionId"
      [showPositionColumn]="false"
      [showTitle]="true"
    />
  `,
})
export class SelectionSurveyComponent {
  private readonly route = inject(ActivatedRoute);
  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
}
