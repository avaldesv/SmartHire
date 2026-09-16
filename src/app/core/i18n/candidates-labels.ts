import { COMMON_CANCEL } from './nav-labels';
import {
  CANDIDATE_PROFILE_ACTIVE,
  CANDIDATE_PROFILE_COUNTRY,
  CANDIDATE_PROFILE_CURP,
  CANDIDATE_PROFILE_EMAIL,
  CANDIDATE_PROFILE_GENDER,
  CANDIDATE_PROFILE_NSS,
  CANDIDATE_PROFILE_PHONE,
  CANDIDATE_PROFILE_RFC,
  CANDIDATE_PROFILE_SALARY,
  CANDIDATE_PROFILE_SOURCE,
  CANDIDATE_PROFILE_STATE,
} from './candidate-profile-labels';
import {
  CATALOG_FIELD_MUNICIPALITY,
  CATALOG_FIELD_NEIGHBORHOOD,
  CATALOG_FIELD_POSTAL_CODE,
  CATALOGS_SAVE,
} from './catalog-i18n-labels';

export const CANDIDATES_LIST_TITLE = $localize`:@@nav.main.candidates:Candidatos`;
export const CANDIDATES_LIST_SUBTITLE = $localize`:@@candidates.list.subtitle:Administración de candidatos en el sistema`;
export const CANDIDATES_LIST_NEW = $localize`:@@candidates.list.new:Nuevo candidato`;
export const CANDIDATES_LIST_SEARCH = $localize`:@@candidates.list.search:Buscar candidato`;
export const CANDIDATES_LIST_SEARCH_PLACEHOLDER = $localize`:@@candidates.list.searchPlaceholder:Nombre, correo…`;
export const CANDIDATES_LIST_LOAD_ERROR = $localize`:@@candidates.list.loadError:No se pudieron cargar los candidatos`;
export const CANDIDATES_LIST_COL_ID = $localize`:@@candidates.list.col.id:ID`;
export const CANDIDATES_LIST_COL_FIRST_NAME = $localize`:@@candidates.list.col.firstName:Nombre`;
export const CANDIDATES_LIST_COL_LAST_NAME = $localize`:@@candidates.list.col.lastName:Apellidos`;
export const CANDIDATES_LIST_COL_EMAIL = $localize`:@@candidates.list.col.email:Correo`;
export const CANDIDATES_LIST_COL_PHONE = $localize`:@@candidates.list.col.phone:Teléfono`;
export const CANDIDATES_LIST_COL_CITY = $localize`:@@candidates.list.col.city:Ciudad`;
export const CANDIDATES_LIST_COL_SOURCE = $localize`:@@candidates.list.col.source:Origen`;
export const CANDIDATES_LIST_COL_ACTIVE = $localize`:@@candidates.list.col.active:Activo`;
export const CANDIDATES_LIST_COL_CREATED = $localize`:@@candidates.list.col.createdAt:Alta`;
export const CANDIDATES_LIST_YES = $localize`:@@common.yes:Sí`;
export const CANDIDATES_LIST_NO = $localize`:@@common.no:No`;

