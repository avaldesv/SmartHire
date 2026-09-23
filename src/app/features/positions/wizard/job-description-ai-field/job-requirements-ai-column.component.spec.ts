import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { GenerateJobDescriptionApiService } from '../../../../core/services/generate-job-description-api.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { JobRequirementsAiColumnComponent } from './job-requirements-ai-column.component';

describe('JobRequirementsAiColumnComponent', () => {
  let api: jasmine.SpyObj<GenerateJobDescriptionApiService>;
  let feedback: jasmine.SpyObj<FeedbackDialogService>;
  let component: JobRequirementsAiColumnComponent;

  const piped =
    '{|*|  "tipo_de_requisitos": {|*|    "obligatorios": {|*|      "requisito1": "A1",|*|      "requisito2": "A2",|*|      "requisito3": "A3"|*|    },|*|    "opcionales": {|*|      "requisito1": "B1",|*|      "requisito2": "B2",|*|      "requisito3": "B3"|*|    },|*|    "deseables": {|*|      "requisito1": "C1",|*|      "requisito2": "C2",|*|      "requisito3": "C3"|*|    }|*|  }|*|}';

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
    component.jobDescriptionControl = new FormControl<string | null>('TEXTO PREVIO');
    component.ngOnInit();
  });

  it('does not call the chat API when positionName is empty', () => {
    component.onGenerate();
    expect(api.generate).not.toHaveBeenCalled();
    expect(feedback.showWarning).toHaveBeenCalled();
    expect(component.jobDescriptionControl.value).toBe('TEXTO PREVIO');
  });

  it('calls description and requirements together and does not send the previous description', () => {
    component.positionNameControl.setValue('Analista');
    component.promptSnapshotFactory = () => ({ city: 'Guadalajara', tradeName: 'Systek' });
    api.generate.and.returnValue(of({ message: piped, conversationThreadId: 't1' }));
    component.onGenerate();
    expect(api.generate).toHaveBeenCalledTimes(2);
    const preguntas = api.generate.calls.allArgs().map((args) => args[0].pregunta);
    for (const pregunta of preguntas) {
      expect(pregunta).not.toContain('TEXTO PREVIO');
      expect(pregunta).toContain('Guadalajara');
      expect(pregunta).toContain('Systek');
    }
    expect(component.mandatoryControl.value).toBe('- A1\n- A2\n- A3');
    expect(component.optionalControl.value).toBe('- B1\n- B2\n- B3');
    expect(component.desirableControl.value).toBe('- C1\n- C2\n- C3');
    expect(component.jobDescriptionControl.value).not.toContain('|*|');
  });

  it('does not overwrite requirements when their JSON is invalid', () => {
    component.positionNameControl.setValue('Analista');
    api.generate.and.returnValue(of({ message: 'not json', conversationThreadId: 't1' }));
    component.onGenerate();
    expect(component.mandatoryControl.value).toBe('keep-m');
    expect(component.optionalControl.value).toBe('keep-o');
    expect(component.desirableControl.value).toBe('keep-d');
    expect(feedback.showWarning).toHaveBeenCalled();
  });

  it('keeps the previous description when that call fails and still fills requirements', () => {
    component.positionNameControl.setValue('Analista');
    api.generate.and.callFake((request: { pregunta: string }) => {
      if (request.pregunta.includes('tipo_de_requisitos')) {
        return of({ message: piped, conversationThreadId: 'req' });
      }
      return throwError(() => new Error('description down'));
    });
    component.onGenerate();
    expect(component.jobDescriptionControl.value).toBe('TEXTO PREVIO');
    expect(component.mandatoryControl.value).toBe('- A1\n- A2\n- A3');
    expect(feedback.showApiError).toHaveBeenCalled();
  });
});
