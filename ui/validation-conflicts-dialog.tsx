"use client";

import { ReactNode, useEffect } from "react";
import PageTitle from "./page-title";
import { LuClipboardPlus } from "react-icons/lu";
import ValidationConflictItem from "./validation-conflict-item";
import { ScrollArea, ScrollBar } from "./radix/scroll-area";
import { cn } from "@/lib/functions";

const ValidationConflictsDialog = ({
  open = false,
  conflicts,
  className = "",
  children,
}: {
  open: boolean;
  conflicts: any[];
  className?: string;
  children: ReactNode;
}) => {
  const handleCopyToClipboard = () => {
    // let count: number = 1;

    const lines: string[] = conflicts.map((conflict: any) => {
      let s: string = ``;
      // if (isMarkdownOn()) {
      //   s = `${count++}. [ ] `;
      // }

      return (
        s +
        `action: \'${conflict.action} (${conflict.service})\', allowed in: \'${conflict.allowedPath}\', denied in: \'${conflict.deniedPath}\'`
      );
    });
    navigator.clipboard.writeText(lines.join("\n"));
  };

  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "validationdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  const handleCloseDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "validationdialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  useEffect(() => {
    if (open) {
      handleOpenDialog();
    } else {
      handleCloseDialog();
    }
  }, [open]);

  return (
    <dialog id="validationdialog" className="modal">
      {/* <div className="modal-box  border-1 border-red-500 bg-base-100"> */}
      <div className="flex justify-between">
        <PageTitle title="Validation Conflict" />
        <div
          className="tooltip tooltip-left tooltip-info"
          data-tip="copy to clipboard"
        >
          <LuClipboardPlus
            size={16}
            className={"hover:cursor-pointer"}
            onClick={handleCopyToClipboard}
          />
        </div>
      </div>
      <div className={cn("mt-1 grid grid-cols-6", className)}>
        <ScrollArea className="overflow-auto col-span-6 h-[160px] min-h-[160px] max-h-[500px] border-1 border-neutral-content/30">
          {conflicts.map((conflict: any) => (
            <ValidationConflictItem key={conflict.id} conflict={conflict} />
          ))}
          <ScrollBar className="bg-content" />
        </ScrollArea>
      </div>
      <div className="flex justify-end mt-2">{children}</div>
      {/* </div> */}
    </dialog>
  );
};

export default ValidationConflictsDialog;
