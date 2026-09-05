import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { WizardFieldCatalogService } from '../../../../core/services/wizard-field-catalog.service';
import {
  ResolvedRequisitionFormConfig,
  ResolvedRequisitionFormField,
  ResolvedRequisitionFormStep,
  WizardFieldOption,
} from '../../../../shared/models/requisition-wizard.model';
import {
  isFieldReadOnly,
  isFieldRequired,
  isFieldVisible,
  fieldValueFrom,
  fieldFillFromCatalog,
} from '../dynamic-wizard-rules.util';
import { RequisitionFormFieldRules } from '../../../../shared/models/requisition-form.model';
import { resolveWizardFieldLabel } from '../requisition-wizard-labels';
import {
  REQUISITION_SCOPE_LOADING,
  REQUISITION_WIZARD_ADD_LANGUAGE,
  REQUISITION_WIZARD_LANGUAGE,
  REQUISITION_WIZARD_LANGUAGE_LEVEL,
  REQUISITION_WIZARD_LOADING_DOCUMENTS,
  REQUISITION_WIZARD_NO_DOCUMENTS,
  REQUISITION_WIZARD_NO_EXAMS,
} from '../../../../core/i18n/requisition-wizard-labels';
import { DocumentRequirementsEditorComponent } from '../document-requirements-editor/document-requirements-editor.component';
import { DynamicWizardFieldComponent } from '../dynamic-wizard-field/dynamic-wizard-field.component';
import { JobDescriptionAiFieldComponent } from '../job-description-ai-field/job-description-ai-field.component';
import { WizardClientSearchFieldComponent } from '../wizard-client-search-field/wizard-client-search-field.component';
import { CLIENT_ID_FIELD_KEY } from '../../../../shared/constants/requisition-client-catalog-fill';

@Component({
  selector: 'sh-dynamic-wizard-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    DynamicWizardFieldComponent,
    DocumentRequirementsEditorComponent,
    JobDescriptionAiFieldComponent,
    WizardClientSearchFieldComponent,
  ],
  templateUrl: './dynamic-wizard-step.component.html',
  styleUrl: './dynamic-wizard-step.component.scss',
})
export class DynamicWizardStepComponent implements OnInit, OnChanges {
  private readonly catalogService = inject(WizardFieldCatalogService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly languageLabel = REQUISITION_WIZARD_LANGUAGE;
  readonly languageLevelLabel = REQUISITION_WIZARD_LANGUAGE_LEVEL;
  readonly addLanguageLabel = REQUISITION_WIZARD_ADD_LANGUAGE;
  readonly examFieldLabel = resolveWizardFieldLabel('exam', 'requisition.field.exam');
  readonly loadingDocumentsLabel = REQUISITION_WIZARD_LOADING_DOCUMENTS;
  readonly noDocumentsLabel = REQUISITION_WIZARD_NO_DOCUMENTS;
  readonly noExamsLabel = REQUISITION_WIZARD_NO_EXAMS;
  readonly loadingOptionsLabel = REQUISITION_SCOPE_LOADING;

  @Input({ required: true }) step!: ResolvedRequisitionFormStep;
  @Input({ required: true }) stepForm!: FormGroup;
  @Input({ required: true }) rootForm!: FormGroup;
  @Input({ required: true }) config!: ResolvedRequisitionFormConfig;
  @Input() countryId: number | null = null;

  visibleFields: ResolvedRequisitionFormField[] = [];
  optionsByField: Partial<Record<string, WizardFieldOption[]>> = {};
  loadingByField: Partial<Record<string, boolean>> = {};

  states: WizardFieldOption[] = [];
  municipalities: WizardFieldOption[] = [];
  neighborhoods: WizardFieldOption[] = [];
  documentTypeOptions: WizardFieldOption[] = [];

  private flatValues: Record<string, unknown> = {};
  private geographySetup = false;
  private readonly catalogFillStop$ = new Subject<void>();

  ngOnInit(): void {
    this.rootForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.flatValues = this.flattenRootValues();
      this.visibleFields = this.step.fields.filter(
        (f) => f.uiType !== 'document-config-section' && isFieldVisible(f, this.flatValues),
      );
      this.syncMirroredFields();
    });
    this.flatValues = this.flattenRootValues();
    this.visibleFields = this.step.fields.filter(
      (f) => f.uiType !== 'document-config-section' && isFieldVisible(f, this.flatValues),
    );
    this.syncMirroredFields();

