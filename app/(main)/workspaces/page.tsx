
"use client";

import { useState } from "react";
import { Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

import { CreateWorkspaceDialog } from
  "@/features/workspaces/components/create-workspace-dialog";

import type {
  Workspace,
  CreateWorkspaceDto,
} from "@/features/workspaces/types/workspace";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  function handleCreate(data: CreateWorkspaceDto) {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      owner_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setWorkspaces((prev) => [...prev, workspace]);
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
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                <Building2 size={22} />
              </div>

              <h2 className="font-semibold">
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
