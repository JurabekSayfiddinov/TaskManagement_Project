
"use client";

import { useState } from "react";
import { CalendarRange, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cycle } from "../types/cycles";



export function CycleManagement() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !startDate || !endDate) return;

    if (endDate < startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    const cycle: Cycle = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || null,
      start_date: startDate,
      end_date: endDate,
    };

    setCycles((prev) => [...prev, cycle]);

    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setError("");
  }

  function handleRemove(id: string) {
    if (!window.confirm("Delete this cycle?")) return;

    setCycles((prev) =>
      prev.filter((cycle) => cycle.id !== id)
    );
  }

  function getStatus(cycle: Cycle) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;

    if (date < cycle.start_date) return "Upcoming";
    if (date > cycle.end_date) return "Completed";

    return "Active";
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-2">
          <CalendarRange className="size-5 text-primary" />
          <h2 className="font-semibold">Cycles</h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Plan and organize your project sprints.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="space-y-4 border-b p-5"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Cycle Name
          </label>

          <Input
            placeholder="Sprint 1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Start Date
            </label>

            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              End Date
            </label>

            <Input
              type="date"
              min={startDate || undefined}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button
          type="submit"
          disabled={!name.trim() || !startDate || !endDate}
        >
          <Plus size={16} />
          Create Cycle
        </Button>
      </form>

      <div className="divide-y">
        {cycles.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No cycles created yet.
          </p>
        ) : (
          cycles.map((cycle) => (
            <div
              key={cycle.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div>
                <h3 className="text-sm font-semibold">
                  {cycle.name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {cycle.start_date} — {cycle.end_date}
                </p>

                {cycle.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cycle.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
                  {getStatus(cycle)}
                </span>

                <button
                  type="button"
                  aria-label={`Delete ${cycle.name}`}
                  onClick={() => handleRemove(cycle.id)}
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
