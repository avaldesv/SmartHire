import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  REQ_FORM_CONFIG_COLUMN_REORDER,
  REQ_FORM_CONFIG_DETAIL_TITLE,
  REQ_FORM_CONFIG_FIELD_COUNTRY,
  REQ_FORM_CONFIG_FIELD_COVERAGE,
  REQ_FORM_CONFIG_FIELD_NAME,
  REQ_FORM_CONFIG_FIELD_REQUIRED,
  REQ_FORM_CONFIG_FIELD_VISIBLE,
  REQ_FORM_CONFIG_LOAD_ERROR,
  REQ_FORM_CONFIG_MOVE_DOWN,
  REQ_FORM_CONFIG_MOVE_UP,
  REQ_FORM_CONFIG_NAME_REQUIRED,
  REQ_FORM_CONFIG_NO_RULES,
  REQ_FORM_CONFIG_PUBLISH,
  REQ_FORM_CONFIG_PUBLISH_ERROR,
  REQ_FORM_CONFIG_PUBLISH_SUCCESS,
  REQ_FORM_CONFIG_PUBLISHING,
  REQ_FORM_CONFIG_READ_ONLY_HINT,
  REQ_FORM_CONFIG_RULE_REQUIRED,
  REQ_FORM_CONFIG_RULE_VISIBLE,
  REQ_FORM_CONFIG_RULES_TITLE,
  REQ_FORM_CONFIG_SAVE_DRAFT,
  REQ_FORM_CONFIG_SAVE_ERROR,
  REQ_FORM_CONFIG_SAVE_SUCCESS,
  REQ_FORM_CONFIG_SAVING,
  REQ_FORM_CONFIG_SCOPE_HINT,
  REQ_FORM_CONFIG_SCOPE_LABEL,
  REQ_FORM_CONFIG_SNACK_CLOSE,
  REQ_FORM_CONFIG_STATUS,
  REQ_FORM_CONFIG_STATUS_DEPRECATED,
  REQ_FORM_CONFIG_STATUS_DRAFT,
  REQ_FORM_CONFIG_STATUS_PUBLISHED,
  REQ_FORM_CONFIG_TREE_TITLE,
  REQ_FORM_CONFIG_VERSION,
} from '../../../core/i18n/requisition-form-config-labels';
import {
  resolveRequisitionFieldLabel,
  resolveRequisitionStepLabel,
} from '../../../core/i18n/requisition-wizard-labels';
import { AppPermissions } from '../../../core/auth/app-permissions';
import { PermissionService } from '../../../core/services/permission.service';
import { RequisitionFormConfigService } from '../../../core/services/requisition-form-config.service';
import { RequisitionFormFieldService } from '../../../core/services/requisition-form-field.service';
import { REQUISITION_FORM_DEFAULT_STEP_KEYS } from '../../../shared/models/requisition-form.model';
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

export interface RequisitionFormConfigDialogData {
  config: RequisitionFormConfigDetail;
  countryName: string;
  coverageTypeName: string;
}

interface SelectedFieldRef {
  stepKey: string;
  fieldDefId: number;
}

