
export type MemberRole =
  | "owner"
  | "admin"
  | "member"
  | "guest";

export type AssignableRole = Exclude<MemberRole, "owner">;

export interface MemberUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
}

export interface Member {
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
  updated_at: string;
  user: MemberUser;
}

export interface InviteMemberDto {
  email: string;
  role: AssignableRole;
}

export interface UpdateMemberDto {
  role: AssignableRole;
}

export interface Invitation {
  id: string;
  workspace_id: string;
  invited_by_id: string;
  email: string;
  role: AssignableRole;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}
