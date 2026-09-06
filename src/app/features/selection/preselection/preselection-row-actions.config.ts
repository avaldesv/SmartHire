import { AppPermissions } from '../../../core/auth/app-permissions';
import { PRESELECTION_ROW_VIEW_NOTIFICATIONS } from '../../../core/i18n/application-notifications-dialog-labels';
import { APP_DIALOG_ACTION_GENERATE_DOCUMENTS } from '../../../core/i18n/position-applications-dialog-labels';
import { PRESELECTION_CHANGE_STAGE, PRESELECTION_ROW_DESELECT, PRESELECTION_ROW_EDIT_PROFILE } from '../../../core/i18n/preselection-actions-labels';

export type PreselectionRowActionId =
  | 'viewProfile'
  | 'downloadCv'
  | 'modifyCompatibility'
  | 'scheduleInterview'
  | 'viewDocuments'
  | 'validateInfo'
  | 'validateStudies'
  | 'auditLog'
  | 'sendSmart'
  | 'generateContract'
  | 'generateDocument'
  | 'notifyQuestionnaire'
  | 'viewNotifications'
  | 'changeStage'
  | 'deselectRow';

export interface PreselectionRowAction {
  id: PreselectionRowActionId;
  label: string;
  icon: string;
  /** At least one authority required to show the action (RF-013 L4 RBAC). */
  permissions: readonly string[];
  dividerBefore?: boolean;
}

/** Row menu actions for RF-013 preselection (L4–L16). */
export const PRESELECTION_ROW_ACTIONS: readonly PreselectionRowAction[] = [
  {
    id: 'viewProfile',
    label: PRESELECTION_ROW_EDIT_PROFILE,
    icon: 'person',
    permissions: [AppPermissions.CANDIDATE_READ],
  },
  {
    id: 'downloadCv',
    label: 'Descargar CV',
    icon: 'download',
    permissions: [AppPermissions.CANDIDATE_READ],
  },
  {
    id: 'modifyCompatibility',
    label: 'Modificar compatibilidad',
    icon: 'tune',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
  {
    id: 'scheduleInterview',
    label: 'Agendar entrevista',
    icon: 'event',
    permissions: [AppPermissions.SELECTION_EDIT],
  },
  {
    id: 'viewDocuments',
    label: 'Ver documentos',
    icon: 'folder_open',
    permissions: [AppPermissions.CANDIDATE_READ],
  },
  {
    id: 'validateInfo',
    label: 'Validar información',
    icon: 'fact_check',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
  {
    id: 'validateStudies',
    label: 'Validar estudios',
    icon: 'school',
    permissions: [AppPermissions.SELECTION_EDIT],
  },
  {
    id: 'auditLog',
    label: 'Bitácora',
    icon: 'history',
    permissions: [AppPermissions.SELECTION_READ],
  },
  {
    id: 'sendSmart',
    label: 'Enviar a SMART',
    icon: 'send',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
  {
    id: 'generateContract',
    label: 'Generar contrato',
    icon: 'description',
    permissions: [AppPermissions.SELECTION_EDIT],
  },
  {
    id: 'generateDocument',
    label: APP_DIALOG_ACTION_GENERATE_DOCUMENTS,
    icon: 'article',
    permissions: [AppPermissions.SELECTION_READ],
  },
  {
    id: 'viewNotifications',
    label: PRESELECTION_ROW_VIEW_NOTIFICATIONS,
    icon: 'notifications',
    permissions: [AppPermissions.SELECTION_READ],
  },
  {
    id: 'notifyQuestionnaire',
    label: 'Notificar cuestionario',
    icon: 'mail',
    permissions: [AppPermissions.SELECTION_EDIT],
  },
  {
    id: 'changeStage',
    label: PRESELECTION_CHANGE_STAGE,
    icon: 'swap_horiz',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
  {
    id: 'deselectRow',
    label: PRESELECTION_ROW_DESELECT,
    icon: 'person_remove',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
];
