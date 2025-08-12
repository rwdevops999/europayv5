"use client";

import { ValidationConflict } from "@/app/server/data/validation-data";
import Button from "@/ui/button";
import ValidationConflictsDialog from "@/ui/validation-conflicts-dialog";
import React, { useState } from "react";

const conflicts: ValidationConflict[] = [
  {
    id: 1,
    action: "ACTION1",
    service: "SERVICE1",
    allowedPath: "> Path allowed1",
    deniedPath: "> Path denied1",
  },
  {
    id: 2,
    action: "ACTION2",
    service: "SERVICE2",
    allowedPath: "> Path allowed2",
    deniedPath: "> Path denied2",
  },
  {
    id: 3,
    action: "ACTION3",
    service: "SERVICE3",
    allowedPath: "> Path allowed3",
    deniedPath: "> Path denied3",
  },
];

const ValidationDialogTest = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const closeCDialog = (): void => {
    setOpenDialog(false);
  };

  const openCDialog = (): void => {
    setOpenDialog(true);
  };

  return (
    <>
      <Button name="Open" onClick={openCDialog} className="bg-custom" />
      <ValidationConflictsDialog open={openDialog} conflicts={conflicts}>
        <Button
          name="Close"
          onClick={closeCDialog}
          className="bg-custom"
          size="small"
        />
      </ValidationConflictsDialog>
    </>
  );
};

export default ValidationDialogTest;
