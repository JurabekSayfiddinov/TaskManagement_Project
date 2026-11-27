
"use client";

import {
  UserCheck,
  MessageCircle,
  CircleCheck,
  AtSign,
  Check,
} from "lucide-react";

import type {
  Notification,
} from "../types/notification";

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
}

const notificationIcons = {
  assignment: UserCheck,
  comment: MessageCircle,
  status: CircleCheck,
  mention: AtSign,
};

export function NotificationItem({
  notification,
  onRead,
}: Props) {
  const Icon = notificationIcons[notification.type];

  return (
    <div
      className={`flex items-start gap-4 border-b border-border p-5 last:border-b-0 transition-colors ${
        notification.is_read
          ? "bg-card"
          : "bg-accent/40"
      }`}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold">
          {notification.title}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {notification.message}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          {new Date(
            notification.created_at
          ).toLocaleString("en-US")}
        </p>
      </div>

      {!notification.is_read && (
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-primary" />

          <button
            type="button"
            title="Mark as read"
            aria-label="Mark as read"
            onClick={() => onRead(notification.id)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-primary"
          >
            <Check size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
