import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  POSITIONS_HISTORY_CLOSE,
  POSITIONS_HISTORY_EMPTY,
  POSITIONS_HISTORY_LOAD_ERROR,
  POSITIONS_HISTORY_TITLE,
  POSITIONS_SNACK_CLOSE,
} from '../../../core/i18n/positions-labels';
import { PositionService } from '../../../core/services/position.service';
import { PositionEventItem } from '../../../shared/models/position.model';

export interface PositionEventsDialogData {
  positionId: number;
  requisitionNo: string;
}

@Component({
  selector: 'sh-position-events-dialog',
  standalone: true,
  imports: [DatePipe, MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ title }} — {{ data.requisitionNo }}</h2>
    <mat-dialog-content>
      @if (loading) {
        <div class="loading-wrap"><mat-spinner diameter="32" /></div>
      } @else if (!events.length) {
        <p class="empty">{{ emptyLabel }}</p>
      } @else {
        <ul class="timeline">
          @for (event of events; track event.id) {
            <li>
              <div class="event-type">{{ event.eventType }}</div>
              <div class="event-meta">
                {{ event.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                @if (event.fromStatus || event.toStatus) {
                  <span> · {{ event.fromStatus || '—' }} → {{ event.toStatus || '—' }}</span>
                }
              </div>
            </li>
          }
        </ul>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" type="button" mat-dialog-close>{{ closeLabel }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .loading-wrap {
      display: flex;
      justify-content: center;
      padding: 24px;
    }
    .empty {
      color: #64748b;
    }
    .timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .timeline li {
      border-left: 3px solid #0d9488;
      padding-left: 12px;
    }
    .event-type {
      font-weight: 600;
    }
    .event-meta {
      font-size: 12px;
      color: #64748b;
    }
  `,
})
export class PositionEventsDialogComponent implements OnInit {
  readonly data = inject<PositionEventsDialogData>(MAT_DIALOG_DATA);
  private readonly positionService = inject(PositionService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<PositionEventsDialogComponent>);

  readonly title = POSITIONS_HISTORY_TITLE;
  readonly emptyLabel = POSITIONS_HISTORY_EMPTY;
  readonly closeLabel = POSITIONS_HISTORY_CLOSE;

  loading = true;
  events: PositionEventItem[] = [];

  ngOnInit(): void {
    this.positionService.listEvents(this.data.positionId).subscribe({
      next: (res) => {
        this.events = res.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(POSITIONS_HISTORY_LOAD_ERROR, POSITIONS_SNACK_CLOSE, { duration: 4000 });
        this.dialogRef.close();
      },
    });
  }
}
