import { api } from "@/lib/api";

export async function getNotifications(
  workspaceSlug: string,
  unreadOnly = false,
) {
  const { data } = await api.get(
    `/workspaces/${encodeURIComponent(workspaceSlug)}/notifications/`,
    {
      params: unreadOnly ? { read: "false" } : undefined,
    },
  );

  return data;
}

export async function markAsRead(workspaceSlug: string, id: string) {
  await api.post(`/workspaces/${encodeURIComponent(workspaceSlug)}/notifications/${encodeURIComponent(id)}/read`);
}

export async function markAllAsRead(workspaceSlug: string) {
  await api.post(`/workspaces/${encodeURIComponent(workspaceSlug)}/notifications/read-all`);
}
