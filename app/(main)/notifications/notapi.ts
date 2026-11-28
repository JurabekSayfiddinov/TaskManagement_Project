import axios from "axios";
import { profileHeaders } from "../profile/prof";

const api = "http://127.0.0.1:3000/api/v1/workspaces";

export async function getNotifications(
  workspaceSlug: string,
  unreadOnly = false,
) {
  const { data } = await axios.get(
    `${api}/${workspaceSlug}/notifications/`,
    {
      headers: profileHeaders(),
      params: unreadOnly ? { read: "false" } : undefined,
    },
  );

  return data;
}

export async function markAsRead(workspaceSlug: string, id: string) {
  await axios.post(
    `${api}/${workspaceSlug}/notifications/${id}/read`,
    undefined,
    { headers: profileHeaders() },
  );
}

export async function markAllAsRead(workspaceSlug: string) {
  await axios.post(
    `${api}/${workspaceSlug}/notifications/read-all`,
    undefined,
    { headers: profileHeaders() },
  );
}