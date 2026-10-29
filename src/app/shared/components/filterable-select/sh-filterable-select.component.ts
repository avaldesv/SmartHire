import {
  Component,
  DoCheck,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  Input,
  Output,
  EventEmitter,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule, SubscriptSizing } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';

/** Normalized option rendered inside the select panel. */
interface FilterableSelectItem {
  key: number;
  value: unknown;
  label: string;
  disabled: boolean;
}

interface FilterableSelectRow {
  item: FilterableSelectItem;
  /** Selected option that does not match the current filter: kept in the DOM (hidden) so the selection is preserved. */
  hidden: boolean;
}

/** Minimal shape of the `MatSelect` internal key manager (used to hand keyboard focus from the filter to the list). */
interface SelectKeyManagerLike {
  setFirstItemActive(): void;
}

/** Payload emitted by `selectionChange` (same `value` contract as `MatSelectChange`). */
export interface ShFilterableSelectChange {
  // `any` keeps drop-in compatibility with handlers previously typed against `MatSelectChange`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

/** Case-insensitive, accent-insensitive normalization used by the CONTAINS match. */
function foldText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Business `mat-select` with a filter box inside the panel (single and multiple).
 *
 * - Match: case-insensitive CONTAINS on the visible label.
 * - Works with `formControlName` / `[formControl]` / `ngModel`, or with `[value]` + `(selectionChange)`.
 * - Options are plain objects: `[options]="rows" valueField="id" labelField="name"`
 *   (defaults: `value` / `label`; `[valueField]="null"` uses the item itself as value;
 *   `[labelFn]` overrides `labelField`).
 * - `emptyLabel` adds a leading `null` option (e.g. "All" or "—").
 * - `loading` disables the field and renders a disabled loading option.
 */
@Component({
  selector: 'sh-filterable-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './sh-filterable-select.component.html',
  styleUrl: './sh-filterable-select.component.scss',
})
export class ShFilterableSelectComponent implements ControlValueAccessor, DoCheck {
  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  /** Floating label of the form field. */
  readonly label = input('');
  readonly placeholder = input('');
  /** Source rows (any shape; see `valueField` / `labelField` / `labelFn`). */
  readonly options = input<readonly unknown[] | null | undefined>([]);
  /** Property used as option value; `null` uses the row itself. */
  readonly valueField = input<string | null>('value');
  /** Property used when `valueField` is empty on a row (e.g. `code` falling back to `id`). */
  readonly valueFallbackField = input<string | null>(null);
  /** Property used as visible label (ignored when `labelFn` is set); `null` uses `String(row)`. */
  readonly labelField = input<string | null>('label');
  /** Property used when `labelField` is empty (e.g. `description` falling back to `code`). */
  readonly labelFallbackField = input<string | null>(null);
  /** Value of the optional leading "empty" option (default `null`; some filters use `0`). */
  readonly emptyValue = input<unknown>(null);
  /** Custom visible label (must be a stable function reference to avoid recomputation). */
  readonly labelFn = input<((option: never) => string) | null>(null);
  /** When set, a leading option with `null` value is rendered using this label. */
  readonly emptyLabel = input<string | null>(null);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  /** Disables the field and renders a disabled loading option instead of the list. */
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingLabel = input('');
  readonly subscriptSizing = input<SubscriptSizing>('fixed');
  /** Text rendered in `mat-error` when the bound control is invalid and touched. */
  readonly errorText = input('');
  /** Overrides the default i18n filter placeholder. */
  readonly searchPlaceholder = input<string | null>(null);
  /** Overrides the default i18n empty-state text. */
  readonly noResultsLabel = input<string | null>(null);

