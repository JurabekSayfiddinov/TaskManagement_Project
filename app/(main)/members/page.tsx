
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Search,
  Users,
  Trash2,
  ShieldCheck,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog";

import { useWorkspace } from "@/features/workspaces/context/workspace-context";

import {
  useMembers,
  useInviteMember,
  useUpdateMember,
  useDeleteMember,
} from "@/features/members/hooks/use-members";

import type {
  MemberRole,
  InviteMemberDto,
  Invitation,
} from "@/features/members/types/member";

const roleStyles: Record<MemberRole, string> = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-indigo-100 text-indigo-700",
  member: "bg-blue-100 text-blue-700",
  guest: "bg-gray-100 text-gray-700",
};

export default function MembersPage() {
  const { workspaceSlug, workspace, isPending: workspacePending,
    isError: workspaceError } = useWorkspace();

  if (workspacePending) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-48 rounded-xl bg-muted" />
      </div>
    );
  }

  if (workspaceError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center text-red-600">
        Failed to load workspaces.
      </div>
    );
  }

  if (!workspaceSlug) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        Select a workspace first.
      </div>
    );
  }

  return (
    <MembersContent
      key={workspaceSlug}
      workspaceSlug={workspaceSlug}
      workspaceName={workspace?.name}
    />
  );
}

function MembersContent({
  workspaceSlug,
  workspaceName,
}: {
  workspaceSlug: string;
  workspaceName?: string;
}) {
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
const [createdInvitations, setCreatedInvitations] =
  useState<Invitation[]>([]);

  
  const {
    data: members = [],
    isPending,
    isError,
    error,
    refetch,
  } = useMembers(workspaceSlug);
  const { data: currentUser } = useQuery({
  queryKey: ["current-user"],
  queryFn: async () => {
    const { data } = await api.get<{ id: string }>("/auth/me");
    return data;
  },
});

const currentMember = members.find(
  (member) => member.user_id === currentUser?.id
);

const canManageMembers =
  currentMember?.role === "owner" ||
  currentMember?.role === "admin";

  
  const inviteMutation = useInviteMember(workspaceSlug);
  const updateMutation = useUpdateMember(workspaceSlug);
  const deleteMutation = useDeleteMember(workspaceSlug);

  const isMutating =
    inviteMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
async function handleInvite(data: InviteMemberDto) {
  setActionError("");

  const invitation =
    await inviteMutation.mutateAsync(data);

  setCreatedInvitations((prev) => [
    ...prev,
    invitation,
  ]);
}

  async function handleRoleChange(
    userId: string,
    role: Exclude<MemberRole, "owner">
  ) {
    setActionError("");

    try {
      await updateMutation.mutateAsync({
        userId,
        data: { role },
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update member."
      );
    }
  }
  

  async function handleRemove(userId: string) {
    if (!window.confirm("Remove this member?")) return;

    setActionError("");

    try {
      await deleteMutation.mutateAsync(userId);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to remove member."
      );
    }
  }

  const filteredMembers = members.filter((member) =>
    `${member.user.display_name ?? ""} ${member.user.email}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const administrators = members.filter(
    (member) =>
      member.role === "admin" ||
      member.role === "owner"
  ).length;

async function handleCopyLink(token: string) {
  setActionError("");

  const link =
    `${window.location.origin}/invites/${encodeURIComponent(token)}`;

  try {
    await navigator.clipboard.writeText(link);

    setCopiedToken(token);

    setTimeout(() => {
      setCopiedToken((current) =>
        current === token ? null : current
      );
    }, 2000);
  } catch {
    setActionError("Failed to copy invitation link.");
  }
}
  if (isPending) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />

        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-xl border bg-muted"
            />
          ))}
        </div>

        <div className="h-56 rounded-xl bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <h2 className="font-semibold text-red-600">
          Failed to load members
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
  
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Members
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage employees and permissions in {workspaceName}.
          </p>
        </div>

        <InviteMemberDialog onInvite={handleInvite} />
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {actionError}
        </div>
      )}


      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <Users className="mb-3 size-5 text-primary" />

          <p className="text-sm text-muted-foreground">
            Total Members
          </p>

          <p className="mt-1 text-3xl font-bold">
            {members.length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <ShieldCheck className="mb-3 size-5 text-primary" />

          <p className="text-sm text-muted-foreground">
            Administrators
          </p>

          <p className="mt-1 text-3xl font-bold">
            {administrators}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <Users className="mb-3 size-5 text-primary" />

          <p className="text-sm text-muted-foreground">
            Invitations Created This Visit
          </p>

          <p className="mt-1 text-3xl font-bold">
            {createdInvitations.length}
          </p>
        </div>
      </div>

    
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

     
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Employee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-muted-foreground"
                >
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">
                        {(member.user.display_name || member.user.email)
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <span className="font-medium">
                        {member.user.display_name || "User"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {member.user.email}
                  </TableCell>

                <TableCell>
  {canManageMembers &&
  member.role !== "owner" &&
  member.user_id !== currentUser?.id ? (
    <select
      aria-label={`Role for ${member.user.email}`}
      value={member.role}
      disabled={isMutating}
      onChange={(e) =>
        handleRoleChange(
          member.user_id,
          e.target.value as Exclude<MemberRole, "owner">
        )
      }
      className={`rounded-md px-2 py-1 text-xs font-medium ${roleStyles[member.role]}`}
    >
      <option value="admin">Admin</option>
      <option value="member">Member</option>
      <option value="guest">Guest</option>
    </select>
  ) : (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${roleStyles[member.role]}`}
    >
      {member.role}
    </span>
  )}
</TableCell>

                  <TableCell className="text-muted-foreground">
                    {new Date(
                      member.created_at
                    ).toLocaleDateString("en-US")}
                  </TableCell>

                <TableCell className="text-right">
  {canManageMembers &&
    member.role !== "owner" &&
    member.user_id !== currentUser?.id && (
      <button
        type="button"
        disabled={isMutating}
        aria-label={`Remove ${member.user.email}`}
        onClick={() => handleRemove(member.user_id)}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    )}
</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>


      {createdInvitations.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold">
            Invitations Created This Visit
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Invitations successfully created through the API.
          </p>

          <div className="mt-4 divide-y">
            {createdInvitations.map((invite, index) => (
              <div
                key={`${invite.email}-${index}`}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {invite.email}
                  </p>

                  <p className="text-xs capitalize text-muted-foreground">
                    {invite.role}
                  </p>
                </div>

           <button
  type="button"
  onClick={() => handleCopyLink(invite.token)}
  className={`rounded-md border px-3 py-2 text-xs font-medium transition-all ${
    copiedToken === invite.token
      ? "border-green-200 bg-green-50 text-green-600"
      : "hover:bg-muted"
  }`}
>
  {copiedToken === invite.token
    ? "✓ Copied"
    : "Copy Link"}
</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
