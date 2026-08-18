import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  CreatePositionRequest,
  PositionDetail,
  PositionDocumentRequirementItem,
  PositionLanguageItem,
  PositionQuestionnaireItem,
} from '../../../shared/models/position.model';
import {
  ResolvedRequisitionFormConfig,
  ResolvedRequisitionFormField,
  WizardDocumentRequirementRow,
  WizardLanguageRow,
  WizardQuestionnaireValue,
} from '../../../shared/models/requisition-wizard.model';
import { isFieldRequired, isFieldVisible, isFieldReadOnly } from './dynamic-wizard-rules.util';
import {
  parseWorkDaysToIds,
  serializeWorkDaysFromIds,
} from '../../../shared/utils/requisition-work-days.util';

const PAYLOAD_FIELD_ALIASES: Record<string, keyof CreatePositionRequest> = {
  addressLine: 'address',
  clientContactPosition: 'clientPosition',
};

export function defaultValueForUiType(uiType: string): unknown {
  switch (uiType) {
    case 'checkbox':
      return false;
    case 'number':
    case 'date':
      return null;
    case 'select':
    case 'client-search':
    case 'user-picker':
      return null;
    case 'multiselect':
      return [] as number[];
    case 'language-grid':
      return [{ languageId: null, languageLevelId: null }] as WizardLanguageRow[];
    case 'document-grid':
      return [] as WizardDocumentRequirementRow[] | number[];
    case 'questionnaire-picker':
      return {
        questionnaireId: null,
        evaluationType: 'PERCENTAGE',
        acceptancePercentage: null,
      } as WizardQuestionnaireValue;
    default:
      return '';
  }
}

function createLanguageRowGroup(fb: FormBuilder): FormGroup {
  return fb.nonNullable.group({
    languageId: [null as number | null],
    languageLevelId: [null as number | null],
  });
}

export function createFieldControl(
  fb: FormBuilder,
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown>,
): AbstractControl {
  if (field.uiType === 'language-grid') {
    return fb.array([createLanguageRowGroup(fb)], buildFieldValidators(field, formValues));
  }
  if (field.uiType === 'questionnaire-picker') {
    return fb.nonNullable.group({
      questionnaireId: [null as number | null],
      evaluationType: ['PERCENTAGE'],
      acceptancePercentage: [null as number | null],
    });
  }
  if (field.uiType === 'document-grid' && field.fieldKey === 'documentTypeIds') {
    return fb.nonNullable.control<number[]>([]);
  }
  if (field.uiType === 'multiselect') {
    return fb.nonNullable.control<number[]>([], buildFieldValidators(field, formValues));
  }
  const initial = defaultValueForUiType(field.uiType);
  return fb.control(initial, buildFieldValidators(field, formValues));
}

export function buildFieldValidators(
  field: ResolvedRequisitionFormField,
  formValues: Record<string, unknown>,
): ValidatorFn[] {
  if (!isFieldVisible(field, formValues)) {
    return [];
  }
  if (!isFieldRequired(field, formValues)) {
    return [];
  }
  switch (field.uiType) {
    case 'number':
      return [Validators.required];
    case 'checkbox':
      return [];
    case 'select':
    case 'client-search':
    case 'user-picker':
      return [Validators.required];
    case 'multiselect':
      return [requiredMultiselectValidator()];
    case 'document-grid':
    case 'language-grid':
    case 'questionnaire-picker':
      return [requiredCompositeValidator(field)];
    default:
      return [Validators.required];
  }
}

function requiredMultiselectValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as number[] | null;
    return value != null && value.length > 0 ? null : { required: true };
  };
}

