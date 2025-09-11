"use client";

import Dialog from "@/ui/dialog";
import React, { useEffect } from "react";
import UserSettingsCarrousel from "./user-settings-carrousel";

const StartSettings = ({ open }: { open: string | null | undefined }) => {
  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "usersettingsdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  useEffect(() => {
    handleOpenDialog();
  }, [open]);

  return (
    <div>
      <Dialog
        title={"Handle user settings ⚙️"}
        id="usersettingsdialog"
        form={<UserSettingsCarrousel />}
        className="w-11/12 max-w-6xl"
      />
    </div>
  );
};

export default StartSettings;
