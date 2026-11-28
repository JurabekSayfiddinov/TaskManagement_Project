import axios from "axios";
import { profileHeaders } from "../prof";

const api = "http://127.0.0.1:3000/api/v1/auth/change-password";

async function changePassword(user: {
  current_password: string;
  new_password: string;
}) {
  await axios.post(api, user, {
    headers: profileHeaders(),
  });
}

export default changePassword;
