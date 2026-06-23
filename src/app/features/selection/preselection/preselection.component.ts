import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CandidateApplicationApiService } from '../../../core/services/candidate-application-api.service';
import { CandidateApiService } from '../../../core/services/candidate-api.service';
import { PermissionService } from '../../../core/services/permission.service';
import {
  CandidatePoolDialogComponent,
  CandidatePoolDialogData,
} from '../../candidates/dialogs/candidate-pool-dialog/candidate-pool-dialog.component';
import {
  PositionApplicationsDialogComponent,
  PositionApplicationsDialogData,
} from '../../candidates/dialogs/position-applications-dialog/position-applications-dialog.component';
import {
  ApplicationAuditLogDialogComponent,
  ApplicationAuditLogDialogData,
} from '../dialogs/application-audit-log-dialog/application-audit-log-dialog.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { PreselectionCandidate } from '../../../shared/models';
import {
  PRESELECTION_ROW_ACTIONS,
  PreselectionRowAction,
  PreselectionRowActionId,
} from './preselection-row-actions.config';

@Component({
  selector: 'sh-preselection',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    RouterLink,
    StatusBadgeComponent,
  ],
  templateUrl: './preselection.component.html',
  styleUrl: './preselection.component.scss',
})
export class PreselectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly candidateApi = inject(CandidateApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly permission = inject(PermissionService);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  readonly rowActionCatalog = PRESELECTION_ROW_ACTIONS;
  loading = true;
  bulkLoading = false;
  data: PreselectionCandidate[] = [];
  selectedCount = 0;
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = ['select', 'name', 'compatibility', 'stage', 'documentsComplete', 'interviewScheduled', 'actions'];

  ngOnInit(): void {
    this.loadApplications();
  }

  get allSelected(): boolean {
    return this.data.length > 0 && this.data.every((c) => c.selected);
  }

  get someSelected(): boolean {
    return this.data.some((c) => c.selected) && !this.allSelected;
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationApi.list(this.pageIndex, this.pageSize, { positionId: this.positionId }).subscribe({
      next: (res) => {
        this.data = res.items.map((app) => ({
          applicationId: app.id,
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
          interviewScheduled: app.interviewScheduled ?? false,
          infoValidated: app.infoValidated ?? false,
          studiesValidated: app.studiesValidated ?? false,
          documentsSaved: app.documentsSaved ?? false,
          documentsComplete: app.documentsSaved ?? false,
          selected: app.isSelected ?? false,
          smartSent: false,
        }));
        this.total = res.total;
        this.loading = false;
        this.updateSelected();
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudieron cargar los candidatos postulados', 'Cerrar', { duration: 4000 });
      },
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadApplications();
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

  setRowSelected(row: PreselectionCandidate, checked: boolean): void {
    row.selected = checked;
    this.updateSelected();
  }

  updateSelected(): void {
    this.selectedCount = this.data.filter((c) => c.selected).length;
  }

  selectedApplicationIds(): number[] {
    return this.data.filter((c) => c.selected).map((c) => c.applicationId);
  }

  bulkSelect(): void {
    const applicationIds = this.selectedApplicationIds();
    if (applicationIds.length === 0) {
      return;
    }
    this.runBulk(
      this.applicationApi.select({ positionId: this.positionId, applicationIds }),
      'Candidatos seleccionados',
    );
  }

  bulkDeselect(): void {
    const applicationIds = this.selectedApplicationIds();
    if (applicationIds.length === 0) {
      return;
    }
    this.runBulk(
      this.applicationApi.deselect({ positionId: this.positionId, applicationIds }),
      'Selección liberada',
    );
  }

  releaseAll(): void {
    if (!confirm('¿Liberar todas las postulaciones de esta posición? Se marcarán como RELEASED.')) {
      return;
    }
    this.runBulk(
      this.applicationApi.releaseAll({ positionId: this.positionId }),
      'Todas las postulaciones liberadas',
    );
  }

  private runBulk(
    request$: ReturnType<CandidateApplicationApiService['select']>,
    successMessage: string,
  ): void {
    this.bulkLoading = true;
    request$.subscribe({
      next: (res) => {
        this.bulkLoading = false;
        this.snack.open(`${successMessage} (${res.updatedCount})`, 'Cerrar', { duration: 3500 });
        this.loadApplications();
      },
      error: () => {
        this.bulkLoading = false;
        this.snack.open('No se pudo completar la acción masiva', 'Cerrar', { duration: 4000 });
      },
    });
  }

  action(name: string): void {
    this.snack.open(`${name}: ${this.selectedCount} candidato(s)`, 'Cerrar', { duration: 2500 });
  }

  visibleRowActions(): PreselectionRowAction[] {
    return this.rowActionCatalog.filter((action) => this.permission.hasAnyPermission(action.permissions));
  }

  onRowAction(actionId: PreselectionRowActionId, row: PreselectionCandidate): void {
    const action = this.rowActionCatalog.find((a) => a.id === actionId);
    if (!action) {
      return;
    }
    if (actionId === 'deselectRow') {
      this.deselectSingleRow(row);
      return;
    }
    if (actionId === 'viewProfile') {
      this.openCandidateProfile(row);
      return;
    }
    if (actionId === 'downloadCv') {
      this.downloadCandidateCv(row);
      return;
    }
    if (actionId === 'validateInfo') {
      this.validateApplicationInfo(row);
      return;
    }
    if (actionId === 'validateStudies') {
      this.validateApplicationStudies(row);
      return;
    }
    if (actionId === 'auditLog') {
      this.openAuditLogDialog(row);
      return;
    }
    if (actionId === 'sendSmart') {
      this.sendCandidateToSmart(row);
      return;
    }
    if (actionId === 'generateContract') {
      this.generateCandidateContract(row);
      return;
    }
    if (actionId === 'notifyQuestionnaire') {
      this.notifyCandidateQuestionnaire(row);
      return;
    }
    const name = `${row.firstName} ${row.lastName}`.trim();
    this.snack.open(`${action.label} — ${name}: pendiente de integración API`, 'Cerrar', { duration: 3500 });
  }

  private deselectSingleRow(row: PreselectionCandidate): void {
    this.runBulk(
      this.applicationApi.deselect({
        positionId: this.positionId,
        applicationIds: [row.applicationId],
      }),
      'Candidato deseleccionado',
    );
  }

  openCandidateProfile(row: PreselectionCandidate): void {
    void this.router.navigate(['/candidates', row.id], {
      queryParams: { from: 'preselection', positionId: this.positionId },
    });
  }

  openAuditLogDialog(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.dialog.open<ApplicationAuditLogDialogComponent, ApplicationAuditLogDialogData>(
      ApplicationAuditLogDialogComponent,
      {
        width: '800px',
        maxWidth: '95vw',
        data: {
          applicationId: row.applicationId,
          candidateName: name,
          positionId: this.positionId,
        },
      },
    );
  }

  downloadCandidateCv(row: PreselectionCandidate): void {
    this.candidateApi.getCvDownloadUrl(row.id).subscribe({
      next: (res) => {
        window.open(res.downloadUrl, '_blank', 'noopener,noreferrer');
        this.snack.open(`CV: ${res.fileName}`, 'Cerrar', { duration: 3500 });
      },
      error: () => {
        this.snack.open('No se pudo obtener la URL de descarga del CV', 'Cerrar', { duration: 4000 });
      },
    });
  }

  formatDocumentsStatus(row: PreselectionCandidate): string {
    if (row.documentsSaved) {
      return 'Completo';
    }
    const parts: string[] = [];
    parts.push(row.infoValidated ? 'Info ✓' : 'Info pendiente');
    parts.push(row.studiesValidated ? 'Estudios ✓' : 'Estudios pendiente');
    return parts.join(' · ');
  }

  private validateApplicationInfo(row: PreselectionCandidate): void {
    if (row.infoValidated) {
      this.snack.open('La información ya está validada', 'Cerrar', { duration: 3000 });
      return;
    }
    this.applicationApi.validateInfo(row.applicationId).subscribe({
      next: (res) => {
        this.applyValidationFlags(row, res);
        this.snack.open('Información validada', 'Cerrar', { duration: 3500 });
      },
      error: () => {
        this.snack.open('No se pudo validar la información', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private validateApplicationStudies(row: PreselectionCandidate): void {
    if (row.studiesValidated) {
      this.snack.open('Los estudios ya están validados', 'Cerrar', { duration: 3000 });
      return;
    }
    this.applicationApi.validateStudies(row.applicationId).subscribe({
      next: (res) => {
        this.applyValidationFlags(row, res);
        this.snack.open('Estudios validados', 'Cerrar', { duration: 3500 });
      },
      error: () => {
        this.snack.open('No se pudieron validar los estudios', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private sendCandidateToSmart(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.applicationApi.sendToSmart(row.applicationId).subscribe({
      next: (res) => {
        this.snack.open(
          `SMART (stub): ${name} — ref. ${res.externalReference}`,
          'Cerrar',
          { duration: 5000 },
        );
      },
      error: () => {
        this.snack.open('No se pudo enviar a SMART', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private generateCandidateContract(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.applicationApi.generateContract(row.applicationId).subscribe({
      next: (res) => {
        this.snack.open(
          `Contrato (stub): ${name} — ref. ${res.contractReference}`,
          'Cerrar',
          { duration: 5000 },
        );
      },
      error: () => {
        this.snack.open('No se pudo generar el contrato', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private notifyCandidateQuestionnaire(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.applicationApi.sendQuestionnaireInvite(row.applicationId).subscribe({
      next: (res) => {
        const ref = this.snack.open(
          `Cuestionario (stub) enviado a ${res.candidateEmail ?? name}`,
          'Abrir link',
          { duration: 8000 },
        );
        ref.onAction().subscribe(() => {
          window.open(res.invitationLink, '_blank', 'noopener,noreferrer');
        });
      },
      error: () => {
        this.snack.open('No se pudo enviar la invitación al cuestionario', 'Cerrar', { duration: 4000 });
      },
    });
  }

  private applyValidationFlags(
    row: PreselectionCandidate,
    flags: {
      infoValidated: boolean;
      studiesValidated: boolean;
      documentsSaved: boolean;
    },
  ): void {
    row.infoValidated = flags.infoValidated;
    row.studiesValidated = flags.studiesValidated;
    row.documentsSaved = flags.documentsSaved;
    row.documentsComplete = flags.documentsSaved;
  }
}
