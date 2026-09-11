/** i18n labels for preselection toolbar, table, actions and feedback. */

export const PRESELECTION_COL_CANDIDATE = $localize`:@@preselection.col.candidate:Candidato`;
export const PRESELECTION_COL_COMPAT = $localize`:@@preselection.col.compat:Compat.`;
export const PRESELECTION_COL_STAGE = $localize`:@@preselection.col.stage:Etapa`;
export const PRESELECTION_COL_DOCS = $localize`:@@preselection.col.docs:Docs`;
export const PRESELECTION_COL_CONTACT = $localize`:@@preselection.col.contact:Contactar`;
export const PRESELECTION_COL_EVALUATION = $localize`:@@preselection.col.evaluation:Evaluación`;
export const PRESELECTION_COL_APPOINTMENT = $localize`:@@preselection.col.appointment:Cita para entrevista`;
export const PRESELECTION_COL_INTERVIEWED = $localize`:@@preselection.col.interviewed:Entrevistado`;

export const PRESELECTION_TOOLBAR_ADD_FROM_POOL = $localize`:@@preselection.toolbar.addFromPool:Agregar del pool`;
export const PRESELECTION_TOOLBAR_VIEW_APPLICANTS = $localize`:@@preselection.toolbar.viewApplicants:Ver postulados`;
export const PRESELECTION_TOOLBAR_SEND_SMART = $localize`:@@preselection.toolbar.sendSmart:Enviar Smart`;
export const PRESELECTION_TOOLBAR_DOCUMENTS = $localize`:@@preselection.toolbar.documents:Documentos`;
export const PRESELECTION_TOOLBAR_REQUEST_DOCUMENTS = $localize`:@@preselection.toolbar.requestDocuments:Solicitar documentos`;
export const PRESELECTION_EMPTY = $localize`:@@preselection.empty:No hay candidatos preseleccionados en esta posición.`;
export const PRESELECTION_ROW_ACTIONS_ARIA = $localize`:@@preselection.row.actionsAria:Acciones del candidato`;

export const PRESELECTION_INTERVIEWED_TOOLTIP = $localize`:@@preselection.interviewed.tooltip:Clic para marcar/desmarcar · Fecha automática al marcar`;
export const PRESELECTION_INTERVIEWED_DONE_TOOLTIP = $localize`:@@preselection.interviewed.doneTooltip:Entrevista realizada · Clic para desmarcar`;
export const PRESELECTION_INTERVIEWED_SUCCESS = $localize`:@@preselection.interviewed.success:Entrevista registrada`;
export const PRESELECTION_INTERVIEWED_UNMARK_SUCCESS = $localize`:@@preselection.interviewed.unmarkSuccess:Marca de entrevista eliminada`;
export const PRESELECTION_INTERVIEWED_ERROR = $localize`:@@preselection.interviewed.error:No se pudo actualizar el estado de entrevista`;

export const PRESELECTION_CONTACT_TOOLTIP = $localize`:@@preselection.contact.tooltip:Enviar cuestionario de contacto`;
export const PRESELECTION_CONTACT_DONE_TOOLTIP = $localize`:@@preselection.contact.doneTooltip:Cuestionario de contacto enviado`;
export const PRESELECTION_CONTACT_SUCCESS = $localize`:@@preselection.contact.success:Cuestionario de contacto enviado`;
export const PRESELECTION_CONTACT_ERROR = $localize`:@@preselection.contact.error:No se pudo enviar el cuestionario de contacto`;

export const PRESELECTION_EVALUATION_TOOLTIP = $localize`:@@preselection.evaluation.tooltip:Evaluación del cuestionario`;
export const PRESELECTION_EVALUATION_PENDING_TITLE = $localize`:@@preselection.evaluation.pendingTitle:Evaluación pendiente`;
export const PRESELECTION_EVALUATION_PENDING_MSG = $localize`:@@preselection.evaluation.pendingMessage:Disponible cuando el candidato responda`;

export const PRESELECTION_APPOINTMENT_TOOLTIP = $localize`:@@preselection.appointment.tooltip:Agendar entrevista`;
export const PRESELECTION_APPOINTMENT_SCHEDULED_TOOLTIP = $localize`:@@preselection.appointment.scheduledTooltip:Entrevista agendada — reprogramar`;

