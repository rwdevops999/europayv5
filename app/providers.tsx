import { MarkdownSettingsProvider } from "@/hooks/use-markdown-settings";
import { ToastSettingsProvider } from "@/hooks/use-toast-settings";
import { UserProvider } from "@/hooks/use-user";
import { WifiProvider } from "@/hooks/use-wifi";
import ProgressBar from "@/ui/progress-bar";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <MarkdownSettingsProvider>
      <UserProvider>
        <WifiProvider>
          <ToastSettingsProvider>
            <ProgressBar>{children}</ProgressBar>;
          </ToastSettingsProvider>
        </WifiProvider>
      </UserProvider>
    </MarkdownSettingsProvider>
  );
};

export default Providers;
