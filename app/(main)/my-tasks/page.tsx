import { TaskPage } from "./task-page";

interface Props {
  searchParams: Promise<{ workspace?: string; project?: string; task?: string }>;
}

export default async function MyTasksPage({ searchParams }: Props) {
  const { workspace, project, task } = await searchParams;
  return <TaskPage initialWorkspace={workspace} initialProject={project} initialTask={task} />;
}
