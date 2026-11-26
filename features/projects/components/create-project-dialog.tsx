
"use client";

import { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";

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

import type { CreateProjectDto } from "../types/project";

interface Props {
  onCreate: (data: CreateProjectDto) => void;
}

export function CreateProjectDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onCreate({
      name: name.trim(),
      identifier,
      description: description.trim(),
    });

    setName("");
    setIdentifier("");
    setDescription("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus size={16} />
        Create Project
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <FolderKanban size={22} />
          </div>

          <DialogTitle>Create Project</DialogTitle>

          <DialogDescription>
            Create a new project to organize your team's
            tasks and track progress.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="text-sm font-medium"
            >
              Project Name
            </label>

            <Input
              id="project-name"
              placeholder="Web Platform"
              value={name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);

                setIdentifier(
                  value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 4)
                );
              }}
              required
              maxLength={100}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-identifier"
              className="text-sm font-medium"
            >
              Project Identifier
            </label>

            <Input
              id="project-identifier"
              placeholder="WEB"
              value={identifier}
              onChange={(e) =>
                setIdentifier(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                )
              }
              required
              minLength={1}
              maxLength={10}
              pattern="[A-Z0-9]+"
              className="h-10"
            />

            <p className="text-xs text-muted-foreground">
              Used in task IDs, for example WEB-104.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-description"
              className="text-sm font-medium"
            >
              Description (Optional)
            </label>

            <Textarea
              id="project-description"
              placeholder="Describe the purpose of this project..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              maxLength={500}
              className="min-h-24 resize-none"
            />

            <p className="text-right text-xs text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || !identifier}
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
