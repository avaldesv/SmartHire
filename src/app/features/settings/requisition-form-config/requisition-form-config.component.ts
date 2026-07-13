import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  REQ_FORM_CONFIG_ADD_FIELD,
  REQ_FORM_CONFIG_ADD_STEP,
  REQ_FORM_CONFIG_COLUMN_REORDER,
  REQ_FORM_CONFIG_FIELD_COVERAGE,
  REQ_FORM_CONFIG_FIELD_COUNTRY,
  REQ_FORM_CONFIG_FIELD_FIELD_KEY,
  REQ_FORM_CONFIG_FIELD_LABEL_KEY,
  REQ_FORM_CONFIG_FIELD_REQUIRED,
  REQ_FORM_CONFIG_FIELD_STEP_KEY,
  REQ_FORM_CONFIG_FIELD_VISIBLE,
  REQ_FORM_CONFIG_FIELDS_TITLE,
  REQ_FORM_CONFIG_LOAD,
  REQ_FORM_CONFIG_LOAD_ERROR,
  REQ_FORM_CONFIG_MOVE_DOWN,
  REQ_FORM_CONFIG_MOVE_UP,
  REQ_FORM_CONFIG_PAGE_TITLE,
  REQ_FORM_CONFIG_PUBLISH,
  REQ_FORM_CONFIG_PUBLISH_ERROR,
  REQ_FORM_CONFIG_PUBLISH_SUCCESS,
  REQ_FORM_CONFIG_PUBLISHING,
  REQ_FORM_CONFIG_REMOVE,
  REQ_FORM_CONFIG_RULE_REQUIRED,
  REQ_FORM_CONFIG_RULE_VISIBLE,
  REQ_FORM_CONFIG_RULES_TITLE,
  REQ_FORM_CONFIG_SAVE_DRAFT,
  REQ_FORM_CONFIG_SAVE_ERROR,
  REQ_FORM_CONFIG_SAVE_SUCCESS,
  REQ_FORM_CONFIG_SAVING,
  REQ_FORM_CONFIG_SELECT_COUNTRY_COVERAGE,
  REQ_FORM_CONFIG_SELECT_STEP,
  REQ_FORM_CONFIG_SELECTORS_HINT,
  REQ_FORM_CONFIG_SNACK_CLOSE,
  REQ_FORM_CONFIG_STATUS,
  REQ_FORM_CONFIG_STATUS_DRAFT,
  REQ_FORM_CONFIG_STATUS_PUBLISHED,
  REQ_FORM_CONFIG_STEPS_TITLE,
  REQ_FORM_CONFIG_VERSION,
} from '../../../core/i18n/requisition-form-config-labels';
import {
  REQUISITION_STEP_LABEL_KEY_PLACEHOLDER,
  resolveRequisitionFieldLabel,
  resolveRequisitionWizardLabel,
} from '../../../core/i18n/requisition-wizard-labels';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../core/services/catalog-position.service';
import { PermissionService } from '../../../core/services/permission.service';
import { RequisitionFormConfigService } from '../../../core/services/requisition-form-config.service';
import { RequisitionFormFieldService } from '../../../core/services/requisition-form-field.service';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogCoverageType } from '../../../shared/models/catalog-position.model';
import {
  PEOPLE_IN_CHARGE_COUNT_FIELD_KEY,
  PEOPLE_IN_CHARGE_FIELD_KEY,
  REQUISITION_FORM_DEFAULT_STEP_KEYS,
  RequisitionFormConfigDetail,
  RequisitionFormFieldConfig,
  RequisitionFormFieldDef,
  RequisitionFormFieldRules,
  RequisitionFormStepConfig,
} from '../../../shared/models/requisition-form.model';

