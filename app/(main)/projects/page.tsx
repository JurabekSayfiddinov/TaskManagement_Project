
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  FolderKanban,
  Search,
  CalendarDays,
  Settings,
  Building2,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { EditProjectDialog } from "@/features/projects/components/edit-project-dialog";
import { DeleteProjectDialog } from "@/features/projects/components/delete-project-dialog";

import {
  useProjects,
  useCreateProject,
} from "@/features/projects/hooks/use-projects";

import { useWorkspace } from "@/features/workspaces/context/workspace-context";

import type {
  CreateProjectDto,
} from "@/features/projects/types/project";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");

  const {
    workspace,
    workspaceSlug,
    isPending: workspacePending,
    isError: workspaceError,
  } = useWorkspace();

  const {
    data: projects = [],
    isPending,
    isError,
    error,
    refetch,
  } = useProjects(workspaceSlug);

  const createMutation =
    useCreateProject(workspaceSlug);

  async function handleCreate(data: CreateProjectDto) {
    await createMutation.mutateAsync(data);
  }

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.identifier}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  if (workspacePending) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
    );
  }

  if (workspaceError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center text-red-600">
        Failed to load workspaces.
      </div>
    );
  }

  if (!workspaceSlug) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-accent text-primary">
          <Building2 size={28} />
        </div>

        <h2 className="text-lg font-semibold">
          No workspace selected
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Create or select a workspace first.
        </p>

        <Link
          href="/workspaces"
          className="mt-5 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Go to Workspaces
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <h2 className="font-semibold text-red-600">
          Failed to load projects
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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Projects
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage projects in {workspace?.name}.
          </p>
        </div>

        <CreateProjectDialog
          key={workspaceSlug}
          onCreate={handleCreate}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-8 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-accent text-primary">
            <FolderKanban size={28} />
          </div>

          <h2 className="text-lg font-semibold">
            No projects yet
          </h2>

          <p className="mb-5 mt-2 text-sm text-muted-foreground">
            Create your first project to start managing tasks.
          </p>

          <CreateProjectDialog
            key={`empty-${workspaceSlug}`}
            onCreate={handleCreate}
          />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
          No matching projects found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <FolderKanban size={22} />
                </div>

                <div className="flex items-center gap-1">
                  <EditProjectDialog
                    project={project}
                    workspaceSlug={workspaceSlug}
                  />

                  <DeleteProjectDialog
                    project={project}
                    workspaceSlug={workspaceSlug}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <h2 className="font-semibold">
                  {project.name}
                </h2>

                <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {project.identifier}
                </span>
              </div>

              <div className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    project.is_archived
                      ? "bg-muted text-muted-foreground"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {project.is_archived
                    ? "Archived"
                    : "Active"}
                </span>
              </div>

              <p className="mt-3 min-h-10 text-sm text-muted-foreground">
                {project.description || "No description"}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays size={14} />

                {new Date(
                  project.created_at
                ).toLocaleDateString("en-US")}
              </div>

              <div className="mt-5 border-t pt-4">
                <Link
                  href={`/projects/${project.id}/settings`}
                  className="flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                >
                  <Settings size={16} />
                  Project Settings
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
