import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import {
  EVALUATEST_BATTERY_ADD,
  EVALUATEST_BATTERY_ADD_COMPETENCES,
  EVALUATEST_BATTERY_ADD_TESTS,
  EVALUATEST_BATTERY_AVG_TIME,
  EVALUATEST_BATTERY_CANCEL,
  EVALUATEST_BATTERY_COMPETENCE_MODEL,
  EVALUATEST_BATTERY_CURRENT_COMPETENCES,
  EVALUATEST_BATTERY_CURRENT_TESTS,
  EVALUATEST_BATTERY_DESIRABLE,
  EVALUATEST_BATTERY_EMPTY_NEW_COMPETENCES,
  EVALUATEST_BATTERY_EVALUATE,
  EVALUATEST_BATTERY_GENERAL,
  EVALUATEST_BATTERY_ID,
  EVALUATEST_BATTERY_LEVEL,
  EVALUATEST_BATTERY_LOAD_ERROR,
  EVALUATEST_BATTERY_MANDATORY,
  EVALUATEST_BATTERY_NAME,
  EVALUATEST_BATTERY_NECESSARY,
  EVALUATEST_BATTERY_NO,
  EVALUATEST_BATTERY_POSITION,
  EVALUATEST_BATTERY_REQUIRED,
  EVALUATEST_BATTERY_SAVE,
  EVALUATEST_BATTERY_SAVE_ERROR,
  EVALUATEST_BATTERY_SAVE_OK,
  EVALUATEST_BATTERY_SELECT_COMPETENCE,
  EVALUATEST_BATTERY_SELECT_TEST,
  EVALUATEST_BATTERY_TEST_ESIC,
  EVALUATEST_BATTERY_TITLE,
  EVALUATEST_BATTERY_YES,
} from '../../../../core/i18n/evaluatest-battery-labels';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { PositionService } from '../../../../core/services/position.service';
import {
  EvaluatestBatteryCatalogOption,
  EvaluatestBatteryCompetenceItem,
  EvaluatestBatteryResponse,
  EvaluatestBatteryTestItem,
} from '../../../../shared/models/evaluatest-battery.model';

export interface EvaluatestBatteryDialogData {
  positionId: number;
  positionName?: string | null;
}

