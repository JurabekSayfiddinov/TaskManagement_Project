
"use client";

import { useState } from "react";
import { Plus, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { CreateWorkspaceDto } from "../types/workspace";

interface Props {
  onCreate: (data: CreateWorkspaceDto) => void;
}

export function CreateWorkspaceDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onCreate({ name: name.trim(), slug });

    setName("");
    setSlug("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button />}
      >
        <Plus size={16} />
        Create Workspace
      </DialogTrigger>

      <DialogContent className="sm:max-w-[448px]">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <Building2 size={22} />
          </div>

          <DialogTitle>Create Workspace</DialogTitle>

          <DialogDescription>
            Create a workspace to organize your projects
            and collaborate with your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="workspace-name"
              className="text-sm font-medium"
            >
              Workspace Name
            </label>

            <Input
              id="workspace-name"
              placeholder="Acme Corp"
              value={name}
              onChange={(e) => {
                const value = e.target.value;

                setName(value);

                setSlug(
                  value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                    .slice(0, 50)
                );
              }}
              required
              maxLength={100}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workspace-slug"
              className="text-sm font-medium"
            >
              Workspace Slug
            </label>

            <Input
              id="workspace-slug"
              placeholder="acme-corp"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              pattern="[a-z0-9\-]+"
              className="h-10"
            />

            <p className="text-xs text-muted-foreground">
              Use lowercase letters, numbers and hyphens.
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

            <Button type="submit" disabled={!name.trim()}>
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
