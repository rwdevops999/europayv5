"use client";

import clsx from "clsx";
import NavbarAppInfo from "./components/navbar-appinfo";
import EmptyNode from "./components/empty-node";
import ThemeToggle from "./components/theme-toggle";
import NavbarUserProfile from "./components/navbar-user-profile";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { useWifi } from "@/hooks/use-wifi";
import { useMarkdownSettings } from "@/hooks/use-markdown-settings";
import { useTask } from "@/hooks/use-task";
import { useOTPSettings } from "@/hooks/use-otp-settings";
import { useHistorySettings } from "@/hooks/use-history-settings";
import { useSocket } from "@/hooks/use-socket";

const renderDevItems: boolean = process.env.NODE_ENV === "development";

const NavbarRight = () => {
  const { getToastNode } = useToastSettings();
  const { getConnectNode } = useWifi();
  const { getMarkdownNode } = useMarkdownSettings();
  const { getTaskNode } = useTask();
  const { getTimingNode } = useOTPSettings();
  const { getHistoryNode } = useHistorySettings();
  const { getSocketNode } = useSocket();

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
        {getTaskNode()}
        {getSocketNode()}
        <EmptyNode />
        {renderDevItems && (
          <>
            {getHistoryNode()}
            {getToastNode()}
            {getMarkdownNode()}
            {getTimingNode()}
          </>
        )}
      </NavbarAppInfo>
      <ThemeToggle />
      <NavbarUserProfile />
    </div>
  );
};

export default NavbarRight;
