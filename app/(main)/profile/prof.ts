import { api } from "@/lib/api";

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const profileUrl = "/auth/me";

export default async function getme() {
  const { data } = await api.get<Profile>(profileUrl);

  return data;
}
