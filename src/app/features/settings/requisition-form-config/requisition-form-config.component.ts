import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppPermissions } from '../../../core/auth/app-permissions';
import {
  REQ_FORM_CONFIG_COLUMN_REORDER,
  REQ_FORM_CONFIG_DETAIL_TITLE,
  REQ_FORM_CONFIG_FIELD_COVERAGE,
  REQ_FORM_CONFIG_FIELD_COUNTRY,
  REQ_FORM_CONFIG_FIELD_REQUIRED,
  REQ_FORM_CONFIG_FIELD_VISIBLE,
  REQ_FORM_CONFIG_LOAD,
  REQ_FORM_CONFIG_LOAD_ERROR,
  REQ_FORM_CONFIG_MOVE_DOWN,
  REQ_FORM_CONFIG_MOVE_UP,
  REQ_FORM_CONFIG_NO_RULES,
  REQ_FORM_CONFIG_PAGE_TITLE,
  REQ_FORM_CONFIG_PUBLISH,
  REQ_FORM_CONFIG_PUBLISH_ERROR,
  REQ_FORM_CONFIG_PUBLISH_SUCCESS,
  REQ_FORM_CONFIG_PUBLISHING,
  REQ_FORM_CONFIG_RULE_REQUIRED,
  REQ_FORM_CONFIG_RULE_VISIBLE,
  REQ_FORM_CONFIG_RULES_TITLE,
  REQ_FORM_CONFIG_SAVE_DRAFT,
  REQ_FORM_CONFIG_SAVE_ERROR,
  REQ_FORM_CONFIG_SAVE_SUCCESS,
  REQ_FORM_CONFIG_SAVING,
  REQ_FORM_CONFIG_SELECT_COUNTRY_COVERAGE,
  REQ_FORM_CONFIG_SELECTORS_HINT,
  REQ_FORM_CONFIG_SNACK_CLOSE,
  REQ_FORM_CONFIG_STATUS,
  REQ_FORM_CONFIG_STATUS_DRAFT,
  REQ_FORM_CONFIG_STATUS_PUBLISHED,
  REQ_FORM_CONFIG_TREE_TITLE,
  REQ_FORM_CONFIG_VERSION,
} from '../../../core/i18n/requisition-form-config-labels';
import {
  resolveRequisitionFieldLabel,
  resolveRequisitionStepLabel,
} from '../../../core/i18n/requisition-wizard-labels';
import { CatalogGeographyService } from '../../../core/services/catalog-geography.service';
import { CatalogPositionService } from '../../../core/services/catalog-position.service';
import { PermissionService } from '../../../core/services/permission.service';
import { RequisitionFormConfigService } from '../../../core/services/requisition-form-config.service';
import { RequisitionFormFieldService } from '../../../core/services/requisition-form-field.service';
import { REQUISITION_FORM_DEFAULT_STEP_KEYS } from '../../../shared/models/requisition-form.model';
import { CatalogCountry } from '../../../shared/models/catalog-geography.model';
import { CatalogCoverageType } from '../../../shared/models/catalog-position.model';
import {
  PEOPLE_IN_CHARGE_COUNT_FIELD_KEY,
  PEOPLE_IN_CHARGE_FIELD_KEY,
  RequisitionFormConfigDetail,
  RequisitionFormFieldConfig,
  RequisitionFormFieldDef,
  RequisitionFormFieldRules,
  RequisitionFormStepConfig,
} from '../../../shared/models/requisition-form.model';
import { buildFullCatalogState } from '../../../shared/utils/requisition-form-catalog.util';

interface SelectedFieldRef {
  stepKey: string;
  fieldDefId: number;
}

