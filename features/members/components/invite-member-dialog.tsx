
"use client";

import { useState } from "react";
import { UserPlus, Mail } from "lucide-react";

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

import type { InviteMemberDto } from "../types/member";

interface Props {
  onInvite: (data: InviteMemberDto) => void;
}

export function InviteMemberDialog({ onInvite }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<InviteMemberDto["role"]>("member");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onInvite({
      email: email.trim(),
      role,
    });

    setEmail("");
    setRole("member");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UserPlus size={16} />
        Invite Member
      </DialogTrigger>

      <DialogContent className="sm:max-w-[448px]">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
            <UserPlus size={22} />
          </div>

          <DialogTitle>Invite Employee</DialogTitle>

          <DialogDescription>
            Invite a teammate to join your workspace.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="invite-email"
              className="text-sm font-medium"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="invite-email"
                type="email"
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="invite-role"
              className="text-sm font-medium"
            >
              Workspace Role
            </label>

            <select
              id="invite-role"
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value as InviteMemberDto["role"]
                )
              }
              className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>

            <p className="text-xs text-muted-foreground">
              Select a role for the invited employee.
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

            <Button type="submit" disabled={!email.trim()}>
              <Mail size={16} />
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
