
"use client";
import Link from "next/link";
import { Settings } from "lucide-react";
import { useState } from "react";
import {
  FolderKanban,
  Search,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { CreateProjectDialog } from
  "@/features/projects/components/create-project-dialog";

import type {
  Project,
  CreateProjectDto,
} from "@/features/projects/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");

  function handleCreate(data: CreateProjectDto) {
    const project: Project = {
      id: crypto.randomUUID(),
      workspace_id: "",
      name: data.name,
      identifier: data.identifier,
      description: data.description ?? null,
      lead_id: data.lead_id ?? null,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProjects((prev) => [...prev, project]);
  }

  const filteredProjects = projects.filter((project) =>
    `${project.name} ${project.identifier}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
    
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Projects
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and organize your workspace projects.
          </p>
        </div>

        <CreateProjectDialog onCreate={handleCreate} />
      </div>

      
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9"
        />
      </div>


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

          <CreateProjectDialog onCreate={handleCreate} />
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

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Active
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <h2 className="font-semibold">
                  {project.name}
                </h2>

                <span className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                  {project.identifier}
                </span>
              </div>

              <p className="mt-2 min-h-10 text-sm text-muted-foreground">
                {project.description || "No description"}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays size={14} />

                {new Date(
                  project.created_at
                ).toLocaleDateString("en-US")}
              </div>

                  <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm font-medium text-muted-foreground">
                Open Project
                <ArrowRight size={16} />
              </div>

              <Link
                href={`/projects/${project.id}/settings`}
                className="mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <Settings size={16} />
                Project Settings
              </Link>
            </div>
          ))}
        </div>
      )}
      
    </div>
    
  );
 
}

