import { api } from "@/lib/api";

import type {
  State,
  CreateStateDto,
  UpdateStateDto,
} from "../types/state";

function getBasePath(
  workspaceSlug: string,
  projectId: string
) {
  return `/workspaces/${workspaceSlug}/projects/${projectId}/states`;
}

export async function getStates(
  workspaceSlug: string,
  projectId: string
) {
  const { data } = await api.get<State[]>(
    `${getBasePath(workspaceSlug, projectId)}/`
  );

  return data;
}

export async function createState(
  workspaceSlug: string,
  projectId: string,
  payload: CreateStateDto
) {
  const { data } = await api.post<State>(
    `${getBasePath(workspaceSlug, projectId)}/`,
    payload
  );

  return data;
}

export async function updateState(
  workspaceSlug: string,
  projectId: string,
  stateId: string,
  payload: UpdateStateDto
) {
  const { data } = await api.patch<State>(
    `${getBasePath(workspaceSlug, projectId)}/${stateId}`,
    payload
  );

  return data;
}

export async function deleteState(
  workspaceSlug: string,
  projectId: string,
  stateId: string,
  transferToStateId?: string
) {
  await api.delete(
    `${getBasePath(workspaceSlug, projectId)}/${stateId}`,
    {
      data: transferToStateId
        ? { transfer_to_state_id: transferToStateId }
        : {},
    }
  );
}