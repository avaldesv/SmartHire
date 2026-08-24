export interface InterviewAvailabilitySlot {
  dayOfWeek: number;
  time: string;
  available: boolean;
}

export interface InterviewCalendarConfig {
  id?: number | null;
  durationMinutes: number;
  maxWorkingDays: number;
  workStartTime: string;
  workEndTime: string;
  reminder15Min: boolean;
  reminder1Hour: boolean;
  excludeNonWorkingDays: boolean;
  availabilitySlots: InterviewAvailabilitySlot[];
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
}
