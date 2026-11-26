
"use client";

import { useState } from "react";
import { Plus, Tag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Label } from "../types/label";

export function LabelManagement() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5");

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;

    setLabels((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        color,
      },
    ]);

    setName("");
  }

  function handleRemove(id: string) {
    if (!window.confirm("Delete this label?")) return;

    setLabels((prev) =>
      prev.filter((label) => label.id !== id)
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <Tag className="size-5 text-primary" />

          <h2 className="font-semibold">Labels</h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Organize and categorize your project tasks.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="flex flex-wrap items-end gap-3 border-b p-5"
      >
        <div className="min-w-40 flex-1 space-y-2">
          <label
            htmlFor="label-name"
            className="text-sm font-medium"
          >
            Label Name
          </label>

          <Input
            id="label-name"
            placeholder="Frontend"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="label-color"
            className="text-sm font-medium"
          >
            Color
          </label>

          <input
            id="label-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="block h-9 w-12 cursor-pointer rounded-md border bg-card p-1"
          />
        </div>

        <Button type="submit" disabled={!name.trim()}>
          <Plus size={16} />
          Add Label
        </Button>
      </form>

      <div className="divide-y">
        {labels.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No labels created yet.
          </p>
        ) : (
          labels.map((label) => (
            <div
              key={label.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  color: label.color,
                  backgroundColor: `${label.color}15`,
                }}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: label.color }}
                />

                {label.name}
              </span>

              <button
                type="button"
                aria-label={`Delete ${label.name}`}
                onClick={() => handleRemove(label.id)}
                className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
