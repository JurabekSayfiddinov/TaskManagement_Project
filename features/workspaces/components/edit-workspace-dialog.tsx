
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUpdateWorkspace } from "../hooks/use-workspaces";
import type { Workspace } from "../types/workspace";

interface Props {
  workspace: Workspace;
}

export function EditWorkspaceDialog({ workspace }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(workspace.name);

  const updateMutation = useUpdateWorkspace();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim() || updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync({
        slug: workspace.slug,
        data: {
          name: name.trim(),
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
        if (updateMutation.isPending) return;

        setOpen(value);

        if (value) {
          setName(workspace.name);
          updateMutation.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit workspace"
          />
        }
      >
        <Pencil size={16} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[448px]">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <Pencil size={22} />
          </div>

          <DialogTitle>Edit Workspace</DialogTitle>

          <DialogDescription>
            Update your workspace information.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor={`name-${workspace.id}`}
              className="text-sm font-medium"
            >
              Workspace Name
            </label>

            <Input
              id={`name-${workspace.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Workspace Slug
            </label>

            <Input
              value={workspace.slug}
              aria-label="Workspace slug"
              readOnly
              className="h-10 bg-muted"
            />

            <p className="text-xs text-muted-foreground">
              Unique identifier for your workspace.
            </p>
          </div>

          {updateMutation.isError && (
            <p className="text-sm text-red-600">
              {updateMutation.error.message}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !name.trim() ||
                name.trim() === workspace.name ||
                updateMutation.isPending
              }
            >
              {updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
