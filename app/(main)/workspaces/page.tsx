
"use client";

import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace-dialog";
import { EditWorkspaceDialog } from "@/features/workspaces/components/edit-workspace-dialog";
import { DeleteWorkspaceDialog } from "@/features/workspaces/components/delete-workspace-dialog";

import {
  useWorkspaces,
  useCreateWorkspace,
} from "@/features/workspaces/hooks/use-workspaces";

import type {
  CreateWorkspaceDto,
} from "@/features/workspaces/types/workspace";

export default function WorkspacesPage() {
  const {
    data: workspaces = [],
    isPending,
    isError,
    error,
    refetch,
  } = useWorkspaces();

  const createMutation = useCreateWorkspace();

  async function handleCreate(data: CreateWorkspaceDto) {
    await createMutation.mutateAsync(data);
  }

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <h2 className="font-semibold text-red-600">
          Failed to load workspaces
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Workspaces
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your company workspaces.
          </p>
        </div>

        <CreateWorkspaceDialog onCreate={handleCreate} />
      </div>

      {workspaces.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-accent text-primary">
            <Building2 size={28} />
          </div>

          <h2 className="text-lg font-semibold">
            No workspaces yet
          </h2>

          <p className="mb-5 mt-2 text-sm text-muted-foreground">
            Create your first workspace to get started.
          </p>

          <CreateWorkspaceDialog onCreate={handleCreate} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className="rounded-xl border bg-card p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <Building2 size={22} />
                </div>

                <div className="flex items-center gap-1">
                  <EditWorkspaceDialog
                    workspace={workspace}
                  />

                  <DeleteWorkspaceDialog
                    workspace={workspace}
                  />
                </div>
              </div>

              <h2 className="mt-4 font-semibold">
                {workspace.name}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {workspace.slug}
              </p>

              <Link
                href={`/projects?workspace=${encodeURIComponent(workspace.slug)}`}
                className="mt-5 flex items-center justify-between border-t pt-4 text-sm font-medium text-primary"
              >
                Open Workspace
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
