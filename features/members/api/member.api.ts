
import { api } from "@/lib/api";

import type {
  Member,
  InviteMemberDto,
  UpdateMemberDto,
  Invitation,
} from "../types/member";

export async function getMembers(workspaceSlug: string) {
  const { data } = await api.get<Member[]>(
    `/workspaces/${workspaceSlug}/members`
  );

  return data;
}

export async function inviteMember(
  workspaceSlug: string,
  invitation: InviteMemberDto
) {
  const { data } = await api.post<Invitation>(
    `/workspaces/${workspaceSlug}/members/invite`,
    invitation
  );

  return data;
}

export async function updateMember(
  workspaceSlug: string,
  userId: string,
  member: UpdateMemberDto
) {
  const { data } = await api.patch<Member>(
    `/workspaces/${workspaceSlug}/members/${userId}`,
    member
  );

  return data;
}

export async function deleteMember(
  workspaceSlug: string,
  userId: string
) {
  await api.delete(
    `/workspaces/${workspaceSlug}/members/${userId}`
  );
}
