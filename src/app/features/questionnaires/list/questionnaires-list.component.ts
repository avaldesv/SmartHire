import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionnaireApiService } from '../../../core/services/questionnaire-api.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Questionnaire } from '../../../shared/models';

@Component({
  selector: 'sh-questionnaires-list',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PageHeaderComponent,
  ],
  templateUrl: './questionnaires-list.component.html',
  styleUrl: './questionnaires-list.component.scss',
})
export class QuestionnairesListComponent implements OnInit {
  private readonly questionnaireApi = inject(QuestionnaireApiService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  data: Questionnaire[] = [];
  readonly columns = ['name', 'category', 'questionsCount', 'acceptancePercent', 'type', 'active', 'actions'];

  ngOnInit(): void {
    this.questionnaireApi.listForms(0, 100).subscribe({
      next: (res) => {
        this.data = res.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los cuestionarios', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
