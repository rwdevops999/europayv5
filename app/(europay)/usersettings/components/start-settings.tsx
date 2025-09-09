"use client";

import Dialog from "@/ui/dialog";
import React, { useEffect } from "react";
import UserSettingsCarrousel from "./user-settings-carrousel";

const StartSettings = ({ open }: { open: string | null | undefined }) => {
  const handleOpenDialog = (): void => {
    console.log("[handleOpenDialog]");
    const dialog: HTMLDialogElement = document.getElementById(
      "usersettingsdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  useEffect(() => {
    console.log("HANDLE OPEN SETTINGS DIALOG WITH open", open);
    console.log("HANDLE OPEN SETTINGS DIALOG");
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
