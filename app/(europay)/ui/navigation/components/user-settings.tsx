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
              icon={<GiSettingsKnobs className="text-white" size={16} />}
              iconFirst
              onClick={() =>
                redirect(absoluteUrl("/usersettings") + `?id=${random}`)
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UserSettings;
