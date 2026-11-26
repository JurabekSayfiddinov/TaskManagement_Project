export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  identifier: string;
  description: string | null;
  lead_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectDto {
  name: string;
  identifier: string;
  description?: string;
  lead_id?: string | null;
}