import { HistorySettingsProvider } from "@/hooks/use-history-settings";
import { JobProvider } from "@/hooks/use-job";
import { MarkdownSettingsProvider } from "@/hooks/use-markdown-settings";
import { OTPSettingsProvider } from "@/hooks/use-otp-settings";
import { SocketProvider } from "@/hooks/use-socket";
import { TaskProvider } from "@/hooks/use-task";
import { ToastSettingsProvider } from "@/hooks/use-toast-settings";
import { UserProvider } from "@/hooks/use-user";
import { WifiProvider } from "@/hooks/use-wifi";
import ProgressBar from "@/ui/progress-bar";
import { ReactNode } from "react";
import Initialisation from "./components/initialisation";
import { TransactionProvider } from "@/hooks/use-transaction";
import { InitProvider } from "@/hooks/use-init";
import { ThemeProvider } from "@/hooks/use-theme";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <InitProvider>
        <SocketProvider>
          <TransactionProvider>
            <JobProvider>
              <HistorySettingsProvider>
                <OTPSettingsProvider>
                  <TaskProvider>
                    <MarkdownSettingsProvider>
                      <UserProvider>
                        <WifiProvider>
                          <ToastSettingsProvider>
                            <ProgressBar>
                              <Initialisation />
                              {children}
                            </ProgressBar>
                          </ToastSettingsProvider>
                        </WifiProvider>
                      </UserProvider>
                    </MarkdownSettingsProvider>
                  </TaskProvider>
                </OTPSettingsProvider>
              </HistorySettingsProvider>
            </JobProvider>
          </TransactionProvider>
        </SocketProvider>
      </InitProvider>
    </ThemeProvider>
  );
};

export default Providers;
