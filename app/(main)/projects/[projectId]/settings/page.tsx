
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useWorkspace } from "@/features/workspaces/context/workspace-context";

import { StateManagement } from "@/features/states/components/state-management";

import { LabelManagement } from "@/features/labels/components/label-management";

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    workspaceSlug,
    isPending,
    isError,
  } = useWorkspace();

  if (isPending) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center text-red-600">
        Failed to load workspace.
      </div>
    );
  }

  if (!workspaceSlug || !projectId) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
        Select a workspace and project first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Project Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage project workflow and task labels.
        </p>
      </div>

      <StateManagement
        key={`states-${workspaceSlug}-${projectId}`}
        workspaceSlug={workspaceSlug}
        projectId={projectId}
      />

      <LabelManagement key={`labels-${projectId}`} />
    </div>
  );
}