function requiredCompositeValidator(field: ResolvedRequisitionFormField): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (field.uiType === 'language-grid' && control instanceof FormArray) {
      const rows = (control.getRawValue() as WizardLanguageRow[]).filter(
        (r) => r.languageId != null || r.languageLevelId != null,
      );
      return rows.length > 0 && rows.every((r) => r.languageId != null && r.languageLevelId != null)
        ? null
        : { required: true };
    }
    if (field.uiType === 'questionnaire-picker' && control instanceof FormGroup) {
      const q = control.getRawValue() as WizardQuestionnaireValue;
      return q.questionnaireId != null ? null : { required: true };
    }
    if (field.uiType === 'document-grid') {
      if (field.fieldKey === 'documentTypeIds') {
        const ids = control.value as number[];
        return ids?.length ? null : { required: true };
      }
      const rows = (control.value ?? []) as WizardDocumentRequirementRow[];
      return rows.some((r) => r.selected) ? null : { required: true };
    }
    return control.value != null && control.value !== '' ? null : { required: true };
  };
}

export function buildDynamicStepForms(
  fb: FormBuilder,
  config: ResolvedRequisitionFormConfig,
): FormGroup {
  const root = fb.nonNullable.group({});
  const flatValues: Record<string, unknown> = {};

  for (const step of config.steps) {
    const stepGroup = fb.nonNullable.group({});
    for (const field of step.fields) {
      stepGroup.addControl(field.fieldKey, createFieldControl(fb, field, flatValues));
      flatValues[field.fieldKey] = stepGroup.get(field.fieldKey)?.value;
    }
    root.addControl(step.stepKey, stepGroup);
  }
  return root;
}

export function flattenDynamicFormValues(form: FormGroup): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const stepKey of Object.keys(form.controls)) {
    const stepGroup = form.get(stepKey) as FormGroup;
    if (!stepGroup) {
      continue;
    }
    for (const fieldKey of Object.keys(stepGroup.controls)) {
      const control = stepGroup.get(fieldKey);
      if (!control) {
        continue;
      }
      values[fieldKey] = readControlValue(control);
    }
  }
  return values;
}

function readControlValue(control: AbstractControl): unknown {
  if (control instanceof FormGroup || control instanceof FormArray) {
    return control.getRawValue();
  }
  return control.disabled ? control.getRawValue() : control.value;
}

export function refreshDynamicValidators(
  form: FormGroup,
  config: ResolvedRequisitionFormConfig,
): void {
  const values = flattenDynamicFormValues(form);
  for (const step of config.steps) {
    const stepGroup = form.get(step.stepKey) as FormGroup | null;
    if (!stepGroup) {
      continue;
    }
    for (const field of step.fields) {
      const control = stepGroup.get(field.fieldKey);
      if (!control) {
        continue;
      }
      const visible = isFieldVisible(field, values);
      if (!visible) {
        control.clearValidators();
        control.disable({ emitEvent: false });
        control.updateValueAndValidity({ emitEvent: false });
        continue;
      }
      if (isFieldReadOnly(field, values)) {
        control.clearValidators();
        control.disable({ emitEvent: false });
        control.updateValueAndValidity({ emitEvent: false });
        continue;
      }
      control.enable({ emitEvent: false });
      control.setValidators(buildFieldValidators(field, values));
      control.updateValueAndValidity({ emitEvent: false });
    }
  }
}

export function buildDynamicCreatePayload(
  formValues: Record<string, unknown>,
  config: ResolvedRequisitionFormConfig,
  includeReadOnlyFields = false,
): CreatePositionRequest {
  const payload: Record<string, unknown> = { brandId: null };

  for (const step of config.steps) {
    for (const field of step.fields) {
      if (!isFieldVisible(field, formValues)) {
        continue;
      }
      if (
        !includeReadOnlyFields &&
        (isFieldReadOnly(field) || field.fieldKey === 'orderId' || field.fieldKey === 'brandId')
      ) {
        continue;
      }
      if (field.fieldKey === 'orderId' || field.fieldKey === 'brandId') {
        continue;
      }
      const raw = formValues[field.fieldKey];
      if (raw === undefined) {
        continue;
      }
      assignPayloadField(payload, field.fieldKey, field.uiType, raw);
    }
  }

  mapLegacyLanguageFields(payload, formValues);
  mapLegacyDocumentFields(payload, formValues);

  return payload as unknown as CreatePositionRequest;
}

