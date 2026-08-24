import { Component, DestroyRef, LOCALE_ID, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import * as L from 'leaflet';
import { FEEDBACK_GENERIC_WARNING_TITLE } from '../../../core/i18n/feedback-labels';
import { FeedbackDialogService } from '../../../core/feedback/feedback-dialog.service';
import {
  INTERVIEW_CAL_ADDRESS,
  INTERVIEW_CAL_CANCEL,
  INTERVIEW_CAL_CLOSE,
  INTERVIEW_CAL_DAY_FRI,
  INTERVIEW_CAL_DAY_MON,
  INTERVIEW_CAL_DAY_THU,
  INTERVIEW_CAL_DAY_TUE,
  INTERVIEW_CAL_DAY_WED,
  INTERVIEW_CAL_DURATION,
  INTERVIEW_CAL_END,
  INTERVIEW_CAL_EXCLUDE_HOLIDAYS,
  INTERVIEW_CAL_GRID,
  INTERVIEW_CAL_INSTRUCTIONS,
  INTERVIEW_CAL_INSTRUCTIONS_PLACEHOLDER,
  INTERVIEW_CAL_LOAD_ERROR,
  INTERVIEW_CAL_LOCATE_ADDRESS,
  INTERVIEW_CAL_GEOCODE_ERROR,
  INTERVIEW_CAL_ADDRESS_REQUIRED,
  INTERVIEW_CAL_ADDRESS_PLACEHOLDER,
  INTERVIEW_CAL_MAP,
  INTERVIEW_CAL_MAP_HINT,
  INTERVIEW_CAL_MAX_DAYS,
  INTERVIEW_CAL_NO,
  INTERVIEW_CAL_REFERENCES,
  INTERVIEW_CAL_REFERENCES_PLACEHOLDER,
  INTERVIEW_CAL_REMINDER,
  INTERVIEW_CAL_REMINDER_15,
  INTERVIEW_CAL_REMINDER_1H,
  INTERVIEW_CAL_SAVE,
  INTERVIEW_CAL_SAVE_ERROR,
  INTERVIEW_CAL_SAVE_SUCCESS,
  INTERVIEW_CAL_START,
  INTERVIEW_CAL_TAB_IN_PERSON,
  INTERVIEW_CAL_TAB_VIDEO,
  INTERVIEW_CAL_TITLE,
  INTERVIEW_CAL_WORK_HOURS,
  INTERVIEW_CAL_YES,
  formatInterviewDurationMinutes,
} from '../../../core/i18n/interview-calendar-labels';
import { InterviewCalendarApiService } from '../../../core/services/interview-calendar-api.service';
import { InterviewAvailabilitySlot } from '../../../shared/models/interview-calendar.model';
import { defaultInterviewCalendarModalityConfig } from '../../../shared/models/interview-calendar.model';
import { merge } from 'rxjs';

@Component({
  selector: 'sh-interview-calendar-config-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './interview-calendar-config-dialog.component.html',
  styleUrl: './interview-calendar-config-dialog.component.scss',
})
export class InterviewCalendarConfigDialogComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<InterviewCalendarConfigDialogComponent>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(InterviewCalendarApiService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly localeId = inject(LOCALE_ID);
  readonly data = inject(MAT_DIALOG_DATA, { optional: true });

  readonly labels = {
    title: INTERVIEW_CAL_TITLE,
    close: INTERVIEW_CAL_CLOSE,
    tabVideo: INTERVIEW_CAL_TAB_VIDEO,
    tabInPerson: INTERVIEW_CAL_TAB_IN_PERSON,
    duration: INTERVIEW_CAL_DURATION,
    maxDays: INTERVIEW_CAL_MAX_DAYS,
    workHours: INTERVIEW_CAL_WORK_HOURS,
    start: INTERVIEW_CAL_START,
    end: INTERVIEW_CAL_END,
    reminder: INTERVIEW_CAL_REMINDER,
    reminder15: INTERVIEW_CAL_REMINDER_15,
    reminder1h: INTERVIEW_CAL_REMINDER_1H,
    exclude: INTERVIEW_CAL_EXCLUDE_HOLIDAYS,
    yes: INTERVIEW_CAL_YES,
    no: INTERVIEW_CAL_NO,
    grid: INTERVIEW_CAL_GRID,
    address: INTERVIEW_CAL_ADDRESS,
    addressPlaceholder: INTERVIEW_CAL_ADDRESS_PLACEHOLDER,
    instructions: INTERVIEW_CAL_INSTRUCTIONS,
    instructionsPlaceholder: INTERVIEW_CAL_INSTRUCTIONS_PLACEHOLDER,
    references: INTERVIEW_CAL_REFERENCES,
    referencesPlaceholder: INTERVIEW_CAL_REFERENCES_PLACEHOLDER,
    map: INTERVIEW_CAL_MAP,
    mapHint: INTERVIEW_CAL_MAP_HINT,
    locateAddress: INTERVIEW_CAL_LOCATE_ADDRESS,
    save: INTERVIEW_CAL_SAVE,
    cancel: INTERVIEW_CAL_CANCEL,
  };

  readonly dayLabels = [
    INTERVIEW_CAL_DAY_MON,
    INTERVIEW_CAL_DAY_TUE,
    INTERVIEW_CAL_DAY_WED,
    INTERVIEW_CAL_DAY_THU,
    INTERVIEW_CAL_DAY_FRI,
  ];
  readonly durationOptions = [15, 30, 45, 60];
  readonly pickerTimeOptions = this.buildPickerTimeOptions();
  gridTimeOptions: string[] = [];

  loading = true;
  saving = false;
  geocoding = false;
  virtualSlots: InterviewAvailabilitySlot[] = [];
  private map?: L.Map;
  private marker?: L.Marker;

  readonly form = this.fb.nonNullable.group({
    virtualDurationMinutes: [30],
    virtualMaxWorkingDays: [5],
    virtualWorkStartTime: ['08:00'],
    virtualWorkEndTime: ['18:00'],
    presentialDurationMinutes: [30],
    presentialMaxWorkingDays: [5],
    presentialWorkStartTime: ['08:00'],
    presentialWorkEndTime: ['18:00'],
    reminder15Min: [true],
    reminder1Hour: [false],
    excludeNonWorkingDays: [true],
    externalCalendarUrl: [''],
    address: [''],
    instructions: [''],
    locationReferences: [''],
    latitude: [19.4326 as number | null],
    longitude: [-99.1332 as number | null],
  });

  ngOnInit(): void {
    merge(
      this.form.controls.virtualWorkStartTime.valueChanges,
      this.form.controls.virtualWorkEndTime.valueChanges,
      this.form.controls.virtualDurationMinutes.valueChanges,
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncVirtualGridFromForm());

    this.api.getMyConfig().subscribe({
      next: (cfg) => {
        const virtual = cfg.virtual ?? defaultInterviewCalendarModalityConfig();
        const presential = cfg.presential ?? defaultInterviewCalendarModalityConfig();
        this.form.patchValue({
          virtualDurationMinutes: virtual.durationMinutes ?? 30,
          virtualMaxWorkingDays: virtual.maxWorkingDays ?? 5,
          virtualWorkStartTime: virtual.workStartTime ?? '08:00',
          virtualWorkEndTime: virtual.workEndTime ?? '18:00',
          presentialDurationMinutes: presential.durationMinutes ?? 30,
          presentialMaxWorkingDays: presential.maxWorkingDays ?? 5,
          presentialWorkStartTime: presential.workStartTime ?? '08:00',
          presentialWorkEndTime: presential.workEndTime ?? '18:00',
          reminder15Min: cfg.reminder15Min ?? true,
          reminder1Hour: cfg.reminder1Hour ?? false,
          excludeNonWorkingDays: cfg.excludeNonWorkingDays ?? true,
          externalCalendarUrl: cfg.externalCalendarUrl ?? '',
          address: cfg.address ?? '',
          instructions: cfg.instructions ?? '',
          locationReferences: cfg.locationReferences ?? '',
          latitude: cfg.latitude ?? 19.4326,
          longitude: cfg.longitude ?? -99.1332,
        });
        this.virtualSlots = [...(virtual.availabilitySlots ?? [])];
        this.syncVirtualGridFromForm();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.syncVirtualGridFromForm();
        this.feedback.showApiError(err, { fallbackMessage: INTERVIEW_CAL_LOAD_ERROR });
      },
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  isAvailable(dayOfWeek: number, time: string): boolean {
    return this.virtualSlots.some((s) => s.dayOfWeek === dayOfWeek && s.time === time && s.available);
  }

  toggleSlot(dayOfWeek: number, time: string): void {
    const idx = this.virtualSlots.findIndex((s) => s.dayOfWeek === dayOfWeek && s.time === time);
    if (idx >= 0) {
      this.virtualSlots[idx] = { ...this.virtualSlots[idx], available: !this.virtualSlots[idx].available };
    } else {
      this.virtualSlots.push({ dayOfWeek, time, available: true });
    }
  }

  save(): void {
    if (this.saving) {
      return;
    }
    this.saving = true;
    const raw = this.form.getRawValue();
    this.api
      .saveMyConfig({
        virtual: {
          durationMinutes: raw.virtualDurationMinutes,
          maxWorkingDays: raw.virtualMaxWorkingDays,
          workStartTime: raw.virtualWorkStartTime,
          workEndTime: raw.virtualWorkEndTime,
          availabilitySlots: this.virtualSlots.filter((s) => s.available),
        },
        presential: {
          durationMinutes: raw.presentialDurationMinutes,
          maxWorkingDays: raw.presentialMaxWorkingDays,
          workStartTime: raw.presentialWorkStartTime,
          workEndTime: raw.presentialWorkEndTime,
          availabilitySlots: [],
        },
        reminder15Min: raw.reminder15Min,
        reminder1Hour: raw.reminder1Hour,
        excludeNonWorkingDays: raw.excludeNonWorkingDays,
        externalCalendarUrl: raw.externalCalendarUrl || null,
        address: raw.address || null,
        instructions: raw.instructions || null,
        locationReferences: raw.locationReferences || null,
        latitude: raw.latitude,
        longitude: raw.longitude,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.feedback.showSuccess(INTERVIEW_CAL_SAVE_SUCCESS);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.saving = false;
          this.feedback.showApiError(err, { fallbackMessage: INTERVIEW_CAL_SAVE_ERROR });
        },
      });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  formatDuration(minutes: number): string {
    return formatInterviewDurationMinutes(minutes);
  }

  formatTime(time: string): string {
    const [hours, mins] = time.split(':').map(Number);
    return new Intl.DateTimeFormat(this.localeId, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(2000, 0, 1, hours, mins));
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      void this.ensureMapReady();
    }
  }

  locateAddressOnMap(): void {
    const address = this.form.controls.address.value.trim();
    if (!address) {
      this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, INTERVIEW_CAL_ADDRESS_REQUIRED);
      return;
    }
    if (this.geocoding) {
      return;
    }
    this.geocoding = true;
    void this.geocodeAddress(address)
      .then(async (coords) => {
        this.geocoding = false;
        if (!coords) {
          this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, INTERVIEW_CAL_GEOCODE_ERROR);
          return;
        }
        this.form.patchValue({ latitude: coords.lat, longitude: coords.lng });
        await this.ensureMapReady();
        this.map?.setView([coords.lat, coords.lng], 16);
        this.marker?.setLatLng([coords.lat, coords.lng]);
      })
      .catch(() => {
        this.geocoding = false;
        this.feedback.showWarning(FEEDBACK_GENERIC_WARNING_TITLE, INTERVIEW_CAL_GEOCODE_ERROR);
      });
  }

  private ensureMapReady(): Promise<void> {
    return new Promise((resolve) => {
      const tryInit = (attempt: number) => {
        setTimeout(() => {
          if (!this.map) {
            this.initMap();
          }
          if (this.map) {
            this.map.invalidateSize();
            const lat = this.form.controls.latitude.value ?? 19.4326;
            const lng = this.form.controls.longitude.value ?? -99.1332;
            this.map.setView([lat, lng], this.map.getZoom() || 13);
            this.marker?.setLatLng([lat, lng]);
            resolve();
            return;
          }
          if (attempt < 5) {
            tryInit(attempt + 1);
          } else {
            resolve();
          }
        }, 120);
      };
      tryInit(0);
    });
  }

  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      return null;
    }
    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    if (!results.length) {
      return null;
    }
    return {
      lat: Number.parseFloat(results[0].lat),
      lng: Number.parseFloat(results[0].lon),
    };
  }

  private syncVirtualGridFromForm(): void {
    const start = this.form.controls.virtualWorkStartTime.value;
    const end = this.form.controls.virtualWorkEndTime.value;
    const stepMinutes = this.form.controls.virtualDurationMinutes.value;

    if (this.timeToMinutes(start) >= this.timeToMinutes(end)) {
      const adjustedEnd = this.minutesToTime(this.timeToMinutes(start) + stepMinutes);
      this.form.controls.virtualWorkEndTime.setValue(adjustedEnd, { emitEvent: false });
    }

    const effectiveEnd = this.form.controls.virtualWorkEndTime.value;
    const newTimes = this.buildGridTimeOptions(start, effectiveEnd, stepMinutes);
    const allowed = new Set(newTimes);

    this.virtualSlots = this.virtualSlots.filter((slot) => allowed.has(slot.time));

    for (let day = 1; day <= 5; day++) {
      for (const time of newTimes) {
        if (!this.virtualSlots.some((slot) => slot.dayOfWeek === day && slot.time === time)) {
          this.virtualSlots.push({ dayOfWeek: day, time, available: false });
        }
      }
    }

    this.gridTimeOptions = newTimes;
  }

  private buildGridTimeOptions(start: string, end: string, stepMinutes: number): string[] {
    const startMin = this.timeToMinutes(start);
    const endMin = this.timeToMinutes(end);
    const step = stepMinutes > 0 ? stepMinutes : 30;
    if (startMin >= endMin) {
      return [];
    }
    const times: string[] = [];
    for (let minutes = startMin; minutes < endMin; minutes += step) {
      times.push(this.minutesToTime(minutes));
    }
    return times;
  }

  private buildPickerTimeOptions(): string[] {
    const times: string[] = [];
    for (let minutes = 6 * 60; minutes <= 22 * 60; minutes += 15) {
      times.push(this.minutesToTime(minutes));
    }
    return times;
  }

  private timeToMinutes(time: string): number {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  }

  private minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  private initMap(): void {
    const el = document.getElementById('interview-calendar-map');
    if (!el || this.map) {
      return;
    }
    if (el.clientHeight === 0) {
      return;
    }
    const lat = this.form.controls.latitude.value ?? 19.4326;
    const lng = this.form.controls.longitude.value ?? -99.1332;
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    this.map = L.map(el).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.map);
    this.marker = L.marker([lat, lng], { draggable: true, icon }).addTo(this.map);
    this.marker.on('dragend', () => {
      const pos = this.marker?.getLatLng();
      if (!pos) {
        return;
      }
      this.form.patchValue({ latitude: pos.lat, longitude: pos.lng });
    });
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker?.setLatLng(e.latlng);
      this.form.patchValue({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    });
    setTimeout(() => this.map?.invalidateSize(), 200);
  }
}
