export interface DashboardTask {
  id: string;
  title: string;
  state_id: string;
  due_date: string | null;
  updated_at: string;
}

export interface DashboardState {
  id: string;
  group:
    | "backlog"
    | "unstarted"
    | "started"
    | "completed"
    | "cancelled";
}