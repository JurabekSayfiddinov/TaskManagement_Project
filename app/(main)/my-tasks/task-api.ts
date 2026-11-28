import axios from "axios";
import { api } from "@/lib/api";
import type { Project } from "@/features/projects/types/project";
import type { Workspace } from "@/features/workspaces/types/workspace";

export interface TaskInput {
  title: string;
  description: string;
  state_id: string;
  priority: string;
  start_date: string | null;
  due_date: string | null;
  estimate_points: number | null;
}

export interface Task {
  id: string;
  sequence_id: number;
  title: string;
  description: string | null;
  state_id: string;
  priority: string;
  start_date: string | null;
  due_date: string | null;
  estimate_points: number | null;
}

export interface TaskState {
  id: string;
  name: string;
  is_default: boolean;
  color?: string;
}

export interface TaskList {
  data: Task[];
  next_cursor: string | null;
}

function projectsUrl(workspace: string) {
  return `/workspaces/${encodeURIComponent(workspace)}/projects/`;
}

function projectUrl(workspace: string, project: string) {
  return projectsUrl(workspace) + encodeURIComponent(project);
}

export function issuesUrl(workspace: string, project: string) {
  return `${projectUrl(workspace, project)}/issues/`;
}

export async function getWorkspaces() {
  const { data } = await api.get<Workspace[]>("/workspaces/");
  return data;
}

export async function getProjects(workspace: string) {
  const { data } = await api.get<Project[]>(projectsUrl(workspace));
  return data;
}

export async function getTaskStates(workspace: string, project: string) {
  const { data } = await api.get<TaskState[]>(`${projectUrl(workspace, project)}/states/`);
  return data;
}

function filterValues(value?: string) {
  // Fastify accepts these filters as arrays. Repeating a value keeps one filter choice.
  return value ? [value, value] : undefined;
}

export async function getTasks(
  workspace: string,
  project: string,
  assignee?: string,
  cursor?: string,
  filters: { search?: string; state?: string; priority?: string } = {},
) {
  const { data } = await api.get<TaskList>(issuesUrl(workspace, project), {
    params: {
      assignee: filterValues(assignee),
      cursor,
      search: filters.search?.trim() || undefined,
      state: filterValues(filters.state),
      priority: filterValues(filters.priority),
    },
    paramsSerializer: { indexes: null },
  });
  return data;
}

export async function createTask(workspace: string, project: string, task: TaskInput, assignee?: string) {
  const payload = { ...task, assignee_ids: assignee ? [assignee] : undefined };
  const { data } = await api.post<Task>(issuesUrl(workspace, project), payload);
  return data;
}

export async function getTask(workspace: string, project: string, taskId: string) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  const { data } = await api.get<Task>(url);
  return data;
}

export async function updateTask(workspace: string, project: string, taskId: string, task: TaskInput) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  const payload = { ...task, description: task.description || null };
  const { data } = await api.patch<Task>(url, payload);
  return data;
}

export async function moveTask(workspace: string, project: string, taskId: string, stateId: string) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  const { data } = await api.patch<Task>(url, { state_id: stateId });
  return data;
}

export async function deleteTask(workspace: string, project: string, taskId: string) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  await api.delete(url);
}

export function taskError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;

  const status = error.response?.status;
  if (status === 401) return "Your session expired. Please sign in again.";
  if (status === 403) return "You do not have permission to do this.";
  if (status === 404) return "This item could not be found.";

  const message = error.response?.data?.error?.message ?? error.response?.data?.message;
  return typeof message === "string" ? message : fallback;
}
