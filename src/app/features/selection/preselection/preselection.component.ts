import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateApplicationApiService } from '../../../core/services/candidate-application-api.service';
import {
  CandidatePoolDialogComponent,
  CandidatePoolDialogData,
} from '../../candidates/dialogs/candidate-pool-dialog/candidate-pool-dialog.component';
import {
  PositionApplicationsDialogComponent,
  PositionApplicationsDialogData,
} from '../../candidates/dialogs/position-applications-dialog/position-applications-dialog.component';
import { PreselectionCandidate } from '../../../shared/models';

@Component({
  selector: 'sh-preselection',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './preselection.component.html',
  styleUrl: './preselection.component.scss',
})
export class PreselectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  loading = true;
  data: PreselectionCandidate[] = [];
  selectedCount = 0;

  readonly columns = ['select', 'name', 'compatibility', 'stage', 'documentsComplete', 'interviewScheduled', 'actions'];

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationApi.list(0, 100, { positionId: this.positionId }).subscribe({
      next: (res) => {
        this.data = res.items.map((app) => ({
          id: app.candidateId,
          firstName: app.candidateFirstName ?? '',
          lastName: app.candidateLastName ?? '',
          email: app.candidateEmail ?? '',
          phone: app.candidatePhone ?? '',
          country: '',
          city: '',
          state: '',
          source: app.source ?? '',
          active: true,
          createdAt: app.createdAt,
          compatibility: app.compatibilityPercent ?? 0,
          stage: app.status,
          interviewScheduled: false,
          documentsComplete: false,
          selected: app.isSelected ?? false,
          smartSent: false,
        }));
        this.loading = false;
        this.updateSelected();
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los candidatos postulados', 'Cerrar', { duration: 4000 });
      },
    });
  }

  openPoolDialog(): void {
    const ref = this.dialog.open<CandidatePoolDialogComponent, CandidatePoolDialogData>(
      CandidatePoolDialogComponent,
      {
        width: '760px',
        maxWidth: '95vw',
        data: { positionId: this.positionId, requisitionNo: `REQ-${this.positionId}` },
      },
    );
    ref.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.snack.open(`${result.created} candidato(s) postulado(s)`, 'Cerrar', { duration: 3500 });
        this.loadApplications();
      }
    });
  }

  openApplicationsDialog(): void {
    this.dialog.open<PositionApplicationsDialogComponent, PositionApplicationsDialogData>(
      PositionApplicationsDialogComponent,
      {
        width: '720px',
        maxWidth: '95vw',
        data: { positionId: this.positionId, requisitionNo: `REQ-${this.positionId}` },
      },
    );
  }

  toggleAll(checked: boolean): void {
    this.data.forEach((c) => (c.selected = checked));
    this.updateSelected();
  }

  toggleRow(row: PreselectionCandidate): void {
    row.selected = !row.selected;
    this.updateSelected();
  }

  updateSelected(): void {
    this.selectedCount = this.data.filter((c) => c.selected).length;
  }

  action(name: string): void {
    this.snack.open(`${name}: ${this.selectedCount} candidato(s)`, 'Cerrar', { duration: 2500 });
  }
}
