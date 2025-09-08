"use client";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";
import Button from "@/ui/button";
import React from "react";
import { GiSettingsKnobs } from "react-icons/gi";

const UserSettings = () => {
  const { user } = useUser();

  const settingsAllowed: boolean = $iam_user_has_action(
    user,
    "europay:authorisation",
    "Settings",
    true
  );

  return (
    <div>
      {settingsAllowed && (
        <div className="-ml-4 flex items-center">
          <Button
            name="Settings"
            size="small"
            className="bg-transparent hover:border-none hover:shadow-none"
            icon={<GiSettingsKnobs className="text-red-500" size={16} />}
            iconFirst
            // onClick={() => redirect(absoluteUrl("/login"))}
          />
        </div>
      )}
    </div>
  );
};

export default UserSettings;
