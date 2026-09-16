/** i18n labels for candidate profile view and dialog. */

export const CANDIDATE_PROFILE_SUBTITLE = $localize`:@@candidateProfile.subtitle:Perfil completo del candidato`;
export const CANDIDATE_PROFILE_BACK_PRESELECTION = $localize`:@@candidateProfile.backPreselection:Volver a preselección`;
export const CANDIDATE_PROFILE_EDIT = $localize`:@@common.edit:Editar`;
export const CANDIDATE_PROFILE_BENEFICIARIES = $localize`:@@candidateProfile.beneficiaries:Beneficiarios`;
export const CANDIDATE_PROFILE_EMERGENCY = $localize`:@@candidateProfile.emergencyContacts:Contactos emergencia`;
export const CANDIDATE_PROFILE_GENERAL = $localize`:@@candidateProfile.section.general:Datos generales`;
export const CANDIDATE_PROFILE_ID = $localize`:@@candidateProfile.field.id:ID`;
export const CANDIDATE_PROFILE_EMAIL = $localize`:@@candidateProfile.field.email:Correo`;
export const CANDIDATE_PROFILE_PHONE = $localize`:@@candidateProfile.field.phone:Teléfono`;
export const CANDIDATE_PROFILE_GENDER = $localize`:@@candidateProfile.field.gender:Género`;
export const CANDIDATE_PROFILE_SOURCE = $localize`:@@candidateProfile.field.source:Origen`;
export const CANDIDATE_PROFILE_CREATED = $localize`:@@candidateProfile.field.createdAt:Alta`;
export const CANDIDATE_PROFILE_EXPERIENCE = $localize`:@@candidateProfile.field.experienceYears:Experiencia`;
export const CANDIDATE_PROFILE_SALARY = $localize`:@@candidateProfile.field.desiredSalary:Salario deseado`;
export const CANDIDATE_PROFILE_OFFICIAL_ID = $localize`:@@candidateProfile.section.officialId:Identificación oficial`;
export const CANDIDATE_PROFILE_CURP = $localize`:@@candidateProfile.field.curp:CURP`;
export const CANDIDATE_PROFILE_RFC = $localize`:@@candidateProfile.field.rfc:RFC`;
export const CANDIDATE_PROFILE_NSS = $localize`:@@candidateProfile.field.nss:NSS`;
export const CANDIDATE_PROFILE_NOT_REGISTERED = $localize`:@@candidateProfile.notRegistered:No registrado`;
export const CANDIDATE_PROFILE_LOCATION = $localize`:@@candidateProfile.section.location:Ubicación`;
export const CANDIDATE_PROFILE_COUNTRY = $localize`:@@candidateProfile.field.country:País`;
export const CANDIDATE_PROFILE_STATE = $localize`:@@candidateProfile.field.state:Estado`;
export const CANDIDATE_PROFILE_CITY = $localize`:@@candidateProfile.field.city:Ciudad`;
export const CANDIDATE_PROFILE_STATUS = $localize`:@@candidateProfile.field.status:Estatus`;
export const CANDIDATE_PROFILE_ACTIVE = $localize`:@@candidateProfile.active:Activo`;
export const CANDIDATE_PROFILE_INACTIVE = $localize`:@@candidateProfile.inactive:Inactivo`;
export const CANDIDATE_PROFILE_EXPERIENCE_SECTION = $localize`:@@candidateProfile.section.experience:Experiencia laboral`;
export const CANDIDATE_PROFILE_EDUCATION_SECTION = $localize`:@@candidateProfile.section.education:Estudios`;
export const CANDIDATE_PROFILE_COURSES_SECTION = $localize`:@@candidateProfile.section.courses:Cursos / Certificaciones`;
export const CANDIDATE_PROFILE_LANGUAGES_SECTION = $localize`:@@candidateProfile.section.languages:Idiomas`;
export const CANDIDATE_PROFILE_SKILLS_SECTION = $localize`:@@candidateProfile.section.skills:Habilidades`;
export const CANDIDATE_PROFILE_NO_EXPERIENCE = $localize`:@@candidateProfile.empty.experience:Sin experiencia registrada.`;
export const CANDIDATE_PROFILE_NO_EDUCATION = $localize`:@@candidateProfile.empty.education:Sin estudios registrados.`;
export const CANDIDATE_PROFILE_NO_COURSES = $localize`:@@candidateProfile.empty.courses:Sin cursos o certificaciones registradas.`;
export const CANDIDATE_PROFILE_NO_LANGUAGES = $localize`:@@candidateProfile.empty.languages:Sin idiomas registrados.`;
export const CANDIDATE_PROFILE_NO_SKILLS = $localize`:@@candidateProfile.empty.skills:Sin habilidades registradas.`;
export const CANDIDATE_PROFILE_NOT_FOUND = $localize`:@@candidateProfile.notFound:Candidato no encontrado.`;
export const CANDIDATE_PROFILE_PRESENT = $localize`:@@candidateProfile.present:Actual`;
export const CANDIDATE_PROFILE_GRADUATE = $localize`:@@candidateProfile.graduate:Titulado`;
export const CANDIDATE_PROFILE_AVERAGE = $localize`:@@candidateProfile.average:Promedio`;
export const CANDIDATE_PROFILE_EXPIRES = $localize`:@@candidateProfile.expires:Vence`;
export const CANDIDATE_PROFILE_YEAR = $localize`:@@candidateProfile.year:año`;
export const CANDIDATE_PROFILE_YEARS = $localize`:@@candidateProfile.years:años`;
export const CANDIDATE_PROFILE_ERRORS_CANDIDATE = $localize`:@@candidateProfile.errors.candidate:No se pudo cargar el candidato`;
export const CANDIDATE_PROFILE_ERRORS_SECTIONS = $localize`:@@candidateProfile.errors.sections:No se pudieron cargar las secciones del perfil`;
export const CANDIDATE_PROFILE_DIALOG_CLOSE = $localize`:@@common.close:Cerrar`;
export const CANDIDATE_PROFILE_EM_DASH = $localize`:@@common.emDash:—`;

export function candidateProfileExperienceYears(count: number): string {
  return $localize`:@@candidateProfile.experienceYears:${count}:count: años`;
}

export function candidateProfileSkillYears(count: number): string {
  if (count === 1) {
    return $localize`:@@candidateProfile.skillYearOne:${count}:count: año`;
  }
  return $localize`:@@candidateProfile.skillYears:${count}:count: años`;
}

export function candidateKindLabel(kind: string | null | undefined): string {
  switch (kind) {
    case 'COURSE':
      return $localize`:@@candidateProfile.kind.course:Curso`;
    case 'CERTIFICATION':
      return $localize`:@@candidateProfile.kind.certification:Certificación`;
    case 'OTHER':
      return $localize`:@@candidateProfile.kind.other:Otro`;
    default:
      return CANDIDATE_PROFILE_EM_DASH;
  }
}

export function candidateSkillLevelLabel(level: string | null | undefined): string {
  switch (level) {
    case 'BASIC':
      return $localize`:@@candidateProfile.skillLevel.basic:Básico`;
    case 'INTERMEDIATE':
      return $localize`:@@candidateProfile.skillLevel.intermediate:Intermedio`;
    case 'ADVANCED':
      return $localize`:@@candidateProfile.skillLevel.advanced:Avanzado`;
    case 'EXPERT':
      return $localize`:@@candidateProfile.skillLevel.expert:Experto`;
    default:
      return level || CANDIDATE_PROFILE_EM_DASH;
  }
}
