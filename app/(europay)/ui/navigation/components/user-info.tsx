"use client";

import { useUser } from "@/hooks/use-user";
import { json } from "@/lib/util";

const cid: string = "UserNavInfo";

const UserInfo = () => {
  const { user, isLoggedIn } = useUser();

  const getUserName = (): string => {
    let name: string = "";

    if (user) {
      if (user.lastname) {
        name = user.firstname.concat(" ", user.lastname);
      } else {
        name = user.email;
      }
    }

    return name;
  };

  const renderComponent = () => {
    return (
      <div className="bg-blue-600 rounded-t-md">
        <div className="flex flex-col space-y-1">
          <p className="text-emerald-300 text-xs font-bold italic leading-none">
            {isLoggedIn() ? `${getUserName()}` : "No one logged in"}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {isLoggedIn() ? user?.email : ""}
          </p>
        </div>
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default UserInfo;
