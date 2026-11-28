import axios from "axios";
import { saveSession } from "@/lib/api";

const api = "http://127.0.0.1:3000/api/v1/auth/login";

async function loginreq(user: { email: string; password: string }) {
  try {
    const { data } = await axios.post(api, user);
    const token = data.access_token;

    if (token && data.refresh_token) {
      saveSession(token, data.refresh_token);
      return token;
    }
  } catch {
    console.error("Login failed.");
  }
}

export default loginreq;
