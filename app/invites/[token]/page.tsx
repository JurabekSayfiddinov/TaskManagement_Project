
"use client";

import { useParams, useRouter } from "next/navigation";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getInvitation } from "@/features/members/api/member.api";
import { Button } from "@/components/ui/button";
import { useAcceptInvitation } from "@/features/members/hooks/use-members";

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const mutation = useAcceptInvitation();
const {
  data: invitation,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["invitation", token],
  queryFn: () => getInvitation(token),
  enabled: !!token,
  retry: false,
});
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent text-primary">
          {mutation.isSuccess ? (
            <CheckCircle2 size={32} />
          ) : (
            <UserPlus size={32} />
          )}
        </div>

        <h1 className="text-2xl font-semibold">
          {mutation.isSuccess
            ? "Invitation Accepted"
            : "Workspace Invitation"}
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          {mutation.isSuccess
            ? "You are now a member of the workspace."
            : "You have been invited to join a workspace."}
        </p>
{invitation && !mutation.isSuccess && (
  <div className="mt-5 space-y-3 rounded-xl border bg-muted/30 p-4 text-left">
    <div>
      <p className="text-xs text-muted-foreground">
        Workspace
      </p>
      <p className="font-semibold">
        {invitation.workspace.name}
      </p>
    </div>

    <div>
      <p className="text-xs text-muted-foreground">
        Email
      </p>
      <p className="text-sm">
        {invitation.email}
      </p>
    </div>

    <div>
      <p className="text-xs text-muted-foreground">
        Invited by
      </p>
      <p className="text-sm">
        {invitation.invited_by.display_name}
      </p>
    </div>

    <div>
      <p className="text-xs text-muted-foreground">
        Role
      </p>
      <p className="text-sm capitalize">
        {invitation.role}
      </p>
    </div>
  </div>
)}
        {mutation.isError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {mutation.error.message}
          </div>
        )}

        {mutation.isSuccess ? (
          <Button
            className="mt-6 w-full"
            onClick={() => router.replace("/workspaces")}
          >
            Go to Workspaces
          </Button>
        ) : (
          <Button
            className="mt-6 w-full"
            disabled={mutation.isPending || !token}
            onClick={() => mutation.mutate(token)}
          >
            {mutation.isPending && (
              <Loader2 size={16} className="animate-spin" />
            )}

            {mutation.isPending
              ? "Accepting..."
              : "Accept Invitation"}
          </Button>
        )}
      </div>
    </div>
  );
}
