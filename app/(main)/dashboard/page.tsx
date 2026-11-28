
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

const stats = [
  {
    title: "My Total Tasks",
    value: 14,
    description: "Tasks assigned to you",
    icon: Layers,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "To Do",
    value: 5,
    description: "Backlog & unstarted states",
    icon: CircleDashed,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "In Progress",
    value: 4,
    description: "Active started tasks",
    icon: Clock3,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Completed",
    value: 5,
    description: "Completed tasks",
    icon: CircleCheck,
    color: "bg-green-100 text-green-700",
  },
];

const todayTasks = [
  {
    id: "WEB-104",
    title: "Update employee onboarding checklist",
    project: "Web Platform",
    date: "Due Today, 5:00 PM",
    priority: "High",
  },
  {
    id: "EMP-42",
    title: "Verify SSO redirect URLs for staging",
    project: "Employee Portal",
    date: "Due Today, 6:00 PM",
    priority: "Urgent",
  },
];

const upcomingTasks = [
  {
    id: "OPS-19",
    title: "Audit quarterly software license seats",
    project: "Operations & IT",
    date: "Due Nov 29, 2026",
    priority: "Medium",
  },
  {
    id: "WEB-112",
    title: "Refresh help center screenshots for Q4",
    project: "Web Platform",
    date: "Due Dec 3, 2026",
    priority: "Low",
  },
];

const recentTasks = [
  {
    id: "WEB-104",
    title: "Update employee onboarding checklist",
    status: "In Progress",
    time: "12m ago",
  },
  {
    id: "EMP-42",
    title: "Verify SSO redirect URLs for staging",
    status: "To Do",
    time: "1h ago",
  },
  {
    id: "WEB-98",
    title: "Fix pagination offset on directory search",
    status: "Done",
    time: "Yesterday",
  },
];

const priorityStyles: Record<string, string> = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-blue-100 text-blue-700",
};

const statusStyles: Record<string, string> = {
  "In Progress": "bg-amber-100 text-amber-700",
  "To Do": "bg-blue-100 text-blue-700",
  Done: "bg-green-100 text-green-700",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        priorityStyles[priority] ?? "bg-muted"
      }`}
    >
      {priority}
    </span>
  );
}

type Task = (typeof todayTasks)[number];

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/30">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-primary" />

          <span className="shrink-0 text-xs text-muted-foreground">
            {task.id}
          </span>

          <p className="truncate text-sm font-medium">
            {task.title}
          </p>
        </div>

        <p className="mt-1 pl-4 text-xs text-muted-foreground">
          {task.project} · {task.date}
        </p>
      </div>

      <PriorityBadge priority={task.priority} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, Jurabek
          </h1>
        </div>

        <Link
          href="/tasks/create"
          className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          Create Task
        </Link>
      </div>

   
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-border bg-card p-4 shadow-xs"
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

              <p className="mt-4 text-3xl font-bold tracking-tight">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

     
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
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
              2 due
            </span>
          </div>

          {todayTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
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
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {upcomingTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </section>

     
      <section>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
            <h2 className="text-sm font-semibold">
              Recently updated tasks
            </h2>

            <Link
              href="/my-tasks"
              className="text-xs font-medium text-primary hover:underline"
            >
              My Tasks
            </Link>
          </div>

          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/30"
            >
              <span className="text-xs text-muted-foreground">
                {task.id}
              </span>

              <p className="min-w-0 flex-1 text-sm font-medium">
                {task.title}
              </p>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  statusStyles[task.status]
                }`}
              >
                {task.status}
              </span>

              <span className="text-xs text-muted-foreground">
                {task.time}
              </span>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
