import axios from "axios";

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const profileUrl = "http://127.0.0.1:3000/api/v1/auth/me";

export function profileHeaders() {
  const token = localStorage.getItem("token");


  return { Authorization: `Bearer ${token}` };
}

export default async function getme() {
  const { data } = await axios.get<Profile>(profileUrl, {
    headers: profileHeaders(),
  });

  return data;
}
