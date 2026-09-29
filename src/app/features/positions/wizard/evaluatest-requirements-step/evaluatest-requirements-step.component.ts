import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, distinctUntilChanged } from 'rxjs';
import {
  EvaluatestApiService,
  EvaluatestCatalogItem,
  evaluatestOptionId,
  evaluatestOptionLabel,
} from '../../../../core/services/evaluatest-api.service';
import { DEFAULT_LOGIN_LOCALE, LocaleService } from '../../../../core/services/locale.service';
import { PositionEvaluatestPayload } from '../../../../shared/models/position.model';

/** Hardcoded SelectionJobPattern options (refine when Brivé catalog is confirmed). */
const SELECTION_JOB_PATTERNS: { id: number; name: string }[] = [
  { id: 1, name: 'Industria' },
  { id: 2, name: 'Área funcional' },
];

@Component({
  selector: 'sh-evaluatest-requirements-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './evaluatest-requirements-step.component.html',
  styleUrl: './evaluatest-requirements-step.component.scss',
})
export class EvaluatestRequirementsStepComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(EvaluatestApiService);
  private readonly localeService = inject(LocaleService);
  private readonly subs = new Subscription();

  @Input({ required: true }) stepForm!: FormGroup;
  @Input() initial: PositionEvaluatestPayload | null = null;
  @Input() defaultJobName: string | null = null;

  readonly labels = {
    section: $localize`:@@requisition.evaluatest.section:Detalles del Puesto`,
    toggle: $localize`:@@requisition.evaluatest.toggle:Evalua Test`,
    jobName: $localize`:@@requisition.evaluatest.jobName:Nombre`,
    competenceModel: $localize`:@@requisition.evaluatest.competenceModel:Modelo de Competencias`,
    jobLevel: $localize`:@@requisition.evaluatest.jobLevel:Nivel del perfil`,
    selectionJobPattern: $localize`:@@requisition.evaluatest.selectionJobPattern:SelectionJobPattern`,
    industry: $localize`:@@requisition.evaluatest.industry:Industria`,
    functionalArea: $localize`:@@requisition.evaluatest.functionalArea:Área funcional`,
    industryJobType: $localize`:@@requisition.evaluatest.industryJobType:Tipos de puestos por industria`,
    selectPlaceholder: $localize`:@@requisition.evaluatest.selectPlaceholder:--- Seleccionar un valor ---`,
    loading: $localize`:@@common.loading:Cargando…`,
  };

  readonly selectionPatterns = SELECTION_JOB_PATTERNS;

  form!: FormGroup;
  loadingBase = false;
  loadingLevels = false;
  loadingIndustryTypes = false;

  competenceModels: EvaluatestCatalogItem[] = [];
  jobLevels: EvaluatestCatalogItem[] = [];
  industries: EvaluatestCatalogItem[] = [];
  functionalAreas: EvaluatestCatalogItem[] = [];
  industryJobTypes: EvaluatestCatalogItem[] = [];

  optionId = evaluatestOptionId;
  optionLabel = evaluatestOptionLabel;

  ngOnInit(): void {
    this.form = this.fb.group({
      evaluatestEnabled: [this.initial?.evaluatestEnabled ?? true],
      jobName: [this.initial?.jobName ?? this.defaultJobName ?? ''],
      competenceModelId: [this.initial?.competenceModelId ?? null],
      jobLevelId: [this.initial?.jobLevelId ?? null],
      selectionJobPatternId: [this.initial?.selectionJobPatternId ?? null],
      industryId: [this.initial?.industryId ?? null],
      functionalAreaId: [this.initial?.functionalAreaId ?? null],
      industryJobTypeId: [this.initial?.industryJobTypeId ?? null],
      evaluatestJobProfileId: [this.initial?.evaluatestJobProfileId ?? null],
    });

    if (this.stepForm.contains('evaluatest')) {
      this.stepForm.setControl('evaluatest', this.form);
    } else {
      this.stepForm.addControl('evaluatest', this.form);
    }

    this.loadBaseCatalogs();

    this.subs.add(
      this.form.controls['competenceModelId'].valueChanges.pipe(distinctUntilChanged()).subscribe((id) => {
        this.form.patchValue({ jobLevelId: null, industryJobTypeId: null }, { emitEvent: false });
        this.jobLevels = [];
        this.industryJobTypes = [];
        if (id != null) {
          this.loadJobLevels(Number(id));
        }
      }),
    );

    this.subs.add(
      this.form.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.maybeLoadIndustryJobTypes()),
    );

    if (this.initial?.competenceModelId != null) {
      this.loadJobLevels(this.initial.competenceModelId);
    }
    this.maybeLoadIndustryJobTypes();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /** Portal locale (e.g. es-MX) — Evaluatest catalog path segment, not language id. */
  private currentLanguage(): string {
    return this.localeService.getLanguageHeader()?.trim() || DEFAULT_LOGIN_LOCALE;
  }

  private loadBaseCatalogs(): void {
    this.loadingBase = true;
    const language = this.currentLanguage();
    let pending = 3;
    const done = () => {
      pending -= 1;
      if (pending <= 0) {
        this.loadingBase = false;
      }
    };
    this.api.getCompetenceModels(language).subscribe({
      next: (items) => {
        this.competenceModels = items ?? [];
        done();
      },
      error: () => done(),
    });
    this.api.getIndustries(language).subscribe({
      next: (items) => {
        this.industries = items ?? [];
        done();
      },
      error: () => done(),
    });
    this.api.getFunctionalAreas(language).subscribe({
      next: (items) => {
        this.functionalAreas = items ?? [];
        done();
      },
      error: () => done(),
    });
  }

  private loadJobLevels(competenceModelId: number): void {
    this.loadingLevels = true;
    this.api.getJobLevels(competenceModelId, this.currentLanguage()).subscribe({
      next: (items) => {
        this.jobLevels = items ?? [];
        this.loadingLevels = false;
      },
      error: () => {
        this.jobLevels = [];
        this.loadingLevels = false;
      },
    });
  }

  private maybeLoadIndustryJobTypes(): void {
    const industryId = this.form.controls['industryId'].value;
    const jobLevelId = this.form.controls['jobLevelId'].value;
    if (industryId == null || jobLevelId == null) {
      this.industryJobTypes = [];
      return;
    }
    this.loadingIndustryTypes = true;
    this.api
      .getIndustryJobTypes(Number(industryId), Number(jobLevelId), this.currentLanguage())
      .subscribe({
        next: (items) => {
          this.industryJobTypes = items ?? [];
          this.loadingIndustryTypes = false;
        },
        error: () => {
          this.industryJobTypes = [];
          this.loadingIndustryTypes = false;
        },
      });
  }
}
