export type NotificationType =
  | "assignment"
  | "comment"
  | "status"
  | "mention";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}