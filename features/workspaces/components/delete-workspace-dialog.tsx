
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

import { useDeleteWorkspace } from "../hooks/use-workspaces";
import type { Workspace } from "../types/workspace";

interface Props {
  workspace: Workspace;
}

export function DeleteWorkspaceDialog({ workspace }: Props) {
  const [open, setOpen] = useState(false);

  const deleteMutation = useDeleteWorkspace();

  async function handleDelete() {
    if (deleteMutation.isPending) return;

    try {
      await deleteMutation.mutateAsync(workspace.slug);
      setOpen(false);
    } catch {
      // Error is displayed inside the dialog.
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (deleteMutation.isPending) return;

        setOpen(value);

        if (value) {
          deleteMutation.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete workspace"
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

          <DialogTitle>Delete Workspace</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{workspace.name}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {deleteMutation.isError && (
          <p className="text-sm text-red-600">
            {deleteMutation.error.message}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={deleteMutation.isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
