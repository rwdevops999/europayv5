"use client";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";
import Button from "@/ui/button";
import Dialog from "@/ui/dialog";
import React, { startTransition, useEffect, useState } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
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
    "User Settings"
  );

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const random = Math.trunc(Math.random() * 100);

  return (
    <>
      <div>
        {settingsAllowed && (
          <div
            className="cursor-pointer flex space-x-2 items-center"
            onClick={() => {
              redirect(absoluteUrl("/usersettings") + `?id=${random}`);
            }}
          >
            <GiSettingsKnobs className="text-white" size={16} />
            <label className="cursor-pointer">Settings</label>
          </div>
        )}
      </div>
    </>
  );
};

export default UserSettings;
