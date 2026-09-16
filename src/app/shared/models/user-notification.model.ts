export type UserNotificationPortal = 'RECRUITER' | 'CANDIDATE';

export interface UserNotificationItem {
  id: number;
  portal: string;
  type: string;
  title: string;
  body: string;
  payloadJson: string | null;
  createAt: string | number | null;
  readAt: string | number | null;
  read: boolean;
}

export interface UserNotificationListResponse {
  data: UserNotificationItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkReadResponse {
  id: number;
  read: boolean;
}
