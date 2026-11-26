
"use client";

import { useState } from "react";
import { Plus, Trash2, CircleDashed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { State, StateGroup } from "../types/state";

const groups: { value: StateGroup; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "unstarted", label: "To Do" },
  { value: "started", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function StateManagement() {
  const [states, setStates] = useState<State[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [group, setGroup] =
    useState<StateGroup>("unstarted");

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;

    setStates((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        color,
        group,
      },
    ]);

    setName("");
  }

  function handleRemove(id: string) {
    if (!window.confirm("Delete this state?")) return;

    setStates((prev) =>
      prev.filter((state) => state.id !== id)
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <CircleDashed className="size-5 text-primary" />
          <h2 className="font-semibold">States</h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage the workflow and statuses of your tasks.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="flex flex-wrap items-end gap-3 border-b p-5"
      >
        <div className="min-w-40 flex-1 space-y-2">
          <label
            htmlFor="state-name"
            className="text-sm font-medium"
          >
            State Name
          </label>

          <Input
            id="state-name"
            placeholder="In Review"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="state-group"
            className="text-sm font-medium"
          >
            Group
          </label>

          <select
            id="state-group"
            value={group}
            onChange={(e) =>
              setGroup(e.target.value as StateGroup)
            }
            className="block h-9 rounded-md border border-input bg-card px-3 text-sm"
          >
            {groups.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="state-color"
            className="text-sm font-medium"
          >
            Color
          </label>

          <input
            id="state-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="block h-9 w-12 cursor-pointer rounded-md border bg-card p-1"
          />
        </div>

        <Button type="submit" disabled={!name.trim()}>
          <Plus size={16} />
          Add State
        </Button>
      </form>

      <div className="divide-y">
        {states.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No states created yet.
          </p>
        ) : (
          states.map((state) => (
            <div
              key={state.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: state.color }}
                />

                <span className="text-sm font-medium">
                  {state.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {
                    groups.find(
                      (item) => item.value === state.group
                    )?.label
                  }
                </span>

                <button
                  type="button"
                  aria-label={`Delete ${state.name}`}
                  onClick={() => handleRemove(state.id)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
