
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getMembers,
  inviteMember,
  updateMember,
  deleteMember,
  acceptInvitation,
} from "../api/member.api";
import type {
  InviteMemberDto,
  UpdateMemberDto,
} from "../types/member";

export function useMembers(workspaceSlug?: string) {
  return useQuery({
    queryKey: ["members", workspaceSlug],
    queryFn: () => getMembers(workspaceSlug!),
    enabled: !!workspaceSlug,
  });
}

export function useInviteMember(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteMemberDto) => {
      if (!workspaceSlug) {
        throw new Error("Select a workspace first.");
      }

      return inviteMember(workspaceSlug, data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["members", workspaceSlug],
      });
    },
  });
}

export function useUpdateMember(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateMemberDto;
    }) => {
      if (!workspaceSlug) {
        throw new Error("Select a workspace first.");
      }

      return updateMember(workspaceSlug, userId, data);
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["members", workspaceSlug],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}

export function useDeleteMember(workspaceSlug?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      if (!workspaceSlug) {
        throw new Error("Select a workspace first.");
      }

      return deleteMember(workspaceSlug, userId);
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["members", workspaceSlug],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["workspaces"],
        }),
      ]);
    },
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) =>
      acceptInvitation(token),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["workspaces"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["members"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}
