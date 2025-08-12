"use client";

import { useProgressBar } from "@/hooks/use-progress-bar";
import { useUser } from "@/hooks/use-user";
import { absoluteUrl } from "@/lib/util";
import Button from "@/ui/button";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";

const UserAuth = () => {
  const { user, isLoggedIn, logout } = useUser();
  const progress = useProgressBar();
  const { push } = useRouter();

  const [login, setLogin] = useState<boolean>(false);

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const doLogout = () => {
    logout();
    redirect(absoluteUrl("/"));
  };

  return (
    <div>
      {isLoggedIn() && (
        <div className="-ml-4 flex items-center">
          <Button
            name="Log Out"
            size="small"
            className="bg-transparent hover:border-none hover:shadow-none"
            icon={<RiLogoutBoxLine className="text-red-500" size={16} />}
            iconFirst
            onClick={doLogout}
          />
        </div>
      )}
      {!isLoggedIn() && (
        <div className="-ml-4 flex items-center">
          <Button
            name="Log In"
            size="small"
            className="bg-transparent hover:border-none hover:shadow-none"
            icon={<RiLoginBoxLine className="text-red-500" size={16} />}
            iconFirst
            onClick={() => redirect(absoluteUrl("/login"))}
          />
        </div>
      )}
    </div>
  );
};

export default UserAuth;
