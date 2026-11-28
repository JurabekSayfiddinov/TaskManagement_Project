import { api } from "@/lib/api";
import { profileUrl, type Profile } from "../prof";

async function editme(user: { display_name: string }) {
  const { data } = await api.patch<Profile>(profileUrl, user);

  return data;
}

export default editme;
