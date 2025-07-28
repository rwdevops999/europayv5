import ProgressBar from "@/ui/progress-bar";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return <ProgressBar>{children}</ProgressBar>;
};

export default Providers;
