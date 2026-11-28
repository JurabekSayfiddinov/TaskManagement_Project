"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardCode,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CalendarDays } from "lucide-react";
import type { Task, TaskState } from "./task-api";

interface Props {
  tasks: Task[];
  states: TaskState[];
  projectIdentifier: string;
  selectedId: string;
  disabled: boolean;
  onOpen: (taskId: string) => void;
  onMove: (taskId: string, stateId: string) => void;
}

export function TaskBoard({ tasks, states, projectIdentifier, selectedId, disabled, onOpen, onMove }: Props) {
  const [draggedId, setDraggedId] = useState("");
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 7 } }),
    useSensor(KeyboardSensor, {
      keyboardCodes: {
        start: [KeyboardCode.Space],
        cancel: [KeyboardCode.Esc],
        end: [KeyboardCode.Space, KeyboardCode.Tab],
      },
    }),
  );
  const draggedTask = tasks.find((task) => task.id === draggedId);
  const unknownTasks = tasks.filter((task) => !states.some((state) => state.id === task.state_id));

  function handleDrop({ active, over }: DragEndEvent) {
    setDraggedId("");
    if (disabled || !over) return;

    const task = tasks.find((item) => item.id === active.id);
    const state = states.find((item) => item.id === over.id);
    if (task && state && task.state_id !== state.id) {
      onMove(task.id, state.id);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      accessibility={{
        screenReaderInstructions: {
          draggable: "Press Enter to open a task. Press Space to pick it up, use the arrow keys to move it, then press Space to drop or Escape to cancel.",
        },
      }}
      onDragStart={({ active }) => setDraggedId(String(active.id))}
      onDragCancel={() => setDraggedId("")}
      onDragEnd={handleDrop}
    >
      <div className="flex items-stretch gap-3 overflow-x-auto px-1 pt-1 pb-3">
        {states.map((state) => {
          const columnTasks = tasks.filter((task) => task.state_id === state.id);
          return (
            <TaskColumn key={state.id} id={state.id} name={state.name} color={state.color} count={columnTasks.length} disabled={disabled}>
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectIdentifier={projectIdentifier}
                  selected={task.id === selectedId}
                  disabled={disabled}
                  onOpen={() => onOpen(task.id)}
                />
              ))}
            </TaskColumn>
          );
        })}
        {unknownTasks.length > 0 && (
          <TaskColumn id="unknown-status" name="Unknown status" count={unknownTasks.length} disabled>
            {unknownTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projectIdentifier={projectIdentifier}
                selected={task.id === selectedId}
                disabled={disabled}
                onOpen={() => onOpen(task.id)}
              />
            ))}
          </TaskColumn>
        )}
      </div>
      <DragOverlay dropAnimation={null}>
        {draggedTask && (
          <div className="space-y-1 rounded-xl border border-primary bg-card p-3 text-sm shadow-lg">
            <p className="text-xs font-semibold text-primary">{projectIdentifier}-{draggedTask.sequence_id}</p>
            <p className="break-words font-semibold">{draggedTask.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

interface ColumnProps {
  id: string;
  name: string;
  color?: string;
  count: number;
  disabled: boolean;
  children: ReactNode;
}

function TaskColumn({ id, name, color, count, disabled, children }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  const statusColor = color && /^#[0-9a-f]{6}$/i.test(color) ? color : "var(--primary)";

  return (
    <section
      ref={setNodeRef}
      aria-label={name}
      className={`min-h-72 min-w-52 flex-[1_0_13rem] space-y-2 overflow-hidden rounded-xl border bg-muted/50 p-3 transition-colors ${isOver ? "border-primary bg-accent ring-2 ring-primary/20" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 rounded-md border-l-4 bg-card px-3 py-2" style={{ borderLeftColor: statusColor }}>
        <h3 className="break-words text-sm font-semibold">{name}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">{count}</span>
      </div>
      {children}
      {count === 0 && (
        <p className={`rounded-lg border border-dashed px-2 py-5 text-center text-xs ${isOver ? "border-primary/50 text-primary" : "text-muted-foreground"}`}>
          {isOver ? "Drop to move here" : "No tasks"}
        </p>
      )}
    </section>
  );
}

interface CardProps {
  task: Task;
  projectIdentifier: string;
  selected: boolean;
  disabled: boolean;
  onOpen: () => void;
}

function TaskCard({ task, projectIdentifier, selected, disabled, onOpen }: CardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      aria-disabled={undefined}
      aria-pressed={selected}
      onClick={onOpen}
      className={`block w-full select-none rounded-xl border bg-card p-3 text-left shadow-xs transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${disabled ? "" : "cursor-grab active:cursor-grabbing"} ${isDragging ? "opacity-35" : ""} ${selected ? "border-primary/60 bg-accent/40" : ""}`}
    >
      <span className="flex flex-wrap items-center justify-between gap-1">
        <span className="text-xs font-semibold text-primary">{projectIdentifier}-{task.sequence_id}</span>
        {task.priority !== "none" && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">{task.priority}</span>
        )}
      </span>
      <span className="mt-1 block break-words text-sm font-semibold leading-snug">{task.title}</span>
      {task.due_date && (
        <span className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" size={13} /> Due {task.due_date.slice(0, 10)}
        </span>
      )}
    </button>
  );
}
