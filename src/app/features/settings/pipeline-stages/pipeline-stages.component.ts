import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CatalogPipelineStageService } from '../../../core/services/catalog-pipeline-stage.service';
import { CatalogPipelineStage } from '../../../shared/models/catalog-pipeline-stage.model';
import { TableRowActionsComponent } from '../../../shared/components/table-row-actions/table-row-actions.component';

@Component({
  selector: 'sh-pipeline-stages',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, TableRowActionsComponent],
  templateUrl: './pipeline-stages.component.html',
  styleUrl: './pipeline-stages.component.scss',
})
export class PipelineStagesComponent implements OnInit {
  private readonly pipelineStageService = inject(CatalogPipelineStageService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  data: CatalogPipelineStage[] = [];
  readonly columns = ['order', 'name', 'color', 'code', 'actions'];

  ngOnInit(): void {
    this.pipelineStageService.list().subscribe({
      next: ({ items }) => {
        this.data = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar las etapas del pipeline', 'Cerrar', { duration: 4000 });
      },
    });
  }

  edit(stage: CatalogPipelineStage): void {
    this.snack.open(`Edición disponible en AVV-352 (CRUD admin)`, 'Cerrar', { duration: 3000 });
  }
}
