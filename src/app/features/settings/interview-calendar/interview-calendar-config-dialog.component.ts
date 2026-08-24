import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
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
  INTERVIEW_CAL_DAY_FRI,
  INTERVIEW_CAL_DAY_MON,
  INTERVIEW_CAL_DAY_THU,
  INTERVIEW_CAL_DAY_TUE,
  INTERVIEW_CAL_DAY_WED,
  INTERVIEW_CAL_DURATION,
  INTERVIEW_CAL_END,
  INTERVIEW_CAL_EXCLUDE_HOLIDAYS,
  INTERVIEW_CAL_EXTERNAL_URL,
  INTERVIEW_CAL_GRID,
  INTERVIEW_CAL_INSTRUCTIONS,
  INTERVIEW_CAL_LOAD_ERROR,
  INTERVIEW_CAL_LOCATE_ADDRESS,
  INTERVIEW_CAL_GEOCODE_ERROR,
  INTERVIEW_CAL_ADDRESS_REQUIRED,
  INTERVIEW_CAL_MAP,
  INTERVIEW_CAL_MAP_HINT,
  INTERVIEW_CAL_MAX_DAYS,
  INTERVIEW_CAL_NO,
  INTERVIEW_CAL_REFERENCES,
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
} from '../../../core/i18n/interview-calendar-labels';
import { InterviewCalendarApiService } from '../../../core/services/interview-calendar-api.service';
import { InterviewAvailabilitySlot } from '../../../shared/models/interview-calendar.model';
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
  readonly data = inject(MAT_DIALOG_DATA, { optional: true });

  readonly labels = {
    title: INTERVIEW_CAL_TITLE,
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
    instructions: INTERVIEW_CAL_INSTRUCTIONS,
    references: INTERVIEW_CAL_REFERENCES,
    map: INTERVIEW_CAL_MAP,
    mapHint: INTERVIEW_CAL_MAP_HINT,
    locateAddress: INTERVIEW_CAL_LOCATE_ADDRESS,
    externalUrl: INTERVIEW_CAL_EXTERNAL_URL,
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
  slots: InterviewAvailabilitySlot[] = [];
  private map?: L.Map;
  private marker?: L.Marker;

  readonly form = this.fb.nonNullable.group({
    durationMinutes: [30],
    maxWorkingDays: [5],
    workStartTime: ['08:00'],
    workEndTime: ['18:00'],
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
      this.form.controls.workStartTime.valueChanges,
      this.form.controls.workEndTime.valueChanges,
      this.form.controls.durationMinutes.valueChanges,
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncGridFromForm());

    this.api.getMyConfig().subscribe({
      next: (cfg) => {
        this.form.patchValue({
          durationMinutes: cfg.durationMinutes ?? 30,
          maxWorkingDays: cfg.maxWorkingDays ?? 5,
          workStartTime: cfg.workStartTime ?? '08:00',
          workEndTime: cfg.workEndTime ?? '18:00',
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
        this.slots = [...(cfg.availabilitySlots ?? [])];
        this.syncGridFromForm();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.syncGridFromForm();
        this.feedback.showApiError(err, { fallbackMessage: INTERVIEW_CAL_LOAD_ERROR });
      },
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  isAvailable(dayOfWeek: number, time: string): boolean {
    return this.slots.some((s) => s.dayOfWeek === dayOfWeek && s.time === time && s.available);
  }

  toggleSlot(dayOfWeek: number, time: string): void {
    const idx = this.slots.findIndex((s) => s.dayOfWeek === dayOfWeek && s.time === time);
    if (idx >= 0) {
      this.slots[idx] = { ...this.slots[idx], available: !this.slots[idx].available };
    } else {
      this.slots.push({ dayOfWeek, time, available: true });
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
        durationMinutes: raw.durationMinutes,
        maxWorkingDays: raw.maxWorkingDays,
        workStartTime: raw.workStartTime,
        workEndTime: raw.workEndTime,
        reminder15Min: raw.reminder15Min,
        reminder1Hour: raw.reminder1Hour,
        excludeNonWorkingDays: raw.excludeNonWorkingDays,
        availabilitySlots: this.slots.filter((s) => s.available),
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

  private syncGridFromForm(): void {
    const start = this.form.controls.workStartTime.value;
    const end = this.form.controls.workEndTime.value;
    const stepMinutes = this.form.controls.durationMinutes.value;

    if (this.timeToMinutes(start) >= this.timeToMinutes(end)) {
      const adjustedEnd = this.minutesToTime(this.timeToMinutes(start) + stepMinutes);
      this.form.controls.workEndTime.setValue(adjustedEnd, { emitEvent: false });
    }

    const effectiveEnd = this.form.controls.workEndTime.value;
    const newTimes = this.buildGridTimeOptions(start, effectiveEnd, stepMinutes);
    const allowed = new Set(newTimes);

    this.slots = this.slots.filter((slot) => allowed.has(slot.time));

    for (let day = 1; day <= 5; day++) {
      for (const time of newTimes) {
        if (!this.slots.some((slot) => slot.dayOfWeek === day && slot.time === time)) {
          this.slots.push({ dayOfWeek: day, time, available: false });
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
