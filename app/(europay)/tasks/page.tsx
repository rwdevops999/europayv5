import { loadTasks } from "@/app/server/tasks";
import { tTask } from "@/lib/prisma-types";
import TasksListWithSuspense from "./tasks-list-with-suspense";

export const dynamic = "force-dynamic";

const TasksPage = async () => {
  const tasks: tTask[] = await loadTasks();

  return <TasksListWithSuspense tasks={tasks} />;
};

export default TasksPage;
