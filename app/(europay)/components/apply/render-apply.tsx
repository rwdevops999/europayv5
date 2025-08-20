"use client";

import { applyForUserAccount } from "@/app/server/apply";
import { ApplyData } from "@/app/server/data/apply-data";
import { tTaskSetup } from "@/app/server/data/taskdata";
import { createTask } from "@/app/server/tasks";
import { TaskStatus } from "@/generated/prisma";
import { useTask } from "@/hooks/use-task";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { showToast } from "@/lib/util";
import { tAccountApply } from "@/lib/prisma-types";
import Button from "@/ui/button";
import { useState } from "react";
import KeyboardShortcut from "../../ui/navigation/keyboard-shortcut";
import ApplyDialog from "./apply-dialog";

const RenderApply = () => {
  const { setTaskAvailable } = useTask();
  const { getToastDuration } = useToastSettings();

  const [openApplyDialog, setOpenApplyDialog] = useState<boolean>(false);

  const closeApplyDialog = (_cancelLogin?: boolean): void => {
    setOpenApplyDialog(false);
  };

  const handleOpenApplyDialog = (): void => {
    setOpenApplyDialog(true);
  };

  const createTasks = async (_application: tAccountApply): Promise<void> => {
    const task: tTaskSetup = {
      name: "TASK_CREATE_USER",
      taskParams: { applicationId: _application.id },
      template: "USER_APPLICATION_CREATE_USER",
      templateParams: { email: _application.email },
      fromStatus: [TaskStatus.CREATED, TaskStatus.OPEN],
    };

    const taskId: number | undefined = await createTask(task);

    const linkedtask: tTaskSetup = {
      name: "TASK_CREATE_ACCOUNT",
      taskParams: { applicationId: _application.id },
      template: "USER_APPLICATION_CREATE_ACCOUNT",
      templateParams: { email: _application.email },
      fromStatus: [TaskStatus.CREATED],
    };

    await createTask(linkedtask, taskId).then(() => setTaskAvailable(true));

    showToast(
      "info",
      "Your application is registered. On completion you'll receive an email",
      getToastDuration()
    );
  };

  const applyForAccount = async (_data: ApplyData): Promise<void> => {
    const application: tAccountApply | undefined = await applyForUserAccount(
      _data
    );
    if (application) {
      createTasks(application);
    }

    closeApplyDialog();
  };

  const handleButtonClick = () => {
    const button: HTMLButtonElement = document.getElementById(
      "applybutton"
    ) as HTMLButtonElement;

    if (button) {
      button.click();
    }
  };

  return (
    <div className="w-[100vw] h-[20vw] flex justify-center">
      <Button
        id="applybutton"
        comp={
          <KeyboardShortcut
            label="Apply for an account"
            combo={{ key: "a", command: true }}
            callParent={handleButtonClick}
          />
        }
        className="bg-custom"
        size="large"
        onClick={handleOpenApplyDialog}
      />
      <ApplyDialog
        open={openApplyDialog}
        closeApplyDialog={closeApplyDialog}
        apply={applyForAccount}
      />
    </div>
  );
};

export default RenderApply;
