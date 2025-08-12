"use client";

import { fillTemplate, loadTemplateByName } from "@/app/server/templates";
import { tTemplate } from "@/lib/prisma-types";
import React, { useEffect, useState } from "react";
import { Separator } from "./radix/separator";
import Button from "./button";
import { cn } from "@/lib/util";

export type tNotificationButton = {
  leftButton?: string;
  centerButton?: string;
  rightButton?: string;
};

type tNotificationInfo = {
  title: string | null;
  message: string | undefined;
};

const NotificationDialog = ({
  _open,
  _template,
  _params,
  _handleButtonLeft,
  _handleButtonCenter,
  _handleButtonRight,
  _buttonnames = { leftButton: "No", rightButton: "Yes" },
  className,
  _data,
}: {
  _open: boolean | undefined;
  _template: string | undefined;
  _params: Record<string, string> | undefined;
  _handleButtonLeft?(data?: any): void;
  _handleButtonCenter?(data?: any): void;
  _handleButtonRight?(data?: any): void;
  _buttonnames?: tNotificationButton;
  className?: string;
  _data: any;
}) => {
  const [notification, setNotification] = useState<tNotificationInfo>();

  const handleDialogView = (open: boolean | undefined) => {
    const dialog: HTMLDialogElement = document.getElementById(
      "notifdialog"
    ) as HTMLDialogElement;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  };

  const loadTheTemplate = async (): Promise<void> => {
    if (_template && _params) {
      await loadTemplateByName(_template).then(
        async (value: tTemplate | undefined) => {
          if (value) {
            let notif: tNotificationInfo = {
              title: value.description,
              message: await fillTemplate(value.content, _params),
            };

            setNotification(notif);
          }
        }
      );
    }
  };

  const focusRightButton = (): void => {
    const element: HTMLElement | null = document.getElementById("rightbutton");

    if (element) {
      window.setTimeout(() => {
        element.focus();
      }, 310);

      element.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          element.click();
        }
      });
    }
  };

  useEffect(() => {
    focusRightButton();
    loadTheTemplate();
    handleDialogView(_open);
  }, [_open]);

  const handleButtonLeft = () => {
    _handleButtonLeft ? _handleButtonLeft(_data) : null;
  };

  const handleButtonCenter = () => {
    _handleButtonCenter ? _handleButtonCenter(_data) : null;
  };

  const handleButtonRight = () => {
    _handleButtonRight ? _handleButtonRight(_data) : null;
  };

  return (
    <dialog id="notifdialog" className="modal">
      <div className="modal-box border-1 border-base-content/40">
        <div className="text-red-500 font-bold text-xl">
          {notification?.title}
        </div>
        <Separator />
        <div className={cn("py-5 space-x-2", className)}>
          {notification?.message}
        </div>
        <div className="flex space-x-2">
          {_buttonnames.leftButton && (
            <Button
              id="leftbutton"
              size="small"
              className="bg-cancel hover:bg-base-content/30"
              name={_buttonnames.leftButton}
              onClick={handleButtonLeft}
            />
          )}
          {_buttonnames.centerButton && (
            <Button
              id="centerbutton"
              size="small"
              className="bg-login-button hover:bg-base-content/30"
              name={_buttonnames.centerButton}
              onClick={handleButtonCenter}
            />
          )}
          {_buttonnames.rightButton && (
            <Button
              id="rightbutton"
              size="small"
              className="bg-login-button hover:bg-base-content/30"
              name={_buttonnames.rightButton}
              onClick={handleButtonRight}
            />
          )}
        </div>
      </div>
    </dialog>
  );
};

export default NotificationDialog;
