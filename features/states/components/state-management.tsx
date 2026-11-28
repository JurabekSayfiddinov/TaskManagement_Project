
"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import type { State } from "../types/state";
import { useState } from "react";
import {
  Plus,
  Trash2,
  CircleDashed,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  useStates,
  useCreateState,
  useDeleteState,
} from "../hooks/use-states";

import type { StateGroup } from "../types/state";

const groups: { value: StateGroup; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "unstarted", label: "To Do" },
  { value: "started", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface StateManagementProps {
  workspaceSlug: string;
  projectId: string;
}

export function StateManagement({
  workspaceSlug,
  projectId,
}: StateManagementProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [group, setGroup] =
    useState<StateGroup>("unstarted");
const [selectedState, setSelectedState] =
  useState<State | null>(null);
  const [actionError, setActionError] = useState("");

  const {
    data: states = [],
    isPending,
    isError,
    error,
    refetch,
  } = useStates(workspaceSlug, projectId);

  const createMutation = useCreateState(
    workspaceSlug,
    projectId
  );

  const deleteMutation = useDeleteState(
    workspaceSlug,
    projectId
  );

  const isMutating =
    createMutation.isPending ||
    deleteMutation.isPending;

  async function handleCreate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim() || isMutating) return;

    setActionError("");

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        color,
        group,
      });

      setName("");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to create state."
      );
    }
  }

  async function handleRemove() {
  if (!selectedState || isMutating) return;

  setActionError("");

  try {
    await deleteMutation.mutateAsync(selectedState.id);

    setSelectedState(null);
  } catch (error) {
    setActionError(
      error instanceof Error
        ? error.message
        : "Failed to delete state."
    );

    setSelectedState(null);
  }
}

  if (!workspaceSlug || !projectId) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
        Select a project first.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="animate-pulse space-y-4 rounded-xl border bg-card p-5">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <h2 className="font-semibold text-red-600">
          Failed to load states
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message}
        </p>

        <Button
          type="button"
          className="mt-4"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <CircleDashed className="size-5 text-primary" />

          <h2 className="font-semibold">States</h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage the workflow and statuses of your tasks.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="flex flex-wrap items-end gap-3 border-b p-5"
      >
        <div className="min-w-40 flex-1 space-y-2">
          <label
            htmlFor="state-name"
            className="text-sm font-medium"
          >
            State Name
          </label>

          <Input
            id="state-name"
            placeholder="In Review"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isMutating}
            maxLength={50}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="state-group"
            className="text-sm font-medium"
          >
            Group
          </label>

          <select
            id="state-group"
            value={group}
            disabled={isMutating}
            onChange={(e) =>
              setGroup(e.target.value as StateGroup)
            }
            className="block h-9 rounded-md border border-input bg-card px-3 text-sm"
          >
            {groups.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="state-color"
            className="text-sm font-medium"
          >
            Color
          </label>

          <input
            id="state-color"
            type="color"
            value={color}
            disabled={isMutating}
            onChange={(e) => setColor(e.target.value)}
            className="block h-9 w-12 cursor-pointer rounded-md border bg-card p-1"
          />
        </div>

        <Button
          type="submit"
          disabled={!name.trim() || isMutating}
        >
          {createMutation.isPending ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Plus size={16} />
          )}

          {createMutation.isPending
            ? "Adding..."
            : "Add State"}
        </Button>
      </form>

      {actionError && (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      <div className="divide-y">
        {states.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No states created yet.
          </p>
        ) : (
          [...states]
            .sort((a, b) => a.order - b.order)
            .map((state) => (
              <div
                key={state.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: state.color,
                    }}
                  />

                  <span className="text-sm font-medium">
                    {state.name}
                  </span>

                  {state.is_default && (
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {
                      groups.find(
                        (item) =>
                          item.value === state.group
                      )?.label
                    }
                  </span>

                 <button
  type="button"
  aria-label={`Delete ${state.name}`}
  disabled={isMutating || state.is_default}
  onClick={() => setSelectedState(state)}
  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
>
  <Trash2 size={16} />
</button>
                </div>
              </div>
            ))
        )}
      </div>
      <AlertDialog
  open={!!selectedState}
  onOpenChange={(open) => {
    if (!open && !deleteMutation.isPending) {
      setSelectedState(null);
    }
  }}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <Trash2 size={24} />
      </div>

      <AlertDialogTitle>
        Delete State?
      </AlertDialogTitle>

      <AlertDialogDescription>
        Are you sure you want to delete "
        {selectedState?.name}"? This action cannot
        be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel
        disabled={deleteMutation.isPending}
      >
        Cancel
      </AlertDialogCancel>

      <Button
        type="button"
        variant="destructive"
        disabled={deleteMutation.isPending}
        onClick={handleRemove}
      >
        {deleteMutation.isPending && (
          <Loader2
            size={16}
            className="animate-spin"
          />
        )}

        {deleteMutation.isPending
          ? "Deleting..."
          : "Delete State"}
      </Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </section>
  );
}
