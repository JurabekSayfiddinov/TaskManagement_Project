import { TaskPage } from "../../my-tasks/task-page";

interface Props {
  searchParams: Promise<{ workspace?: string; project?: string }>;
}

export default async function CreateTaskPage({ searchParams }: Props) {
  const { workspace, project } = await searchParams;
  return <TaskPage isCreate initialWorkspace={workspace} initialProject={project} />;
}
