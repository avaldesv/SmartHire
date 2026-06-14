import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PipelineStage } from '../../../shared/models';

@Component({
  selector: 'sh-tracking-pipeline',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, PageHeaderComponent],
  templateUrl: './tracking-pipeline.component.html',
  styleUrl: './tracking-pipeline.component.scss',
})
export class TrackingPipelineComponent implements OnInit {
  private readonly settings = inject(SettingsService);

  loading = true;
  stages: PipelineStage[] = [];

  ngOnInit(): void {
    this.settings.getPipeline().subscribe((s) => {
      this.stages = s;
      this.loading = false;
    });
  }
}