export const CANDIDATES_FORM_TITLE_NEW = CANDIDATES_LIST_NEW;
export const CANDIDATES_FORM_TITLE_EDIT = $localize`:@@candidates.form.titleEdit:Editar candidato`;
export const CANDIDATES_FORM_SUBTITLE = $localize`:@@candidates.form.subtitle:Complete la información del candidato`;
export const CANDIDATES_FORM_LOADING = $localize`:@@candidates.form.loading:Cargando...`;
export const CANDIDATES_FORM_GENDER_FEMALE = $localize`:@@candidates.form.gender.female:Femenino`;
export const CANDIDATES_FORM_GENDER_MALE = $localize`:@@candidates.form.gender.male:Masculino`;
export const CANDIDATES_FORM_SOURCE_MANUAL = $localize`:@@candidates.form.source.manual:Carga Manual`;
export const CANDIDATES_FORM_SOURCE_JOBBOARD = $localize`:@@candidates.form.source.jobboard:Jobboard`;
export const CANDIDATES_FORM_SOURCE_BUC = $localize`:@@candidates.form.source.buc:BUC`;
export const CANDIDATES_FORM_CREATED = $localize`:@@candidates.form.created:Candidato creado`;
export const CANDIDATES_FORM_UPDATED = $localize`:@@candidates.form.updated:Candidato actualizado`;
export const CANDIDATES_FORM_SAVE_ERROR = $localize`:@@candidates.form.saveError:No se pudo guardar el candidato`;
export const CANDIDATES_FORM_LOAD_ERROR = $localize`:@@candidates.form.loadError:No se pudo cargar el candidato`;
export const CANDIDATES_FORM_COUNTRIES_ERROR = $localize`:@@candidates.form.countriesError:No se pudieron cargar los países`;
export const CANDIDATES_FORM_STATES_ERROR = $localize`:@@candidates.form.statesError:No se pudieron cargar los estados`;
export const CANDIDATES_FORM_MUNICIPALITIES_ERROR = $localize`:@@candidates.form.municipalitiesError:No se pudieron cargar los municipios`;
export const CANDIDATES_FORM_NEIGHBORHOODS_ERROR = $localize`:@@candidates.form.neighborhoodsError:No se pudieron cargar las colonias`;
export const CANDIDATES_FORM_NO_NEIGHBORHOODS = $localize`:@@candidates.form.noNeighborhoods:Sin colonias para ese código postal`;
export const CANDIDATES_FORM_SAVE = CATALOGS_SAVE;
export const CANDIDATES_FORM_CANCEL = COMMON_CANCEL;

export const CANDIDATES_FORM_FIRST_NAME = CANDIDATES_LIST_COL_FIRST_NAME;
export const CANDIDATES_FORM_LAST_NAME = CANDIDATES_LIST_COL_LAST_NAME;
export const CANDIDATES_FORM_EMAIL = CANDIDATE_PROFILE_EMAIL;
export const CANDIDATES_FORM_PHONE = CANDIDATE_PROFILE_PHONE;
export const CANDIDATES_FORM_CURP = CANDIDATE_PROFILE_CURP;
export const CANDIDATES_FORM_RFC = CANDIDATE_PROFILE_RFC;
export const CANDIDATES_FORM_NSS = CANDIDATE_PROFILE_NSS;
export const CANDIDATES_FORM_GENDER = CANDIDATE_PROFILE_GENDER;
export const CANDIDATES_FORM_COUNTRY = CANDIDATE_PROFILE_COUNTRY;
export const CANDIDATES_FORM_STATE = CANDIDATE_PROFILE_STATE;
export const CANDIDATES_FORM_MUNICIPALITY = CATALOG_FIELD_MUNICIPALITY;
export const CANDIDATES_FORM_POSTAL_CODE = CATALOG_FIELD_POSTAL_CODE;
export const CANDIDATES_FORM_NEIGHBORHOOD = CATALOG_FIELD_NEIGHBORHOOD;
export const CANDIDATES_FORM_SALARY = CANDIDATE_PROFILE_SALARY;
export const CANDIDATES_FORM_SOURCE = CANDIDATE_PROFILE_SOURCE;
export const CANDIDATES_FORM_ACTIVE = CANDIDATE_PROFILE_ACTIVE;

const SOURCE_PORTAL = $localize`:@@candidates.source.portal:Portal`;
const SOURCE_RECRUITER_EXCEL_BULK = $localize`:@@candidates.source.recruiterExcelBulk:Carga Excel reclutador`;

export function candidatesSourceLabel(source: string | null | undefined): string {
  const key = (source ?? '').trim().toUpperCase();
  if (key === 'PORTAL') {
    return SOURCE_PORTAL;
  }
  if (key === 'RECRUITER_EXCEL_BULK') {
    return SOURCE_RECRUITER_EXCEL_BULK;
  }
  if (key === 'MANUAL' || source === 'Carga Manual') {
    return CANDIDATES_FORM_SOURCE_MANUAL;
  }
  if (key === 'JOBBOARD' || source === 'Jobboard') {
    return CANDIDATES_FORM_SOURCE_JOBBOARD;
  }
  if (key === 'BUC') {
    return CANDIDATES_FORM_SOURCE_BUC;
  }
  return source?.trim() || '';
}