@Component({
  selector: 'sh-requisition-form-config',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './requisition-form-config.component.html',
  styleUrl: './requisition-form-config.component.scss',
})
export class RequisitionFormConfigComponent implements OnInit {
  private readonly geographyService = inject(CatalogGeographyService);
  private readonly positionCatalogService = inject(CatalogPositionService);
  private readonly configService = inject(RequisitionFormConfigService);
  private readonly fieldService = inject(RequisitionFormFieldService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly pageTitle = REQ_FORM_CONFIG_PAGE_TITLE;
  readonly fieldCountry = REQ_FORM_CONFIG_FIELD_COUNTRY;
  readonly fieldCoverage = REQ_FORM_CONFIG_FIELD_COVERAGE;
  readonly loadLabel = REQ_FORM_CONFIG_LOAD;
  readonly statusLabel = REQ_FORM_CONFIG_STATUS;
  readonly versionLabel = REQ_FORM_CONFIG_VERSION;
  readonly statusDraft = REQ_FORM_CONFIG_STATUS_DRAFT;
  readonly statusPublished = REQ_FORM_CONFIG_STATUS_PUBLISHED;
  readonly stepsTitle = REQ_FORM_CONFIG_STEPS_TITLE;
  readonly fieldsTitle = REQ_FORM_CONFIG_FIELDS_TITLE;
  readonly fieldStepKey = REQ_FORM_CONFIG_FIELD_STEP_KEY;
  readonly fieldLabelKey = REQ_FORM_CONFIG_FIELD_LABEL_KEY;
  readonly fieldFieldKey = REQ_FORM_CONFIG_FIELD_FIELD_KEY;
  readonly fieldVisible = REQ_FORM_CONFIG_FIELD_VISIBLE;
  readonly fieldRequired = REQ_FORM_CONFIG_FIELD_REQUIRED;
  readonly columnReorder = REQ_FORM_CONFIG_COLUMN_REORDER;
  readonly moveUpLabel = REQ_FORM_CONFIG_MOVE_UP;
  readonly moveDownLabel = REQ_FORM_CONFIG_MOVE_DOWN;
  readonly addStepLabel = REQ_FORM_CONFIG_ADD_STEP;
  readonly addFieldLabel = REQ_FORM_CONFIG_ADD_FIELD;
  readonly removeLabel = REQ_FORM_CONFIG_REMOVE;
  readonly saveDraftLabel = REQ_FORM_CONFIG_SAVE_DRAFT;
  readonly publishLabel = REQ_FORM_CONFIG_PUBLISH;
  readonly savingLabel = REQ_FORM_CONFIG_SAVING;
  readonly publishingLabel = REQ_FORM_CONFIG_PUBLISHING;
  readonly selectStepHint = REQ_FORM_CONFIG_SELECT_STEP;
  readonly selectorsHint = REQ_FORM_CONFIG_SELECTORS_HINT;
  readonly rulesTitle = REQ_FORM_CONFIG_RULES_TITLE;
  readonly ruleVisibleLabel = REQ_FORM_CONFIG_RULE_VISIBLE;
  readonly ruleRequiredLabel = REQ_FORM_CONFIG_RULE_REQUIRED;
  readonly stepLabelKeyPlaceholder = REQUISITION_STEP_LABEL_KEY_PLACEHOLDER;

  readonly canWrite = computed(() => this.permissions.hasAuthority(AppPermissions.REQUISITION_FORM_CONFIG_WRITE));
  readonly canPublish = computed(() => this.permissions.hasAuthority(AppPermissions.REQUISITION_FORM_CONFIG_PUBLISH));

  readonly stepColumns = ['order', 'stepKey', 'labelI18nKey', 'visible', 'reorder', 'actions'];
  readonly fieldColumns = ['order', 'fieldKey', 'visible', 'required', 'reorder', 'actions'];

  loading = false;
  saving = false;
  publishing = false;
  countries: CatalogCountry[] = [];
  coverageTypes: CatalogCoverageType[] = [];
  fieldDefs: RequisitionFormFieldDef[] = [];
  config: RequisitionFormConfigDetail | null = null;
  steps: RequisitionFormStepConfig[] = [];
  fields: RequisitionFormFieldConfig[] = [];
  selectedStepKey: string | null = null;
  selectedFieldDefId: number | null = null;
  newStepKey = '';
  newStepLabelKey = '';
  addFieldDefId: number | null = null;
  ruleVisibleWhen = false;
  ruleRequiredWhen = false;

  readonly selectorForm = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
    coverageTypeId: this.fb.control<number | null>(null),
  });

  getAvailableStepKeys(): readonly string[] {
    const used = new Set(this.steps.map((step) => step.stepKey));
    return REQUISITION_FORM_DEFAULT_STEP_KEYS.filter((key) => !used.has(key));
  }

  ngOnInit(): void {
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
    });
    this.fieldService.list().subscribe({
      next: (defs) => {
        this.fieldDefs = defs;
      },
    });
    this.selectorForm.controls.countryId.valueChanges.subscribe((countryId) => {
      this.selectorForm.controls.coverageTypeId.setValue(null);
      this.coverageTypes = [];
      if (countryId) {
        this.positionCatalogService.listCoverageTypes(countryId).subscribe({
          next: (items) => {
            this.coverageTypes = items;
          },
        });
      }
    });
  }

  loadDraft(): void {
    const countryId = this.selectorForm.controls.countryId.value;
    const coverageTypeId = this.selectorForm.controls.coverageTypeId.value;
    if (!countryId || !coverageTypeId) {
      this.snack.open(REQ_FORM_CONFIG_SELECT_COUNTRY_COVERAGE, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3000 });
      return;
    }

    this.loading = true;
    this.resetEditorState();
    this.configService
      .list(0, 1, { countryId, coverageTypeId, status: 'DRAFT' })
      .subscribe({
        next: ({ items }) => {
          const draft = items[0];
          if (draft) {
            this.loadConfigById(draft.id);
            return;
          }
          this.configService.create({ countryId, coverageTypeId }).subscribe({
            next: (created) => this.applyConfig(created),
            error: () => this.handleLoadError(),
          });
        },
        error: () => this.handleLoadError(),
      });
  }

  private loadConfigById(id: number): void {
    this.configService.getById(id).subscribe({
      next: (detail) => this.applyConfig(detail),
      error: () => this.handleLoadError(),
    });
  }

  private applyConfig(detail: RequisitionFormConfigDetail): void {
    this.config = detail;
    this.steps = [...(detail.steps ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
    this.fields = [...(detail.fields ?? [])];
    this.selectedStepKey = this.steps[0]?.stepKey ?? null;
    this.loading = false;
  }

  private handleLoadError(): void {
    this.loading = false;
    this.snack.open(REQ_FORM_CONFIG_LOAD_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
  }

  private resetEditorState(): void {
    this.config = null;
    this.steps = [];
    this.fields = [];
    this.selectedStepKey = null;
    this.selectedFieldDefId = null;
    this.addFieldDefId = null;
    this.ruleVisibleWhen = false;
    this.ruleRequiredWhen = false;
  }

  statusLabelFor(status: string | undefined): string {
    return status === 'PUBLISHED' ? this.statusPublished : this.statusDraft;
  }

  selectStep(stepKey: string): void {
    this.selectedStepKey = stepKey;
    this.selectedFieldDefId = null;
    this.addFieldDefId = null;
  }

  isStepSelected(stepKey: string): boolean {
    return this.selectedStepKey === stepKey;
  }

  fieldsForSelectedStep(): RequisitionFormFieldConfig[] {
    if (!this.selectedStepKey) {
      return [];
    }
    return this.fields
      .filter((field) => field.stepKey === this.selectedStepKey)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  stepDisplayLabel(stepKey: string, labelI18nKey?: string): string {
    return resolveRequisitionWizardLabel(labelI18nKey ?? `requisition.step.${stepKey}`);
  }

  fieldDefLabel(fieldDefId: number): string {
    const def = this.fieldDefs.find((item) => item.id === fieldDefId);
    if (!def) {
      return String(fieldDefId);
    }
    return `${def.fieldKey} — ${resolveRequisitionFieldLabel(def.labelI18nKey)}`;
  }

  fieldLabelFromKey(labelI18nKey: string): string {
    return resolveRequisitionWizardLabel(labelI18nKey);
  }

  fieldDefKey(fieldDefId: number): string {
    return this.fieldDefs.find((item) => item.id === fieldDefId)?.fieldKey ?? '';
  }

  availableFieldDefsForStep(): RequisitionFormFieldDef[] {
    if (!this.selectedStepKey) {
      return [];
    }
    const usedIds = new Set(
      this.fields.filter((field) => field.stepKey === this.selectedStepKey).map((field) => field.fieldDefId),
    );
    return this.fieldDefs.filter((def) => !usedIds.has(def.id));
  }

  addStep(): void {
    if (!this.newStepKey || !this.newStepLabelKey) {
      return;
    }
    const orderIndex = this.steps.length + 1;
    this.steps = [
      ...this.steps,
      {
        stepKey: this.newStepKey,
        labelI18nKey: this.newStepLabelKey,
        orderIndex,
        isVisible: true,
      },
    ];
    this.selectedStepKey = this.newStepKey;
    this.newStepKey = '';
    this.newStepLabelKey = '';
  }

  removeStep(stepKey: string): void {
    this.steps = this.reindexSteps(this.steps.filter((step) => step.stepKey !== stepKey));
    this.fields = this.fields.filter((field) => field.stepKey !== stepKey);
    if (this.selectedStepKey === stepKey) {
      this.selectedStepKey = this.steps[0]?.stepKey ?? null;
    }
  }

  moveStep(stepKey: string, direction: -1 | 1): void {
    const index = this.steps.findIndex((step) => step.stepKey === stepKey);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= this.steps.length) {
      return;
    }
    const reordered = [...this.steps];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    this.steps = this.reindexSteps(reordered);
  }

  toggleStepVisible(step: RequisitionFormStepConfig, visible: boolean): void {
    this.steps = this.steps.map((item) =>
      item.stepKey === step.stepKey ? { ...item, isVisible: visible } : item,
    );
  }

  updateStepLabel(stepKey: string, labelI18nKey: string): void {
    this.steps = this.steps.map((item) =>
      item.stepKey === stepKey ? { ...item, labelI18nKey } : item,
    );
  }

  addField(): void {
    if (!this.selectedStepKey || !this.addFieldDefId) {
      return;
    }
    const stepFields = this.fields.filter((field) => field.stepKey === this.selectedStepKey);
    const orderIndex = stepFields.length + 1;
    this.fields = [
      ...this.fields,
      {
        stepKey: this.selectedStepKey,
        fieldDefId: this.addFieldDefId,
        orderIndex,
        isVisible: true,
        isRequired: false,
        overridesJson: null,
        rulesJson: null,
      },
    ];
    this.addFieldDefId = null;
  }

  removeField(field: RequisitionFormFieldConfig): void {
    const stepKey = field.stepKey;
    const remaining = this.fields.filter(
      (item) => !(item.stepKey === field.stepKey && item.fieldDefId === field.fieldDefId),
    );
    this.fields = this.reindexStepFields(remaining, stepKey);
    if (this.selectedFieldDefId === field.fieldDefId) {
      this.selectedFieldDefId = null;
    }
  }

  moveField(field: RequisitionFormFieldConfig, direction: -1 | 1): void {
    const stepFields = this.fieldsForSelectedStep();
    const index = stepFields.findIndex((item) => item.fieldDefId === field.fieldDefId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= stepFields.length) {
      return;
    }
    const reordered = [...stepFields];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const otherFields = this.fields.filter((item) => item.stepKey !== field.stepKey);
    this.fields = [...otherFields, ...this.reindexFields(reordered)];
  }

  toggleFieldVisible(field: RequisitionFormFieldConfig, visible: boolean): void {
    this.patchField(field, { isVisible: visible });
  }

  toggleFieldRequired(field: RequisitionFormFieldConfig, required: boolean): void {
    this.patchField(field, { isRequired: required });
  }

  selectFieldForRules(field: RequisitionFormFieldConfig): void {
    if (this.fieldDefKey(field.fieldDefId) !== PEOPLE_IN_CHARGE_COUNT_FIELD_KEY) {
      this.selectedFieldDefId = null;
      return;
    }
    this.selectedFieldDefId = field.fieldDefId;
    const rules = this.parseRules(field.rulesJson);
    this.ruleVisibleWhen = rules.visibleWhen?.fieldKey === PEOPLE_IN_CHARGE_FIELD_KEY && rules.visibleWhen.equals === true;
    this.ruleRequiredWhen =
      rules.requiredWhen?.fieldKey === PEOPLE_IN_CHARGE_FIELD_KEY && rules.requiredWhen.equals === true;
  }

  isPeopleInChargeCountField(field: RequisitionFormFieldConfig): boolean {
    return this.fieldDefKey(field.fieldDefId) === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY;
  }

  applyPeopleInChargeRules(): void {
    if (!this.selectedStepKey || this.selectedFieldDefId == null) {
      return;
    }
    const rules: RequisitionFormFieldRules = {};
    if (this.ruleVisibleWhen) {
      rules.visibleWhen = { fieldKey: PEOPLE_IN_CHARGE_FIELD_KEY, equals: true };
    }
    if (this.ruleRequiredWhen) {
      rules.requiredWhen = { fieldKey: PEOPLE_IN_CHARGE_FIELD_KEY, equals: true };
    }
    const rulesJson = Object.keys(rules).length > 0 ? JSON.stringify(rules) : null;
    const target = this.fields.find(
      (field) => field.stepKey === this.selectedStepKey && field.fieldDefId === this.selectedFieldDefId,
    );
    if (target) {
      this.patchField(target, { rulesJson });
    }
  }

  saveDraft(): void {
    if (!this.config || !this.canWrite()) {
      return;
    }
    this.saving = true;
    this.configService
      .update(this.config.id, {
        steps: this.steps,
        fields: this.fields,
      })
      .subscribe({
        next: (updated) => {
          this.applyConfig(updated);
          this.saving = false;
          this.snack.open(REQ_FORM_CONFIG_SAVE_SUCCESS, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 2500 });
        },
        error: () => {
          this.saving = false;
          this.snack.open(REQ_FORM_CONFIG_SAVE_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  publishConfig(): void {
    if (!this.config || !this.canPublish()) {
      return;
    }
    this.publishing = true;
    this.configService.publish(this.config.id).subscribe({
      next: (published) => {
        this.applyConfig(published);
        this.publishing = false;
        this.snack.open(REQ_FORM_CONFIG_PUBLISH_SUCCESS, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 2500 });
      },
      error: () => {
        this.publishing = false;
        this.snack.open(REQ_FORM_CONFIG_PUBLISH_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  private patchField(field: RequisitionFormFieldConfig, patch: Partial<RequisitionFormFieldConfig>): void {
    this.fields = this.fields.map((item) =>
      item.stepKey === field.stepKey && item.fieldDefId === field.fieldDefId ? { ...item, ...patch } : item,
    );
  }

  private reindexSteps(steps: RequisitionFormStepConfig[]): RequisitionFormStepConfig[] {
    return steps.map((step, index) => ({ ...step, orderIndex: index + 1 }));
  }

  private reindexFields(fields: RequisitionFormFieldConfig[]): RequisitionFormFieldConfig[] {
    return fields.map((field, index) => ({ ...field, orderIndex: index + 1 }));
  }

  private reindexStepFields(fields: RequisitionFormFieldConfig[], stepKey: string): RequisitionFormFieldConfig[] {
    const stepFields = fields.filter((field) => field.stepKey === stepKey);
    const otherFields = fields.filter((field) => field.stepKey !== stepKey);
    return [...otherFields, ...this.reindexFields(stepFields)];
  }

  private parseRules(rulesJson: string | null | undefined): RequisitionFormFieldRules {
    if (!rulesJson) {
      return {};
    }
    try {
      return JSON.parse(rulesJson) as RequisitionFormFieldRules;
    } catch {
      return {};
    }
  }
}
