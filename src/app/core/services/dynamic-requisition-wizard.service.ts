import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ResolvedRequisitionFormConfig } from '../../shared/models/requisition-wizard.model';
import { DEFAULT_REQUISITION_WIZARD_SCHEMA } from '../../features/positions/wizard/default-requisition-wizard-schema.constant';
import { applyBuiltinFieldPresentation } from '../../features/positions/wizard/requisition-form-presentation.util';
import {
  buildDynamicStepForms,
  flattenDynamicFormValues,
  refreshDynamicValidators,
} from '../../features/positions/wizard/dynamic-wizard-payload.util';
import { RequisitionFormConfigService } from './requisition-form-config.service';

@Injectable({ providedIn: 'root' })
export class DynamicRequisitionWizardService {
  private readonly fb = inject(FormBuilder);
  private readonly formConfigService = inject(RequisitionFormConfigService);

  resolve(countryId: number, coverageTypeId: number): Observable<ResolvedRequisitionFormConfig | null> {
    return this.formConfigService.resolve(countryId, coverageTypeId).pipe(
      map((config) => (config.steps.length ? applyBuiltinFieldPresentation(config) : null)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }
        throw error;
      }),
    );
  }

  getDefaultSchema(): ResolvedRequisitionFormConfig {
    return applyBuiltinFieldPresentation(DEFAULT_REQUISITION_WIZARD_SCHEMA);
  }

  buildForm(config: ResolvedRequisitionFormConfig): FormGroup {
    return buildDynamicStepForms(this.fb, config);
  }

  refreshValidators(form: FormGroup, config: ResolvedRequisitionFormConfig): void {
    refreshDynamicValidators(form, config);
  }

  getFlatValues(form: FormGroup): Record<string, unknown> {
    return flattenDynamicFormValues(form);
  }
}