function assignPayloadField(
  payload: Record<string, unknown>,
  fieldKey: string,
  uiType: string,
  raw: unknown,
): void {
  const targetKey = PAYLOAD_FIELD_ALIASES[fieldKey] ?? fieldKey;

  switch (uiType) {
    case 'language-grid': {
      const rows = (raw as WizardLanguageRow[]).filter(
        (r) => r.languageId != null && r.languageLevelId != null,
      );
      const seen = new Set<number>();
      payload['languages'] = rows
        .filter((r) => {
          if (seen.has(r.languageId!)) {
            return false;
          }
          seen.add(r.languageId!);
          return true;
        })
        .map(
          (r) =>
            ({
              languageId: r.languageId!,
              languageLevelId: r.languageLevelId!,
            }) satisfies PositionLanguageItem,
        );
      break;
    }
    case 'document-grid': {
      if (fieldKey === 'documentTypeIds') {
        payload['documentTypeIds'] = (raw as number[]) ?? [];
      } else {
        const rows = (raw as WizardDocumentRequirementRow[]).filter((r) => r.selected);
        payload['documentRequirements'] = rows.map(
          (r) =>
            ({
              documentTypeId: r.documentTypeId,
              isRequired: r.isRequired,
            }) satisfies PositionDocumentRequirementItem,
        );
        payload['documentTypeIds'] = rows.map((r) => r.documentTypeId);
      }
      break;
    }
    case 'questionnaire-picker': {
      const q = raw as WizardQuestionnaireValue;
      if (q.questionnaireId != null) {
        payload['questionnaire'] = {
          questionnaireId: q.questionnaireId,
          evaluationType: q.evaluationType,
          acceptancePercentage: q.acceptancePercentage,
        } satisfies PositionQuestionnaireItem;
      }
      break;
    }
    case 'number': {
      payload[targetKey] = raw === null || raw === '' ? null : Number(raw);
      break;
    }
    case 'multiselect': {
      if (fieldKey === 'workDays') {
        payload[targetKey] = serializeWorkDaysFromIds(raw as number[]);
        break;
      }
      const ids = Array.isArray(raw) ? (raw as number[]).filter((id) => id != null) : [];
      payload[targetKey] = ids;
      break;
    }
    case 'checkbox': {
      payload[targetKey] = !!raw;
      break;
    }
    case 'date': {
      payload[targetKey] = formatDatePayload(raw);
      break;
    }
    case 'time': {
      payload[targetKey] = typeof raw === 'string' && raw.trim() ? raw : null;
      break;
    }
    default: {
      payload[targetKey] = raw === '' ? null : raw;
    }
  }
}

function formatDatePayload(raw: unknown): string | null {
  if (raw == null || raw === '') {
    return null;
  }
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    const y = raw.getFullYear();
    const m = String(raw.getMonth() + 1).padStart(2, '0');
    const d = String(raw.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof raw === 'string') {
    return raw.length >= 10 ? raw.slice(0, 10) : raw;
  }
  return null;
}

function mapLegacyLanguageFields(payload: Record<string, unknown>, formValues: Record<string, unknown>): void {
  if (payload['languages']) {
    return;
  }
  const primary = formValues['primaryLanguageId'] as number | null | undefined;
  const secondary = formValues['secondaryLanguageId'] as number | null | undefined;
  const level = formValues['languageLevelId'] as number | null | undefined;
  if (primary == null || level == null) {
    return;
  }
  const languages: PositionLanguageItem[] = [{ languageId: primary, languageLevelId: level }];
  if (secondary != null) {
    languages.push({ languageId: secondary, languageLevelId: level });
  }
  payload['languages'] = languages;
  payload['primaryLanguageId'] = primary;
  payload['secondaryLanguageId'] = secondary ?? null;
  payload['languageLevelId'] = level;
}

function mapLegacyDocumentFields(payload: Record<string, unknown>, formValues: Record<string, unknown>): void {
  if (payload['documentTypeIds'] || payload['documentRequirements']) {
    return;
  }
  const ids = formValues['documentTypeIds'] as number[] | undefined;
  if (ids?.length) {
    payload['documentTypeIds'] = ids;
  }
}