export const PRESELECTION_BULK_CONTACT = $localize`:@@preselection.bulk.contact:Contactar candidatos`;
export const PRESELECTION_BULK_CONTACT_CONFIRM = $localize`:@@preselection.bulk.contactConfirm:¿Enviar cuestionario de contacto a los candidatos seleccionados?`;
export const PRESELECTION_BULK_CONTACT_SUCCESS = $localize`:@@preselection.bulk.contactSuccess:Cuestionarios de contacto enviados`;
export const PRESELECTION_BULK_CONTACT_PARTIAL = $localize`:@@preselection.bulk.contactPartial:Algunos cuestionarios no se enviaron`;
export const PRESELECTION_BULK_CONTACT_SENT = $localize`:@@preselection.bulk.contactSent:enviados`;
export const PRESELECTION_BULK_CONTACT_FAILED = $localize`:@@preselection.bulk.contactFailed:fallaron`;

export const PRESELECTION_BULK_APPOINTMENT = $localize`:@@preselection.bulk.appointment:Enviar cita para entrevistas`;
export const PRESELECTION_BULK_APPOINTMENT_TITLE = $localize`:@@preselection.bulk.appointmentTitle:Enviar citas para entrevistas`;
export const PRESELECTION_BULK_APPOINTMENT_HINT = $localize`:@@preselection.bulk.appointmentHint:Se usará el horario sugerido del calendario para cada candidato.`;
export const PRESELECTION_BULK_APPOINTMENT_SUCCESS = $localize`:@@preselection.bulk.appointmentSuccess:Citas de entrevista enviadas`;
export const PRESELECTION_BULK_APPOINTMENT_PARTIAL = $localize`:@@preselection.bulk.appointmentPartial:Algunas citas no se agendaron`;
export const PRESELECTION_BULK_NONE_SELECTED = $localize`:@@preselection.bulk.noneSelected:Seleccione al menos un candidato en la tabla`;

export const PRESELECTION_BULK_MARK_SELECTED = $localize`:@@preselection.bulk.markSelected:Marcar como seleccionado`;
export const PRESELECTION_BULK_RELEASE = $localize`:@@preselection.bulk.release:Liberar`;
export const PRESELECTION_BULK_RELEASE_ALL = $localize`:@@preselection.bulk.releaseAll:Liberar todos`;
export const PRESELECTION_BULK_MARK_SUCCESS = $localize`:@@preselection.bulk.markSuccess:Candidatos seleccionados`;
export const PRESELECTION_BULK_RELEASE_SUCCESS = $localize`:@@preselection.bulk.releaseSuccess:Selección liberada`;
export const PRESELECTION_BULK_RELEASE_ALL_CONFIRM = $localize`:@@preselection.bulk.releaseAllConfirm:¿Liberar todas las postulaciones de esta posición? Se marcarán como RELEASED.`;
export const PRESELECTION_BULK_RELEASE_ALL_SUCCESS = $localize`:@@preselection.bulk.releaseAllSuccess:Todas las postulaciones liberadas`;
export const PRESELECTION_BULK_ERROR = $localize`:@@preselection.bulk.error:No se pudo completar la acción masiva`;
export const PRESELECTION_LOAD_ERROR = $localize`:@@preselection.loadError:No se pudieron cargar los candidatos postulados`;
export const PRESELECTION_POOL_CREATED = $localize`:@@preselection.pool.created:candidato(s) postulado(s)`;
export const PRESELECTION_ACTION_CANDIDATES_SUFFIX = $localize`:@@preselection.action.candidatesSuffix:candidato(s)`;
export const PRESELECTION_ACTION_PENDING_API = $localize`:@@preselection.action.pendingApi:pendiente de integración API`;

export const PRESELECTION_ROW_DESELECT = $localize`:@@preselection.row.deselect:Deseleccionar`;
export const PRESELECTION_ROW_EDIT_PROFILE = $localize`:@@preselection.row.editProfile:Editar perfil`;
export const PRESELECTION_ROW_DOWNLOAD_CV = $localize`:@@preselection.row.downloadCv:Descargar CV`;
export const PRESELECTION_ROW_MODIFY_COMPATIBILITY = $localize`:@@preselection.row.modifyCompatibility:Modificar compatibilidad`;
export const PRESELECTION_ROW_SCHEDULE_INTERVIEW = $localize`:@@preselection.row.scheduleInterview:Agendar entrevista`;
export const PRESELECTION_ROW_VIEW_DOCUMENTS = $localize`:@@preselection.row.viewDocuments:Ver documentos`;
export const PRESELECTION_ROW_VALIDATE_INFO = $localize`:@@preselection.row.validateInfo:Validar información`;
export const PRESELECTION_ROW_VALIDATE_STUDIES = $localize`:@@preselection.row.validateStudies:Validar estudios`;
export const PRESELECTION_ROW_AUDIT_LOG = $localize`:@@preselection.row.auditLog:Bitácora`;
export const PRESELECTION_ROW_SEND_SMART = $localize`:@@preselection.row.sendSmart:Enviar a SMART`;
export const PRESELECTION_ROW_GENERATE_CONTRACT = $localize`:@@preselection.row.generateContract:Generar contrato`;
export const PRESELECTION_ROW_NOTIFY_QUESTIONNAIRE = $localize`:@@preselection.row.notifyQuestionnaire:Notificar cuestionario`;
export const PRESELECTION_ROW_DESELECT_SUCCESS = $localize`:@@preselection.row.deselectSuccess:Candidato deseleccionado`;

