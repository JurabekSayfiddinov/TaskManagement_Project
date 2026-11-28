import axios from "axios";
import type { Project } from "@/features/projects/types/project";
import type { Workspace } from "@/features/workspaces/types/workspace";
import { profileHeaders } from "../profile/prof";

const api = "http://127.0.0.1:3000/api/v1";

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
  return `${api}/workspaces/${encodeURIComponent(workspace)}/projects/`;
}

function projectUrl(workspace: string, project: string) {
  return projectsUrl(workspace) + encodeURIComponent(project);
}

function issuesUrl(workspace: string, project: string) {
  return `${projectUrl(workspace, project)}/issues/`;
}

export async function getWorkspaces() {
  const { data } = await axios.get<Workspace[]>(`${api}/workspaces/`, { headers: profileHeaders() });
  return data;
}

export async function getProjects(workspace: string) {
  const { data } = await axios.get<Project[]>(projectsUrl(workspace), { headers: profileHeaders() });
  return data;
}

export async function getTaskStates(workspace: string, project: string) {
  const { data } = await axios.get<TaskState[]>(`${projectUrl(workspace, project)}/states/`, {
    headers: profileHeaders(),
  });
  return data;
}

export async function getTasks(workspace: string, project: string, assignee?: string, cursor?: string) {
  const { data } = await axios.get<TaskList>(issuesUrl(workspace, project), {
    headers: profileHeaders(),
    // Fastify rejects a single value here. Two identical IDs still filter one user.
    params: { assignee: assignee ? [assignee, assignee] : undefined, cursor },
    paramsSerializer: { indexes: null },
  });
  return data;
}

export async function createTask(workspace: string, project: string, task: TaskInput, assignee?: string) {
  const payload = { ...task, assignee_ids: assignee ? [assignee] : undefined };
  const { data } = await axios.post<Task>(issuesUrl(workspace, project), payload, {
    headers: profileHeaders(),
  });
  return data;
}

export async function getTask(workspace: string, project: string, taskId: string) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  const { data } = await axios.get<Task>(url, { headers: profileHeaders() });
  return data;
}

export async function updateTask(workspace: string, project: string, taskId: string, task: TaskInput) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  const payload = { ...task, description: task.description || null };
  const { data } = await axios.patch<Task>(url, payload, { headers: profileHeaders() });
  return data;
}

export async function moveTask(workspace: string, project: string, taskId: string, stateId: string) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  const { data } = await axios.patch<Task>(url, { state_id: stateId }, {
    headers: profileHeaders(),
  });
  return data;
}

export async function deleteTask(workspace: string, project: string, taskId: string) {
  const url = issuesUrl(workspace, project) + encodeURIComponent(taskId);
  await axios.delete(url, { headers: profileHeaders() });
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
