import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Subject, switchMap } from 'rxjs';
import { FeedbackDialogService } from '../../../../core/feedback/feedback-dialog.service';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../../core/i18n/feedback-labels';
import {
  REQUISITION_PORTALS_ADD,
  REQUISITION_PORTALS_COL_ACTIONS,
  REQUISITION_PORTALS_COL_EXTERNAL_ID,
  REQUISITION_PORTALS_COL_PORTAL,
  REQUISITION_PORTALS_DELETE,
  REQUISITION_PORTALS_DUPLICATE,
  REQUISITION_PORTALS_EDIT,
  REQUISITION_PORTALS_EMPTY,
  REQUISITION_PORTALS_EXTERNAL_ID,
  REQUISITION_PORTALS_EXTERNAL_ID_PLACEHOLDER,
  REQUISITION_PORTALS_EXTERNAL_ID_REQUIRED,
  REQUISITION_PORTALS_PORTAL,
  REQUISITION_PORTALS_SECTION_HINT,
  REQUISITION_PORTALS_SECTION_TITLE,
  REQUISITION_PORTALS_SELECT,
  REQUISITION_PORTALS_TABLE_TITLE,
  REQUISITION_PORTALS_UPDATE,
} from '../../../../core/i18n/portal-credentials-labels';
import { CatalogJobPortalService } from '../../../../core/services/catalog-job-portal.service';
import { CatalogJobPortal } from '../../../../shared/models/catalog-job-portal.model';
import { WizardPublishedPortalRow } from '../../../../shared/models/job-portal-credentials.model';

@Component({
  selector: 'sh-published-portals-editor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './published-portals-editor.component.html',
  styleUrl: './published-portals-editor.component.scss',
})
export class PublishedPortalsEditorComponent implements OnInit, OnChanges {
  private readonly jobPortalService = inject(CatalogJobPortalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly countryChange$ = new Subject<number>();

  @Input({ required: true }) control!: FormControl<WizardPublishedPortalRow[]>;
  @Input() countryId: number | null = null;
  @Input() disabled = false;

  readonly labels = {
    sectionTitle: REQUISITION_PORTALS_SECTION_TITLE,
    hint: REQUISITION_PORTALS_SECTION_HINT,
    portal: REQUISITION_PORTALS_PORTAL,
    externalId: REQUISITION_PORTALS_EXTERNAL_ID,
    externalIdPlaceholder: REQUISITION_PORTALS_EXTERNAL_ID_PLACEHOLDER,
    select: REQUISITION_PORTALS_SELECT,
    add: REQUISITION_PORTALS_ADD,
    update: REQUISITION_PORTALS_UPDATE,
    tableTitle: REQUISITION_PORTALS_TABLE_TITLE,
    colPortal: REQUISITION_PORTALS_COL_PORTAL,
    colExternalId: REQUISITION_PORTALS_COL_EXTERNAL_ID,
    colActions: REQUISITION_PORTALS_COL_ACTIONS,
    edit: REQUISITION_PORTALS_EDIT,
    delete: REQUISITION_PORTALS_DELETE,
    empty: REQUISITION_PORTALS_EMPTY,
  };

  readonly displayedColumns = ['portal', 'externalId', 'actions'];
  portals: CatalogJobPortal[] = [];
  loading = false;
  draftPortalId: number | null = null;
  draftExternalId = '';
  editingIndex: number | null = null;

  ngOnInit(): void {
    this.countryChange$
      .pipe(
        switchMap((countryId) => {
          this.loading = true;
          return this.jobPortalService.list(countryId, 0, 200);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.portals = (res.items ?? []).filter((p) => p.isActive);
          this.loading = false;
        },
        error: () => {
          this.portals = [];
          this.loading = false;
        },
      });
    this.countryChange$.next(this.countryId ?? 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryId'] && !changes['countryId'].firstChange) {
      this.countryChange$.next(this.countryId ?? 0);
    }
  }

  get rows(): WizardPublishedPortalRow[] {
    return this.control?.value ?? [];
  }

  portalName(id: number): string {
    return this.portals.find((p) => p.id === id)?.name ?? String(id);
  }

  availablePortals(): CatalogJobPortal[] {
    const used = new Set(this.rows.map((r) => r.jobPortalId));
    if (this.editingIndex != null) {
      used.delete(this.rows[this.editingIndex]?.jobPortalId);
    }
    return this.portals.filter((p) => p.isActive && !used.has(p.id));
  }

  addOrUpdate(): void {
    if (this.disabled) {
      return;
    }
    const externalId = this.draftExternalId.trim();
    if (this.draftPortalId == null) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, this.labels.select);
      return;
    }
    if (!/^[A-Za-z0-9._-]{1,64}$/.test(externalId)) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, REQUISITION_PORTALS_EXTERNAL_ID_REQUIRED);
      return;
    }
    const next = [...this.rows];
    const row: WizardPublishedPortalRow = {
      jobPortalId: this.draftPortalId,
      externalPortalId: externalId,
    };
    if (this.editingIndex != null) {
      next[this.editingIndex] = row;
    } else {
      if (next.some((r) => r.jobPortalId === row.jobPortalId)) {
        this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, REQUISITION_PORTALS_DUPLICATE);
        return;
      }
      next.push(row);
    }
    this.control.setValue(next);
    this.control.markAsDirty();
    this.resetDraft();
  }

  editRow(index: number): void {
    const row = this.rows[index];
    if (!row) {
      return;
    }
    this.editingIndex = index;
    this.draftPortalId = row.jobPortalId;
    this.draftExternalId = row.externalPortalId;
  }

  deleteRow(index: number): void {
    if (this.disabled) {
      return;
    }
    const next = this.rows.filter((_, i) => i !== index);
    this.control.setValue(next);
    this.control.markAsDirty();
    if (this.editingIndex === index) {
      this.resetDraft();
    }
  }

  private resetDraft(): void {
    this.editingIndex = null;
    this.draftPortalId = null;
    this.draftExternalId = '';
  }
}
