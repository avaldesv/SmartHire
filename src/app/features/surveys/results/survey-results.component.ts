import { Component } from '@angular/core';
import { SurveySessionsListComponent } from '../shared/survey-sessions-list.component';

@Component({
  selector: 'sh-survey-results',
  standalone: true,
  imports: [SurveySessionsListComponent],
  template: `<sh-survey-sessions-list [showPositionColumn]="true" [showTitle]="true" />`,
})
export class SurveyResultsComponent {}
