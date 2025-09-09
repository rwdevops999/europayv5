"use client";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";
import Button from "@/ui/button";
import Dialog from "@/ui/dialog";
import React, { startTransition, useEffect, useState } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
import UserSettingsCarrousel from "./user-settings-carrousel";
import { absoluteUrl } from "@/lib/util";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { useRouter } from "next/navigation";

const UserSettings = () => {
  const { user } = useUser();
  const progress = useProgressBar();
  const { push } = useRouter();

  const settingsAllowed: boolean = $iam_user_has_action(
    user,
    "europay:authorisation",
    "Settings",
    true
  );

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  // const [openDialog, setOpenDialog] = useState<number>(0);

  // const openSettingsDialog = (): void => {
  //   setOpenDialog((x: number) => x + 1);
  // };

  // const handleOpenDialog = (): void => {
  //   const dialog: HTMLDialogElement = document.getElementById(
  //     "usersettingsdialog"
  //   ) as HTMLDialogElement;

  //   dialog.showModal();
  // };

  // useEffect(() => {
  //   if (openDialog > 0) {
  //     handleOpenDialog();
  //   }
  // }, [openDialog]);

  const random = Math.trunc(Math.random() * 100);

  return (
    <>
      <div>
        {settingsAllowed && (
          <div className="-ml-4 flex items-center">
            <Button
              name="Settings"
              size="small"
              className="bg-transparent hover:border-none hover:shadow-none"
              icon={<GiSettingsKnobs className="text-red-500" size={16} />}
              iconFirst
              onClick={() =>
                redirect(absoluteUrl("/usersettings") + `?id=${random}`)
              }
            />
          </div>
        )}
      </div>
      {/* <div>
        <Dialog
          title={"Handle user settings ⚙️"}
          id="usersettingsdialog"
          form={<UserSettingsCarrousel />}
          className="w-11/12 max-w-6xl z-50"
        />
      </div> */}
    </>
  );
};

export default UserSettings;
