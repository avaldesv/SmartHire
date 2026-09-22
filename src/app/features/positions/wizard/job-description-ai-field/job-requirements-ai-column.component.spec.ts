import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { GenerateJobDescriptionApiService } from '../../../../core/services/generate-job-description-api.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { JobRequirementsAiColumnComponent } from './job-requirements-ai-column.component';

describe('JobRequirementsAiColumnComponent', () => {
  let api: jasmine.SpyObj<GenerateJobDescriptionApiService>;
  let feedback: jasmine.SpyObj<FeedbackDialogService>;
  let component: JobRequirementsAiColumnComponent;

  beforeEach(() => {
    api = jasmine.createSpyObj('GenerateJobDescriptionApiService', ['generate']);
    feedback = jasmine.createSpyObj('FeedbackDialogService', ['showWarning', 'showApiError']);
    TestBed.configureTestingModule({
      providers: [
        { provide: GenerateJobDescriptionApiService, useValue: api },
        { provide: FeedbackDialogService, useValue: feedback },
        { provide: LocaleService, useValue: { activeLocale: () => 'es-MX' } },
      ],
    });
    component = TestBed.runInInjectionContext(() => new JobRequirementsAiColumnComponent());
    component.mandatoryControl = new FormControl<string | null>('keep-m');
    component.optionalControl = new FormControl<string | null>('keep-o');
    component.desirableControl = new FormControl<string | null>('keep-d');
    component.positionNameControl = new FormControl<string | null>('');
    component.jobDescriptionControl = new FormControl<string | null>('');
    component.ngOnInit();
  });

  it('does not call the chat API when positionName is empty', () => {
    component.onGenerate();
    expect(api.generate).not.toHaveBeenCalled();
    expect(feedback.showWarning).toHaveBeenCalled();
  });

  it('fills the three controls from a |*| JSON chat response', () => {
    component.positionNameControl.setValue('Analista');
    const piped =
      '{|*|  "tipo_de_requisitos": {|*|    "obligatorios": {|*|      "requisito1": "A1",|*|      "requisito2": "A2",|*|      "requisito3": "A3"|*|    },|*|    "opcionales": {|*|      "requisito1": "B1",|*|      "requisito2": "B2",|*|      "requisito3": "B3"|*|    },|*|    "deseables": {|*|      "requisito1": "C1",|*|      "requisito2": "C2",|*|      "requisito3": "C3"|*|    }|*|  }|*|}';
    api.generate.and.returnValue(of({ message: piped, conversationThreadId: 't1' }));
    component.onGenerate();
    expect(api.generate).toHaveBeenCalledTimes(1);
    expect(component.mandatoryControl.value).toBe('- A1\n- A2\n- A3');
    expect(component.optionalControl.value).toBe('- B1\n- B2\n- B3');
    expect(component.desirableControl.value).toBe('- C1\n- C2\n- C3');
  });

  it('does not overwrite controls when generate JSON is invalid', () => {
    component.positionNameControl.setValue('Analista');
    api.generate.and.returnValue(of({ message: 'not json', conversationThreadId: 't1' }));
    component.onGenerate();
    expect(component.mandatoryControl.value).toBe('keep-m');
    expect(component.optionalControl.value).toBe('keep-o');
    expect(component.desirableControl.value).toBe('keep-d');
    expect(feedback.showWarning).toHaveBeenCalled();
  });
});
