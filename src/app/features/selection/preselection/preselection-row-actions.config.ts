import { AppPermissions } from '../../../core/auth/app-permissions';

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
  | 'notifyQuestionnaire'
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
    label: 'Ver perfil',
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
    label: 'Solicitar cita entrevista',
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
    id: 'notifyQuestionnaire',
    label: 'Notificar cuestionario',
    icon: 'mail',
    permissions: [AppPermissions.SELECTION_EDIT],
  },
  {
    id: 'deselectRow',
    label: 'Deseleccionar',
    icon: 'person_remove',
    permissions: [AppPermissions.SELECTION_EDIT],
    dividerBefore: true,
  },
];