@Component({
  selector: 'sh-requisition-form-config-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './requisition-form-config-dialog.component.html',
  styleUrl: './requisition-form-config-dialog.component.scss',
})
export class RequisitionFormConfigDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<RequisitionFormConfigDialogComponent, boolean>);
  private readonly data = inject<RequisitionFormConfigDialogData>(MAT_DIALOG_DATA);
  private readonly configService = inject(RequisitionFormConfigService);
  private readonly fieldService = inject(RequisitionFormFieldService);
  private readonly permissions = inject(PermissionService);
  private readonly snack = inject(MatSnackBar);

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
  readonly rulesTitle = REQ_FORM_CONFIG_RULES_TITLE;
  readonly ruleVisibleLabel = REQ_FORM_CONFIG_RULE_VISIBLE;
  readonly ruleRequiredLabel = REQ_FORM_CONFIG_RULE_REQUIRED;
  readonly noRulesHint = REQ_FORM_CONFIG_NO_RULES;
  readonly readOnlyHint = REQ_FORM_CONFIG_READ_ONLY_HINT;
  readonly fieldNameLabel = REQ_FORM_CONFIG_FIELD_NAME;
  readonly fieldCountry = REQ_FORM_CONFIG_FIELD_COUNTRY;
  readonly fieldCoverage = REQ_FORM_CONFIG_FIELD_COVERAGE;
  readonly scopeLabel = REQ_FORM_CONFIG_SCOPE_LABEL;
  readonly scopeHint = REQ_FORM_CONFIG_SCOPE_HINT;
  readonly statusLabel = REQ_FORM_CONFIG_STATUS;
  readonly versionLabel = REQ_FORM_CONFIG_VERSION;
  readonly statusDraft = REQ_FORM_CONFIG_STATUS_DRAFT;
  readonly statusPublished = REQ_FORM_CONFIG_STATUS_PUBLISHED;
  readonly statusDeprecated = REQ_FORM_CONFIG_STATUS_DEPRECATED;
  readonly closeLabel = REQ_FORM_CONFIG_SNACK_CLOSE;

  readonly countryName = this.data.countryName;
  readonly coverageTypeName = this.data.coverageTypeName;

  readonly canWrite = computed(() => this.permissions.hasAuthority(AppPermissions.REQUISITION_FORM_CONFIG_WRITE));
  readonly canPublish = computed(() => this.permissions.hasAuthority(AppPermissions.REQUISITION_FORM_CONFIG_PUBLISH));
  readonly isReadOnly = computed(
    () =>
      this.config?.status === 'PUBLISHED' ||
      this.config?.status === 'DEPRECATED' ||
      !this.canWrite(),
  );

  loading = true;
  saving = false;
  publishing = false;
  changed = false;
  configName = '';
  config: RequisitionFormConfigDetail | null = null;
  fieldDefs: RequisitionFormFieldDef[] = [];
  steps: RequisitionFormStepConfig[] = [];
  fields: RequisitionFormFieldConfig[] = [];
  expandedSteps = new Set<string>([...REQUISITION_FORM_DEFAULT_STEP_KEYS]);
  selectedField: SelectedFieldRef | null = null;
  ruleVisibleWhen = false;
  ruleRequiredWhen = false;

  ngOnInit(): void {
    this.fieldService.list().subscribe({
      next: (defs) => {
        this.fieldDefs = defs.filter((d) => d.isBuiltin);
        this.applyConfig(this.data.config);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open(REQ_FORM_CONFIG_LOAD_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
        this.dialogRef.close(false);
      },
    });
  }

  get title(): string {
    if (!this.config) {
      return this.treeTitle;
    }
    const status = this.statusLabelFor(this.config.status);
    const name = this.configName?.trim() || this.config.name || this.treeTitle;
    return `${name} · v${this.config.version} (${status})`;
  }

  statusLabelFor(status: string | undefined): string {
    if (status === 'PUBLISHED') {
      return this.statusPublished;
    }
    if (status === 'DEPRECATED') {
      return this.statusDeprecated;
    }
    return this.statusDraft;
  }

  stepDisplayLabel(stepKey: string): string {
    return resolveRequisitionStepLabel(stepKey);
  }

  fieldDefLabel(fieldDefId: number): string {
    const def = this.fieldDefs.find((item) => item.id === fieldDefId);
    if (!def) {
      return String(fieldDefId);
    }
    return resolveRequisitionFieldLabel(def.fieldKey, def.labelI18nKey);
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
    if (this.isReadOnly()) {
      return;
    }
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
    if (this.isReadOnly()) {
      return;
    }
    this.steps = this.steps.map((item) =>
      item.stepKey === step.stepKey ? { ...item, isVisible: visible } : item,
    );
    if (visible) {
      this.fields = this.fields.map((field) =>
        field.stepKey === step.stepKey ? { ...field, isVisible: true } : field,
      );
    } else {
      this.fields = this.fields.map((field) =>
        field.stepKey === step.stepKey ? { ...field, isVisible: false, isRequired: false } : field,
      );
    }
  }

  toggleFieldVisible(field: RequisitionFormFieldConfig, visible: boolean): void {
    if (this.isReadOnly()) {
      return;
    }
    const patch: Partial<RequisitionFormFieldConfig> = { isVisible: visible };
    if (!visible) {
      patch.isRequired = false;
    }
    this.patchField(field, patch);
  }

  toggleFieldRequired(field: RequisitionFormFieldConfig, required: boolean): void {
    if (this.isReadOnly()) {
      return;
    }
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
    if (this.isReadOnly()) {
      return;
    }
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
    if (!this.config || !this.canWrite() || this.isReadOnly()) {
      return;
    }
    const name = this.configName.trim();
    if (!name) {
      this.snack.open(REQ_FORM_CONFIG_NAME_REQUIRED, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3000 });
      return;
    }
    this.saving = true;
    this.configService
      .update(this.config.id, {
        name,
        steps: this.steps,
        fields: this.fields,
      })
      .subscribe({
        next: (updated) => {
          this.applyConfig(updated);
          this.saving = false;
          this.changed = true;
          this.snack.open(REQ_FORM_CONFIG_SAVE_SUCCESS, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 2500 });
        },
        error: () => {
          this.saving = false;
          this.snack.open(REQ_FORM_CONFIG_SAVE_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
        },
      });
  }

  publishConfig(): void {
    if (!this.config || !this.canPublish() || this.config.status !== 'DRAFT') {
      return;
    }
    this.publishing = true;
    this.configService.publish(this.config.id).subscribe({
      next: (published) => {
        this.applyConfig(published);
        this.publishing = false;
        this.changed = true;
        this.snack.open(REQ_FORM_CONFIG_PUBLISH_SUCCESS, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 2500 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.publishing = false;
        this.snack.open(REQ_FORM_CONFIG_PUBLISH_ERROR, REQ_FORM_CONFIG_SNACK_CLOSE, { duration: 3500 });
      },
    });
  }

  close(): void {
    this.dialogRef.close(this.changed);
  }

  private applyConfig(detail: RequisitionFormConfigDetail): void {
    this.config = detail;
    this.configName = detail.name ?? '';
    const catalog = buildFullCatalogState(this.fieldDefs, detail.steps ?? [], detail.fields ?? []);
    this.steps = catalog.steps;
    this.fields = catalog.fields;
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
