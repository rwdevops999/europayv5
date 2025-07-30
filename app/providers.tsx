import { ToastSettingsProvider } from "@/hooks/use-toast-settings";
import ProgressBar from "@/ui/progress-bar";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ToastSettingsProvider>
      <ProgressBar>{children}</ProgressBar>;
    </ToastSettingsProvider>
  );
};

export default Providers;