@Component({
  selector: 'sh-requisition-form-config',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
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
  readonly treeTitle = REQ_FORM_CONFIG_TREE_TITLE;
  readonly detailTitle = REQ_FORM_CONFIG_DETAIL_TITLE;
  readonly fieldVisible = REQ_FORM_CONFIG_FIELD_VISIBLE;
  readonly fieldRequired = REQ_FORM_CONFIG_FIELD_REQUIRED;
  readonly columnReorder = REQ_FORM_CONFIG_COLUMN_REORDER;
  readonly moveUpLabel = REQ_FORM_CONFIG_MOVE_UP;
  readonly moveDownLabel = REQ_FORM_CONFIG_MOVE_DOWN;
  readonly saveDraftLabel = REQ_FORM_CONFIG_SAVE_DRAFT;
  readonly publishLabel = REQ_FORM_CONFIG_PUBLISH;
  readonly savingLabel = REQ_FORM_CONFIG_SAVING;
  readonly publishingLabel = REQ_FORM_CONFIG_PUBLISHING;
  readonly selectorsHint = REQ_FORM_CONFIG_SELECTORS_HINT;
  readonly rulesTitle = REQ_FORM_CONFIG_RULES_TITLE;
  readonly ruleVisibleLabel = REQ_FORM_CONFIG_RULE_VISIBLE;
  readonly ruleRequiredLabel = REQ_FORM_CONFIG_RULE_REQUIRED;
  readonly noRulesHint = REQ_FORM_CONFIG_NO_RULES;
  readonly defaultStepKeys = REQUISITION_FORM_DEFAULT_STEP_KEYS;

  readonly canWrite = computed(() => this.permissions.hasAuthority(AppPermissions.REQUISITION_FORM_CONFIG_WRITE));
  readonly canPublish = computed(() => this.permissions.hasAuthority(AppPermissions.REQUISITION_FORM_CONFIG_PUBLISH));

  loading = false;
  saving = false;
  publishing = false;
  countries: CatalogCountry[] = [];
  coverageTypes: CatalogCoverageType[] = [];
  fieldDefs: RequisitionFormFieldDef[] = [];
  config: RequisitionFormConfigDetail | null = null;
  private pendingConfigDetail: RequisitionFormConfigDetail | null = null;
  steps: RequisitionFormStepConfig[] = [];
  fields: RequisitionFormFieldConfig[] = [];
  expandedSteps = new Set<string>([...REQUISITION_FORM_DEFAULT_STEP_KEYS]);
  selectedField: SelectedFieldRef | null = null;
  ruleVisibleWhen = false;
  ruleRequiredWhen = false;

  readonly selectorForm = this.fb.nonNullable.group({
    countryId: this.fb.control<number | null>(null),
    coverageTypeId: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.geographyService.listCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
    });
    this.fieldService.list().subscribe({
      next: (defs) => {
        this.fieldDefs = defs.filter((d) => d.isBuiltin);
        if (this.pendingConfigDetail) {
          this.applyConfig(this.pendingConfigDetail);
          this.pendingConfigDetail = null;
        }
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
    if (this.fieldDefs.length === 0) {
      this.pendingConfigDetail = detail;
      this.config = detail;
      this.loading = false;
      return;
    }
    this.config = detail;
    const catalog = buildFullCatalogState(this.fieldDefs, detail.steps ?? [], detail.fields ?? []);
    this.steps = catalog.steps;
    this.fields = catalog.fields;
    this.loading = false;
  }

  private handleLoadError(): void {
    this.loading = false;
    this.snack.open(REQ_FORM_CONFIG_LOAD_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
  }

  private resetEditorState(): void {
    this.config = null;
    this.pendingConfigDetail = null;
    this.steps = [];
    this.fields = [];
    this.selectedField = null;
    this.ruleVisibleWhen = false;
    this.ruleRequiredWhen = false;
  }

  statusLabelFor(status: string | undefined): string {
    return status === 'PUBLISHED' ? this.statusPublished : this.statusDraft;
  }

  stepDisplayLabel(stepKey: string): string {
    return resolveRequisitionStepLabel(stepKey);
  }

  fieldDefLabel(fieldDefId: number): string {
    const def = this.fieldDefs.find((item) => item.id === fieldDefId);
    if (!def) {
      return String(fieldDefId);
    }
    return resolveRequisitionFieldLabel(def.labelI18nKey);
  }

  fieldDefKey(fieldDefId: number): string {
    return this.fieldDefs.find((item) => item.id === fieldDefId)?.fieldKey ?? '';
  }

  fieldsForStep(stepKey: string): RequisitionFormFieldConfig[] {
    return this.fields
      .filter((field) => field.stepKey === stepKey)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  isStepExpanded(stepKey: string): boolean {
    return this.expandedSteps.has(stepKey);
  }

  toggleStepExpanded(stepKey: string): void {
    if (this.expandedSteps.has(stepKey)) {
      this.expandedSteps.delete(stepKey);
    } else {
      this.expandedSteps.add(stepKey);
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
    if (!visible) {
      this.fields = this.fields.map((field) =>
        field.stepKey === step.stepKey ? { ...field, isVisible: false, isRequired: false } : field,
      );
    }
  }

  toggleFieldVisible(field: RequisitionFormFieldConfig, visible: boolean): void {
    const patch: Partial<RequisitionFormFieldConfig> = { isVisible: visible };
    if (!visible) {
      patch.isRequired = false;
    }
    this.patchField(field, patch);
  }

  toggleFieldRequired(field: RequisitionFormFieldConfig, required: boolean): void {
    this.patchField(field, { isRequired: required, isVisible: required ? true : field.isVisible });
  }

  selectField(field: RequisitionFormFieldConfig): void {
    this.selectedField = { stepKey: field.stepKey, fieldDefId: field.fieldDefId };
    if (this.fieldDefKey(field.fieldDefId) === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY) {
      const rules = this.parseRules(field.rulesJson);
      this.ruleVisibleWhen =
        rules.visibleWhen?.fieldKey === PEOPLE_IN_CHARGE_FIELD_KEY && rules.visibleWhen.equals === true;
      this.ruleRequiredWhen =
        rules.requiredWhen?.fieldKey === PEOPLE_IN_CHARGE_FIELD_KEY && rules.requiredWhen.equals === true;
    } else {
      this.ruleVisibleWhen = false;
      this.ruleRequiredWhen = false;
    }
  }

  isFieldSelected(field: RequisitionFormFieldConfig): boolean {
    return (
      this.selectedField?.stepKey === field.stepKey &&
      this.selectedField?.fieldDefId === field.fieldDefId
    );
  }

  selectedFieldConfig(): RequisitionFormFieldConfig | null {
    if (!this.selectedField) {
      return null;
    }
    return (
      this.fields.find(
        (f) => f.stepKey === this.selectedField!.stepKey && f.fieldDefId === this.selectedField!.fieldDefId,
      ) ?? null
    );
  }

  supportsConditionalRules(fieldDefId: number): boolean {
    return this.fieldDefKey(fieldDefId) === PEOPLE_IN_CHARGE_COUNT_FIELD_KEY;
  }

  applyPeopleInChargeRules(): void {
    const target = this.selectedFieldConfig();
    if (!target) {
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
    this.patchField(target, { rulesJson });
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
