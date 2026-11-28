
"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NotificationItem } from
  "@/features/notifications/components/notification-item";

import type { Notification } from
  "@/features/notifications/types/notification";

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "assignment",
    title: "New task assigned",
    message: "You have been assigned task WEB-104.",
    is_read: false,
    created_at: "2026-11-27T10:30:00Z",
  },
  {
    id: "2",
    type: "comment",
    title: "New comment on your task",
    message: "Alex Morgan commented on your task.",
    is_read: false,
    created_at: "2026-11-27T09:20:00Z",
  },
  {
    id: "3",
    type: "status",
    title: "Task status updated",
    message: "WEB-102 has been moved to In Progress.",
    is_read: false,
    created_at: "2026-11-27T08:10:00Z",
  },
  {
    id: "4",
    type: "mention",
    title: "You were mentioned",
    message: "A teammate mentioned you in a comment.",
    is_read: true,
    created_at: "2026-11-26T12:00:00Z",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const [filter, setFilter] =
    useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  function handleMarkAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );
  }

  function handleMarkAllAsRead() {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
  }

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter(
          (notification) => !notification.is_read
        )
      : notifications;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
                {unreadCount} unread
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Stay up to date with your workspace activity.
          </p>
        </div>

        <Button
          variant="outline"
          disabled={unreadCount === 0}
          onClick={handleMarkAllAsRead}
        >
          <CheckCheck size={16} />
          Mark all as read
        </Button>
      </div>

      {/* Notifications panel */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">

        {/* Filters */}
        <div className="flex gap-6 border-b px-5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`border-b-2 py-4 text-sm font-medium ${
              filter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`border-b-2 py-4 text-sm font-medium ${
              filter === "unread"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification list */}
        {filteredNotifications.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-accent text-primary">
              <Bell size={28} />
            </div>

            <h2 className="font-semibold">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You're all caught up!
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
