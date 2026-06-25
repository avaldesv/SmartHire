import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { QuestionnaireApiService } from '../../../core/services/questionnaire-api.service';
import { PositionService } from '../../../core/services/position.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Questionnaire } from '../../../shared/models';
import { mapEvaluationTypeToApi } from '../../../shared/models/questionnaire.model';

@Component({
  selector: 'sh-questionnaire-assign',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PageHeaderComponent,
  ],
  templateUrl: './questionnaire-assign.component.html',
  styleUrl: './questionnaire-assign.component.scss',
})
export class QuestionnaireAssignComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly questionnaireApi = inject(QuestionnaireApiService);
  private readonly positionService = inject(PositionService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  saving = false;
  questionnaires: Questionnaire[] = [];
  requisitions: { id: number; label: string }[] = [];

  readonly form = this.fb.nonNullable.group({
    questionnaireId: [0, [Validators.required, Validators.min(1)]],
    requisitionId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    forkJoin({
      questionnaires: this.questionnaireApi.listForms(0, 100, true),
      positions: this.positionService.list(0, 50),
    }).subscribe({
      next: ({ questionnaires, positions }) => {
        this.questionnaires = questionnaires.items;
        this.requisitions = positions.items.map((r) => ({ id: r.id, label: `${r.requisitionNo} — ${r.name}` }));
        if (this.questionnaires.length) {
          this.form.patchValue({ questionnaireId: this.questionnaires[0].id });
        }
        if (this.requisitions.length) {
          this.form.patchValue({ requisitionId: this.requisitions[0].id });
          this.loadAssignmentForPosition(this.requisitions[0].id);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los datos', 'Cerrar', { duration: 4000 });
      },
    });

    this.form.controls.requisitionId.valueChanges.subscribe((positionId) => {
      if (positionId > 0) {
        this.loadAssignmentForPosition(positionId);
      }
    });
  }

  assign(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const questionnaire = this.questionnaires.find((q) => q.id === this.form.controls.questionnaireId.value);
    if (!questionnaire) {
      this.snack.open('Seleccione un cuestionario válido', 'Cerrar', { duration: 4000 });
      return;
    }

    this.saving = true;
    const positionId = this.form.controls.requisitionId.value;
    this.questionnaireApi
      .upsertPositionAssignment(positionId, {
        questionnaireFormId: questionnaire.id,
        evaluationType: mapEvaluationTypeToApi(questionnaire.type),
        acceptancePercent: questionnaire.acceptancePercent,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.snack.open('Cuestionario asignado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/questionnaires']);
        },
        error: () => {
          this.saving = false;
          this.snack.open('No se pudo asignar el cuestionario', 'Cerrar', { duration: 4000 });
        },
      });
  }

  private loadAssignmentForPosition(positionId: number): void {
    this.questionnaireApi.getPositionAssignment(positionId).subscribe({
      next: (assignment) => {
        if (assignment.persisted && assignment.questionnaireFormId != null) {
          this.form.patchValue({ questionnaireId: assignment.questionnaireFormId }, { emitEvent: false });
        }
      },
      error: () => {
        // Sin asignación previa o error de red: se mantiene la selección actual.
      },
    });
  }
}
