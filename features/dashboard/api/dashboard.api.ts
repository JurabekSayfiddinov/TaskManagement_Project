
import { api } from "@/lib/api";

import type {
  DashboardUser,
  DashboardWorkspace,
  DashboardProject,
  DashboardTask,
  DashboardState,
  PaginatedResponse,
} from "../types/dashboard";

export async function getCurrentUser() {
  const { data } = await api.get<DashboardUser>("/auth/me");
  return data;
}

export async function getWorkspaces() {
  const { data } =
    await api.get<DashboardWorkspace[]>("/workspaces/");

  return data;
}

export async function getProjects(workspaceSlug: string) {
  const { data } = await api.get<DashboardProject[]>(
    `/workspaces/${workspaceSlug}/projects/`
  );

  return data;
}

export async function getProjectStates(
  workspaceSlug: string,
  projectId: string
) {
  const { data } = await api.get<DashboardState[]>(
    `/workspaces/${workspaceSlug}/projects/${projectId}/states/`
  );

  return data;
}

export async function getProjectTasks(
  workspaceSlug: string,
  projectId: string,
  userId?: string
) {
  const tasks: DashboardTask[] = [];

  let cursor: string | undefined;

  do {
    const { data } = await api.get<
      PaginatedResponse<DashboardTask>
    >(
      `/workspaces/${workspaceSlug}/projects/${projectId}/issues/`,
      {
        params: {
          limit: 100,
          assignee: userId,
          cursor,
        },
      }
    );

    tasks.push(...data.data);

    cursor = data.next_cursor ?? undefined;
  } while (cursor);

  return tasks;
}

export async function getUnreadNotifications(
  workspaceSlug: string
) {
  const { data } = await api.get<{
    unread_count: number;
  }>(
    `/workspaces/${workspaceSlug}/notifications/`
  );

  return data.unread_count;
}