export function hydrateDynamicFormValues(
  position: PositionDetail,
  config: ResolvedRequisitionFormConfig,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  const positionRecord = position as unknown as Record<string, unknown>;

  for (const step of config.steps) {
    for (const field of step.fields) {
      values[field.fieldKey] = resolveHydratedValue(field, position, positionRecord);
    }
  }
  return values;
}

function resolveHydratedValue(
  field: ResolvedRequisitionFormField,
  position: PositionDetail,
  positionRecord: Record<string, unknown>,
): unknown {
  switch (field.uiType) {
    case 'language-grid':
      if (position.languages?.length) {
        return position.languages.map((l) => ({
          languageId: l.languageId,
          languageLevelId: l.languageLevelId,
        }));
      }
      if (position.primaryLanguageId != null && position.languageLevelId != null) {
        const rows: WizardLanguageRow[] = [
          { languageId: position.primaryLanguageId, languageLevelId: position.languageLevelId },
        ];
        if (position.secondaryLanguageId != null) {
          rows.push({
            languageId: position.secondaryLanguageId,
            languageLevelId: position.languageLevelId,
          });
        }
        return rows;
      }
      return [{ languageId: null, languageLevelId: null }];
    case 'document-grid':
      if (field.fieldKey === 'documentTypeIds') {
        return position.documentTypeIds ?? [];
      }
      if (position.documentRequirements?.length) {
        return position.documentRequirements.map((d) => ({
          documentTypeId: d.documentTypeId,
          isRequired: d.isRequired,
          selected: true,
        }));
      }
      return (position.documentTypeIds ?? []).map((id) => ({
        documentTypeId: id,
        isRequired: false,
        selected: true,
      }));
    case 'questionnaire-picker':
      if (position.questionnaire) {
        return {
          questionnaireId: position.questionnaire.questionnaireId,
          evaluationType: position.questionnaire.evaluationType,
          acceptancePercentage: position.questionnaire.acceptancePercentage,
        };
      }
      return defaultValueForUiType(field.uiType);
    case 'multiselect': {
      if (field.fieldKey === 'workDays') {
        const text =
          (positionRecord[field.fieldKey] as string | null | undefined) ?? position.workDays;
        return parseWorkDaysToIds(text);
      }
      const raw = positionRecord[field.fieldKey];
      if (Array.isArray(raw)) {
        return (raw as number[]).filter((id) => id != null);
      }
      if (field.fieldKey === 'disabilityTypeIds' && position.disabilityTypeId != null) {
        return [position.disabilityTypeId];
      }
      return [];
    }
    default: {
      const alias = PAYLOAD_FIELD_ALIASES[field.fieldKey];
      let value =
        (alias ? positionRecord[alias as string] : undefined) ??
        positionRecord[field.fieldKey] ??
        defaultValueForUiType(field.uiType);
      if (field.uiType === 'date') {
        value = parseDateControlValue(value);
      }
      return value;
    }
  }
}

function parseDateControlValue(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(`${value.slice(0, 10)}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

export function patchDynamicForm(
  form: FormGroup,
  values: Record<string, unknown>,
  config: ResolvedRequisitionFormConfig,
): void {
  const fb = new FormBuilder();
  for (const step of config.steps) {
    const stepGroup = form.get(step.stepKey) as FormGroup | null;
    if (!stepGroup) {
      continue;
    }
    for (const field of step.fields) {
      const control = stepGroup.get(field.fieldKey);
      const value = values[field.fieldKey];
      if (!control || value === undefined) {
        continue;
      }
      if (field.uiType === 'language-grid' && control instanceof FormArray) {
        control.clear();
        const rows = (value as WizardLanguageRow[]) ?? [];
        for (const row of rows) {
          control.push(
            fb.nonNullable.group({
              languageId: [row.languageId],
              languageLevelId: [row.languageLevelId],
            }),
          );
        }
        if (!control.length) {
          control.push(createLanguageRowGroup(fb));
        }
        continue;
      }
      control.patchValue(value, { emitEvent: false });
    }
  }
  refreshDynamicValidators(form, config);
}
