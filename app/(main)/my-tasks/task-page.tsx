"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import getme from "../profile/prof";
import { ProjectTasks } from "./project-tasks";
import { getProjects, getTaskStates, getWorkspaces, taskError } from "./task-api";
import { TaskForm } from "./task-form";

interface PageProps {
  isCreate?: boolean;
  initialWorkspace?: string;
  initialProject?: string;
  initialTask?: string;
}

export function TaskPage({ isCreate, initialWorkspace, initialProject, initialTask }: PageProps) {
  const [workspaceSlug, setWorkspaceSlug] = useState(
    typeof initialWorkspace === "string" ? initialWorkspace : "",
  );
  const workspaces = useQuery({ queryKey: ["workspaces"], queryFn: getWorkspaces });
  const workspaceList = workspaces.data ?? [];
  const workspace = workspaceSlug
    ? workspaceList.find((item) => item.slug === workspaceSlug)
    : workspaceList[0];

  return (
    <div className="grid grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-[minmax(0,18rem)_minmax(0,18rem)_minmax(0,1fr)]">
      <header className="col-span-full space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">{isCreate ? "Create Task" : "My Tasks"}</h1>
        <p className="text-sm text-muted-foreground">Choose a workspace and project.</p>
        {isCreate && <Link href="/my-tasks" className="text-sm text-primary hover:underline">Back to My Tasks</Link>}
      </header>
      {workspaces.isPending && <p role="status" className="col-span-full">Loading workspaces…</p>}
      {workspaces.isError && (
        <div className="col-span-full space-y-2">
          <p role="alert">{taskError(workspaces.error, "Could not load workspaces.")}</p>
          <Button variant="outline" onClick={() => workspaces.refetch()}>Retry</Button>
        </div>
      )}
      {workspaces.data?.length === 0 && <p className="col-span-full">Your account does not have any workspaces yet.</p>}
      {workspaceList.length > 0 && (
        <label className="block max-w-sm space-y-1 text-sm font-medium">
          <span>Workspace</span>
          <select
            className="block h-10 w-full rounded-lg border bg-card px-3 shadow-xs"
            value={workspace?.slug ?? ""}
            onChange={(event) => setWorkspaceSlug(event.target.value)}
          >
            <option value="" disabled>Select a workspace</option>
            {workspaceList.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
      )}
      {workspace && (
        <WorkspaceTasks
          key={workspace.slug}
          workspace={workspace.slug}
          isCreate={isCreate}
          initialProject={workspace.slug === initialWorkspace ? initialProject : ""}
          initialTask={workspace.slug === initialWorkspace ? initialTask : ""}
        />
      )}
    </div>
  );
}

interface WorkspaceProps {
  workspace: string;
  isCreate?: boolean;
  initialProject?: string;
  initialTask?: string;
}

function WorkspaceTasks({ workspace, isCreate, initialProject, initialTask }: WorkspaceProps) {
  const [projectId, setProjectId] = useState(typeof initialProject === "string" ? initialProject : "");
  const projects = useQuery({ queryKey: ["projects", workspace], queryFn: () => getProjects(workspace) });
  const projectList = projects.data ?? [];
  const project = projectId ? projectList.find((item) => item.id === projectId) : projectList[0];

  return (
    <>
      {projects.isPending && <p role="status" className="col-span-full">Loading projects…</p>}
      {projects.isError && (
        <div className="col-span-full space-y-2">
          <p role="alert">{taskError(projects.error, "Could not load projects.")}</p>
          <Button variant="outline" onClick={() => projects.refetch()}>Retry</Button>
        </div>
      )}
      {projects.data?.length === 0 && <p className="col-span-full">This workspace does not have any projects yet.</p>}
      {projectList.length > 0 && (
        <label className="block max-w-sm space-y-1 text-sm font-medium">
          <span>Project</span>
          <select
            className="block h-10 w-full rounded-lg border bg-card px-3 shadow-xs"
            value={project?.id ?? ""}
            onChange={(event) => setProjectId(event.target.value)}
          >
            <option value="" disabled>Select a project</option>
            {projectList.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      )}
      {project && (
        <div className="col-span-full min-w-0">
          {isCreate ? (
            <NewTask key={project.id} workspace={workspace} project={project.id} />
          ) : (
            <ProjectTasks
              key={project.id}
              workspace={workspace}
              project={project}
              initialTask={project.id === initialProject && typeof initialTask === "string" ? initialTask : ""}
            />
          )}
        </div>
      )}
    </>
  );
}

function NewTask({ workspace, project }: { workspace: string; project: string }) {
  const router = useRouter();
  const profile = useQuery({ queryKey: ["profile"], queryFn: getme });
  const states = useQuery({
    queryKey: ["task-states", workspace, project],
    queryFn: () => getTaskStates(workspace, project),
  });
  const backUrl = `/my-tasks?workspace=${encodeURIComponent(workspace)}&project=${encodeURIComponent(project)}`;

  if (states.isPending || profile.isPending) return <p role="status">Loading the task form…</p>;
  if (states.isError || profile.isError) {
    return (
      <div className="space-y-2">
        <p role="alert">{taskError(states.error ?? profile.error, "Could not load the task form.")}</p>
        <Button variant="outline" onClick={() => { if (states.isError) void states.refetch(); if (profile.isError) void profile.refetch(); }}>Retry</Button>
      </div>
    );
  }
  if (!states.data.length) return <p>This project needs at least one status before you can create tasks.</p>;

  return (
    <div className="max-w-2xl">
      <TaskForm
        workspace={workspace}
        project={project}
        states={states.data}
        currentUserId={profile.data.id}
        onSaved={(task) => router.replace(`${backUrl}&task=${encodeURIComponent(task.id)}`)}
        onCancel={() => router.push(backUrl)}
      />
    </div>
  );
}
