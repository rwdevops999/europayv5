"use client";

import { JSX, ReactNode, useEffect } from "react";
import PageTitle from "./page-title";
import { LuClipboardPlus } from "react-icons/lu";
import ValidationConflictItem from "./validation-conflict-item";
import { cn } from "@/lib/functions";
import { ScrollArea, ScrollBar } from "./radix/scroll-area";

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

  const DialogTitle = (): JSX.Element => {
    return (
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
    );
  };

  const DialogContent = (): JSX.Element => {
    return (
      <div>
        <ScrollArea className="overflow-y-auto h-[150px] min-h-[150px] max-h-[5000px] border-1 border-neutral-content/30">
          {conflicts.map((conflict: any) => (
            <ValidationConflictItem key={conflict.id} conflict={conflict} />
          ))}
          <ScrollBar className="bg-content" />
        </ScrollArea>
      </div>
    );
  };

  return (
    <dialog id="validationdialog" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <DialogTitle />
        <DialogContent />
        <div className="modal-action">
          <form className="flex justify-end" method="dialog">
            {children}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ValidationConflictsDialog;
