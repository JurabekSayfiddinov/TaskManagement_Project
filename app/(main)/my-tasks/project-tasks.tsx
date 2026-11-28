"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Columns3, List, Plus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Project } from "@/features/projects/types/project";
import getme from "../profile/prof";
import { deleteTask, getTask, getTasks, getTaskStates, moveTask, taskError, type TaskList } from "./task-api";
import { TaskBoard } from "./task-board";
import { TaskForm } from "./task-form";

interface Props {
  workspace: string;
  project: Project;
  initialTask: string;
}

export function ProjectTasks({ workspace, project, initialTask }: Props) {
  const queryClient = useQueryClient();
  const [mineOnly, setMineOnly] = useState(true);
  const [showBoard, setShowBoard] = useState(false);
  const [cursors, setCursors] = useState<string[]>([]);
  const [taskId, setTaskId] = useState(initialTask);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const profile = useQuery({ queryKey: ["profile"], queryFn: getme });
  const assignee = mineOnly ? profile.data?.id : undefined;
  const cursor = cursors.at(-1);
  const taskListKey = ["tasks", workspace, project.id];
  const detailKey = ["task", workspace, project.id, taskId];
  const tasks = useQuery({
    queryKey: [...taskListKey, assignee, cursor],
    queryFn: () => getTasks(workspace, project.id, assignee, cursor),
    enabled: !mineOnly || Boolean(assignee),
  });
  const selected = useQuery({
    queryKey: detailKey,
    queryFn: () => getTask(workspace, project.id, taskId),
    enabled: Boolean(taskId),
  });
  const states = useQuery({
    queryKey: ["task-states", workspace, project.id],
    queryFn: () => getTaskStates(workspace, project.id),
  });
  const move = useMutation({
    mutationFn: ({ id, stateId }: { id: string; stateId: string }) =>
      moveTask(workspace, project.id, id, stateId),
    async onSuccess(updatedTask) {
      const key = ["task", workspace, project.id, updatedTask.id];
      await queryClient.cancelQueries({ queryKey: key });
      await queryClient.cancelQueries({ queryKey: taskListKey });
      queryClient.setQueryData(key, updatedTask);
      queryClient.setQueriesData<TaskList>({ queryKey: taskListKey }, (page) => {
        if (!page) return page;
        return {
          ...page,
          data: page.data.map((task) => task.id === updatedTask.id ? updatedTask : task),
        };
      });
      return queryClient.invalidateQueries({ queryKey: taskListKey });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteTask(workspace, project.id, id),
    onSuccess(_, id) {
      setDeleteOpen(false);
      setTaskId("");
      setEditing(false);
      setCursors([]);
      queryClient.removeQueries({ queryKey: ["task", workspace, project.id, id] });
      return queryClient.invalidateQueries({ queryKey: taskListKey });
    },
  });
  const createUrl = `/tasks/create?workspace=${encodeURIComponent(workspace)}&project=${encodeURIComponent(project.id)}`;
  const current = selected.isError ? undefined : selected.data;
  const taskCount = tasks.data?.data.length;
  const taskScope = mineOnly ? "Assigned to me" : "All project tasks";

  function openTask(id: string) {
    setDeleteOpen(false);
    setEditing(false);
    setTaskId(id);
  }

  function getStateName(id: string) {
    return states.data?.find((state) => state.id === id)?.name ?? "Unknown status";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Task view" className="flex gap-1 rounded-lg bg-muted p-1">
            <Button type="button" variant={showBoard ? "ghost" : "default"} aria-pressed={!showBoard} onClick={() => setShowBoard(false)}>
              <List aria-hidden="true" size={16} />
              List
            </Button>
            <Button type="button" variant={showBoard ? "default" : "ghost"} aria-pressed={showBoard} onClick={() => setShowBoard(true)}>
              <Columns3 aria-hidden="true" size={16} />
              Board
            </Button>
          </div>
          <label className="flex cursor-pointer items-center gap-2 px-1 text-sm">
            <input
              className="size-4 accent-primary"
              type="checkbox"
              checked={mineOnly}
              onChange={(event) => { setMineOnly(event.target.checked); setCursors([]); }}
            />
            Only tasks assigned to me
          </label>
        </div>
        <Link href={createUrl} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus aria-hidden="true" size={16} />
          Create Task
        </Link>
      </div>

      <div className={showBoard ? "space-y-5" : "grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)]"}>
        <section className="min-w-0 space-y-4 rounded-2xl border bg-card p-4 shadow-xs sm:p-5">
          <header className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">{taskScope}</h2>
              {showBoard && <p className="mt-1 text-sm text-muted-foreground">Click a task for details. Drag the card to change its status.</p>}
            </div>
            {taskCount !== undefined && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {taskCount} {taskCount === 1 ? "task" : "tasks"} on this page
              </span>
            )}
          </header>
          {mineOnly && profile.isError && (
            <div className="space-y-2">
              <p role="alert">{taskError(profile.error, "Could not load your profile.")}</p>
              <Button variant="outline" onClick={() => profile.refetch()}>Retry</Button>
            </div>
          )}
          {tasks.isLoading && <p role="status">Loading tasks…</p>}
          {mineOnly && profile.isPending && <p role="status">Loading your profile…</p>}
          {tasks.isError && (
            <div className="space-y-2">
              <p role="alert">{taskError(tasks.error, "Could not load tasks.")}</p>
              <Button variant="outline" onClick={() => tasks.refetch()}>Retry</Button>
            </div>
          )}
          {!showBoard && taskCount === 0 && (
            <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
              {mineOnly ? "No tasks assigned to you on this page." : "No tasks on this page."}
            </p>
          )}
          {!showBoard && !!tasks.data?.data.length && (
            <div className="overflow-hidden rounded-xl border">
              <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_minmax(5rem,7rem)_5rem_6.5rem_1rem] items-center gap-3 bg-muted/70 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
                <span>Task</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Due date</span>
              </div>
              <ul className="divide-y border-t">
                {tasks.data.data.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      disabled={remove.isPending}
                      aria-pressed={task.id === taskId}
                      onClick={() => openTask(task.id)}
                      className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-l-2 border-transparent px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary aria-pressed:border-primary aria-pressed:bg-accent/70 md:grid-cols-[minmax(0,1fr)_minmax(5rem,7rem)_5rem_6.5rem_1rem]"
                    >
                      <span className="min-w-0">
                        <span className="text-xs font-semibold text-primary">{project.identifier}-{task.sequence_id}</span>
                        <span className="block break-words text-sm font-semibold">{task.title}</span>
                      </span>
                      <span className="justify-self-start rounded-full bg-muted px-2 py-1 text-xs font-medium">{getStateName(task.state_id)}</span>
                      <span className={`text-xs font-medium capitalize ${task.priority === "urgent" || task.priority === "high" ? "text-destructive" : "text-muted-foreground"}`}>
                        <span className="md:sr-only">Priority: </span>{task.priority}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                        {task.due_date ? <><CalendarDays aria-hidden="true" size={13} /><span className="sr-only">Due </span>{task.due_date.slice(0, 10)}</> : "—"}
                      </span>
                      <ArrowUpRight aria-hidden="true" size={14} className="hidden text-muted-foreground md:block" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showBoard && states.isPending && <p role="status">Loading task statuses…</p>}
          {showBoard && states.isError && (
            <div className="space-y-2">
              <p role="alert">{taskError(states.error, "Could not load task statuses.")}</p>
              <Button variant="outline" onClick={() => states.refetch()}>Retry statuses</Button>
            </div>
          )}
          {showBoard && states.data?.length === 0 && <p>This project has no statuses for the board.</p>}
          {showBoard && tasks.data && !!states.data?.length && (
            <TaskBoard
              tasks={tasks.data.data}
              states={states.data}
              projectIdentifier={project.identifier}
              selectedId={taskId}
              disabled={move.isPending || remove.isPending || editing || deleteOpen}
              onOpen={openTask}
              onMove={(id, stateId) => move.mutate({ id, stateId })}
            />
          )}
          {move.isPending && <p role="status" className="text-sm text-muted-foreground">Saving status…</p>}
          {move.isError && (
            <p role="alert" className="text-sm text-destructive">
              {taskError(move.error, "Could not move the task.")}
            </p>
          )}
          {(cursors.length > 0 || tasks.data?.next_cursor) && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={cursors.length === 0 || tasks.isFetching} onClick={() => setCursors(cursors.slice(0, -1))}>Previous</Button>
              <Button
                type="button"
                variant="outline"
                disabled={!tasks.data?.next_cursor || tasks.isFetching}
                onClick={() => {
                  const next = tasks.data?.next_cursor;
                  if (next) setCursors([...cursors, next]);
                }}
              >
                Next
              </Button>
            </div>
          )}
        </section>

        {!taskId && !showBoard && (
          <section className="rounded-2xl border border-dashed bg-card p-6">
            <h2 className="font-semibold">Task details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select a task to see its details.</p>
          </section>
        )}
        {taskId && selected.isPending && <p role="status">Loading task…</p>}
        {taskId && selected.isError && (
          <div className="space-y-2">
            <p role="alert">{taskError(selected.error, "Could not load the task.")}</p>
            <Button variant="outline" onClick={() => selected.refetch()}>Retry</Button>
          </div>
        )}
        {taskId && current && !editing && (
          <section className="max-w-3xl space-y-4 rounded-2xl border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary">{project.identifier}-{current.sequence_id}</p>
                <h2 className="mt-1 break-words text-lg font-semibold">{current.title}</h2>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Close task details" disabled={remove.isPending} onClick={() => setTaskId("")}>
                <X aria-hidden="true" size={16} />
              </Button>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{current.description || "No description."}</p>
            <dl className="grid grid-cols-2 gap-3 rounded-xl border bg-muted/40 p-3 text-sm">
              <div><dt className="text-muted-foreground">Status</dt><dd>{getStateName(current.state_id)}</dd></div>
              <div><dt className="text-muted-foreground">Priority</dt><dd className="capitalize">{current.priority}</dd></div>
              <div><dt className="text-muted-foreground">Start date</dt><dd>{current.start_date?.slice(0, 10) || "—"}</dd></div>
              <div><dt className="text-muted-foreground">Due date</dt><dd>{current.due_date?.slice(0, 10) || "—"}</dd></div>
              <div><dt className="text-muted-foreground">Estimate points</dt><dd>{current.estimate_points ?? "—"}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" disabled={move.isPending || remove.isPending || !states.data?.length} onClick={() => setEditing(true)}>Edit task</Button>
              <AlertDialog
                open={deleteOpen}
                onOpenChange={(open) => {
                  if (remove.isPending) return;
                  if (open) remove.reset();
                  setDeleteOpen(open);
                }}
              >
                <AlertDialogTrigger disabled={move.isPending} render={<Button type="button" variant="destructive" />}>
                  Delete task
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete task?</AlertDialogTitle>
                    <AlertDialogDescription className="break-words">
                      Delete &ldquo;{current.title}&rdquo; from this project?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {remove.isError && (
                    <p role="alert" className="text-sm text-destructive">
                      {taskError(remove.error, "Could not delete the task.")}
                    </p>
                  )}
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="button"
                      variant="destructive"
                      disabled={remove.isPending}
                      onClick={() => remove.mutate(current.id)}
                    >
                      {remove.isPending ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {states.isError && (
              <div className="space-y-2">
                <p role="alert">{taskError(states.error, "Could not load task statuses.")}</p>
                <Button variant="outline" onClick={() => states.refetch()}>Retry statuses</Button>
              </div>
            )}
          </section>
        )}
        {taskId && current && editing && states.data && (
          <TaskForm
            key={current.id}
            workspace={workspace}
            project={project.id}
            states={states.data}
            task={current}
            onSaved={() => setEditing(false)}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>
    </div>
  );
}
