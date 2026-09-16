import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import type { MatDateFormats } from '@angular/material/core';
import { formatDateToDdMmYyyy, parseDateInput } from './date-value.util';

/** Native adapter that parses and displays calendar dates as dd/MM/yyyy. */
@Injectable()
export class DmyDateAdapter extends NativeDateAdapter {
  override parse(value: unknown, _parseFormat?: unknown): Date | null {
    return parseDateInput(value);
  }

  override format(date: Date, displayFormat: unknown): string {
    if (!this.isValid(date)) {
      return '';
    }
    if (displayFormat === 'DD/MM/YYYY') {
      return formatDateToDdMmYyyy(date) ?? '';
    }
    if (displayFormat && typeof displayFormat === 'object') {
      return super.format(date, displayFormat);
    }
    return formatDateToDdMmYyyy(date) ?? '';
  }
}

export const DMY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};