export const PRESELECTION_DOCS_COMPLETE = $localize`:@@preselection.docs.complete:Completo`;
export const PRESELECTION_DOCS_INFO_OK = $localize`:@@preselection.docs.infoOk:Info ✓`;
export const PRESELECTION_DOCS_INFO_PENDING = $localize`:@@preselection.docs.infoPending:Info pendiente`;
export const PRESELECTION_DOCS_STUDIES_OK = $localize`:@@preselection.docs.studiesOk:Estudios ✓`;
export const PRESELECTION_DOCS_STUDIES_PENDING = $localize`:@@preselection.docs.studiesPending:Estudios pendiente`;

export const PRESELECTION_COMPAT_UPDATED = $localize`:@@preselection.compat.updated:Compatibilidad actualizada`;
export const PRESELECTION_COMPAT_UPDATE_ERROR = $localize`:@@preselection.compat.updateError:No se pudo actualizar la compatibilidad`;
export const PRESELECTION_COMPAT_DIALOG_TITLE = $localize`:@@preselection.compat.dialogTitle:Modificar compatibilidad`;
export const PRESELECTION_COMPAT_FIELD = $localize`:@@preselection.compat.field:Compatibilidad (%)`;

export const PRESELECTION_CV_DOWNLOAD_ERROR = $localize`:@@preselection.cv.downloadError:No se pudo obtener la URL de descarga del CV`;
export const PRESELECTION_INFO_ALREADY_VALIDATED = $localize`:@@preselection.info.alreadyValidated:La información ya está validada`;
export const PRESELECTION_INFO_VALIDATED = $localize`:@@preselection.info.validated:Información validada`;
export const PRESELECTION_INFO_VALIDATE_ERROR = $localize`:@@preselection.info.validateError:No se pudo validar la información`;
export const PRESELECTION_STUDIES_ALREADY_VALIDATED = $localize`:@@preselection.studies.alreadyValidated:Los estudios ya están validados`;
export const PRESELECTION_STUDIES_VALIDATED = $localize`:@@preselection.studies.validated:Estudios validados`;
export const PRESELECTION_STUDIES_VALIDATE_ERROR = $localize`:@@preselection.studies.validateError:No se pudieron validar los estudios`;
export const PRESELECTION_SMART_SEND_ERROR = $localize`:@@preselection.smart.sendError:No se pudo enviar a SMART`;
export const PRESELECTION_CONTRACT_GENERATE_ERROR = $localize`:@@preselection.contract.generateError:No se pudo generar el contrato`;
export const PRESELECTION_QUESTIONNAIRE_INVITE_ERROR = $localize`:@@preselection.questionnaire.inviteError:No se pudo enviar la invitación al cuestionario`;

export const PRESELECTION_CHANGE_STAGE = $localize`:@@preselection.changeStage.action:Cambiar etapa`;
export const PRESELECTION_CHANGE_STAGE_TITLE = $localize`:@@preselection.changeStage.title:Cambiar etapa`;
export const PRESELECTION_CHANGE_STAGE_SUBTITLE = $localize`:@@preselection.changeStage.subtitle:Se actualizará la etapa de los candidatos seleccionados.`;
export const PRESELECTION_CHANGE_STAGE_CANDIDATES_LABEL = $localize`:@@preselection.changeStage.candidatesLabel:Candidatos`;
export const PRESELECTION_CHANGE_STAGE_LABEL = $localize`:@@preselection.changeStage.field:Nueva etapa`;
export const PRESELECTION_CHANGE_STAGE_SAVE = $localize`:@@preselection.changeStage.save:Aplicar`;
export const PRESELECTION_CHANGE_STAGE_CANCEL = $localize`:@@preselection.changeStage.cancel:Cancelar`;
export const PRESELECTION_CHANGE_STAGE_SUCCESS = $localize`:@@preselection.changeStage.success:Etapa actualizada`;
export const PRESELECTION_CHANGE_STAGE_ERROR = $localize`:@@preselection.changeStage.error:No se pudo cambiar la etapa`;