    const langField = this.step.fields.find((f) => f.uiType === 'language-grid');
    if (langField) {
      this.catalogService.loadOptions('languages', {}).subscribe({
        next: (opts) => {
          this.optionsByField['__languages__'] = opts;
        },
      });
      this.catalogService.loadOptions('language-levels', { countryId: this.countryId }).subscribe({
        next: (opts) => {
          this.optionsByField['__languageLevels__'] = opts;
        },
      });
    }

    this.loadExamOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stepForm'] || changes['config'] || changes['step']) {
      this.refreshVisibleFields();
      this.loadFieldOptions();
      this.loadExamOptions();
      if (!this.geographySetup) {
        this.setupGeographyCascade();
        this.geographySetup = true;
      }
      this.catalogFillStop$.next();
      this.setupCatalogFill();
    }
    if (changes['countryId'] && !changes['countryId'].firstChange) {
      this.loadFieldOptions();
      this.loadStates();
    }
  }

  fieldControl(fieldKey: string): FormControl {
    return this.stepForm.get(fieldKey) as FormControl;
  }

  isReadOnly(field: ResolvedRequisitionFormField): boolean {
    return isFieldReadOnly(field, this.flatValues);
  }

  isRequired(field: ResolvedRequisitionFormField): boolean {
    return isFieldRequired(field, this.flatValues);
  }

  private syncMirroredFields(): void {
    for (const field of this.step.fields) {
      const control = this.stepForm.get(field.fieldKey);
      if (!control) {
        continue;
      }
      if (isFieldReadOnly(field, this.flatValues) && control.enabled) {
        control.disable({ emitEvent: false });
      }
      const sourceKey = fieldValueFrom(field);
      if (!sourceKey) {
        continue;
      }
      const sourceValue = this.flatValues[sourceKey] ?? '';
      if (control.value !== sourceValue) {
        control.setValue(sourceValue, { emitEvent: false });
      }
    }
  }

  private setupCatalogFill(): void {
    if (!this.stepForm) {
      return;
    }
    for (const field of this.step.fields) {
      const fill = fieldFillFromCatalog(field);
      if (!fill) {
        continue;
      }
      const control = this.stepForm.get(field.fieldKey);
      if (!control) {
        continue;
      }
      control.valueChanges
        .pipe(distinctUntilChanged(), takeUntil(this.catalogFillStop$), takeUntilDestroyed(this.destroyRef))
        .subscribe((id) => this.applyCatalogFill(fill, id));
    }
  }

  private applyCatalogFill(
    fill: NonNullable<RequisitionFormFieldRules['fillFromCatalog']>,
    rawId: unknown,
  ): void {
    const id = typeof rawId === 'number' ? rawId : Number(rawId);
    if (rawId == null || rawId === '' || Number.isNaN(id)) {
      return;
    }
    this.catalogService.loadCatalogItem(fill.dataSourceKey, id).subscribe({
      next: (item) => {
        if (!item) {
          return;
        }
        for (const mapping of fill.mappings) {
          const control = this.findControl(mapping.fieldKey);
          if (!control) {
            continue;
          }
          const value = item[mapping.from];
          const next = value == null ? '' : value;
          if (control.value !== next) {
            control.setValue(next, { emitEvent: false });
          }
        }
        this.flatValues = this.flattenRootValues();
        this.visibleFields = this.step.fields.filter(
          (f) => f.uiType !== 'document-config-section' && isFieldVisible(f, this.flatValues),
        );
        this.syncMirroredFields();
      },
    });
  }

  private findControl(fieldKey: string): AbstractControl | null {
    const local = this.stepForm.get(fieldKey);
    if (local) {
      return local;
    }
    for (const step of this.config.steps) {
      const group = this.rootForm.get(step.stepKey) as FormGroup | null;
      const ctrl = group?.get(fieldKey) ?? null;
      if (ctrl) {
        return ctrl;
      }
    }
    return null;
  }

  languageArray(fieldKey: string): FormArray {
    return this.stepForm.get(fieldKey) as FormArray;
  }

  questionnaireGroup(fieldKey: string): FormGroup {
    return this.stepForm.get(fieldKey) as FormGroup;
  }

  private refreshVisibleFields(): void {
    this.flatValues = this.flattenRootValues();
    this.visibleFields = this.step.fields.filter(
      (f) => f.uiType !== 'document-config-section' && isFieldVisible(f, this.flatValues),
    );
    this.syncMirroredFields();
  }

  private flattenRootValues(): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    for (const s of this.config.steps) {
      const group = this.rootForm.get(s.stepKey) as FormGroup | null;
      if (!group) {
        continue;
      }
      for (const key of Object.keys(group.controls)) {
        const ctrl = group.get(key);
        values[key] = ctrl instanceof FormGroup || ctrl instanceof FormArray ? ctrl.getRawValue() : ctrl?.value;
      }
    }
    return values;
  }

  private loadFieldOptions(): void {
    for (const field of this.step.fields) {
      if (
        !field.dataSourceKey ||
        field.uiType === 'document-grid' ||
        field.uiType === 'language-grid' ||
        field.uiType === 'questionnaire-picker'
      ) {
        continue;
      }
      if (['states', 'municipalities', 'neighborhoods', 'clients'].includes(field.dataSourceKey)) {
        continue;
      }
      this.loadingByField[field.fieldKey] = true;
      this.catalogService.loadOptions(field.dataSourceKey, { countryId: this.countryId }).subscribe({
        next: (opts) => {
          this.optionsByField[field.fieldKey] = opts;
          this.loadingByField[field.fieldKey] = false;
        },
        error: () => {
          this.optionsByField[field.fieldKey] = [];
          this.loadingByField[field.fieldKey] = false;
        },
      });
    }
    if (this.step.fields.some((f) => f.uiType === 'document-grid')) {
      this.loadingByField['__documents__'] = true;
      this.catalogService.loadOptions('document-types', { countryId: this.countryId }).subscribe({
        next: (opts) => {
          this.documentTypeOptions = opts;
          this.loadingByField['__documents__'] = false;
        },
        error: () => {
          this.documentTypeOptions = [];
          this.loadingByField['__documents__'] = false;
        },
      });
    }
    this.loadStates();
  }

  private loadExamOptions(): void {
    const questionnaireField = this.step?.fields.find((f) => f.uiType === 'questionnaire-picker');
    if (!questionnaireField) {
      return;
    }
    this.loadingByField[questionnaireField.fieldKey] = true;
    this.catalogService.loadOptions('exams', {}).subscribe({
      next: (opts) => {
        this.optionsByField[questionnaireField.fieldKey] = opts;
        this.loadingByField[questionnaireField.fieldKey] = false;
      },
      error: () => {
        this.optionsByField[questionnaireField.fieldKey] = [];
        this.loadingByField[questionnaireField.fieldKey] = false;
      },
    });
  }

  private loadStates(): void {
    if (!this.countryId || !this.step.fields.some((f) => f.fieldKey === 'stateId')) {
      return;
    }
    this.catalogService.loadOptions('states', { countryId: this.countryId }).subscribe({
      next: (opts) => {
        this.states = opts;
      },
    });
  }

  private setupGeographyCascade(): void {
    const stateCtrl = this.stepForm.get('stateId');
    const municipalityCtrl = this.stepForm.get('municipalityId');
    const postalCtrl = this.stepForm.get('postalCode');
    const neighborhoodCtrl = this.stepForm.get('neighborhoodId');

    stateCtrl?.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((stateId: number | null) => {
        this.municipalities = [];
        municipalityCtrl?.reset(null, { emitEvent: false });
        neighborhoodCtrl?.reset(null, { emitEvent: false });
        this.neighborhoods = [];
        if (stateId != null) {
          this.catalogService.loadOptions('municipalities', { stateId }).subscribe({
            next: (opts) => {
              this.municipalities = opts;
            },
          });
        }
      });

    municipalityCtrl?.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((municipalityId: number | null) => {
        if (municipalityId == null) {
          return;
        }
        const municipality = this.municipalities.find((m) => m.id === municipalityId);
        const cityCtrl = this.stepForm.get('city');
        if (cityCtrl && municipality) {
          cityCtrl.patchValue(municipality.label, { emitEvent: false });
        }
        const postalCode = postalCtrl?.value as string | undefined;
        if (postalCode && postalCode.length >= 4) {
          this.loadNeighborhoods(postalCode);
        }
      });

    postalCtrl?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((cp) => !!cp && String(cp).length >= 4),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((postalCode) => {
        neighborhoodCtrl?.reset(null, { emitEvent: false });
        this.loadNeighborhoods(String(postalCode));
      });
  }

  private loadNeighborhoods(postalCode: string): void {
    this.catalogService.loadOptions('neighborhoods', { postalCode }).subscribe({
      next: (opts) => {
        this.neighborhoods = opts;
      },
    });
  }

  addLanguageRow(fieldKey: string): void {
    const array = this.languageArray(fieldKey);
    array.push(
      this.fb.nonNullable.group({
        languageId: [null as number | null],
        languageLevelId: [null as number | null],
      }),
    );
    array.updateValueAndValidity({ emitEvent: false });
  }

  removeLanguageRow(fieldKey: string, index: number): void {
    const array = this.languageArray(fieldKey);
    if (array.length > 1) {
      array.removeAt(index);
      array.updateValueAndValidity({ emitEvent: true });
    }
  }

  languageOptions(): WizardFieldOption[] {
    return this.optionsByField['__languages__'] ?? [];
  }

  languageLevelOptions(): WizardFieldOption[] {
    return this.optionsByField['__languageLevels__'] ?? [];
  }

  toggleLegacyDocument(fieldKey: string, documentTypeId: number, checked: boolean): void {
    const control = this.stepForm.get(fieldKey) as FormControl<number[]>;
    const current = control.value ?? [];
    control.setValue(checked ? [...current, documentTypeId] : current.filter((id) => id !== documentTypeId));
  }

  isLegacyDocumentSelected(fieldKey: string, documentTypeId: number): boolean {
    const control = this.stepForm.get(fieldKey) as FormControl<number[]>;
    return (control.value ?? []).includes(documentTypeId);
  }

  private static readonly GENERAL_REQUIREMENTS_BLOCK_KEYS = [
    'jobDescription',
    'requirementsMandatory',
    'requirementsOptional',
    'requirementsDesirable',
  ] as const;

  readonly jobRequirementSectionTitle = $localize`:@@requisition.section.jobRequirement:Requerimiento del Empleo`;

  /** Side-by-side block when jobDescription + three requirements are all visible. */
  get generalRequirementsBlock(): {
    jobDescription: ResolvedRequisitionFormField;
    requirementsMandatory: ResolvedRequisitionFormField;
    requirementsOptional: ResolvedRequisitionFormField;
    requirementsDesirable: ResolvedRequisitionFormField;
  } | null {
    const byKey = new Map(this.visibleFields.map((f) => [f.fieldKey, f]));
    const jobDescription = byKey.get('jobDescription');
    const requirementsMandatory = byKey.get('requirementsMandatory');
    const requirementsOptional = byKey.get('requirementsOptional');
    const requirementsDesirable = byKey.get('requirementsDesirable');
    if (!jobDescription || !requirementsMandatory || !requirementsOptional || !requirementsDesirable) {
      return null;
    }
    return { jobDescription, requirementsMandatory, requirementsOptional, requirementsDesirable };
  }

  isGeneralRequirementsBlockStart(field: ResolvedRequisitionFormField): boolean {
    return field.fieldKey === 'jobDescription' && this.generalRequirementsBlock !== null;
  }

  isConsumedByGeneralRequirementsBlock(fieldKey: string): boolean {
    if (!this.generalRequirementsBlock) {
      return false;
    }
    return (DynamicWizardStepComponent.GENERAL_REQUIREMENTS_BLOCK_KEYS as readonly string[]).includes(
      fieldKey,
    );
  }

  fieldLabel(field: ResolvedRequisitionFormField): string {
    return resolveWizardFieldLabel(field.fieldKey, field.labelI18nKey);
  }

  isClientSearchField(field: ResolvedRequisitionFormField): boolean {
    return field.fieldKey === CLIENT_ID_FIELD_KEY || field.dataSourceKey === 'clients';
  }

  /** Config-only document sections: visible when configured and marked visible (default true if absent). */
  documentSectionVisible(fieldKey: string): boolean {
    const field = this.step.fields.find((f) => f.fieldKey === fieldKey);
    if (!field) {
      return true;
    }
    return isFieldVisible(field, this.flatValues);
  }

  documentSectionReadOnly(fieldKey: string): boolean {
    const field = this.step.fields.find((f) => f.fieldKey === fieldKey);
    if (!field) {
      return false;
    }
    return isFieldReadOnly(field, this.flatValues);
  }
}
