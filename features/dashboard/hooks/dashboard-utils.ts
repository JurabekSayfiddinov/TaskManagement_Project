
import type {
  DashboardTask,
  DashboardState,
} from "../types/dashboard";

export function getDashboardStats(
  tasks: DashboardTask[],
  states: DashboardState[]
) {
  const statesMap = new Map(
    states.map((state) => [state.id, state.group])
  );

  const getGroup = (task: DashboardTask) =>
    statesMap.get(task.state_id);

  return {
    total: tasks.length,

    todo: tasks.filter((task) =>
      ["backlog", "unstarted"].includes(
        getGroup(task) ?? ""
      )
    ).length,

    inProgress: tasks.filter(
      (task) => getGroup(task) === "started"
    ).length,

    completed: tasks.filter(
      (task) => getGroup(task) === "completed"
    ).length,
  };
}
