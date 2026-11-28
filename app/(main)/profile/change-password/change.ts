import { api } from "@/lib/api";

async function changePassword(user: {
  current_password: string;
  new_password: string;
}) {
  await api.post("/auth/change-password", user);
}

export default changePassword;
