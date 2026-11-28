
"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDeleteProject } from "../hooks/use-projects";
import type { Project } from "../types/project";

interface Props {
  project: Project;
  workspaceSlug: string;
}

export function DeleteProjectDialog({
  project,
  workspaceSlug,
}: Props) {
  const [open, setOpen] = useState(false);

  const mutation = useDeleteProject(workspaceSlug);

  async function handleDelete() {
    if (mutation.isPending) return;

    try {
      await mutation.mutateAsync(project.id);
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
          mutation.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete project"
            className="hover:bg-red-50 hover:text-red-600"
          />
        }
      >
        <Trash2 size={16} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[448px]">
        <DialogHeader>
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <DialogTitle>Delete Project</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{project.name}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

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
            type="button"
            variant="destructive"
            disabled={mutation.isPending}
            onClick={handleDelete}
          >
            {mutation.isPending
              ? "Deleting..."
              : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
