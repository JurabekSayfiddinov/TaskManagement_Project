import axios from "axios";
import { profileHeaders, profileUrl as api, type Profile } from "../prof";

async function editme(user: { display_name: string }) {
  const { data } = await axios.patch<Profile>(api, user, {
    headers: profileHeaders(),
  });

  return data;
}

export default editme;
