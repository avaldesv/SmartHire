export interface InterviewAvailabilitySlot {
  dayOfWeek: number;
  time: string;
  available: boolean;
}

export interface InterviewCalendarModalityConfig {
  durationMinutes: number;
  maxWorkingDays: number;
  workStartTime: string;
  workEndTime: string;
  availabilitySlots: InterviewAvailabilitySlot[];
  minScheduleBufferHours?: number;
}

export interface InterviewCalendarConfig {
  id?: number | null;
  virtual: InterviewCalendarModalityConfig;
  presential: InterviewCalendarModalityConfig;
  reminder15Min: boolean;
  reminder1Hour: boolean;
  excludeNonWorkingDays: boolean;
  confirmationExpirationHours?: number;
  externalCalendarUrl?: string | null;
  address?: string | null;
  instructions?: string | null;
  locationReferences?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ScheduleInterviewRequest {
  modality: 'VIRTUAL' | 'PRESENTIAL';
  startAt: string;
  meetingLink?: string | null;
}

export interface ScheduleInterviewResponse {
  id: number;
  applicationId: number;
  modality: string;
  startAt: string;
  endAt: string;
  status: string;
  calendarIcsUrl: string;
  calendarGoogleUrl: string;
  calendarOutlookUrl: string;
  urlConfirm?: string | null;
  expiresAt?: string | null;
}

export interface SuggestedInterviewSlot {
  startAt: string;
  endAt: string;
  modality: string;
  durationMinutes: number;
}

export function defaultInterviewCalendarModalityConfig(): InterviewCalendarModalityConfig {
  return {
    durationMinutes: 30,
    maxWorkingDays: 5,
    workStartTime: '08:00',
    workEndTime: '18:00',
    availabilitySlots: [],
    minScheduleBufferHours: 12,
  };
}
