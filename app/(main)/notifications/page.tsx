"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/features/workspaces/context/workspace-context";

import { getNotifications, markAllAsRead, markAsRead } from "./notapi";

type NotificationRow = {
  id: string;
  type: string;
  is_read: boolean;
  created_at: string;
  actor: { display_name: string } | null;
};

export default function NotificationsPage() {
  const { workspaceSlug, isPending, isError } = useWorkspace();

  if (isPending) return <p>Loading workspaces…</p>;
  if (isError) return <p role="alert">Could not load workspaces.</p>;
  if (!workspaceSlug) return <p>Select a workspace to see notifications.</p>;

  return (
    <WorkspaceNotifications key={workspaceSlug} workspaceSlug={workspaceSlug} />
  );
}

function WorkspaceNotifications({ workspaceSlug }: { workspaceSlug: string }) {
  const [unreadOnly, setUnreadOnly] = useState(false);

  const queryClient = useQueryClient();
  const queryKey = ["notifications", workspaceSlug];

  const notifications = useQuery({
    queryKey: [...queryKey, unreadOnly],
    queryFn: () => getNotifications(workspaceSlug, unreadOnly),
  });

  function refreshNotifications() {
    return queryClient.invalidateQueries({ queryKey });
  }

  const readOne = useMutation({
    mutationFn: (id: string) => markAsRead(workspaceSlug, id),
    onSuccess: refreshNotifications,
  });

  const readAll = useMutation({
    mutationFn: () => markAllAsRead(workspaceSlug),
    onSuccess: refreshNotifications,
  });

  const items: NotificationRow[] = notifications.data?.data ?? [];
  const unreadCount = notifications.data?.unread_count ?? 0;
  const saving = readOne.isPending || readAll.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
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
          type="button"
          variant="outline"
          disabled={saving || unreadCount === 0}
          onClick={() => readAll.mutate()}
        >
          <CheckCheck size={16} />
          {readAll.isPending ? "Saving…" : "Mark all as read"}
        </Button>
      </header>

      {(readOne.isError || readAll.isError) && (
        <p role="alert" className="text-sm text-destructive">
          Could not mark notifications as read. Please try again.
        </p>
      )}

      <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="flex gap-6 border-b px-5">
          <button
            type="button"
            aria-pressed={!unreadOnly}
            onClick={() => setUnreadOnly(false)}
            className={`border-b-2 py-4 text-sm font-medium ${
              !unreadOnly
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            All
          </button>

          <button
            type="button"
            aria-pressed={unreadOnly}
            onClick={() => setUnreadOnly(true)}
            className={`border-b-2 py-4 text-sm font-medium ${
              unreadOnly
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {notifications.isPending ? (
          <p role="status" className="p-5">Loading notifications…</p>
        ) : notifications.isError ? (
          <div className="space-y-3 p-5">
            <p role="alert">Could not load notifications.</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => notifications.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
            <Bell className="text-primary" size={28} />
            <p>{unreadOnly ? "No unread notifications." : "No notifications yet."}</p>
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex items-start gap-4 p-5 ${
                  item.is_read ? "bg-card" : "bg-accent/40"
                }`}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
                  <Bell size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold capitalize">
                    {item.type.replaceAll("_", " ")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.actor?.display_name ?? "Someone"}
                  </p>
                  <time dateTime={item.created_at} className="mt-2 block text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </time>
                </div>

                {!item.is_read && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={saving}
                    onClick={() => readOne.mutate(item.id)}
                  >
                    <Check size={16} />
                    Mark as read
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}