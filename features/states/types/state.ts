export type StateGroup =
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "cancelled";

export interface State {
  id: string;
  name: string;
  color: string;
  group: StateGroup;
}

export interface CreateStateDto {
  name: string;
  color: string;
  group: StateGroup;
}