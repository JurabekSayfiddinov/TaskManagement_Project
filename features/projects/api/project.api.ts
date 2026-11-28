
import { api } from "@/lib/api";

import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "../types/project";

export async function getProjects(workspaceSlug: string) {
  const { data } = await api.get<Project[]>(
    `/workspaces/${workspaceSlug}/projects/`
  );

  return data;
}

export async function getProject(
  workspaceSlug: string,
  projectId: string
) {
  const { data } = await api.get<Project>(
    `/workspaces/${workspaceSlug}/projects/${projectId}`
  );

  return data;
}

export async function createProject(
  workspaceSlug: string,
  project: CreateProjectDto
) {
  const { data } = await api.post<Project>(
    `/workspaces/${workspaceSlug}/projects/`,
    project
  );

  return data;
}

export async function updateProject(
  workspaceSlug: string,
  projectId: string,
  project: UpdateProjectDto
) {
  const { data } = await api.patch<Project>(
    `/workspaces/${workspaceSlug}/projects/${projectId}`,
    project
  );

  return data;
}

export async function deleteProject(
  workspaceSlug: string,
  projectId: string
) {
  await api.delete(
    `/workspaces/${workspaceSlug}/projects/${projectId}`
  );
}
