"use client";

import React, { useEffect, useState } from "react";
import TaskForm from "./task-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/ui/radix/dialog";
import { Root } from "@radix-ui/react-dialog";

const TaskDialog = ({
  _open,
  _taskId = 0,
  _depth,
}: {
  _open: boolean;
  _taskId?: number;
  _depth: number;
}) => {
  const [dialogState, setDialogState] = useState<boolean>(false);

  useEffect(() => {
    setDialogState(_open);
  }, [_open]);

  return (
    <Dialog open={dialogState}>
      <DialogContent className="[&>button:last-child]:hidden flex bg-transparent justify-center items-center border-none min-w-[55%] min-h-[50%]">
        <Root>
          <DialogTitle />
          <DialogDescription />
        </Root>
        <TaskForm taskId={_taskId} depth={_depth} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
