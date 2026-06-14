import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateService } from '../../../mock/services/candidate.service';
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
  private readonly candidateService = inject(CandidateService);
  private readonly snack = inject(MatSnackBar);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  loading = true;
  data: PreselectionCandidate[] = [];
  selectedCount = 0;

  readonly columns = ['select', 'name', 'compatibility', 'stage', 'documentsComplete', 'interviewScheduled', 'actions'];

  ngOnInit(): void {
    this.candidateService.getPreselection(this.positionId).subscribe((items) => {
      this.data = items;
      this.loading = false;
      this.updateSelected();
    });
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
