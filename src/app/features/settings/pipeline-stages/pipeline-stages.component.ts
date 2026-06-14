import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { PipelineStage } from '../../../shared/models';

@Component({
  selector: 'sh-pipeline-stages',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './pipeline-stages.component.html',
  styleUrl: './pipeline-stages.component.scss',
})
export class PipelineStagesComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly snack = inject(MatSnackBar);

  loading = true;
  data: PipelineStage[] = [];
  readonly columns = ['order', 'name', 'color', 'candidatesCount', 'actions'];

  ngOnInit(): void {
    this.settings.getPipeline().subscribe((s) => {
      this.data = s;
      this.loading = false;
    });
  }

  edit(stage: PipelineStage): void {
    this.snack.open(`Editar etapa: ${stage.name}`, 'Cerrar', { duration: 2500 });
  }
}
