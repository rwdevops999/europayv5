"use client";

import clsx from "clsx";
import NavbarAppInfo from "./components/navbar-appinfo";
import EmptyNode from "./components/empty-node";
import ThemeToggle from "./components/theme-toggle";
import NavbarUserProfile from "./components/navbar-user-profile";
import { useToastSettings } from "@/hooks/use-toast-settings";

const renderDevItems: boolean = process.env.NODE_ENV === "development";

const NavbarRight = () => {
  const { getToastNode } = useToastSettings();

  return (
    <div data-testid="navbarright" className="flex items-center space-x-2">
      <NavbarAppInfo
        data-testid="navbarappinfo"
        className={clsx(
          "grid",
          { "grid-cols-8": renderDevItems },
          { "grid-cols-4": !renderDevItems }
        )}
      >
        <EmptyNode />
        <EmptyNode />
        <EmptyNode />
        <EmptyNode />
        {renderDevItems && (
          <>
            <EmptyNode />
            {getToastNode()}
            <EmptyNode />
            <EmptyNode />
          </>
        )}
      </NavbarAppInfo>
      <ThemeToggle />
      <NavbarUserProfile />
    </div>
  );
};

export default NavbarRight;
