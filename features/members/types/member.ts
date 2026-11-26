export type MemberRole =
  | "owner"
  | "admin"
  | "member"
  | "guest";

export interface Member {
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
  updated_at: string;

  user: {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export interface InviteMemberDto {
  email: string;
  role: Exclude<MemberRole, "owner">;
}