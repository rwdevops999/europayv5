import { HistorySettingsProvider } from "@/hooks/use-history-settings";
import { MarkdownSettingsProvider } from "@/hooks/use-markdown-settings";
import { OTPSettingsProvider } from "@/hooks/use-otp-settings";
import { TaskProvider } from "@/hooks/use-task";
import { ToastSettingsProvider } from "@/hooks/use-toast-settings";
import { UserProvider } from "@/hooks/use-user";
import { WifiProvider } from "@/hooks/use-wifi";
import ProgressBar from "@/ui/progress-bar";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <HistorySettingsProvider>
      <OTPSettingsProvider>
        <TaskProvider>
          <MarkdownSettingsProvider>
            <UserProvider>
              <WifiProvider>
                <ToastSettingsProvider>
                  <ProgressBar>{children}</ProgressBar>;
                </ToastSettingsProvider>
              </WifiProvider>
            </UserProvider>
          </MarkdownSettingsProvider>
        </TaskProvider>
      </OTPSettingsProvider>
    </HistorySettingsProvider>
  );
};

export default Providers;
