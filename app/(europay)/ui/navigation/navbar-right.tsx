"use client";

import clsx from "clsx";
import NavbarAppInfo from "./components/navbar-appinfo";
import EmptyNode from "./components/empty-node";
import ThemeToggle from "./components/theme-toggle";
import NavbarUserProfile from "./components/navbar-user-profile";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { useWifi } from "@/hooks/use-wifi";

const renderDevItems: boolean = process.env.NODE_ENV === "development";

const NavbarRight = () => {
  const { getToastNode } = useToastSettings();
  const { getConnectNode } = useWifi();

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
        {getConnectNode()}
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