  /** Emits after the user changes the selection (`value` mirrors `MatSelectChange`). */
  @Output() readonly selectionChange = new EventEmitter<ShFilterableSelectChange>();
  /** Enables `[(value)]` two-way binding. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly valueChange = new EventEmitter<any>();

  readonly defaultSearchPlaceholder = $localize`:@@filterableSelect.search:Buscar…`;
  readonly defaultNoResultsLabel = $localize`:@@filterableSelect.noResults:Sin resultados`;
  readonly defaultRequiredError = $localize`:@@filterableSelect.required:Campo obligatorio`;

  private readonly matSelect = viewChild(MatSelect);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private readonly currentValue = signal<unknown>(null);
  private readonly cvaDisabled = signal(false);
  readonly filterText = signal('');

  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled() || this.loading());

  readonly selectValue = computed(() => {
    const value = this.currentValue();
    if (this.multiple()) {
      return Array.isArray(value) ? value : [];
    }
    return value === undefined ? null : value;
  });

  private readonly items = computed<FilterableSelectItem[]>(() => {
    const valueField = this.valueField();
    const labelField = this.labelField();
    const valueFallback = this.valueFallbackField();
    const fallbackField = this.labelFallbackField();
    const labelFn = this.labelFn() as ((option: unknown) => string) | null;
    const result: FilterableSelectItem[] = [];
    const empty = this.emptyLabel();
    if (empty !== null && empty !== undefined) {
      result.push({ key: 0, value: this.emptyValue(), label: empty, disabled: false });
    }
    for (const option of this.options() ?? []) {
      const record = (option ?? {}) as Record<string, unknown>;
      let label: unknown;
      if (labelFn) {
        label = labelFn(option);
      } else if (labelField === null) {
        label = option;
      } else {
        label = record[labelField];
        if ((label === null || label === undefined || label === '') && fallbackField) {
          label = record[fallbackField];
        }
      }
      let value: unknown;
      if (valueField === null) {
        value = option;
      } else {
        value = record[valueField];
        if ((value === null || value === undefined || value === '') && valueFallback) {
          value = record[valueFallback];
        }
      }
      result.push({
        key: result.length,
        value,
        label: label === null || label === undefined ? '' : String(label),
        disabled: record['disabled'] === true,
      });
    }
    return result;
  });

  private readonly selectedValues = computed<unknown[]>(() => {
    const value = this.selectValue();
    if (Array.isArray(value)) {
      return value;
    }
    return value === null ? [] : [value];
  });

  readonly rows = computed<FilterableSelectRow[]>(() => {
    const query = foldText(this.filterText());
    const selected = this.selectedValues();
    const rows: FilterableSelectRow[] = [];
    for (const item of this.items()) {
      if (!query || foldText(item.label).includes(query)) {
        rows.push({ item, hidden: false });
      } else if (selected.includes(item.value)) {
        rows.push({ item, hidden: true });
      }
    }
    return rows;
  });

  readonly hasMatches = computed(() => this.rows().some((row) => !row.hidden));

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (_control, form) => {
      const control = this.ngControl?.control;
      return !!control && control.invalid && (control.touched || !!form?.submitted);
    },
  };

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Plain `[value]` binding for usages without a form control (pair with `(selectionChange)`). */
  @Input()
  set value(value: unknown) {
    this.currentValue.set(value);
  }

  get isRequired(): boolean {
    const control = this.ngControl?.control;
    return (
      this.required() ||
      !!control?.hasValidator(Validators.required) ||
      !!control?.errors?.['required']
    );
  }

  /** Parent CVA may be marked touched without MatSelect noticing (no ngControl on the inner select). */
  get showError(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && control.touched;
  }

  get resolvedErrorText(): string {
    return this.errorText() || this.defaultRequiredError;
  }

  ngDoCheck(): void {
    // MatSelect has no FormControl of its own; force errorState from the host CVA control.
    this.matSelect()?.updateErrorState();
  }

  writeValue(value: unknown): void {
    this.currentValue.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  onSelectionChange(event: { value: unknown }): void {
    this.commit(event.value);
  }

  onOpenedChange(opened: boolean): void {
    if (opened) {
      setTimeout(() => this.searchInput()?.nativeElement.focus());
      return;
    }
    this.filterText.set('');
    this.onTouched();
  }

  onFilterInput(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  onFilterKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'Tab') {
      return;
    }
    // Keep typing inside the filter: the panel would otherwise run type-ahead / toggle options.
    event.stopPropagation();
    const select = this.matSelect();
    if (!select) {
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      select.focus();
      (select as unknown as { _keyManager?: SelectKeyManagerLike })._keyManager?.setFirstItemActive();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.multiple()) {
        const first = this.rows().find((row) => !row.hidden && !row.item.disabled);
        if (first) {
          this.currentValue.set(first.item.value);
          this.commit(first.item.value);
          select.close();
        }
      }
    }
  }

  /** Focus the select trigger (e.g. after jumping to an invalid step). */
  focus(): void {
    this.matSelect()?.focus();
  }

  private commit(value: unknown): void {
    this.currentValue.set(value);
    this.onChange(value);
    this.selectionChange.emit({ value });
    this.valueChange.emit(value);
  }
}
