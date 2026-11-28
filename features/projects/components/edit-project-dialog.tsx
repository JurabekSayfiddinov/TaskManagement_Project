
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUpdateProject } from "../hooks/use-projects";
import type { Project } from "../types/project";

interface Props {
  project: Project;
  workspaceSlug: string;
}

export function EditProjectDialog({
  project,
  workspaceSlug,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(
    project.description ?? ""
  );

  const mutation = useUpdateProject(workspaceSlug);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim() || mutation.isPending) return;

    try {
      await mutation.mutateAsync({
        projectId: project.id,
        data: {
          name: name.trim(),
          description: description.trim() || null,
        },
      });

      setOpen(false);
    } catch {
  
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (mutation.isPending) return;

        setOpen(value);

        if (value) {
          setName(project.name);
          setDescription(project.description ?? "");
          mutation.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit project"
          />
        }
      >
        <Pencil size={16} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <Pencil size={22} />
          </div>

          <DialogTitle>Edit Project</DialogTitle>

          <DialogDescription>
            Update your project information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor={`project-name-${project.id}`}
              className="text-sm font-medium"
            >
              Project Name
            </label>

            <Input
              id={`project-name-${project.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Project Identifier
            </label>

            <Input
              value={project.identifier}
              aria-label="Project identifier"
              readOnly
              className="h-10 bg-muted"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`description-${project.id}`}
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id={`description-${project.id}`}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              maxLength={500}
              className="min-h-24 resize-none"
            />
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-600">
              {mutation.error.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || mutation.isPending}
            >
              {mutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
