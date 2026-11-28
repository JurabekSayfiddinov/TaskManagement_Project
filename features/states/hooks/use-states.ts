import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getStates,
  createState,
  updateState,
  deleteState,
} from "../api/state.api";

import type {
  CreateStateDto,
  UpdateStateDto,
} from "../types/state";

export function useStates(
  workspaceSlug: string,
  projectId: string
) {
  return useQuery({
    queryKey: ["states", workspaceSlug, projectId],
    queryFn: () => getStates(workspaceSlug, projectId),
    enabled: !!workspaceSlug && !!projectId,
  });
}

export function useCreateState(
  workspaceSlug: string,
  projectId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStateDto) =>
      createState(workspaceSlug, projectId, data),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["states", workspaceSlug, projectId],
      }),
  });
}

export function useUpdateState(
  workspaceSlug: string,
  projectId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stateId,
      data,
    }: {
      stateId: string;
      data: UpdateStateDto;
    }) =>
      updateState(
        workspaceSlug,
        projectId,
        stateId,
        data
      ),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["states", workspaceSlug, projectId],
      }),
  });
}

export function useDeleteState(
  workspaceSlug: string,
  projectId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stateId: string) =>
      deleteState(workspaceSlug, projectId, stateId),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["states", workspaceSlug, projectId],
      }),
  });
}