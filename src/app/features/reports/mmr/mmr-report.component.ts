import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '../../../mock/services/settings.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { MmrRow } from '../../../shared/models';

@Component({
  selector: 'sh-mmr-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    KpiCardComponent,
  ],
  templateUrl: './mmr-report.component.html',
  styleUrl: './mmr-report.component.scss',
})
export class MmrReportComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  loading = true;
  rows: MmrRow[] = [];
  kpis = { fillRateCurrent: '', fillRatePrevious: '', fillRateYtd: '' };
  months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  readonly filters = this.fb.nonNullable.group({
    year: ['2025'],
    branch: ['Todos'],
  });

  readonly columns = ['indicator', ...Array.from({ length: 12 }, (_, i) => 'm' + i)];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.settings.getMmrData().subscribe((data) => {
      this.kpis = data.kpis;
      this.rows = data.rows;
      this.loading = false;
    });
  }
}
