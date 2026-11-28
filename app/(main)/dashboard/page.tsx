
"use client";

import Link from "next/link";
import {
  Layers,
  CircleDashed,
  Clock3,
  CircleCheck,
  CalendarCheck,
  CalendarClock,
  Plus,
} from "lucide-react";
import { useWorkspace } from "@/features/workspaces/context/workspace-context";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";

import type {
  DashboardTask,
} from "@/features/dashboard/types/dashboard";

const priorityStyles: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
  none: "bg-muted text-muted-foreground",
};

function getLocalDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? "UTC"
      : undefined,
  });
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export default function DashboardPage() {
 const { workspaceSlug } = useWorkspace();

const {
  data,
  isPending,
  isError,
  error,
  refetch,
} = useDashboard(workspaceSlug);

  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded bg-muted" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 rounded-xl border bg-muted"
            />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="h-48 rounded-xl bg-muted" />
          <div className="h-48 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <h2 className="font-semibold text-red-600">
          Failed to load dashboard
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

  const {
    user,
    workspace,
    projects,
    tasks,
    states,
    stats,
  } = data;

  const today = getLocalDate(new Date());

  const statesMap = new Map(
    states.map((state) => [state.id, state])
  );

  const projectsMap = new Map(
    projects.map((project) => [project.id, project])
  );

  function isOpen(task: DashboardTask) {
    const group = statesMap.get(task.state_id)?.group;

    return group !== "completed" && group !== "cancelled";
  }

  const todayTasks = tasks.filter(
    (task) =>
      task.due_date?.slice(0, 10) === today &&
      isOpen(task)
  );

  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.due_date &&
        task.due_date.slice(0, 10) > today &&
        isOpen(task)
    )
    .sort((a, b) =>
      (a.due_date ?? "").localeCompare(b.due_date ?? "")
    )
    .slice(0, 5);

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 5);

  const myProjectCount = projects.filter(
    (project) => project.myTasks.length > 0
  ).length;

  const statCards = [
    {
      title: "My Total Tasks",
      value: stats.total,
      description: `Across ${myProjectCount} active projects`,
      icon: Layers,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "To Do",
      value: stats.todo,
      description: "Backlog & unstarted states",
      icon: CircleDashed,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      description: "Active started tasks",
      icon: Clock3,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      description: "Completed tasks",
      icon: CircleCheck,
      color: "bg-green-100 text-green-700",
    },
  ];

  function renderTask(task: DashboardTask) {
    const project = projectsMap.get(task.project_id);

    return (
      <div
        key={task.id}
        className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/30"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-primary" />

            <span className="text-xs text-muted-foreground">
              {project?.identifier}-{task.sequence_id}
            </span>

            <p className="truncate text-sm font-medium">
              {task.title}
            </p>
          </div>

          <p className="mt-1 pl-4 text-xs text-muted-foreground">
            {project?.name}

            {task.due_date &&
              ` · Due ${formatDate(task.due_date)}`}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${
            priorityStyles[task.priority] ??
            priorityStyles.none
          }`}
        >
          {task.priority}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
   
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user.display_name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Workspace: {workspace?.name ?? "No workspace"}

            {" · "}

            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {workspace && (
          <Link
            href="/tasks/create"
            className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} />
            Create Task
          </Link>
        )}
      </div>

      {!workspace && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold">
            No workspace yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create a workspace to start managing projects.
          </p>

          <Link
            href="/workspaces"
            className="mt-4 inline-block text-sm font-medium text-primary"
          >
            Go to Workspaces
          </Link>
        </div>
      )}


      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border bg-card p-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon size={17} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

  
      <section className="grid gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <CalendarCheck
                size={16}
                className="text-primary"
              />

              <h2 className="text-sm font-semibold">
                Tasks due today
              </h2>
            </div>

            <span className="rounded-full bg-accent px-2 py-1 text-xs text-primary">
              {todayTasks.length} due
            </span>
          </div>

          {todayTasks.length > 0 ? (
            todayTasks.map(renderTask)
          ) : (
            <EmptyState message="No tasks due today." />
          )}
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <CalendarClock
                size={16}
                className="text-muted-foreground"
              />

              <h2 className="text-sm font-semibold">
                Upcoming deadlines
              </h2>
            </div>

            <Link
              href="/my-tasks"
              className="text-xs font-medium text-primary"
            >
              View all
            </Link>
          </div>

          {upcomingTasks.length > 0 ? (
            upcomingTasks.map(renderTask)
          ) : (
            <EmptyState message="No upcoming deadlines." />
          )}
        </div>
      </section>


      <section className="grid gap-5 xl:grid-cols-3">
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs xl:col-span-2">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
            <h2 className="text-sm font-semibold">
              Recently updated tasks
            </h2>

            <Link
              href="/my-tasks"
              className="text-xs font-medium text-primary"
            >
              My Tasks
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <EmptyState message="No recently updated tasks." />
          ) : (
            recentTasks.map((task) => {
              const state = statesMap.get(task.state_id);
              const project = projectsMap.get(task.project_id);

              return (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center gap-3 border-b px-4 py-3 last:border-b-0"
                >
                  <span className="text-xs text-muted-foreground">
                    {project?.identifier}-{task.sequence_id}
                  </span>

                  <p className="min-w-0 flex-1 text-sm font-medium">
                    {task.title}
                  </p>

                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      color: state?.color,
                      backgroundColor: state
                        ? `${state.color}20`
                        : undefined,
                    }}
                  >
                    {state?.name ?? "Unknown"}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {formatDate(task.updated_at)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Project overview */}
        <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
            <h2 className="text-sm font-semibold">
              Project overview
            </h2>

            <Link
              href="/projects"
              className="text-xs font-medium text-primary"
            >
              All projects
            </Link>
          </div>

          {projects.length === 0 ? (
            <EmptyState message="No projects yet." />
          ) : (
            projects.map((project) => {
              const completed = project.tasks.filter(
                (task) =>
                  statesMap.get(task.state_id)?.group ===
                  "completed"
              ).length;

              const progress = project.tasks.length
                ? Math.round(
                    (completed / project.tasks.length) * 100
                  )
                : 0;

              return (
                <div
                  key={project.id}
                  className="space-y-2 border-b p-4 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      {project.name}
                    </h3>

                    <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {project.identifier}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {project.tasks.length} tasks · {progress}% completed
                  </p>

                  <div
                    role="progressbar"
                    aria-label={project.name}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
