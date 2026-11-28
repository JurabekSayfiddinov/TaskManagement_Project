
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bell,
  ChevronRight,
  Plus,
} from "lucide-react";

import { useWorkspace } from "@/features/workspaces/context/workspace-context";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  "my-tasks": "My Tasks",
  notifications: "Notifications",
  profile: "Profile",
  members: "Members",
  tasks: "Tasks",
  projects: "Projects",
  workspaces: "Workspaces",
};

export function AppHeader() {
  const pathname = usePathname();
  const { workspace } = useWorkspace();

  const segment = pathname.split("/").filter(Boolean)[0];

  const title = pageTitles[segment] ?? "Task Management";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">
          {workspace?.name ?? "No workspace"}
        </span>

        <ChevronRight
          size={14}
          className="text-muted-foreground"
        />

        <span className="font-medium">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <Bell size={19} />

          <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />
        </Link>

        <Link
          href="/profile"
          aria-label="Profile"
          className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-medium text-primary"
        >
          AM
        </Link>

        <Link
          href="/tasks/create"
          className="flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus size={16} />
          Create Task
        </Link>
      </div>
    </header>
  );
}
