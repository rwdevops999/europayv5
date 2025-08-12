"use client";

import Dialog from "@/ui/dialog";
import { useEffect } from "react";
import TaskForm from "./task-form";

const TaskHandler = ({
  taskId,
  depth,
}: {
  taskId: number | undefined;
  depth: number;
}) => {
  // const progress = useProgressBar();
  // const { push, back } = useRouter();

  // const [openDialog, setOpenDialog] = useState<boolean>(false);

  const openDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "taskdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  useEffect(() => {
    openDialog();
  }, [taskId]);

  return (
    <Dialog
      title=""
      id="taskdialog"
      form={<TaskForm taskId={taskId} depth={depth} />}
      className="w-6/12 max-w-6xl border-1 border-base-content/40"
    />
  );
};

export default TaskHandler;
