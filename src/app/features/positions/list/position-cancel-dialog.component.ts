import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  POSITIONS_CANCEL_DIALOG_CANDIDATES,
  POSITIONS_CANCEL_DIALOG_COL_EMAIL,
  POSITIONS_CANCEL_DIALOG_COL_NAME,
  POSITIONS_CANCEL_DIALOG_COL_PHONE,
  POSITIONS_CANCEL_DIALOG_COL_STATUS,
  POSITIONS_CANCEL_DIALOG_CRITICAL_WARNING,
  POSITIONS_CANCEL_DIALOG_CRITICAL_TITLE,
  POSITIONS_CANCEL_DIALOG_DESCRIPTION,
  POSITIONS_CANCEL_DIALOG_EVIDENCE,
  POSITIONS_CANCEL_DIALOG_EVIDENCE_CLEAR,
  POSITIONS_CANCEL_DIALOG_EVIDENCE_HINT,
  POSITIONS_CANCEL_DIALOG_EVIDENCE_INVALID,
  POSITIONS_CANCEL_DIALOG_EVIDENCE_PICK,
  POSITIONS_CANCEL_DIALOG_HIDE,
  POSITIONS_CANCEL_DIALOG_LOAD_ERROR,
  POSITIONS_CANCEL_DIALOG_NO_CANDIDATES,
  POSITIONS_CANCEL_DIALOG_REASON,
  POSITIONS_CANCEL_DIALOG_REQUIRED,
  POSITIONS_CANCEL_DIALOG_REQUISITION,
  POSITIONS_CANCEL_DIALOG_REASONS_ERROR,
  POSITIONS_CANCEL_DIALOG_SHOW,
  POSITIONS_CANCEL_DIALOG_TYPE,
  POSITIONS_COL_APPLICANTS,
  POSITIONS_COL_FIRST_DAY,
  POSITIONS_COL_POSITIONS,
  POSITIONS_COL_PRESELECTION,
  POSITIONS_REASON_DIALOG_CANCEL,
  POSITIONS_REASON_DIALOG_CONFIRM,
} from '../../../core/i18n/positions-labels';
import { CatalogCancellationReasonService } from '../../../core/services/catalog-cancellation-reason.service';
import { CatalogCancellationTypeService } from '../../../core/services/catalog-cancellation-type.service';
import { PositionService } from '../../../core/services/position.service';
import { CatalogCancellationReason } from '../../../shared/models/catalog-cancellation-reason.model';
import { CatalogCancellationType } from '../../../shared/models/catalog-cancellation-type.model';
import {
  PositionCancellationImpact,
  PositionCancellationImpactCandidate,
} from '../../../shared/models/position.model';
import {
  ShModalActionsDirective,
  ShModalFormComponent,
} from '../../../shared/components/modal-form/sh-modal-form.component';

const MAX_EVIDENCE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EVIDENCE_EXTENSIONS = new Set([
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'doc',
  'docx',
  'xls',
  'xlsx',
]);

export interface PositionCancelDialogData {
  positionId: number;
  title: string;
}

export interface PositionCancelDialogResult {
  cancellationTypeId: number;
  cancellationReasonId: number;
  description: string | null;
  evidenceFile: File | null;
}

@Component({
  selector: 'sh-position-cancel-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    ShModalFormComponent,
    ShModalActionsDirective,
  ],
  templateUrl: './position-cancel-dialog.component.html',
  styleUrl: './position-cancel-dialog.component.scss',
})
export class PositionCancelDialogComponent implements OnInit {
  readonly dialogRef = inject(
    MatDialogRef<PositionCancelDialogComponent, PositionCancelDialogResult | null>,
  );
  private readonly data = inject<PositionCancelDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly positionService = inject(PositionService);
  private readonly typeService = inject(CatalogCancellationTypeService);
  private readonly reasonService = inject(CatalogCancellationReasonService);
  private readonly feedback = inject(FeedbackDialogService);

  @ViewChild('evidenceInput') private evidenceInput?: ElementRef<HTMLInputElement>;

  readonly title = this.data.title;
  readonly requisitionLabel = POSITIONS_CANCEL_DIALOG_REQUISITION;
  readonly showLabel = POSITIONS_CANCEL_DIALOG_SHOW;
  readonly hideLabel = POSITIONS_CANCEL_DIALOG_HIDE;
  readonly candidatesLabel = POSITIONS_CANCEL_DIALOG_CANDIDATES;
  readonly colName = POSITIONS_CANCEL_DIALOG_COL_NAME;
  readonly colEmail = POSITIONS_CANCEL_DIALOG_COL_EMAIL;
  readonly colPhone = POSITIONS_CANCEL_DIALOG_COL_PHONE;
  readonly colStatus = POSITIONS_CANCEL_DIALOG_COL_STATUS;
  readonly colPositions = POSITIONS_COL_POSITIONS;
  readonly colApplicants = POSITIONS_COL_APPLICANTS;
  readonly colPreselection = POSITIONS_COL_PRESELECTION;
  readonly colFirstDay = POSITIONS_COL_FIRST_DAY;
  readonly typeLabel = POSITIONS_CANCEL_DIALOG_TYPE;
  readonly reasonLabel = POSITIONS_CANCEL_DIALOG_REASON;
  readonly descriptionLabel = POSITIONS_CANCEL_DIALOG_DESCRIPTION;
  readonly evidenceLabel = POSITIONS_CANCEL_DIALOG_EVIDENCE;
  readonly evidenceHint = POSITIONS_CANCEL_DIALOG_EVIDENCE_HINT;
  readonly evidencePick = POSITIONS_CANCEL_DIALOG_EVIDENCE_PICK;
  readonly evidenceClear = POSITIONS_CANCEL_DIALOG_EVIDENCE_CLEAR;
  readonly requiredMsg = POSITIONS_CANCEL_DIALOG_REQUIRED;
  readonly noCandidates = POSITIONS_CANCEL_DIALOG_NO_CANDIDATES;
  readonly confirmLabel = POSITIONS_REASON_DIALOG_CONFIRM;
  readonly cancelLabel = POSITIONS_REASON_DIALOG_CANCEL;
  readonly candidateColumns = ['fullName', 'email', 'phone', 'status'];

