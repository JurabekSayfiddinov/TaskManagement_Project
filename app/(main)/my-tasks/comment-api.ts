import { api } from "@/lib/api";
import { issuesUrl } from "./task-api";

export interface TaskComment {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
  author: { display_name: string } | null;
}

function commentsUrl(workspace: string, projectId: string, taskId: string) {
  return `${issuesUrl(workspace, projectId)}${encodeURIComponent(taskId)}/comments/`;
}

export async function getComments(workspace: string, projectId: string, taskId: string) {
  const { data } = await api.get<TaskComment[]>(commentsUrl(workspace, projectId, taskId));
  return data;
}

export async function createComment(workspace: string, projectId: string, taskId: string, body: string) {
  await api.post(commentsUrl(workspace, projectId, taskId), { body });
}

export async function updateComment(
  workspace: string,
  projectId: string,
  taskId: string,
  commentId: string,
  body: string,
) {
  const url = commentsUrl(workspace, projectId, taskId) + encodeURIComponent(commentId);
  await api.patch(url, { body });
}

export async function deleteComment(workspace: string, projectId: string, taskId: string, commentId: string) {
  const url = commentsUrl(workspace, projectId, taskId) + encodeURIComponent(commentId);
  await api.delete(url);
}
