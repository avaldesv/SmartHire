import { Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
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
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { WizardFieldCatalogService } from '../../../../core/services/wizard-field-catalog.service';
import {
  ResolvedRequisitionFormConfig,
  ResolvedRequisitionFormField,
  ResolvedRequisitionFormStep,
  WizardDocumentRequirementRow,
  WizardFieldOption,
} from '../../../../shared/models/requisition-wizard.model';
import { isFieldReadOnly, isFieldVisible, fieldValueFrom } from '../dynamic-wizard-rules.util';
import { resolveWizardFieldLabel } from '../requisition-wizard-labels';
import { DynamicWizardFieldComponent } from '../dynamic-wizard-field/dynamic-wizard-field.component';
import { JobDescriptionAiFieldComponent } from '../job-description-ai-field/job-description-ai-field.component';

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
    JobDescriptionAiFieldComponent,
  ],
  templateUrl: './dynamic-wizard-step.component.html',
  styleUrl: './dynamic-wizard-step.component.scss',
})
export class DynamicWizardStepComponent implements OnInit, OnChanges {
  private readonly catalogService = inject(WizardFieldCatalogService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly documentColumnLabel = $localize`:@@requisition.documents.columnDocument:Documento`;
  readonly documentRequiredLabel = $localize`:@@requisition.documents.required:Obligatorio`;

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

  ngOnInit(): void {
    this.rootForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.flatValues = this.flattenRootValues();
      this.visibleFields = this.step.fields.filter((f) => isFieldVisible(f, this.flatValues));
      this.syncMirroredFields();
    });
    this.flatValues = this.flattenRootValues();
    this.visibleFields = this.step.fields.filter((f) => isFieldVisible(f, this.flatValues));
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

    const questionnaireField = this.step.fields.find((f) => f.uiType === 'questionnaire-picker');
    if (questionnaireField) {
      this.loadingByField[questionnaireField.fieldKey] = true;
      this.catalogService.loadOptions('questionnaires', {}).subscribe({
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stepForm'] || changes['config'] || changes['step']) {
      this.refreshVisibleFields();
      this.loadFieldOptions();
      if (!this.geographySetup) {
        this.setupGeographyCascade();
        this.geographySetup = true;
      }
      this.syncDocumentGrid();
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
    return isFieldReadOnly(field);
  }

  private syncMirroredFields(): void {
    for (const field of this.step.fields) {
      const sourceKey = fieldValueFrom(field);
      if (!sourceKey) {
        continue;
      }
      const control = this.stepForm.get(field.fieldKey);
      if (!control) {
        continue;
      }
      const sourceValue = this.flatValues[sourceKey] ?? '';
      if (control.value !== sourceValue) {
        control.setValue(sourceValue, { emitEvent: false });
      }
      if (isFieldReadOnly(field) && control.enabled) {
        control.disable({ emitEvent: false });
      }
    }
  }

  languageArray(fieldKey: string): FormArray {
    return this.stepForm.get(fieldKey) as FormArray;
  }

  questionnaireGroup(fieldKey: string): FormGroup {
    return this.stepForm.get(fieldKey) as FormGroup;
  }

  private refreshVisibleFields(): void {
    this.flatValues = this.flattenRootValues();
    this.visibleFields = this.step.fields.filter((f) => isFieldVisible(f, this.flatValues));
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
      if (!field.dataSourceKey || field.uiType === 'document-grid' || field.uiType === 'language-grid') {
        continue;
      }
      if (['states', 'municipalities', 'neighborhoods'].includes(field.dataSourceKey)) {
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
          this.syncDocumentGrid();
        },
        error: () => {
          this.documentTypeOptions = [];
          this.loadingByField['__documents__'] = false;
        },
      });
    }
    this.loadStates();
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

  private syncDocumentGrid(): void {
    const docField = this.step.fields.find(
      (f) => f.uiType === 'document-grid' && f.fieldKey === 'documentRequirements',
    );
    if (!docField) {
      return;
    }
    const control = this.stepForm.get(docField.fieldKey) as FormControl<WizardDocumentRequirementRow[]> | null;
    const current = control?.value ?? [];
    const selectedMap = new Map(current.map((r) => [r.documentTypeId, r]));
    const rows = this.documentTypeOptions.map((opt) => {
      const existing = selectedMap.get(opt.id);
      return existing ?? { documentTypeId: opt.id, isRequired: false, selected: false };
    });
    control?.setValue(rows, { emitEvent: false });
  }

  toggleDocumentSelected(fieldKey: string, documentTypeId: number, checked: boolean): void {
    const control = this.stepForm.get(fieldKey) as FormControl<WizardDocumentRequirementRow[]>;
    const rows = [...(control.value ?? [])];
    const index = rows.findIndex((r) => r.documentTypeId === documentTypeId);
    if (index >= 0) {
      rows[index] = { ...rows[index], selected: checked };
    } else {
      rows.push({ documentTypeId, isRequired: false, selected: checked });
    }
    control.setValue(rows);
  }

  toggleDocumentRequired(fieldKey: string, documentTypeId: number, required: boolean): void {
    const control = this.stepForm.get(fieldKey) as FormControl<WizardDocumentRequirementRow[]>;
    const rows = [...(control.value ?? [])];
    const index = rows.findIndex((r) => r.documentTypeId === documentTypeId);
    if (index >= 0) {
      rows[index] = { ...rows[index], isRequired: required };
      control.setValue(rows);
    }
  }

  isDocumentSelected(fieldKey: string, documentTypeId: number): boolean {
    const control = this.stepForm.get(fieldKey) as FormControl<WizardDocumentRequirementRow[]>;
    return (control.value ?? []).some((r) => r.documentTypeId === documentTypeId && r.selected);
  }

  isDocumentRequired(fieldKey: string, documentTypeId: number): boolean {
    const control = this.stepForm.get(fieldKey) as FormControl<WizardDocumentRequirementRow[]>;
    return (control.value ?? []).find((r) => r.documentTypeId === documentTypeId)?.isRequired ?? false;
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

  fieldLabel(field: ResolvedRequisitionFormField): string {
    return resolveWizardFieldLabel(field.fieldKey, field.labelI18nKey);
  }
}
