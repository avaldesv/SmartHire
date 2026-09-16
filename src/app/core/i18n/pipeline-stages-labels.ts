export const PIPELINE_STAGES_PAGE_TITLE = $localize`:@@pipelineStages.pageTitle:Etapas del pipeline`;
export const PIPELINE_STAGES_NEW_BUTTON = $localize`:@@pipelineStages.newButton:Nueva etapa`;
export const PIPELINE_STAGES_EDIT_TITLE = $localize`:@@pipelineStages.editTitle:Editar etapa`;
export const PIPELINE_STAGES_NEW_TITLE = $localize`:@@pipelineStages.newTitle:Nueva etapa`;
export const PIPELINE_STAGES_RECORD_SCOPE = $localize`:@@catalogs.common.recordScope:Ámbito del registro:`;
export const PIPELINE_STAGES_SCOPE_TENANT = $localize`:@@catalogs.common.scopeTenant:Tenant actual`;
export const PIPELINE_STAGES_SCOPE_GLOBAL = $localize`:@@catalogs.common.scopeGlobal:Global`;
export const PIPELINE_STAGES_FIELD_COUNTRY = $localize`:@@catalogs.field.country:País`;
export const PIPELINE_STAGES_FIELD_CODE = $localize`:@@catalogs.field.code:Clave`;
export const PIPELINE_STAGES_FIELD_STAGE = $localize`:@@pipelineStages.field.stage:Etapa`;
export const PIPELINE_STAGES_FIELD_DESCRIPTION = $localize`:@@catalogs.field.description:Descripción`;
export const PIPELINE_STAGES_FIELD_ORDER = $localize`:@@pipelineStages.field.order:Orden`;
export const PIPELINE_STAGES_FIELD_COLOR = $localize`:@@pipelineStages.field.color:Color`;
export const PIPELINE_STAGES_FIELD_ACTIVE = $localize`:@@catalogs.field.active:Activo`;
export const PIPELINE_STAGES_COLUMN_ORDER = $localize`:@@pipelineStages.column.order:Orden`;
export const PIPELINE_STAGES_COLUMN_STAGE = $localize`:@@pipelineStages.field.stage:Etapa`;
export const PIPELINE_STAGES_COLUMN_COLOR = $localize`:@@pipelineStages.field.color:Color`;
export const PIPELINE_STAGES_COLUMN_REORDER = $localize`:@@pipelineStages.column.reorder:Reordenar`;
export const PIPELINE_STAGES_MOVE_UP = $localize`:@@pipelineStages.moveUp:Subir`;
export const PIPELINE_STAGES_MOVE_DOWN = $localize`:@@pipelineStages.moveDown:Bajar`;
export const PIPELINE_STAGES_CANCEL = $localize`:@@common.cancel:Cancelar`;
export const PIPELINE_STAGES_SAVING = $localize`:@@catalogs.common.saving:Guardando...`;
export const PIPELINE_STAGES_SAVE = $localize`:@@catalogs.common.save:Guardar`;
export const PIPELINE_STAGES_YES = $localize`:@@common.yes:Sí`;
export const PIPELINE_STAGES_NO = $localize`:@@common.no:No`;
export const PIPELINE_STAGES_SNACK_CLOSE = $localize`:@@common.close:Cerrar`;

export const PIPELINE_STAGES_LOAD_ERROR = $localize`:@@pipelineStages.errors.load:No se pudieron cargar las etapas del pipeline`;
export const PIPELINE_STAGES_SAVE_SUCCESS = $localize`:@@pipelineStages.success.saved:Etapa guardada`;
export const PIPELINE_STAGES_SAVE_ERROR = $localize`:@@pipelineStages.errors.save:No se pudo guardar la etapa`;
export const PIPELINE_STAGES_DELETE_SUCCESS = $localize`:@@pipelineStages.success.deleted:Etapa eliminada`;
export const PIPELINE_STAGES_DELETE_ERROR = $localize`:@@pipelineStages.errors.delete:No se pudo eliminar la etapa`;
export const PIPELINE_STAGES_REORDER_ERROR = $localize`:@@pipelineStages.errors.reorder:No se pudo reordenar las etapas`;

export function pipelineStagesDeleteConfirm(name: string): string {
  return $localize`:@@pipelineStages.confirm.delete:¿Eliminar la etapa "${name}:name:"?`;
}
