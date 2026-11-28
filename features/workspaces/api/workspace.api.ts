
import { api } from "@/lib/api";

import type {
  Workspace,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "../types/workspace";

export async function getWorkspaces() {
  const { data } = await api.get<Workspace[]>(
    "/workspaces/"
  );

  return data;
}

export async function createWorkspace(
  workspace: CreateWorkspaceDto
) {
  const { data } = await api.post<Workspace>(
    "/workspaces/",
    workspace
  );

  return data;
}

export async function updateWorkspace(
  slug: string,
  workspace: UpdateWorkspaceDto
) {
  const { data } = await api.patch<Workspace>(
    `/workspaces/${slug}`,
    workspace
  );

  return data;
}

export async function deleteWorkspace(slug: string) {
  await api.delete(`/workspaces/${slug}`);
}
