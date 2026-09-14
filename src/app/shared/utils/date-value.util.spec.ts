import { formatDateToDdMmYyyy, formatDateToIso, parseDateInput } from './date-value.util';

describe('parseDateInput', () => {
  it('parses ISO YYYY-MM-DD', () => {
    const date = parseDateInput('2026-09-14');
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(8);
    expect(date?.getDate()).toBe(14);
  });

  it('parses dd/MM/yyyy and d/m/yy as day-first', () => {
    expect(formatDateToIso('14/09/2026')).toBe('2026-09-14');
    expect(formatDateToIso('1/2/26')).toBe('2026-02-01');
    expect(formatDateToIso('01/02/2026')).toBe('2026-02-01');
  });

  it('rejects invalid calendar dates', () => {
    expect(parseDateInput('31/02/2026')).toBeNull();
  });
});

describe('formatDateToDdMmYyyy', () => {
  it('pads day and month', () => {
    expect(formatDateToDdMmYyyy('2026-01-08')).toBe('08/01/2026');
    expect(formatDateToDdMmYyyy('2026-09-14')).toBe('14/09/2026');
  });
});