@Component({
  selector: 'sh-evaluatest-battery-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './evaluatest-battery-dialog.component.html',
  styleUrl: './evaluatest-battery-dialog.component.scss',
})
export class EvaluatestBatteryDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EvaluatestBatteryDialogComponent, boolean>);
  private readonly data = inject<EvaluatestBatteryDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly positionService = inject(PositionService);
  private readonly feedback = inject(FeedbackDialogService);

  readonly labels = {
    title: EVALUATEST_BATTERY_TITLE,
    position: EVALUATEST_BATTERY_POSITION,
    competenceModel: EVALUATEST_BATTERY_COMPETENCE_MODEL,
    general: EVALUATEST_BATTERY_GENERAL,
    evaluate: EVALUATEST_BATTERY_EVALUATE,
    yes: EVALUATEST_BATTERY_YES,
    no: EVALUATEST_BATTERY_NO,
    necessary: EVALUATEST_BATTERY_NECESSARY,
    desirable: EVALUATEST_BATTERY_DESIRABLE,
    currentCompetences: EVALUATEST_BATTERY_CURRENT_COMPETENCES,
    addCompetences: EVALUATEST_BATTERY_ADD_COMPETENCES,
    selectCompetence: EVALUATEST_BATTERY_SELECT_COMPETENCE,
    emptyNewCompetences: EVALUATEST_BATTERY_EMPTY_NEW_COMPETENCES,
    currentTests: EVALUATEST_BATTERY_CURRENT_TESTS,
    addTests: EVALUATEST_BATTERY_ADD_TESTS,
    selectTest: EVALUATEST_BATTERY_SELECT_TEST,
    id: EVALUATEST_BATTERY_ID,
    name: EVALUATEST_BATTERY_NAME,
    level: EVALUATEST_BATTERY_LEVEL,
    required: EVALUATEST_BATTERY_REQUIRED,
    mandatory: EVALUATEST_BATTERY_MANDATORY,
    testEsic: EVALUATEST_BATTERY_TEST_ESIC,
    avgTime: EVALUATEST_BATTERY_AVG_TIME,
    add: EVALUATEST_BATTERY_ADD,
    cancel: EVALUATEST_BATTERY_CANCEL,
    save: EVALUATEST_BATTERY_SAVE,
  };

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly battery = signal<EvaluatestBatteryResponse | null>(null);

  currentCompetences: EvaluatestBatteryCompetenceItem[] = [];
  currentTests: EvaluatestBatteryTestItem[] = [];
  pendingCompetences: EvaluatestBatteryCompetenceItem[] = [];
  availableCompetences: EvaluatestBatteryCatalogOption[] = [];
  availableTests: EvaluatestBatteryCatalogOption[] = [];
  filteredTests: EvaluatestBatteryCatalogOption[] = [];

  readonly competenceColumns = ['id', 'name', 'level', 'required'];
  readonly pendingCompetenceColumns = ['id', 'name', 'level', 'required'];
  readonly testColumns = ['id', 'name', 'mandatory', 'isTestEsic', 'avgTime'];

  readonly form = this.fb.nonNullable.group({
    isCompetenceEvaluation: [true, Validators.required],
    mandatoryWeight: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
    desirableWeight: [20, [Validators.required, Validators.min(0), Validators.max(100)]],
    selectedCompetenceId: [null as number | null],
    testSearch: [''],
  });

  ngOnInit(): void {
    this.positionService.getEvaluatestBattery(this.data.positionId).subscribe({
      next: (res) => {
        this.battery.set(res);
        this.currentCompetences = [...(res.currentCompetences ?? [])];
        this.currentTests = [...(res.currentTests ?? [])];
        this.availableCompetences = [...(res.availableCompetences ?? [])];
        this.availableTests = [...(res.availableTests ?? [])];
        this.filteredTests = [...this.availableTests];
        this.form.patchValue({
          isCompetenceEvaluation: res.isCompetenceEvaluation ?? true,
          mandatoryWeight: res.mandatoryWeight ?? 80,
          desirableWeight: res.desirableWeight ?? 20,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.feedback.showApiError(err, { fallbackMessage: EVALUATEST_BATTERY_LOAD_ERROR });
        this.dialogRef.close(false);
      },
    });

    this.form.controls.testSearch.valueChanges.subscribe((term) => this.filterTests(term ?? ''));
  }

  get jobName(): string {
    return this.battery()?.jobName || this.data.positionName || '';
  }

  get competenceModelName(): string {
    return this.battery()?.competenceModelName || '';
  }

  addCompetence(): void {
    const id = this.form.controls.selectedCompetenceId.value;
    if (id == null) {
      return;
    }
    if (
      this.currentCompetences.some((c) => c.id === id) ||
      this.pendingCompetences.some((c) => c.id === id)
    ) {
      this.form.controls.selectedCompetenceId.setValue(null);
      return;
    }
    const option = this.availableCompetences.find((c) => c.id === id);
    if (!option) {
      return;
    }
    this.pendingCompetences = [
      ...this.pendingCompetences,
      { id: option.id, name: option.name, level: null, required: true },
    ];
    this.form.controls.selectedCompetenceId.setValue(null);
  }

  togglePendingRequired(row: EvaluatestBatteryCompetenceItem, value: boolean): void {
    row.required = value;
  }

  selectTest(option: EvaluatestBatteryCatalogOption): void {
    if (this.currentTests.some((t) => t.id === option.id)) {
      return;
    }
    this.currentTests = [
      ...this.currentTests,
      {
        id: option.id,
        name: option.name,
        mandatory: true,
        isTestEsic: false,
        avgTimeMinutes: null,
      },
    ];
  }

  private filterTests(term: string): void {
    const q = term.trim().toLowerCase();
    this.filteredTests = !q
      ? [...this.availableTests]
      : this.availableTests.filter((t) => (t.name ?? '').toLowerCase().includes(q));
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const competences = [...this.currentCompetences, ...this.pendingCompetences];
    this.saving.set(true);
    this.positionService
      .updateEvaluatestBattery(this.data.positionId, {
        isCompetenceEvaluation: value.isCompetenceEvaluation,
        mandatoryWeight: value.mandatoryWeight,
        desirableWeight: value.desirableWeight,
        competences,
        tests: this.currentTests,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.feedback.showSuccess(EVALUATEST_BATTERY_SAVE_OK);
          this.dialogRef.close(true);
        },
        error: (err) =>
          this.feedback.showApiError(err, { fallbackMessage: EVALUATEST_BATTERY_SAVE_ERROR }),
      });
  }
}
