import {
  Component,
  DestroyRef,
  forwardRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { CatalogClientService } from '../../../core/services/catalog-client.service';
import { CatalogClient } from '../../models/catalog-client.model';

interface ClientOption {
  id: number;
  label: string;
  /** Same semantics as Positions list filter (companyArea / legalName / …). */
  filterValue: string;
}

/**
 * Client typeahead for report filters — same UX as Positions table
 * ({@link CatalogClientService.searchByCompanyArea}).
 * Form value = filter string sent as `clientKey` to report APIs.
 */
@Component({
  selector: 'sh-client-filter-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './client-filter-field.component.html',
  styleUrl: './client-filter-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClientFilterFieldComponent),
      multi: true,
    },
  ],
})
export class ClientFilterFieldComponent implements OnInit, ControlValueAccessor {
  private readonly catalogClientService = inject(CatalogClientService);
  private readonly destroyRef = inject(DestroyRef);

  readonly clientSearch = new FormControl<string | ClientOption>('', { nonNullable: true });
  clientOptions: ClientOption[] = [];
  private selectedFilter = '';

  private onChange: (value: string) => void = () => undefined;
  onTouched: () => void = () => undefined;

  readonly displayClientFn = (option: ClientOption | string | null): string => {
    if (!option) {
      return '';
    }
    return typeof option === 'string' ? option : option.label;
  };

  ngOnInit(): void {
    this.clientSearch.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged((a, b) => this.clientSearchText(a) === this.clientSearchText(b)),
        switchMap((term) => {
          const selected = this.parseClientOption(term);
          if (selected) {
            this.setFilterValue(selected.filterValue, false);
            this.clientOptions = [selected];
            return of([selected]);
          }

          const trimmed = typeof term === 'string' ? term.trim() : '';
          if (!trimmed) {
            if (this.selectedFilter) {
              this.setFilterValue('', true);
            }
            return of([] as ClientOption[]);
          }

          if (this.selectedFilter) {
            const current = this.clientOptions.find((o) => o.filterValue === this.selectedFilter);
            if (current?.label.trim() === trimmed) {
              return of([current]);
            }
            this.setFilterValue('', false);
          }
          return this.searchClients(trimmed);
        }),
      )
      .subscribe((options) => {
        this.clientOptions = options;
      });
  }

  writeValue(value: string | null): void {
    const next = value?.trim() || '';
    this.selectedFilter = next;
    if (!next) {
      this.clientSearch.setValue('', { emitEvent: false });
      this.clientOptions = [];
      return;
    }
    // Keep typed/selected label if already showing matching option; otherwise show raw filter.
    const current = this.parseClientOption(this.clientSearch.value);
    if (current?.filterValue === next) {
      return;
    }
    this.clientSearch.setValue(next, { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.clientSearch.disable({ emitEvent: false });
    } else {
      this.clientSearch.enable({ emitEvent: false });
    }
  }

  onClientSearchFocus(): void {
    const trimmed = this.clientSearchText(this.clientSearch.value);
    if (trimmed.length > 0) {
      return;
    }
    this.searchClients('').subscribe((options) => {
      this.clientOptions = options;
    });
  }

  onClientSelected(event: MatAutocompleteSelectedEvent): void {
    const option = this.parseClientOption(event.option.value);
    if (!option) {
      return;
    }
    this.clientSearch.setValue(option, { emitEvent: false });
    this.clientOptions = [option];
    this.setFilterValue(option.filterValue, true);
  }

  clearClientFilter(): void {
    this.clientSearch.setValue('', { emitEvent: false });
    this.clientOptions = [];
    this.setFilterValue('', true);
    this.onTouched();
  }

  private setFilterValue(value: string, emit: boolean): void {
    this.selectedFilter = value;
    if (emit) {
      this.onChange(value);
    } else {
      this.onChange(value);
    }
  }

  private searchClients(term: string) {
    return this.catalogClientService.searchByCompanyArea(term, 20).pipe(
      map((items) =>
        items
          .filter((c) => !!this.clientDisplayName(c))
          .map((c) => ({
            id: c.id,
            label: this.clientDisplayName(c),
            filterValue: this.clientFilterValue(c),
          })),
      ),
      catchError(() => of([] as ClientOption[])),
    );
  }

  private parseClientOption(term: unknown): ClientOption | null {
    if (term == null || typeof term !== 'object' || !('id' in term) || !('label' in term) || !('filterValue' in term)) {
      return null;
    }
    const raw = term as ClientOption;
    return typeof raw.id === 'number' && typeof raw.label === 'string' && typeof raw.filterValue === 'string'
      ? raw
      : null;
  }

  private clientSearchText(value: unknown): string {
    const option = this.parseClientOption(value);
    if (option) {
      return option.label.trim();
    }
    return typeof value === 'string' ? value.trim() : '';
  }

  private clientDisplayName(client: CatalogClient): string {
    return (
      client.companyArea?.trim() ||
      client.tradeName?.trim() ||
      client.legalName?.trim() ||
      client.code
    );
  }

  private clientFilterValue(client: CatalogClient): string {
    return (
      client.companyArea?.trim() ||
      client.legalName?.trim() ||
      client.tradeName?.trim() ||
      client.code
    );
  }
}
