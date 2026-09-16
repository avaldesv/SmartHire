import {
  combineDateAndTime,
  isIncompleteDateTimePair,
  splitIsoDateTime,
} from './exam-form.util';

describe('isIncompleteDateTimePair', () => {
  it('is complete when both empty or both filled', () => {
    expect(isIncompleteDateTimePair('', '')).toBeFalse();
    expect(isIncompleteDateTimePair(null, undefined)).toBeFalse();
    expect(isIncompleteDateTimePair('2026-09-14', '09:00')).toBeFalse();
  });

  it('is incomplete when only date or only time is set', () => {
    expect(isIncompleteDateTimePair('2026-09-14', '')).toBeTrue();
    expect(isIncompleteDateTimePair('', '09:00')).toBeTrue();
  });
});

describe('combineDateAndTime', () => {
  it('returns null when date or time is missing instead of inventing midnight', () => {
    expect(combineDateAndTime('2026-09-14', '')).toBeNull();
    expect(combineDateAndTime('2026-09-14', null)).toBeNull();
    expect(combineDateAndTime('', '09:00')).toBeNull();
  });

  it('round-trips a local date and time through ISO', () => {
    const iso = combineDateAndTime('2026-09-14', '09:00');
    expect(iso).toBeTruthy();
    const split = splitIsoDateTime(iso);
    expect(split.date).toBe('2026-09-14');
    expect(split.time).toBe('09:00');
  });
});
