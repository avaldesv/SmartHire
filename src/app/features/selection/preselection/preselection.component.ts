import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import { catalogDialogConfig } from '../../../core/dialog/catalog-dialog.constants';
import { AppPermissions } from '../../../core/auth/app-permissions';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import {
  PRESELECTION_APPOINTMENT_SCHEDULED_TOOLTIP,
  PRESELECTION_APPOINTMENT_TOOLTIP,
  PRESELECTION_BULK_APPOINTMENT,
  PRESELECTION_BULK_CONTACT,
  PRESELECTION_BULK_CONTACT_CONFIRM,
  PRESELECTION_BULK_CONTACT_PARTIAL,
  PRESELECTION_BULK_CONTACT_SUCCESS,
  PRESELECTION_BULK_NONE_SELECTED,
  PRESELECTION_BULK_MARK_SELECTED,
  PRESELECTION_BULK_RELEASE,
  PRESELECTION_BULK_RELEASE_ALL,
  PRESELECTION_CHANGE_STAGE,
  PRESELECTION_COL_APPOINTMENT,
  PRESELECTION_COL_CONTACT,
  PRESELECTION_COL_EVALUATION,
  PRESELECTION_CONTACT_ERROR,
  PRESELECTION_CONTACT_SUCCESS,
  PRESELECTION_CONTACT_TOOLTIP,
  PRESELECTION_EVALUATION_PENDING_MSG,
  PRESELECTION_EVALUATION_PENDING_TITLE,
  PRESELECTION_EVALUATION_TOOLTIP,
} from '../../../core/i18n/preselection-actions-labels';
import { CandidateApplicationApiService } from '../../../core/services/candidate-application-api.service';
import { CandidateApiService } from '../../../core/services/candidate-api.service';
import { PermissionService } from '../../../core/services/permission.service';
import {
  CandidateEditDialogComponent,
  CandidateEditDialogData,
  CandidateEditDialogResult,
} from '../../candidates/dialogs/candidate-edit-dialog/candidate-edit-dialog.component';
import {
  CandidateDocumentsDialogComponent,
  CandidateDocumentsDialogData,
  candidateDocumentsDialogConfig,
} from '../../candidates/dialogs/candidate-documents-dialog/candidate-documents-dialog.component';
import {
  CandidatePoolDialogComponent,
  CandidatePoolDialogData,
  candidatePoolDialogConfig,
} from '../../candidates/dialogs/candidate-pool-dialog/candidate-pool-dialog.component';
import {
  ScheduleInterviewDialogComponent,
  ScheduleInterviewDialogData,
} from '../../candidates/dialogs/schedule-interview-dialog/schedule-interview-dialog.component';
import {
  PositionApplicationsDialogComponent,
  PositionApplicationsDialogData,
  PositionApplicationsDialogResult,
  positionApplicationsDialogConfig,
} from '../../candidates/dialogs/position-applications-dialog/position-applications-dialog.component';
import {
  BulkScheduleInterviewsDialogComponent,
  BulkScheduleInterviewsDialogData,
  BulkScheduleInterviewsDialogResult,
} from '../dialogs/bulk-schedule-interviews-dialog/bulk-schedule-interviews-dialog.component';
import {
  ChangeApplicationStageDialogComponent,
  ChangeApplicationStageDialogData,
  ChangeApplicationStageDialogResult,
} from '../dialogs/change-application-stage-dialog/change-application-stage-dialog.component';
import {
  ApplicationNotificationsDialogComponent,
  ApplicationNotificationsDialogData,
} from '../dialogs/application-notifications-dialog/application-notifications-dialog.component';
import {
  ApplicationAuditLogDialogComponent,
  ApplicationAuditLogDialogData,
} from '../dialogs/application-audit-log-dialog/application-audit-log-dialog.component';
import {
  GenerateDocumentDialogComponent,
  GenerateDocumentDialogData,
} from '../dialogs/generate-document-dialog/generate-document-dialog.component';
import {
  PreselectionCompatibilityDialogComponent,
  PreselectionCompatibilityDialogData,
} from '../dialogs/preselection-compatibility-dialog/preselection-compatibility-dialog.component';
import {
  QuestionnaireEvaluationDialogComponent,
  QuestionnaireEvaluationDialogData,
} from '../dialogs/questionnaire-evaluation-dialog/questionnaire-evaluation-dialog.component';
import { QuestionnaireApiService } from '../../../core/services/questionnaire-api.service';
import { getCandidateApplicationStageLabel, isApplicationSelected } from '../../../shared/constants/candidate-application-stage';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { filter, switchMap, catchError, concatMap, from, map, of, toArray } from 'rxjs';
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
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
    StatusBadgeComponent,
  ],
  templateUrl: './preselection.component.html',
  styleUrl: './preselection.component.scss',
})
export class PreselectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly applicationApi = inject(CandidateApplicationApiService);
  private readonly candidateApi = inject(CandidateApiService);
  private readonly questionnaireApi = inject(QuestionnaireApiService);
  private readonly dialog = inject(MatDialog);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly permission = inject(PermissionService);

  readonly positionId = +this.route.parent!.snapshot.paramMap.get('positionId')!;
  readonly rowActionCatalog = PRESELECTION_ROW_ACTIONS;
  readonly labels = {
    colContact: PRESELECTION_COL_CONTACT,
    colEvaluation: PRESELECTION_COL_EVALUATION,
    colAppointment: PRESELECTION_COL_APPOINTMENT,
    contactTooltip: PRESELECTION_CONTACT_TOOLTIP,
    evaluationTooltip: PRESELECTION_EVALUATION_TOOLTIP,
    appointmentTooltip: PRESELECTION_APPOINTMENT_TOOLTIP,
    appointmentScheduledTooltip: PRESELECTION_APPOINTMENT_SCHEDULED_TOOLTIP,
    bulkContact: PRESELECTION_BULK_CONTACT,
    bulkAppointment: PRESELECTION_BULK_APPOINTMENT,
    bulkMarkSelected: PRESELECTION_BULK_MARK_SELECTED,
    bulkRelease: PRESELECTION_BULK_RELEASE,
    bulkReleaseAll: PRESELECTION_BULK_RELEASE_ALL,
    changeStage: PRESELECTION_CHANGE_STAGE,
  };
  loading = true;
  bulkLoading = false;
  contactingApplicationId: number | null = null;
  data: PreselectionCandidate[] = [];
  selectedCount = 0;
  total = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly columns = [
    'select',
    'name',
    'compatibility',
    'stage',
    'documentsComplete',
    'contact',
    'evaluation',
    'appointment',
    'actions',
  ];

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
    this.applicationApi
      .list(this.pageIndex, this.pageSize, { positionId: this.positionId, postPreselectedOnly: true })
      .subscribe({
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
          selected: isApplicationSelected(app),
          smartSent: false,
          questionnaireStatus: app.questionnaireStatus ?? null,
          questionnaireAutoScorePercent: app.questionnaireAutoScorePercent ?? null,
        }));
        this.total = res.total;
        this.loading = false;
        this.updateSelected();
      },
      error: (err) => {
        this.loading = false;
        this.feedback.showApiError(err, { fallbackMessage: 'No se pudieron cargar los candidatos postulados' });
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
        ...candidatePoolDialogConfig(),
        data: { positionId: this.positionId, requisitionNo: `REQ-${this.positionId}` },
      },
    );
    ref.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.feedback.showSuccess(`${result.created} candidato(s) postulado(s)`);
        this.loadApplications();
      }
    });
  }

  openApplicationsDialog(): void {
    this.dialog
      .open<PositionApplicationsDialogComponent, PositionApplicationsDialogData, PositionApplicationsDialogResult>(
        PositionApplicationsDialogComponent,
        {
          ...positionApplicationsDialogConfig(),
          data: { positionId: this.positionId, requisitionNo: `REQ-${this.positionId}` },
        },
      )
      .afterClosed()
      .subscribe((result) => {
        if (result?.changed) {
          this.loadApplications();
        }
      });
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
    this.feedback
      .confirm({
        title: FEEDBACK_GENERIC_WARNING_TITLE,
        message: '¿Liberar todas las postulaciones de esta posición? Se marcarán como RELEASED.',
        confirmWarn: true,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.runBulk(
          this.applicationApi.releaseAll({ positionId: this.positionId }),
          'Todas las postulaciones liberadas',
        );
      });
  }

  private runBulk(
    request$: ReturnType<CandidateApplicationApiService['select']>,
    successMessage: string,
  ): void {
    this.bulkLoading = true;
    request$.subscribe({
      next: (res) => {
        this.bulkLoading = false;
        this.feedback.showSuccess(`${successMessage} (${res.updatedCount})`);
        this.loadApplications();
      },
      error: (err) => {
        this.bulkLoading = false;
        this.feedback.showApiError(err, { fallbackMessage: 'No se pudo completar la acción masiva' });
      },
    });
  }

  action(name: string): void {
    this.feedback.showSuccess(`${name}: ${this.selectedCount} candidato(s)`);
  }

  openChangeStageDialog(rows: PreselectionCandidate[]): void {
    if (!this.canEditSelection || this.bulkLoading || rows.length === 0) {
      return;
    }
    const candidates = rows.map((row) => ({
      applicationId: row.applicationId,
      name: `${row.firstName} ${row.lastName}`.trim() || row.email,
      currentStatus: row.stage,
    }));
    this.dialog
      .open<
        ChangeApplicationStageDialogComponent,
        ChangeApplicationStageDialogData,
        ChangeApplicationStageDialogResult | null
      >(ChangeApplicationStageDialogComponent, {
        ...catalogDialogConfig('480px'),
        data: { positionId: this.positionId, candidates },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.updated > 0) {
          this.loadApplications();
        }
      });
  }

  bulkChangeStage(): void {
    const selected = this.data.filter((row) => row.selected);
    if (selected.length === 0) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, PRESELECTION_BULK_NONE_SELECTED);
      return;
    }
    this.openChangeStageDialog(selected);
  }

  stageLabel(status: string | null | undefined): string {
    return getCandidateApplicationStageLabel(status);
  }

  bulkContactSelectedCandidates(): void {
    if (!this.canEditSelection || this.bulkLoading) {
      return;
    }
    const selected = this.data.filter((row) => row.selected);
    if (selected.length === 0) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, PRESELECTION_BULK_NONE_SELECTED);
      return;
    }
    this.feedback
      .confirm({
        title: PRESELECTION_BULK_CONTACT,
        message: PRESELECTION_BULK_CONTACT_CONFIRM,
      })
      .subscribe((ok) => {
        if (!ok) {
          return;
        }
        this.bulkLoading = true;
        from(selected)
          .pipe(
            concatMap((row) =>
              this.applicationApi.contactQuestionnaire(row.applicationId).pipe(
                map(() => true),
                catchError(() => of(false)),
              ),
            ),
            toArray(),
          )
          .subscribe({
            next: (results) => {
              this.bulkLoading = false;
              const succeeded = results.filter(Boolean).length;
              const failed = results.length - succeeded;
              if (failed === 0) {
                this.feedback.showSuccess(`${PRESELECTION_BULK_CONTACT_SUCCESS} (${succeeded})`);
              } else if (succeeded === 0) {
                this.feedback.showApiError(null, { fallbackMessage: PRESELECTION_CONTACT_ERROR });
              } else {
                this.feedback.showWarning(
                  PRESELECTION_BULK_CONTACT_PARTIAL,
                  `${succeeded} enviados, ${failed} fallaron`,
                );
              }
              this.loadApplications();
            },
            error: (err) => {
              this.bulkLoading = false;
              this.feedback.showApiError(err, { fallbackMessage: PRESELECTION_CONTACT_ERROR });
            },
          });
      });
  }

  bulkSendInterviewAppointments(): void {
    if (!this.canEditSelection || this.bulkLoading) {
      return;
    }
    const selected = this.data.filter((row) => row.selected);
    if (selected.length === 0) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, PRESELECTION_BULK_NONE_SELECTED);
      return;
    }
    const candidates = selected.map((row) => ({
      applicationId: row.applicationId,
      name: `${row.firstName} ${row.lastName}`.trim() || row.email,
    }));
    this.dialog
      .open<
        BulkScheduleInterviewsDialogComponent,
        BulkScheduleInterviewsDialogData,
        BulkScheduleInterviewsDialogResult | null
      >(BulkScheduleInterviewsDialogComponent, {
        ...catalogDialogConfig('480px'),
        data: { candidates },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.scheduled > 0) {
          this.loadApplications();
        }
      });
  }

  private openScheduleInterview(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    const dialogRef = this.dialog.open<
      ScheduleInterviewDialogComponent,
      ScheduleInterviewDialogData,
      boolean | null
    >(ScheduleInterviewDialogComponent, {
      ...catalogDialogConfig('480px'),
      data: { applicationId: row.applicationId, candidateName: name },
    });
    dialogRef
      .afterClosed()
      .pipe(filter((ok): ok is true => ok === true))
      .subscribe(() => {
        row.interviewScheduled = true;
      });
  }

  get canEditSelection(): boolean {
    return this.permission.hasAuthority(AppPermissions.SELECTION_EDIT);
  }

  visibleRowActions(): PreselectionRowAction[] {
    return this.rowActionCatalog.filter((action) => this.permission.hasAnyPermission(action.permissions));
  }

  contactQuestionnaire(row: PreselectionCandidate): void {
    if (!this.canEditSelection || this.contactingApplicationId != null) {
      return;
    }
    this.contactingApplicationId = row.applicationId;
    this.applicationApi.contactQuestionnaire(row.applicationId).subscribe({
      next: (res) => {
        this.contactingApplicationId = null;
        this.feedback.showSuccess(res.message?.trim() || PRESELECTION_CONTACT_SUCCESS);
      },
      error: (err) => {
        this.contactingApplicationId = null;
        this.feedback.showApiError(err, { fallbackMessage: PRESELECTION_CONTACT_ERROR });
      },
    });
  }

  openEvaluationPending(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    if (row.questionnaireStatus !== 'ANSWERED') {
      this.feedback.showInfo(
        PRESELECTION_EVALUATION_PENDING_TITLE,
        `${PRESELECTION_EVALUATION_PENDING_MSG} (${name})`,
      );
      return;
    }
    const data: QuestionnaireEvaluationDialogData = {
      applicationId: row.applicationId,
      candidateName: name,
    };
    this.dialog.open(QuestionnaireEvaluationDialogComponent, {
      ...catalogDialogConfig,
      width: '920px',
      maxWidth: '96vw',
      data,
    });
  }

  evaluationTooltip(row: PreselectionCandidate): string {
    if (row.questionnaireStatus === 'ANSWERED') {
      const score = row.questionnaireAutoScorePercent;
      return score != null
        ? `${this.labels.evaluationTooltip} (${score}%)`
        : this.labels.evaluationTooltip;
    }
    return this.labels.evaluationTooltip;
  }

  scheduleInterviewForRow(row: PreselectionCandidate): void {
    if (!this.canEditSelection) {
      return;
    }
    this.openScheduleInterview(row);
  }

  appointmentTooltip(row: PreselectionCandidate): string {
    return row.interviewScheduled
      ? this.labels.appointmentScheduledTooltip
      : this.labels.appointmentTooltip;
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
    if (actionId === 'modifyCompatibility') {
      this.openCompatibilityDialog(row);
      return;
    }
    if (actionId === 'scheduleInterview') {
      this.openScheduleInterview(row);
      return;
    }
    if (actionId === 'viewDocuments') {
      this.openCandidateDocuments(row);
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
    if (actionId === 'generateDocument') {
      this.openGenerateDocumentDialog(row);
      return;
    }
    if (actionId === 'viewNotifications') {
      this.openApplicationNotificationsDialog(row);
      return;
    }
    if (actionId === 'notifyQuestionnaire') {
      this.notifyCandidateQuestionnaire(row);
      return;
    }
    if (actionId === 'changeStage') {
      this.openChangeStageDialog([row]);
      return;
    }
    const name = `${row.firstName} ${row.lastName}`.trim();
    this.feedback.showSuccess(`${action.label} — ${name}: pendiente de integración API`);
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
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.dialog
      .open<CandidateEditDialogComponent, CandidateEditDialogData, CandidateEditDialogResult | null>(
        CandidateEditDialogComponent,
        {
          ...catalogDialogConfig('720px'),
          maxWidth: '96vw',
          maxHeight: '90vh',
          autoFocus: false,
          data: {
            candidateId: row.id,
            applicationId: row.applicationId,
            candidateName: name,
          },
        },
      )
      .afterClosed()
      .subscribe((result) => {
        if (result?.saved) {
          this.loadApplications();
        }
      });
  }

  private openCandidateDocuments(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.dialog.open<CandidateDocumentsDialogComponent, CandidateDocumentsDialogData>(
      CandidateDocumentsDialogComponent,
      {
        ...candidateDocumentsDialogConfig(),
        autoFocus: false,
        data: {
          applicationId: row.applicationId,
          candidateId: row.id,
          candidateName: name,
          requisitionNo: `REQ-${this.positionId}`,
        },
      },
    );
  }

  private openCompatibilityDialog(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    const dialogRef = this.dialog.open<
      PreselectionCompatibilityDialogComponent,
      PreselectionCompatibilityDialogData,
      number | undefined
    >(PreselectionCompatibilityDialogComponent, {
      ...catalogDialogConfig('480px'),
      data: { candidateName: name, currentCompatibility: row.compatibility },
    });
    dialogRef
      .afterClosed()
      .pipe(filter((value): value is number => value != null))
      .subscribe((compatibilityPercent) => {
        this.applicationApi.patchApplication(row.applicationId, { compatibilityPercent }).subscribe({
          next: (res) => {
            row.compatibility = res.compatibilityPercent ?? compatibilityPercent;
            this.feedback.showSuccess('Compatibilidad actualizada');
          },
          error: (err) => {
            this.feedback.showApiError(err, { fallbackMessage: 'No se pudo actualizar la compatibilidad' });
          },
        });
      });
  }

  openAuditLogDialog(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.dialog.open<ApplicationAuditLogDialogComponent, ApplicationAuditLogDialogData>(
      ApplicationAuditLogDialogComponent,
      {
        ...catalogDialogConfig('800px'),
        data: {
          applicationId: row.applicationId,
          candidateName: name,
          positionId: this.positionId,
        },
      },
    );
  }

  private openApplicationNotificationsDialog(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.dialog.open<ApplicationNotificationsDialogComponent, ApplicationNotificationsDialogData>(
      ApplicationNotificationsDialogComponent,
      {
        ...catalogDialogConfig('960px'),
        maxWidth: '96vw',
        maxHeight: '88vh',
        autoFocus: false,
        data: {
          applicationId: row.applicationId,
          candidateName: name,
        },
      },
    );
  }

  downloadCandidateCv(row: PreselectionCandidate): void {
    this.candidateApi.downloadCv(row.id).subscribe({
      next: (res) => {
        this.feedback.showSuccess(`CV: ${res.fileName}`);
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: 'No se pudo obtener la URL de descarga del CV' });
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
      this.feedback.showSuccess('La información ya está validada');
      return;
    }
    this.applicationApi.validateInfo(row.applicationId).subscribe({
      next: (res) => {
        this.applyValidationFlags(row, res);
        this.feedback.showSuccess('Información validada');
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: 'No se pudo validar la información' });
      },
    });
  }

  private validateApplicationStudies(row: PreselectionCandidate): void {
    if (row.studiesValidated) {
      this.feedback.showSuccess('Los estudios ya están validados');
      return;
    }
    this.applicationApi.validateStudies(row.applicationId).subscribe({
      next: (res) => {
        this.applyValidationFlags(row, res);
        this.feedback.showSuccess('Estudios validados');
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: 'No se pudieron validar los estudios' });
      },
    });
  }

  private sendCandidateToSmart(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.applicationApi.sendToSmart(row.applicationId).subscribe({
      next: (res) => {
        this.feedback.showSuccess(`SMART (stub): ${name} — ref. ${res.externalReference}`);
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: 'No se pudo enviar a SMART' });
      },
    });
  }

  private generateCandidateContract(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.applicationApi.generateContract(row.applicationId).subscribe({
      next: (res) => {
        this.feedback.showSuccess(`Contrato (stub): ${name} — ref. ${res.contractReference}`);
      },
      error: (err) => {
        this.feedback.showApiError(err, { fallbackMessage: 'No se pudo generar el contrato' });
      },
    });
  }

  private openGenerateDocumentDialog(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.dialog.open<GenerateDocumentDialogComponent, GenerateDocumentDialogData, boolean>(
      GenerateDocumentDialogComponent,
      {
        ...catalogDialogConfig('640px'),
        data: {
          applicationId: row.applicationId,
          candidateName: name,
        },
      },
    );
  }

  private notifyCandidateQuestionnaire(row: PreselectionCandidate): void {
    const name = `${row.firstName} ${row.lastName}`.trim() || row.email;
    this.questionnaireApi
      .getPositionAssignment(this.positionId)
      .pipe(
        switchMap((assignment) =>
          this.applicationApi.sendQuestionnaireInvite(row.applicationId, {
            questionnaireId: assignment.persisted ? assignment.questionnaireFormId : null,
          }),
        ),
      )
      .subscribe({
        next: (res) => {
          const label = res.questionnaireId
            ? `Cuestionario #${res.questionnaireId} (stub) enviado a ${res.candidateEmail ?? name}`
            : `Invitación (stub) enviada sin formulario asignado a ${res.candidateEmail ?? name}`;
          this.feedback.showSuccess(label);
          if (res.invitationLink) {
            window.open(res.invitationLink, '_blank', 'noopener,noreferrer');
          }
        },
        error: (err) => {
          this.feedback.showApiError(err, { fallbackMessage: 'No se pudo enviar la invitación al cuestionario' });
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
