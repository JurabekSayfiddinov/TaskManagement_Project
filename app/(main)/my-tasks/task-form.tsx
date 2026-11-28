"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTask, taskError, updateTask, type Task, type TaskInput, type TaskState } from "./task-api";

interface Props {
  workspace: string;
  project: string;
  states: TaskState[];
  task?: Task;
  currentUserId?: string;
  onSaved: (task: Task) => void;
  onCancel?: () => void;
}

export function TaskForm({ workspace, project, states, task, currentUserId, onSaved, onCancel }: Props) {
  const queryClient = useQueryClient();
  const defaultState = states.find((state) => state.is_default) ?? states[0];
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [stateId, setStateId] = useState(task?.state_id ?? defaultState?.id ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "none");
  const [startDate, setStartDate] = useState(task?.start_date?.slice(0, 10) ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date?.slice(0, 10) ?? "");
  const [estimate, setEstimate] = useState(task?.estimate_points?.toString() ?? "");
  const [assignToMe, setAssignToMe] = useState(true);

  const save = useMutation({
    mutationFn: (input: TaskInput) => {
      if (task) return updateTask(workspace, project, task.id, input);
      return createTask(workspace, project, input, assignToMe ? currentUserId : undefined);
    },
    async onSuccess(saved) {
      const detailKey = ["task", workspace, project, saved.id];
      await queryClient.cancelQueries({ queryKey: detailKey });
      queryClient.setQueryData(detailKey, saved);
      void queryClient.invalidateQueries({ queryKey: ["tasks", workspace, project] });
      onSaved(saved);
    },
  });
  const datesInvalid = Boolean(startDate && dueDate && startDate > dueDate);
  const stateAvailable = states.some((state) => state.id === stateId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (save.isPending || !title.trim() || !stateAvailable || datesInvalid) return;

    const input = {
      title: title.trim(),
      description: description.trim(),
      state_id: stateId,
      priority,
      start_date: startDate || null,
      due_date: dueDate || null,
      estimate_points: estimate === "" ? null : Number(estimate),
    };
    save.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-5">
      <h2 className="font-semibold">{task ? "Edit task" : "New task"}</h2>
      <fieldset disabled={save.isPending} className="space-y-4">
        <label className="block space-y-1 text-sm">
          <span>Title</span>
          <Input required maxLength={500} value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Description</span>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span>Status</span>
            <select required value={stateAvailable ? stateId : ""} onChange={(event) => setStateId(event.target.value)} className="block h-9 w-full rounded-md border bg-background px-2">
              <option value="" disabled>Select a status</option>
              {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span>Priority</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value)} className="block h-9 w-full rounded-md border bg-background px-2">
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span>Start date</span>
            <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Due date</span>
            <Input type="date" min={startDate || undefined} value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>Estimate points</span>
            <Input type="number" step="any" value={estimate} onChange={(event) => setEstimate(event.target.value)} />
          </label>
        </div>
        {!task && currentUserId && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={assignToMe} onChange={(event) => setAssignToMe(event.target.checked)} />
            Assign to me
          </label>
        )}
      </fieldset>
      {datesInvalid && <p role="alert" className="text-sm text-destructive">The due date must be on or after the start date.</p>}
      {save.isError && <p role="alert" className="text-sm text-destructive">{taskError(save.error, "Could not save the task.")}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={save.isPending || !title.trim() || !stateAvailable || datesInvalid}>
          {save.isPending ? "Saving…" : task ? "Save changes" : "Create task"}
        </Button>
        {onCancel && <Button type="button" variant="outline" disabled={save.isPending} onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
