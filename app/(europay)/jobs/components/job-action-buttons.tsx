"use client";

import Button from "@/ui/button";
import React from "react";
import ConfirmDialog from "./confirm-dialog";
import { useUser } from "@/hooks/use-user";
import { $iam_user_has_action } from "@/app/client/iam-access";

const JobActionButtons = ({
  selectedJobsSize,
  suspendSelectedJobs,
  removeSelectedJobs,
  restartSelectedJobs,
  clearSelectedJobs,
}: {
  selectedJobsSize: number;
  suspendSelectedJobs?: () => void;
  removeSelectedJobs?: () => void;
  restartSelectedJobs?: () => void;
  clearSelectedJobs?: () => void;
}) => {
  const { user } = useUser();

  const maySuspend: boolean = $iam_user_has_action(
    user,
    "europay:lists:jobs",
    "Suspend",
    true
  );
  const mayRemove: boolean = $iam_user_has_action(
    user,
    "europay:lists:jobs",
    "Remove",
    true
  );
  const mayRestart: boolean = $iam_user_has_action(
    user,
    "europay:lists:jobs",
    "Restart",
    true
  );

  const openConfirmDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "confirmdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  const closeConfirmDialog = (_clearSelection: boolean = true): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "confirmdialog"
    ) as HTMLDialogElement;

    dialog.close();

    if (_clearSelection && clearSelectedJobs) {
      clearSelectedJobs();
    }
  };

  const confirmDialog = async (): Promise<void> => {
    if (removeSelectedJobs) {
      removeSelectedJobs();
    }

    closeConfirmDialog(false);
  };

  const removeJobs = (): void => {
    if (selectedJobsSize > 0) {
      openConfirmDialog();
    }
  };

  const restartJobs = async (): Promise<void> => {
    if (restartSelectedJobs) {
      restartSelectedJobs();
    }
  };

  const suspendJobs = async (): Promise<void> => {
    if (suspendSelectedJobs) {
      suspendSelectedJobs();
    }
  };

  return (
    <>
      <div className="ml-2 flex items-center space-x-2">
        <Button
          intent="warning"
          style="soft"
          name="Suspend"
          size="small"
          onClick={suspendJobs}
          disabled={!maySuspend || selectedJobsSize === 0}
        />
        <Button
          intent="success"
          style="soft"
          name="Restart"
          size="small"
          onClick={restartJobs}
          disabled={!mayRestart || selectedJobsSize === 0}
        />
        <Button
          intent="error"
          style="soft"
          name="Remove"
          size="small"
          onClick={removeJobs}
          disabled={!mayRemove || selectedJobsSize === 0}
        />
      </div>
      <ConfirmDialog
        plural={selectedJobsSize > 1}
        handleOK={confirmDialog}
        handleCancel={closeConfirmDialog}
      />
    </>
  );
};

export default JobActionButtons;
