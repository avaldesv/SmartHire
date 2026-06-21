import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService } from '../../../mock/services/settings.service';
import { PositionService } from '../../../core/services/position.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Questionnaire } from '../../../shared/models';

@Component({
  selector: 'sh-questionnaire-assign',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule, PageHeaderComponent],
  templateUrl: './questionnaire-assign.component.html',
  styleUrl: './questionnaire-assign.component.scss',
})
export class QuestionnaireAssignComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settings = inject(SettingsService);
  private readonly positionService = inject(PositionService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  questionnaires: Questionnaire[] = [];
  requisitions: { id: number; label: string }[] = [];

  readonly form = this.fb.nonNullable.group({
    questionnaireId: [0, Validators.required],
    requisitionId: [0, Validators.required],
  });

  ngOnInit(): void {
    this.settings.getQuestionnaires().subscribe((q) => {
      this.questionnaires = q;
      if (q.length) this.form.patchValue({ questionnaireId: q[0].id });
    });
    this.positionService.list(0, 50).subscribe({
      next: (res) => {
        this.requisitions = res.items.map((r) => ({ id: r.id, label: `${r.requisitionNo} — ${r.name}` }));
        if (this.requisitions.length) this.form.patchValue({ requisitionId: this.requisitions[0].id });
      },
      error: () => this.snack.open('No se pudieron cargar las requisiciones', 'Cerrar', { duration: 4000 }),
    });
  }

  assign(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.snack.open('Cuestionario asignado correctamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/questionnaires']);
  }
}