  loading = true;
  loadingReasons = false;
  showCandidates = false;
  loadError: string | null = null;
  reasonsError: string | null = null;
  evidenceError: string | null = null;
  evidenceFile: File | null = null;

  impact: PositionCancellationImpact | null = null;
  types: CatalogCancellationType[] = [];
  reasons: CatalogCancellationReason[] = [];

  readonly form = this.fb.nonNullable.group({
    cancellationTypeId: [null as number | null, Validators.required],
    cancellationReasonId: [null as number | null, Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.form.controls.cancellationReasonId.disable();
    forkJoin({
      impact: this.positionService.getCancellationImpact(this.data.positionId),
      types: this.typeService.list(0, 200),
    }).subscribe({
      next: ({ impact, types }) => {
        this.impact = {
          ...impact,
          positionsCount: impact.positionsCount ?? 0,
          applicantsCount: impact.applicantsCount ?? 0,
          preselectionCount: impact.preselectionCount ?? 0,
          firstDayCount: impact.firstDayCount ?? 0,
          candidates: impact.candidates ?? [],
        };
        this.types = types.items.filter((t) => t.isActive);
        this.loading = false;
      },
      error: () => {
        this.loadError = POSITIONS_CANCEL_DIALOG_LOAD_ERROR;
        this.loading = false;
      },
    });

    this.form.controls.cancellationTypeId.valueChanges.subscribe((typeId) => {
      this.form.controls.cancellationReasonId.reset(null);
      this.reasons = [];
      if (typeId == null) {
        this.form.controls.cancellationReasonId.disable();
        return;
      }
      this.form.controls.cancellationReasonId.enable();
      this.loadReasons(typeId);
    });
  }

  get candidates(): PositionCancellationImpactCandidate[] {
    return this.impact?.candidates ?? [];
  }

  toggleCandidates(): void {
    this.showCandidates = !this.showCandidates;
  }

  pickEvidence(): void {
    this.evidenceInput?.nativeElement.click();
  }

  onEvidenceSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    this.evidenceError = null;
    if (!file) {
      return;
    }
    if (!this.isEvidenceAllowed(file)) {
      this.evidenceFile = null;
      this.evidenceError = POSITIONS_CANCEL_DIALOG_EVIDENCE_INVALID;
      return;
    }
    this.evidenceFile = file;
  }

  clearEvidence(): void {
    this.evidenceFile = null;
    this.evidenceError = null;
  }

  confirm(): void {
    if (this.loading || this.loadError || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.evidenceError) {
      return;
    }

    const preselection = this.impact?.preselectionCount ?? 0;
    const firstDay = this.impact?.firstDayCount ?? 0;
    if (preselection > 0 || firstDay > 0) {
      this.feedback
        .confirm({
          title: POSITIONS_CANCEL_DIALOG_CRITICAL_TITLE,
          message: POSITIONS_CANCEL_DIALOG_CRITICAL_WARNING,
          confirmWarn: true,
        })
        .subscribe((confirmed) => {
          if (confirmed) {
            this.submitResult();
          }
        });
      return;
    }

    this.submitResult();
  }

  private submitResult(): void {
    const value = this.form.getRawValue();
    const description = value.description.trim();
    this.dialogRef.close({
      cancellationTypeId: value.cancellationTypeId!,
      cancellationReasonId: value.cancellationReasonId!,
      description: description || null,
      evidenceFile: this.evidenceFile,
    });
  }

  private loadReasons(typeId: number): void {
    this.loadingReasons = true;
    this.reasonsError = null;
    this.reasonService.list(0, 200, typeId).subscribe({
      next: (res) => {
        this.reasons = res.items.filter((r) => r.isActive);
        this.loadingReasons = false;
      },
      error: () => {
        this.reasons = [];
        this.loadingReasons = false;
        this.reasonsError = POSITIONS_CANCEL_DIALOG_REASONS_ERROR;
      },
    });
  }

  private isEvidenceAllowed(file: File): boolean {
    if (file.size > MAX_EVIDENCE_BYTES) {
      return false;
    }
    const ext = file.name.includes('.')
      ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      : '';
    return ALLOWED_EVIDENCE_EXTENSIONS.has(ext);
  }
}
