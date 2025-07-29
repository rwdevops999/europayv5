"use client";

import { fillTemplate, loadTemplateByName } from "@/app/server/templates";
import { tTemplate } from "@/lib/prisma-types";
import React, { useEffect, useState } from "react";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import PageTitle from "./page-title";

export type tAlert = {
  template: string;
  params: Record<string, string>;
};

type tAlertInfo = {
  title: string;
  message: string;
};

const TemplateAlert = ({
  open,
  template,
  parameters,
  children,
}: {
  open: boolean;
  template: string;
  parameters: Record<string, string>;
  children: React.ReactNode;
}) => {
  const [info, setInfo] = useState<tAlertInfo>({
    title: "",
    message: "",
  });

  const getTemplateMessage = async (
    _templatename: string,
    _params: Record<string, string>
  ): Promise<void> => {
    await loadTemplateByName(_templatename).then(
      async (template: tTemplate | undefined) => {
        if (template) {
          const newinfo: tAlertInfo = {
            title: template.description ?? "",
            message: "",
          };

          await fillTemplate(template.content, _params).then(
            (value: string | undefined) => (newinfo.message = value ?? "")
          );

          setInfo(newinfo);
        }
      }
    );
  };

  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "alertwithtemplatesdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  const handleCloseDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "alertwithtemplatesdialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  useEffect(() => {
    getTemplateMessage(template, parameters);
    if (open) {
      handleOpenDialog();
    } else {
      handleCloseDialog();
    }
  }, [open]);

  return (
    <dialog id="alertwithtemplatesdialog" className="modal">
      <div className="modal-box  border-1 border-base-content/40">
        <div className="flex items-center space-x-2">
          <MdOutlineReportGmailerrorred size={20} />
          <PageTitle title={info.title}></PageTitle>
        </div>
        <div>{info.message}</div>
        <div className="flex justify-end">{children}</div>
      </div>
    </dialog>
  );
};

export default TemplateAlert;
