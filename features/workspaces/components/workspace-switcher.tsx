
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ChevronDown,
  Building2,
  Check,
  Settings,
} from "lucide-react";

import { useWorkspace } from "../context/workspace-context";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);

  const {
    workspace,
    workspaces,
    setWorkspaceSlug,
    isPending,
    isError,
  } = useWorkspace();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={isPending}
            className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-sm hover:bg-muted"
          />
        }
      >
        <span className="truncate">
          {isPending
            ? "Loading..."
            : isError
              ? "Failed to load"
              : workspace?.name ?? "Select workspace"}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-56 p-1"
      >
        <p className="px-2 py-2 text-xs font-medium text-muted-foreground">
          Switch workspace
        </p>

        <div className="max-h-60 space-y-1 overflow-y-auto">
          {workspaces.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setWorkspaceSlug(item.slug);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${
                workspace?.id === item.id
                  ? "bg-accent text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <Building2 className="size-4 shrink-0" />

              <span className="flex-1 truncate">
                {item.name}
              </span>

              {workspace?.id === item.id && (
                <Check size={16} />
              )}
            </button>
          ))}

          {workspaces.length === 0 && (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              No workspaces yet.
            </p>
          )}
        </div>

        <div className="my-1 border-t" />

        <Link
          href="/workspaces"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary"
        >
          <Settings size={16} />
          Manage workspaces
        </Link>
      </PopoverContent>
    </Popover>
  );
}
