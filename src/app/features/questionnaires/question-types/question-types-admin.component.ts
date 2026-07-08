import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  QQUEST_TYPE_REFERENCE,
  QQUEST_TYPES_COL_CODE,
  QQUEST_TYPES_COL_DESCRIPTION,
  QQUEST_TYPES_COL_LABEL,
  QQUEST_TYPES_INTRO,
} from '../../../core/i18n/questionnaire-questions-labels';

@Component({
  selector: 'sh-question-types-admin',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './question-types-admin.component.html',
  styleUrl: './question-types-admin.component.scss',
})
export class QuestionTypesAdminComponent {
  readonly intro = QQUEST_TYPES_INTRO;
  readonly columnCode = QQUEST_TYPES_COL_CODE;
  readonly columnLabel = QQUEST_TYPES_COL_LABEL;
  readonly columnDescription = QQUEST_TYPES_COL_DESCRIPTION;
  readonly columns = ['code', 'label', 'description'];
  readonly types = QQUEST_TYPE_REFERENCE;
}
