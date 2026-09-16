import { AppPermissions } from '../../../core/auth/app-permissions';
import { PRESELECTION_ROW_VIEW_NOTIFICATIONS } from '../../../core/i18n/application-notifications-dialog-labels';
import { APP_DIALOG_ACTION_GENERATE_DOCUMENTS } from '../../../core/i18n/position-applications-dialog-labels';
import {
  PRESELECTION_CHANGE_STAGE,
  PRESELECTION_ROW_AUDIT_LOG,
  PRESELECTION_ROW_DESELECT,
  PRESELECTION_ROW_DOWNLOAD_CV,
  PRESELECTION_ROW_EDIT_PROFILE,
  PRESELECTION_ROW_GENERATE_CONTRACT,
  PRESELECTION_ROW_MODIFY_COMPATIBILITY,
  PRESELECTION_ROW_NOTIFY_QUESTIONNAIRE,
  PRESELECTION_ROW_SCHEDULE_INTERVIEW,
  PRESELECTION_ROW_SEND_SMART,
  PRESELECTION_ROW_VALIDATE_INFO,
  PRESELECTION_ROW_VALIDATE_STUDIES,
  PRESELECTION_ROW_VIEW_DOCUMENTS,
} from '../../../core/i18n/preselection-actions-labels';

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
    label: PRESELECTION_ROW_DOWNLOAD_CV,
    icon: 'download',
    permissions: [AppPermissions.CANDIDATE_READ],
  },
  {
    id: 'modifyCompatibility',
    label: PRESELECTION_ROW_MODIFY_COMPATIBILITY,
    icon: 'tune',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
  {
    id: 'scheduleInterview',
    label: PRESELECTION_ROW_SCHEDULE_INTERVIEW,
    icon: 'event',
    permissions: [AppPermissions.SELECTION_EDIT],
  },
  {
    id: 'viewDocuments',
    label: PRESELECTION_ROW_VIEW_DOCUMENTS,
    icon: 'folder_open',
    permissions: [AppPermissions.CANDIDATE_READ],
  },
  {
    id: 'validateInfo',
    label: PRESELECTION_ROW_VALIDATE_INFO,
    icon: 'fact_check',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
  {
    id: 'validateStudies',
    label: PRESELECTION_ROW_VALIDATE_STUDIES,
    icon: 'school',
    permissions: [AppPermissions.SELECTION_EDIT],
  },
  {
    id: 'auditLog',
    label: PRESELECTION_ROW_AUDIT_LOG,
    icon: 'history',
    permissions: [AppPermissions.SELECTION_READ],
  },
  {
    id: 'sendSmart',
    label: PRESELECTION_ROW_SEND_SMART,
    icon: 'send',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
  {
    id: 'generateContract',
    label: PRESELECTION_ROW_GENERATE_CONTRACT,
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
    label: PRESELECTION_ROW_NOTIFY_QUESTIONNAIRE,
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
