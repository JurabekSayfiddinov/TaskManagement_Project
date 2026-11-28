
"use client";

import { useState } from "react";
import { Layers, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { Module } from "../types/module";

export function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) return;

    const module: Module = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || null,
    };

    setModules((prev) => [...prev, module]);

    setName("");
    setDescription("");
  }

  function handleRemove(id: string) {
    if (!window.confirm("Delete this module?")) return;

    setModules((prev) =>
      prev.filter((module) => module.id !== id)
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          <h2 className="font-semibold">Modules</h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Organize project tasks into functional modules.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="space-y-4 border-b p-5"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Module Name
          </label>

          <Input
            placeholder="Authentication"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description
          </label>

          <Textarea
            placeholder="Describe this module..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
        </div>

        <Button type="submit" disabled={!name.trim()}>
          <Plus size={16} />
          Create Module
        </Button>
      </form>

      <div className="divide-y">
        {modules.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No modules created yet.
          </p>
        ) : (
          modules.map((module) => (
            <div
              key={module.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Layers size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    {module.name}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {module.description || "No description"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label={`Delete ${module.name}`}
                onClick={() => handleRemove(module.id)}
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
