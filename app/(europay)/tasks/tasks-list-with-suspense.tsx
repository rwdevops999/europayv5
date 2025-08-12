import { loadTasks } from "@/app/server/tasks";
import TaskList from "./task-list";
import { tTask } from "@/lib/prisma-types";
import { Suspense } from "react";
import LoadingSpinner from "@/ui/loading-spinner";

const TaskListLoader = async () => {
  const tasks = await loadTasks();

  return <TaskList tasks={tasks} />;
};

const TasksListWithSuspense = ({ tasks }: { tasks: tTask[] }) => {
  if (tasks) {
    return <TaskList tasks={tasks} />;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="loading..." />}>
      <TaskListLoader />
    </Suspense>
  );
};

export default TasksListWithSuspense;
