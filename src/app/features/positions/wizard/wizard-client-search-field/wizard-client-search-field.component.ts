import {
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { WizardFieldCatalogService } from '../../../../core/services/wizard-field-catalog.service';
import {
  REQUISITION_WIZARD_CLIENT_SEARCH_CLEAR,
  REQUISITION_WIZARD_CLIENT_SEARCH_NO_COUNTRY,
  REQUISITION_WIZARD_CLIENT_SEARCH_NO_RESULTS,
  REQUISITION_WIZARD_CLIENT_SEARCH_PLACEHOLDER,
} from '../../../../core/i18n/requisition-wizard-labels';
import { catalogClientOptionLabel } from '../../../../shared/constants/requisition-client-catalog-fill';
import { WizardFieldOption } from '../../../../shared/models/requisition-wizard.model';

@Component({
  selector: 'sh-wizard-client-search-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './wizard-client-search-field.component.html',
  styleUrl: './wizard-client-search-field.component.scss',
})
export class WizardClientSearchFieldComponent implements OnInit, OnChanges {
  private readonly catalogService = inject(WizardFieldCatalogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly controlStop$ = new Subject<void>();

  @Input({ required: true }) control!: FormControl;
  @Input() countryId: number | null = null;
  @Input() disabled = false;
  @Input() label = '';

  readonly searchCtrl = new FormControl<string | WizardFieldOption>('', { nonNullable: true });
  options: WizardFieldOption[] = [];
  loading = false;
  searched = false;

  readonly placeholder = REQUISITION_WIZARD_CLIENT_SEARCH_PLACEHOLDER;
  readonly noCountryHint = REQUISITION_WIZARD_CLIENT_SEARCH_NO_COUNTRY;
  readonly noResultsLabel = REQUISITION_WIZARD_CLIENT_SEARCH_NO_RESULTS;
  readonly clearLabel = REQUISITION_WIZARD_CLIENT_SEARCH_CLEAR;

  readonly displayFn = (option: WizardFieldOption | string | null): string => {
    if (!option) {
      return '';
    }
    return typeof option === 'string' ? option : option.label;
  };

  ngOnInit(): void {
    this.applyDisabled();
    this.bindControl();
    this.searchCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged((a, b) => this.searchText(a) === this.searchText(b)),
        switchMap((term) => {
          const selected = this.parseOption(term);
          if (selected) {
            this.setClientId(selected.id);
            this.options = [selected];
            this.searched = true;
            return of(this.options);
          }

          const trimmed = typeof term === 'string' ? term.trim() : '';
          const currentId = this.numericId(this.control.value);
          if (currentId != null) {
            const currentLabel = this.searchText(this.searchCtrl.value);
            if (!trimmed || currentLabel !== this.selectedLabel(currentId)) {
              this.setClientId(null);
            }
          }

          return this.runSearch(trimmed);
        }),
      )
      .subscribe((options) => {
        this.options = options;
        this.loading = false;
        this.searched = true;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control'] && this.control && !changes['control'].firstChange) {
      this.bindControl();
    }
    if (changes['disabled'] || changes['countryId']) {
      this.applyDisabled();
    }
    if (changes['countryId'] && !changes['countryId'].firstChange) {
      const selected = this.parseOption(this.searchCtrl.value);
      if (selected && this.numericId(this.control.value) === selected.id) {
        return;
      }
      const text = this.searchText(this.searchCtrl.value);
      this.runSearch(text).subscribe((options) => {
        this.options = options;
        this.loading = false;
        this.searched = true;
      });
    }
  }

  onFocus(): void {
    if (this.disabled || this.countryId == null) {
      return;
    }
    if (this.parseOption(this.searchCtrl.value)) {
      return;
    }
    this.runSearch(this.searchText(this.searchCtrl.value)).subscribe((options) => {
      this.options = options;
      this.loading = false;
      this.searched = true;
    });
  }

  onSelected(event: MatAutocompleteSelectedEvent): void {
    const option = this.parseOption(event.option.value);
    if (!option) {
      return;
    }
    this.searchCtrl.setValue(option, { emitEvent: false });
    this.options = [option];
    this.setClientId(option.id);
  }

  clear(): void {
    this.searchCtrl.setValue('', { emitEvent: false });
    this.options = [];
    this.searched = false;
    this.setClientId(null);
    this.control.markAsTouched();
  }

  private bindControl(): void {
    this.controlStop$.next();
    this.syncFromControl(this.control.value);
    this.control.valueChanges
      .pipe(takeUntil(this.controlStop$), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.syncFromControl(value));
  }

  private runSearch(term: string) {
    if (this.countryId == null) {
      this.loading = false;
      return of([] as WizardFieldOption[]);
    }
    this.loading = true;
    return this.catalogService.searchClients(this.countryId, term).pipe(
      catchError(() => of([] as WizardFieldOption[])),
    );
  }

  private syncFromControl(raw: unknown): void {
    const id = this.numericId(raw);
    if (id == null) {
      if (!this.parseOption(this.searchCtrl.value) && this.searchText(this.searchCtrl.value)) {
        return;
      }
      if (!this.searchText(this.searchCtrl.value)) {
        return;
      }
      if (this.parseOption(this.searchCtrl.value)) {
        this.searchCtrl.setValue('', { emitEvent: false });
      }
      return;
    }
    const current = this.parseOption(this.searchCtrl.value);
    if (current?.id === id) {
      return;
    }
    const fromOptions = this.options.find((option) => option.id === id);
    if (fromOptions) {
      this.searchCtrl.setValue(fromOptions, { emitEvent: false });
      return;
    }
    this.catalogService.loadCatalogItem('clients', id).subscribe((item) => {
      if (!item) {
        return;
      }
      const option: WizardFieldOption = {
        id,
        label: catalogClientOptionLabel({
          id,
          code: typeof item['code'] === 'string' ? item['code'] : null,
          tradeName: typeof item['tradeName'] === 'string' ? item['tradeName'] : null,
          legalName: typeof item['legalName'] === 'string' ? item['legalName'] : null,
          companyArea: typeof item['companyArea'] === 'string' ? item['companyArea'] : null,
        }),
      };
      this.searchCtrl.setValue(option, { emitEvent: false });
      this.options = [option];
    });
  }

  private selectedLabel(id: number): string {
    const current = this.parseOption(this.searchCtrl.value);
    if (current?.id === id) {
      return current.label.trim();
    }
    return this.options.find((option) => option.id === id)?.label.trim() ?? '';
  }

  private setClientId(id: number | null): void {
    const current = this.numericId(this.control.value);
    if (current === id) {
      return;
    }
    this.control.setValue(id);
    this.control.markAsDirty();
  }

  private applyDisabled(): void {
    const disable = this.disabled || this.countryId == null;
    if (disable) {
      this.searchCtrl.disable({ emitEvent: false });
    } else {
      this.searchCtrl.enable({ emitEvent: false });
    }
  }

  private parseOption(term: unknown): WizardFieldOption | null {
    if (term == null || typeof term !== 'object' || !('id' in term) || !('label' in term)) {
      return null;
    }
    const raw = term as WizardFieldOption;
    return typeof raw.id === 'number' && typeof raw.label === 'string' ? raw : null;
  }

  private searchText(value: unknown): string {
    const option = this.parseOption(value);
    if (option) {
      return option.label.trim();
    }
    return typeof value === 'string' ? value.trim() : '';
  }

  private numericId(raw: unknown): number | null {
    if (raw == null || raw === '') {
      return null;
    }
    const id = typeof raw === 'number' ? raw : Number(raw);
    return Number.isNaN(id) ? null : id;
  }
}
