
"use client";

import { useState } from "react";
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

import { InviteMemberDialog } from
  "@/features/members/components/invite-member-dialog";

import type {
  Member,
  MemberRole,
  InviteMemberDto,
} from "@/features/members/types/member";

const roleStyles: Record<MemberRole, string> = {
  owner: "bg-purple-100 text-purple-700",
  admin: "bg-indigo-100 text-indigo-700",
  member: "bg-blue-100 text-blue-700",
  guest: "bg-gray-100 text-gray-700",
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [invitations, setInvitations] =
    useState<InviteMemberDto[]>([]);

  function handleInvite(data: InviteMemberDto) {
    setInvitations((prev) => [...prev, data]);
  }

  function handleRoleChange(
    userId: string,
    role: MemberRole
  ) {
    setMembers((prev) =>
      prev.map((member) =>
        member.user_id === userId
          ? { ...member, role }
          : member
      )
    );
  }

  function handleRemove(userId: string) {
    if (!window.confirm("Remove this member?")) return;

    setMembers((prev) =>
      prev.filter((member) => member.user_id !== userId)
    );
  }

  const filteredMembers = members.filter((member) =>
    `${member.user.display_name} ${member.user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
 
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Members
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage employees and workspace permissions.
          </p>
        </div>

        <InviteMemberDialog onInvite={handleInvite} />
      </div>

    
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
            {
              members.filter((m) =>
                ["admin", "owner"].includes(m.role)
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <Users className="mb-3 size-5 text-primary" />

          <p className="text-sm text-muted-foreground">
            Draft Invitations
          </p>

          <p className="mt-1 text-3xl font-bold">
            {invitations.length}
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
                        {member.user.display_name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <span className="font-medium">
                        {member.user.display_name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {member.user.email}
                  </TableCell>

                  <TableCell>
                    {member.role === "owner" ? (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                        Owner
                      </span>
                    ) : (
                      <select
                        aria-label={`Role for ${member.user.display_name}`}
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(
                            member.user_id,
                            e.target.value as MemberRole
                          )
                        }
                        className={`rounded-md px-2 py-1 text-xs font-medium ${roleStyles[member.role]}`}
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="guest">Guest</option>
                      </select>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {new Date(
                      member.created_at
                    ).toLocaleDateString("en-US")}
                  </TableCell>

                  <TableCell className="text-right">
                    {member.role !== "owner" && (
                      <button
                        type="button"
                        aria-label={`Remove ${member.user.display_name}`}
                        onClick={() =>
                          handleRemove(member.user_id)
                        }
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
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

    
      {invitations.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold">
            Invitation Drafts
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            These invitations have not been sent yet.
          </p>

          <div className="mt-4 divide-y">
            {invitations.map((invite, index) => (
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

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                  Draft
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
