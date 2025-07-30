import { ToastSettingsProvider } from "@/hooks/use-toast-settings";
import { WifiProvider } from "@/hooks/use-wifi";
import ProgressBar from "@/ui/progress-bar";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WifiProvider>
      <ToastSettingsProvider>
        <ProgressBar>{children}</ProgressBar>;
      </ToastSettingsProvider>
    </WifiProvider>
  );
};

export default Providers;
